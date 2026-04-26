"""
Whisper Service - Audio transcription using OpenAI Whisper API
"""
import os
import httpx
from typing import Dict, Any, List
from openai import OpenAI


class WhisperService:
    """Service for audio transcription using Whisper"""
    
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key:
            self.client = OpenAI(api_key=api_key)
        else:
            self.client = None
    
    async def transcribe_video(self, audio_url: str, video_id: str) -> Dict[str, Any]:
        """
        Transcribe video audio using Whisper API.
        Downloads the audio and sends to OpenAI Whisper for transcription.
        """
        if not self.client:
            raise ValueError("OpenAI API key not configured")
        
        # For streaming audio, we'll use the audio URL directly
        # Note: This requires the audio to be accessible and in a supported format
        
        try:
            # Download audio file
            async with httpx.AsyncClient(timeout=120.0, follow_redirects=True) as client:
                response = await client.get(audio_url)
                audio_data = response.content
            
            # Save to temporary file for Whisper processing
            import tempfile
            import shutil
            
            temp_dir = tempfile.mkdtemp()
            audio_path = os.path.join(temp_dir, f"{video_id}.mp3")
            
            with open(audio_path, 'wb') as f:
                f.write(audio_data)
            
            try:
                # Transcribe with Whisper
                with open(audio_path, 'rb') as audio_file:
                    transcript = self.client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio_file,
                        response_format="verbose_json",
                        timestamp_granularities=["segment"]
                    )
                
                # Parse response
                segments = []
                if hasattr(transcript, 'segments') and transcript.segments:
                    for seg in transcript.segments:
                        segments.append({
                            "start": seg.start,
                            "end": seg.end,
                            "text": seg.text.strip()
                        })
                else:
                    # Single segment fallback
                    segments.append({
                        "start": 0.0,
                        "end": 10.0,
                        "text": transcript.text.strip() if hasattr(transcript, 'text') else str(transcript)
                    })
                
                return {
                    "text": transcript.text if hasattr(transcript, 'text') else str(transcript),
                    "segments": segments,
                    "language": getattr(transcript, 'language', 'en')
                }
                
            finally:
                # Cleanup temp file
                shutil.rmtree(temp_dir, ignore_errors=True)
                
        except Exception as e:
            raise Exception(f"Whisper transcription failed: {str(e)}")
    
    def transcribe_audio_file(self, file_path: str) -> Dict[str, Any]:
        """
        Transcribe a local audio file.
        This is a synchronous version for direct file processing.
        """
        if not self.client:
            raise ValueError("OpenAI API key not configured")
        
        try:
            with open(file_path, 'rb') as audio_file:
                transcript = self.client.audio.transcriptions.create(
                    model="whisper-1",
                    file=audio_file,
                    response_format="verbose_json",
                    timestamp_granularities=["segment"]
                )
            
            segments = []
            if hasattr(transcript, 'segments') and transcript.segments:
                for seg in transcript.segments:
                    segments.append({
                        "start": seg.start,
                        "end": seg.end,
                        "text": seg.text.strip()
                    })
            else:
                segments.append({
                    "start": 0.0,
                    "end": 10.0,
                    "text": transcript.text.strip() if hasattr(transcript, 'text') else str(transcript)
                })
            
            return {
                "text": transcript.text if hasattr(transcript, 'text') else str(transcript),
                "segments": segments,
                "language": getattr(transcript, 'language', 'en')
            }
            
        except Exception as e:
            raise Exception(f"Whisper transcription failed: {str(e)}")
