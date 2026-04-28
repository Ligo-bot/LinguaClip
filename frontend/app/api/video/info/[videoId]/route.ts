import { NextRequest, NextResponse } from 'next/server'

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
 * Fetch subtitles from Supadata API with timeout
 */
async function fetchSubtitlesFromSupadata(videoId: string): Promise<SubtitleSegment[]> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
    
    const response = await fetch(`${SUPADATA_API}?videoId=${videoId}`, {
      method: 'GET',
      headers: {
        'x-api-key': SUPADATA_API_KEY,
      },
      signal: controller.signal,
    })
    
    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error('Supadata API failed:', response.status)
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

/**
 * Fetch video info from YouTube oEmbed API with timeout
 */
async function fetchVideoInfo(videoId: string): Promise<{ title: string; channel: string }> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
    
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
      { signal: controller.signal }
    )
    
    clearTimeout(timeoutId)
    
    if (response.ok) {
      const data = await response.json()
      return {
        title: data.title || 'YouTube Video',
        channel: data.author_name || 'YouTube'
      }
    }
  } catch (error) {
    console.error('Error fetching video info:', error)
  }
  
  return {
    title: 'YouTube Video',
    channel: 'YouTube'
  }
}

export async function GET(
  request: NextRequest,
  context: { params: { videoId: string } }
) {
  try {
    const videoId = context.params.videoId

    if (!videoId) {
      return NextResponse.json({
        success: false,
        error: 'Video ID is required'
      }, { status: 400 })
    }

    // Fetch subtitles and video info in parallel
    const [subtitles, videoInfo] = await Promise.all([
      fetchSubtitlesFromSupadata(videoId),
      fetchVideoInfo(videoId)
    ])

    // Always return success, even if no subtitles found
    return NextResponse.json({
      success: true,
      data: {
        video_id: videoId,
        title: videoInfo.title,
        description: '',
        duration: subtitles.length > 0 ? subtitles[subtitles.length - 1].end : 0,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        channel: videoInfo.channel,
        subtitles: subtitles,
        has_subtitles: subtitles.length > 0,
      }
    })
  } catch (error) {
    console.error('Error in video info API:', error)
    
    return NextResponse.json({
      success: false,
      error: 'Failed to load video'
    }, { status: 500 })
  }
}
