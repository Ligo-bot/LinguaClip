"""
YouTube Service - Video parsing and subtitle extraction
"""
import re
import httpx
import yt_dlp
from typing import Optional, List, Dict, Any
import asyncio

from models import SubtitleSegment, VideoInfo
from services.whisper_service import WhisperService


class YouTubeService:
    """Service for YouTube video operations"""
    
    def __init__(self):
        self.whisper_service = WhisperService()
        self.ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,
        }
    
    def extract_video_id(self, url: str) -> Optional[str]:
        """Extract video ID from YouTube URL"""
        patterns = [
            r'(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([a-zA-Z0-9_-]{11})',
            r'youtube\.com/shorts/([a-zA-Z0-9_-]{11})',
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return None
    
    async def get_video_info(self, video_id: str, use_whisper: bool = False) -> Dict[str, Any]:
        """
        Get video information and extract subtitles.
        Returns both video info and the method used for subtitle extraction.
        """
        loop = asyncio.get_event_loop()
        
        # Run yt-dlp in thread pool to not block
        video_data = await loop.run_in_executor(
            None, 
            self._extract_video_info, 
            video_id
        )
        
        # Check if subtitles are available
        subtitles = video_data.get('subtitles', {}) or video_data.get('automatic_captions', {})
        
        if subtitles:
            # Use YouTube captions
            caption_url = self._get_caption_url(video_data, 'en')
            segments = await self._parse_subtitles_from_video(video_data)
            
            video_info = VideoInfo(
                video_id=video_id,
                title=video_data.get('title', ''),
                description=video_data.get('description', ''),
                duration=video_data.get('duration', 0) or 0,
                thumbnail=f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
                channel=video_data.get('uploader', video_data.get('channel', '')),
                subtitles=segments,
                has_subtitles=True,
                caption_url=caption_url
            )
            
            return {
                "video_info": video_info,
                "method": "youtube_captions"
            }
        elif use_whisper:
            # Use Whisper API
            audio_url = self._get_audio_url(video_data)
            if audio_url:
                transcript = await self.whisper_service.transcribe_video(audio_url, video_id)
                
                segments = [
                    SubtitleSegment(
                        id=i,
                        start=seg['start'],
                        end=seg['end'],
                        text=seg['text'],
                        translation=None
                    )
                    for i, seg in enumerate(transcript['segments'])
                ]
                
                video_info = VideoInfo(
                    video_id=video_id,
                    title=video_data.get('title', ''),
                    description=video_data.get('description', ''),
                    duration=video_data.get('duration', 0) or 0,
                    thumbnail=f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
                    channel=video_data.get('uploader', video_data.get('channel', '')),
                    subtitles=segments,
                    has_subtitles=True,
                    caption_url=None
                )
                
                return {
                    "video_info": video_info,
                    "method": "whisper"
                }
        
        # No subtitles available
        video_info = VideoInfo(
            video_id=video_id,
            title=video_data.get('title', ''),
            description=video_data.get('description', ''),
            duration=video_data.get('duration', 0) or 0,
            thumbnail=f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
            channel=video_data.get('uploader', video_data.get('channel', '')),
            subtitles=[],
            has_subtitles=False,
            caption_url=None
        )
        
        return {
            "video_info": video_info,
            "method": "none"
        }
    
    def _extract_video_info(self, video_id: str) -> Dict[str, Any]:
        """Extract video info using yt-dlp"""
        url = f"https://www.youtube.com/watch?v={video_id}"
        
        opts = {
            'format': 'bestaudio/best',
            'extract_flat': False,
            'write_subtitles': True,
            'write_automatic_caption': True,
            'subtitleslangs': ['en', 'en-US'],
            'skip_download': True,
            'get_subtitles': True,
        }
        opts.update(self.ydl_opts)
        
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return info or {}
    
    def _get_audio_url(self, video_data: Dict) -> Optional[str]:
        """Get audio URL for Whisper processing"""
        formats = video_data.get('formats', [])
        audio_formats = [f for f in formats if f.get('vcodec') == 'none' and f.get('acodec')]
        
        if audio_formats:
            # Prefer higher quality audio
            audio_formats.sort(key=lambda x: x.get('tbr', 0), reverse=True)
            return audio_formats[0].get('url')
        return None
    
    def _get_caption_url(self, video_data: Dict, lang: str = 'en') -> Optional[str]:
        """Get caption/subtitle URL from video data"""
        subtitles = video_data.get('subtitles', {}) or video_data.get('automatic_captions', {})
        
        if lang in subtitles:
            caption_data = subtitles[lang]
            if isinstance(caption_data, list) and len(caption_data) > 0:
                return caption_data[0].get('url')
        
        # Try to find any available caption
        for lang_key, caption_info in subtitles.items():
            if isinstance(caption_info, list) and len(caption_info) > 0:
                return caption_info[0].get('url')
        
        return None
    
    async def _parse_subtitles_from_video(self, video_data: Dict) -> List[SubtitleSegment]:
        """Parse subtitles from video data into segments"""
        subtitles = video_data.get('subtitles', {}) or video_data.get('automatic_captions', {})
        
        # Try to get English subtitles first
        caption_data = subtitles.get('en') or subtitles.get('en-US')
        
        if not caption_data:
            # Get first available language
            for lang, data in subtitles.items():
                caption_data = data
                break
        
        if not caption_data:
            return []
        
        segments = []
        
        # Try to fetch and parse the subtitle content
        if isinstance(caption_data, list) and len(caption_data) > 0:
            url = caption_data[0].get('url')
            if url:
                try:
                    segments = await self._fetch_and_parse_subtitles(url)
                except Exception:
                    pass
        
        # If we couldn't fetch, create dummy segments based on available data
        if not segments:
            # Create placeholder segments
            title = video_data.get('title', '')
            segments = [
                SubtitleSegment(
                    id=0,
                    start=0.0,
                    end=5.0,
                    text=f"Subtitles not available. Video: {title[:100]}",
                    translation=None
                )
            ]
        
        return segments
    
    async def _fetch_and_parse_subtitles(self, url: str) -> List[SubtitleSegment]:
        """Fetch subtitle content from URL and parse to segments"""
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url)
            content = response.text
            
            return self._parse_srt_content(content)
    
    def _parse_srt_content(self, content: str) -> List[SubtitleSegment]:
        """Parse SRT/VTT format subtitle content"""
        
        segments = []
        # Handle both SRT and VTT formats
        content = content.replace('\r\n', '\n').replace('\r', '\n')
        
        # VTT header
        content = re.sub(r'WEBVTT.*?\n\n', '', content, flags=re.DOTALL)
        
        # Split by blank lines
        blocks = re.split(r'\n\s*\n', content.strip())
        
        for block in blocks:
            lines = block.strip().split('\n')
            if len(lines) < 2:
                continue
            
            # Parse time line
            time_match = re.search(r'(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})', 
                                   lines[0])
            
            if not time_match:
                # Try shorter format (mm:ss)
                time_match = re.search(r'(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2})[,.](\d{3})',
                                       lines[0])
            
            if time_match:
                if len(time_match.groups()) == 8:
                    # HH:MM:SS,mmm format
                    start = int(time_match.group(1)) * 3600 + int(time_match.group(2)) * 60 + int(time_match.group(3)) + int(time_match.group(4)) / 1000
                    end = int(time_match.group(5)) * 3600 + int(time_match.group(6)) * 60 + int(time_match.group(7)) + int(time_match.group(8)) / 1000
                else:
                    # MM:SS,mmm format
                    start = int(time_match.group(1)) * 60 + int(time_match.group(2)) + int(time_match.group(3)) / 1000
                    end = int(time_match.group(4)) * 60 + int(time_match.group(5)) + int(time_match.group(6)) / 1000
                
                # Get text (remaining lines)
                text = ' '.join(lines[1:]).strip()
                text = re.sub(r'<[^>]+>', '', text)  # Remove HTML tags
                
                if text:
                    segments.append(SubtitleSegment(
                        id=len(segments),
                        start=start,
                        end=end,
                        text=text,
                        translation=None
                    ))
        
        return segments
    
    async def get_basic_info(self, video_id: str) -> Dict[str, Any]:
        """Get basic video information without subtitles"""
        loop = asyncio.get_event_loop()
        
        video_data = await loop.run_in_executor(
            None,
            self._extract_video_info,
            video_id
        )
        
        return {
            "video_id": video_id,
            "title": video_data.get('title', ''),
            "thumbnail": f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
            "duration": video_data.get('duration', 0) or 0,
            "channel": video_data.get('uploader', video_data.get('channel', '')),
        }
    
    async def get_transcript_only(self, video_id: str, lang: str = 'en') -> List[Dict]:
        """Get transcript segments without full video info"""
        result = await self.get_video_info(video_id, use_whisper=True)
        return [
            {"start": s.start, "end": s.end, "text": s.text}
            for s in result["video_info"].subtitles
        ]
    
    async def translate_subtitles(self, subtitles: List[SubtitleSegment]) -> List[SubtitleSegment]:
        """Translate subtitles using LibreTranslate (free) or fallback"""
        try:
            # Try LibreTranslate (free, self-hosted friendly)
            async with httpx.AsyncClient(timeout=60.0) as client:
                try:
                    response = await client.post(
                        "https://libretranslate.com/translate",
                        json={
                            "q": [s.text for s in subtitles],
                            "source": "en",
                            "target": "zh",
                            "format": "text"
                        }
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        translations = data.get('translatedText', [])
                        
                        for i, segment in enumerate(subtitles):
                            if i < len(translations):
                                segment.translation = translations[i]
                            else:
                                segment.translation = segment.text
                    else:
                        # Fallback: use same text
                        for segment in subtitles:
                            segment.translation = segment.text
                            
                except Exception:
                    # If translation fails, use original text
                    for segment in subtitles:
                        segment.translation = f"[翻译不可用] {segment.text}"
            
            return subtitles
            
        except Exception as e:
            # Return originals with error note
            for segment in subtitles:
                segment.translation = f"[翻译错误] {segment.text}"
            return subtitles
