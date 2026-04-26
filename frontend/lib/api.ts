// API client for LinguaClip backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Supadata API for YouTube transcripts
const SUPADATA_API_KEY = 'sd_47cabf6ee09c245cb9d8849702ab9ae3';
const SUPADATA_API = 'https://api.supadata.ai/v1/youtube/transcript';

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

// Fetch subtitles from Supadata API
export async function fetchSubtitlesFromSupadata(videoId: string): Promise<SubtitleSegment[]> {
  try {
    const response = await fetch(`${SUPADATA_API}?videoId=${videoId}`, {
      method: 'GET',
      headers: {
        'x-api-key': SUPADATA_API_KEY,
      },
    });

    if (!response.ok) {
      console.error('Supadata API failed:', response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    
    // Supadata returns content array with offset and duration in milliseconds
    if (data.content && Array.isArray(data.content)) {
      return data.content.map((seg: any, index: number) => ({
        id: index,
        start: seg.offset / 1000, // Convert ms to seconds
        end: (seg.offset + seg.duration) / 1000,
        text: seg.text,
        translation: undefined,
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching subtitles from Supadata:', error);
    return [];
  }
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
    
    // Fetch subtitles from Supadata API
    const subtitles = await fetchSubtitlesFromSupadata(videoId);
    
    if (subtitles.length > 0) {
      result.data.subtitles = subtitles;
      result.data.has_subtitles = true;
      result.processing_method = 'supadata_api';
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
    const translatedSubtitles = [...subtitles];
    
    // Batch translate to be more efficient
    for (let i = 0; i < translatedSubtitles.length; i++) {
      const segment = translatedSubtitles[i];
      
      // Skip if already has translation
      if (segment.translation) continue;
      
      try {
        const textToTranslate = segment.text.substring(0, 450);
        
        // Use MyMemory API - it's free and reliable
        const response = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textToTranslate)}&langpair=en|zh-CN`
        );
        
        if (response.ok) {
          const data = await response.json();
          
          // Check if translation is valid (not the same as original)
          const translatedText = data.responseData?.translatedText;
          if (translatedText && translatedText !== textToTranslate) {
            segment.translation = translatedText;
          } else {
            // If API returned same text, it might have failed - try alternative
            segment.translation = await translateWithGoogle(textToTranslate);
          }
        } else {
          segment.translation = `【翻译失败】${segment.text}`;
        }
        
        // Small delay to avoid rate limiting (MyMemory has 5000 chars/day limit)
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (e) {
        console.error('Translation error for segment:', i, e);
        segment.translation = `【翻译失败】${segment.text}`;
      }
    }
    
    return translatedSubtitles;
  } catch (error) {
    console.error('Error translating subtitles:', error);
    return subtitles;
  }
}

// Alternative translation using LibreTranslate
async function translateWithGoogle(text: string): Promise<string> {
  try {
    // Use LibreTranslate as backup (free API)
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: 'zh',
        format: 'text'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.translatedText || text;
    }
    return text;
  } catch {
    return text;
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
