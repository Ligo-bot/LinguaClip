"""
YouTube Service - Video parsing and subtitle extraction
"""
import re
import httpx
import yt_dlp
from typing import Optional, List, Dict, Any
import asyncio
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound

from models import SubtitleSegment, VideoInfo
from services.whisper_service import WhisperService


class YouTubeService:
    """Service for YouTube video operations"""
    
    def __init__(self):
        self.whisper_service = WhisperService()
        self.ydl_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': 'in_playlist',
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
        """
        # Get video basic info
        video_data = await self._get_video_basic_info(video_id)
        
        # Get subtitles using youtube-transcript-api
        subtitles = await self._get_subtitles_transcript_api(video_id)
        
        if subtitles:
            video_info = VideoInfo(
                video_id=video_id,
                title=video_data.get('title', ''),
                description=video_data.get('description', ''),
                duration=video_data.get('duration', 0) or 0,
                thumbnail=f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
                channel=video_data.get('uploader', video_data.get('channel', '')),
                subtitles=subtitles,
                has_subtitles=True,
                caption_url=None
            )
            
            return {
                "video_info": video_info,
                "method": "youtube_captions"
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
    
    async def _get_video_basic_info(self, video_id: str) -> Dict[str, Any]:
        """Get basic video info using yt-dlp (lightweight)"""
        url = f"https://www.youtube.com/watch?v={video_id}"
        
        try:
            loop = asyncio.get_event_loop()
            opts = {
                'quiet': True,
                'no_warnings': True,
                'extract_flat': 'in_playlist',
                'skip_download': True,
            }
            
            def extract():
                with yt_dlp.YoutubeDL(opts) as ydl:
                    return ydl.extract_info(url, download=False) or {}
            
            return await loop.run_in_executor(None, extract)
        except Exception as e:
            # Fallback: return minimal info
            return {
                'title': f'YouTube Video {video_id}',
                'duration': 0,
                'uploader': '',
            }
    
    async def _get_subtitles_transcript_api(self, video_id: str) -> List[SubtitleSegment]:
        """Get subtitles using youtube-transcript-api"""
        try:
            loop = asyncio.get_event_loop()
            
            def fetch_transcript():
                # Try English first, then auto-generated English
                try:
                    transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=['en', 'en-US'])
                    return transcript
                except NoTranscriptFound:
                    # Try auto-generated
                    try:
                        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
                        # Try to get any English transcript
                        transcript = transcript_list.find_transcript(['en', 'en-US'])
                        return transcript.fetch()
                    except:
                        # Try to get any available transcript
                        for t in transcript_list:
                            return t.fetch()
                return None
            
            transcript = await loop.run_in_executor(None, fetch_transcript)
            
            if not transcript:
                return []
            
            segments = []
            for i, entry in enumerate(transcript):
                text = entry.get('text', '').strip()
                # Remove music/sound descriptions
                text = re.sub(r'[\[\(].*?[\]\)]', '', text).strip()
                
                if text:
                    segments.append(SubtitleSegment(
                        id=i,
                        start=entry.get('start', 0),
                        end=entry.get('start', 0) + entry.get('duration', 0),
                        text=text,
                        translation=None
                    ))
            
            return segments
            
        except TranscriptsDisabled:
            return []
        except Exception as e:
            print(f"Error fetching transcript: {e}")
            return []
    
    async def get_basic_info(self, video_id: str) -> Dict[str, Any]:
        """Get basic video information without subtitles"""
        video_data = await self._get_video_basic_info(video_id)
        
        return {
            "video_id": video_id,
            "title": video_data.get('title', ''),
            "thumbnail": f"https://img.youtube.com/vi/{video_id}/maxresdefault.jpg",
            "duration": video_data.get('duration', 0) or 0,
            "channel": video_data.get('uploader', video_data.get('channel', '')),
        }
    
    async def get_transcript_only(self, video_id: str, lang: str = 'en') -> List[Dict]:
        """Get transcript segments without full video info"""
        subtitles = await self._get_subtitles_transcript_api(video_id)
        return [
            {"start": s.start, "end": s.end, "text": s.text}
            for s in subtitles
        ]
    
    async def translate_subtitles(self, subtitles: List[SubtitleSegment]) -> List[SubtitleSegment]:
        """Translate subtitles using free translation API"""
        try:
            # Try MyMemory free translation API
            async with httpx.AsyncClient(timeout=60.0) as client:
                for segment in subtitles:
                    try:
                        # MyMemory has 500 chars limit per request
                        text_to_translate = segment.text[:450]
                        response = await client.get(
                            "https://api.mymemory.translated.net/get",
                            params={
                                "q": text_to_translate,
                                "langpair": "en|zh"
                            }
                        )
                        
                        if response.status_code == 200:
                            data = response.json()
                            segment.translation = data.get('responseData', {}).get('translatedText', segment.text)
                        else:
                            segment.translation = segment.text
                            
                        # Small delay to avoid rate limiting
                        await asyncio.sleep(0.1)
                            
                    except Exception:
                        segment.translation = segment.text
            
            return subtitles
            
        except Exception as e:
            # Return originals
            for segment in subtitles:
                segment.translation = segment.text
            return subtitles
