import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const SUPADATA_API_KEY = 'sd_47cabf6ee09c245cb9d8849702ab9ae3'
const SUPADATA_API = 'https://api.supadata.ai/v1/youtube/transcript'

interface SubtitleSegment {
  id: number
  start: number
  end: number
  text: string
  translation?: string
}

/**
 * Merge short subtitle segments into complete sentences.
 */
function mergeSubtitleSegments(segments: SubtitleSegment[]): SubtitleSegment[] {
  if (segments.length === 0) return segments
  
  const merged: SubtitleSegment[] = []
  let current = { ...segments[0] }
  
  for (let i = 1; i < segments.length; i++) {
    const next = segments[i]
    const gap = next.start - current.end
    const currentWordCount = current.text.split(/\s+/).length
    const endsWithPunctuation = /[.!?]$/.test(current.text.trim())
    
    if (!endsWithPunctuation && gap < 0.5 && currentWordCount < 12) {
      current.text += ' ' + next.text
      current.end = next.end
      if (current.translation && next.translation) {
        current.translation += ' ' + next.translation
      }
    } else {
      merged.push(current)
      current = { ...next }
    }
  }
  
  merged.push(current)
  return merged.map((seg, index) => ({ ...seg, id: index }))
}

/**
 * Fetch subtitles from Supadata API
 */
async function fetchSubtitlesFromSupadata(videoId: string): Promise<SubtitleSegment[]> {
  try {
    const response = await fetch(`${SUPADATA_API}?videoId=${videoId}`, {
      method: 'GET',
      headers: {
        'x-api-key': SUPADATA_API_KEY,
      },
    })

    if (!response.ok) {
      console.error('Supadata API failed:', response.status, response.statusText)
      return []
    }

    const data = await response.json()
    
    if (data.content && Array.isArray(data.content)) {
      const segments = data.content.map((seg: any, index: number) => ({
        id: index,
        start: seg.offset / 1000,
        end: (seg.offset + seg.duration) / 1000,
        text: seg.text,
        translation: undefined,
      }))
      
      return mergeSubtitleSegments(segments)
    }
    
    return []
  } catch (error) {
    console.error('Error fetching subtitles from Supadata:', error)
    return []
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { videoId: string } }
) {
  const videoId = params.videoId

  try {
    // Get basic video info from backend
    const response = await fetch(`${API_BASE_URL}/api/video/info/${videoId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      // If backend doesn't have the video, return a basic response
      // with just the video ID and fetch subtitles
      const subtitles = await fetchSubtitlesFromSupadata(videoId)
      
      return NextResponse.json({
        success: true,
        data: {
          video_id: videoId,
          title: 'YouTube Video',
          description: '',
          duration: subtitles.length > 0 ? subtitles[subtitles.length - 1].end : 0,
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          channel: 'YouTube',
          subtitles: subtitles,
          has_subtitles: subtitles.length > 0,
        }
      })
    }

    const result = await response.json()
    
    // Fetch subtitles from Supadata API
    const subtitles = await fetchSubtitlesFromSupadata(videoId)
    
    if (subtitles.length > 0) {
      result.data.subtitles = subtitles
      result.data.has_subtitles = true
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error getting video info:', error)
    
    // Try to at least get subtitles
    const subtitles = await fetchSubtitlesFromSupadata(videoId)
    
    return NextResponse.json({
      success: true,
      data: {
        video_id: videoId,
        title: 'YouTube Video',
        description: '',
        duration: subtitles.length > 0 ? subtitles[subtitles.length - 1].end : 0,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        channel: 'YouTube',
        subtitles: subtitles,
        has_subtitles: subtitles.length > 0,
      }
    })
  }
}
