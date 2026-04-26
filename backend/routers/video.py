"""
Video Router - Handle YouTube video parsing and subtitle extraction
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import Optional, List
import httpx

from services.youtube import YouTubeService

router = APIRouter()
youtube_service = YouTubeService()


class VideoParseRequest(BaseModel):
    """Request model for video parsing"""
    url: str = Field(..., description="YouTube video URL")
    use_whisper: bool = Field(default=False, description="Force use Whisper for videos without subtitles")


class SubtitleSegment(BaseModel):
    """Subtitle segment model"""
    id: int
    start: float  # Start time in seconds
    end: float    # End time in seconds
    text: str     # Original text
    translation: Optional[str] = None


class VideoInfo(BaseModel):
    """Video information model"""
    video_id: str
    title: str
    description: str
    duration: int  # Duration in seconds
    thumbnail: str
    channel: str
    subtitles: List[SubtitleSegment]
    has_subtitles: bool
    caption_url: Optional[str] = None


class VideoParseResponse(BaseModel):
    """Response model for video parsing"""
    success: bool
    data: Optional[VideoInfo] = None
    error: Optional[str] = None
    processing_method: str  # "youtube_captions" or "whisper"


@router.post("/parse", response_model=VideoParseResponse)
async def parse_video(request: VideoParseRequest):
    """
    Parse a YouTube video and extract subtitles.
    
    - First tries to get YouTube's built-in captions
    - If no captions available and use_whisper=True, uses Whisper API
    """
    try:
        # Validate URL
        video_id = youtube_service.extract_video_id(request.url)
        if not video_id:
            return VideoParseResponse(
                success=False,
                error="Invalid YouTube URL",
                processing_method="none"
            )
        
        # Get video info and subtitles
        result = await youtube_service.get_video_info(video_id, request.use_whisper)
        
        return VideoParseResponse(
            success=True,
            data=result["video_info"],
            processing_method=result["method"]
        )
        
    except Exception as e:
        return VideoParseResponse(
            success=False,
            error=str(e),
            processing_method="none"
        )


@router.get("/info/{video_id}")
async def get_video_info(video_id: str):
    """Get basic video information without subtitles"""
    try:
        info = await youtube_service.get_basic_info(video_id)
        return {"success": True, "data": info}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/translate")
async def translate_subtitles(subtitles: List[SubtitleSegment]):
    """
    Translate subtitles using free translation API
    """
    try:
        translated = await youtube_service.translate_subtitles(subtitles)
        return {"success": True, "data": translated}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class TranscriptRequest(BaseModel):
    """Request model for transcript-only extraction"""
    video_id: str
    lang: str = Field(default="en", description="Language code")


@router.post("/transcript")
async def get_transcript(request: TranscriptRequest):
    """Get video transcript without full parsing"""
    try:
        transcript = await youtube_service.get_transcript_only(request.video_id, request.lang)
        return {"success": True, "data": transcript}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
