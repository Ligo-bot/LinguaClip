"""
Data models for LinguaClip API
"""
from pydantic import BaseModel
from typing import Optional, List


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
