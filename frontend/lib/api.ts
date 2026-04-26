// API client for LinguaClip backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Types
export interface SubtitleSegment {
  id: number;
  start: number;
  end: number;
  text: string;
  translation?: string;
}

export interface VideoInfo {
  video_id: string;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  channel: string;
  subtitles: SubtitleSegment[];
  has_subtitles: boolean;
  caption_url?: string;
}

export interface VideoParseResponse {
  success: boolean;
  data?: VideoInfo;
  error?: string;
  processing_method: string;
}

// Extract video ID from YouTube URL
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

// Frontend: Fetch subtitles directly from YouTube (bypass server blocking)
export async function fetchSubtitlesFromFrontend(videoId: string): Promise<SubtitleSegment[]> {
  try {
    // Use a CORS proxy to fetch YouTube captions
    const corsProxies = [
      `https://api.allorigins.win/raw?url=`,
      `https://corsproxy.io/?`,
    ];
    
    // Try to get captions via YouTube's timedtext API
    const captionUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&fmt=json3`;
    
    for (const proxy of corsProxies) {
      try {
        const response = await fetch(proxy + encodeURIComponent(captionUrl), {
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) continue;
        
        const data = await response.json();
        const segments = parseYouTubeJson3(data);
        
        if (segments.length > 0) {
          return segments;
        }
      } catch (e) {
        console.log(`Proxy ${proxy} failed:`, e);
        continue;
      }
    }
    
    // Fallback: Try auto-generated captions
    const autoCaptionUrl = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=en&kind=asr&fmt=json3`;
    
    for (const proxy of corsProxies) {
      try {
        const response = await fetch(proxy + encodeURIComponent(autoCaptionUrl), {
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) continue;
        
        const data = await response.json();
        const segments = parseYouTubeJson3(data);
        
        if (segments.length > 0) {
          return segments;
        }
      } catch (e) {
        continue;
      }
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching subtitles from frontend:', error);
    return [];
  }
}

// Parse YouTube JSON3 subtitle format
function parseYouTubeJson3(data: any): SubtitleSegment[] {
  const segments: SubtitleSegment[] = [];
  
  if (!data || !data.events) return segments;
  
  let segId = 0;
  
  for (const event of data.events) {
    const segs = event.segs;
    if (!segs || segs.length === 0) continue;
    
    const startMs = event.tStartMs || 0;
    const durationMs = event.dDurationMs || 0;
    
    const start = startMs / 1000.0;
    const end = (startMs + durationMs) / 1000.0;
    
    // Combine all text segments
    const textParts: string[] = [];
    for (const seg of segs) {
      const text = seg.utf8?.trim();
      if (text) {
        textParts.push(text);
      }
    }
    
    let text = textParts.join(' ').trim();
    
    // Remove music/sound descriptions like [Music], (applause), etc.
    text = text.replace(/[\[\(].*?[\]\)]/g, '').trim();
    
    if (text) {
      segments.push({
        id: segId++,
        start,
        end,
        text,
        translation: undefined,
      });
    }
  }
  
  return segments;
}

// Main API Functions
export async function parseVideo(url: string, useWhisper: boolean = false): Promise<VideoParseResponse> {
  try {
    const videoId = extractVideoId(url);
    
    if (!videoId) {
      return {
        success: false,
        error: 'Invalid YouTube URL',
        processing_method: 'none',
      };
    }
    
    // Try to fetch subtitles from frontend first (bypass server blocking)
    const frontendSubtitles = await fetchSubtitlesFromFrontend(videoId);
    
    // Get basic video info from backend
    const response = await fetch(`${API_BASE_URL}/api/video/parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, use_whisper: useWhisper }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to parse video');
    }

    const result = await response.json();
    
    // Use frontend subtitles if available, otherwise use backend subtitles
    if (frontendSubtitles.length > 0) {
      result.data.subtitles = frontendSubtitles;
      result.data.has_subtitles = true;
      result.processing_method = 'frontend_captions';
    }
    
    return result;
  } catch (error) {
    console.error('Error parsing video:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      processing_method: 'none',
    };
  }
}

export async function getVideoInfo(videoId: string): Promise<VideoInfo | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/video/info/${videoId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get video info');
    }

    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('Error getting video info:', error);
    return null;
  }
}

export async function translateSubtitles(subtitles: SubtitleSegment[]): Promise<SubtitleSegment[]> {
  try {
    // Use MyMemory free translation API from frontend
    const translatedSubtitles = [...subtitles];
    
    for (let i = 0; i < translatedSubtitles.length; i++) {
      const segment = translatedSubtitles[i];
      try {
        const textToTranslate = segment.text.substring(0, 450);
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|zh`
        );
        
        if (response.ok) {
          const data = await response.json();
          segment.translation = data.responseData?.translatedText || segment.text;
        } else {
          segment.translation = segment.text;
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        segment.translation = segment.text;
      }
    }
    
    return translatedSubtitles;
  } catch (error) {
    console.error('Error translating subtitles:', error);
    return subtitles;
  }
}

// Dictionary API (Free Dictionary API)
export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
      synonyms?: string[];
    }[];
  }[];
}

export async function lookupWord(word: string): Promise<DictionaryEntry | null> {
  try {
    // Clean the word (remove punctuation)
    const cleanWord = word.toLowerCase().replace(/[^a-z]/g, '');
    
    if (!cleanWord) return null;

    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data[0] || null;
  } catch (error) {
    console.error('Error looking up word:', error);
    return null;
  }
}

// Format time in MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
