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

/**
 * Merge short subtitle segments into complete sentences.
 * More conservative merging - keeps sentences shorter for better learning.
 */
export function mergeSubtitleSegments(segments: SubtitleSegment[]): SubtitleSegment[] {
  if (segments.length === 0) return segments;
  
  const merged: SubtitleSegment[] = [];
  let current = { ...segments[0] };
  
  for (let i = 1; i < segments.length; i++) {
    const next = segments[i];
    const gap = next.start - current.end;
    const currentWordCount = current.text.split(/\s+/).length;
    const endsWithPunctuation = /[.!?]$/.test(current.text.trim());
    
    // Only merge if:
    // 1. Current segment doesn't end with punctuation
    // 2. Gap is very small (less than 0.5 seconds)
    // 3. Current merged text is less than 12 words
    if (!endsWithPunctuation && gap < 0.5 && currentWordCount < 12) {
      current.text += ' ' + next.text;
      current.end = next.end;
      if (current.translation && next.translation) {
        current.translation += ' ' + next.translation;
      }
    } else {
      merged.push(current);
      current = { ...next };
    }
  }
  
  // Don't forget the last segment
  merged.push(current);
  
  // Re-index with sequential IDs
  return merged.map((seg, index) => ({ ...seg, id: index }));
}

/**
 * Get word-level timing information for a subtitle segment.
 * Since Supadata doesn't provide word-level timestamps, we estimate based on word count.
 */
export interface WordTiming {
  word: string;
  start: number;
  end: number;
}

export function getWordTimings(segment: SubtitleSegment): WordTiming[] {
  const words = segment.text.split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return [];
  
  const duration = segment.end - segment.start;
  const wordDuration = duration / words.length;
  
  return words.map((word, index) => ({
    word,
    start: segment.start + index * wordDuration,
    end: segment.start + (index + 1) * wordDuration,
  }));
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
      const segments = data.content.map((seg: any, index: number) => ({
        id: index,
        start: seg.offset / 1000, // Convert ms to seconds
        end: (seg.offset + seg.duration) / 1000,
        text: seg.text,
        translation: undefined,
      }));
      
      // Merge short segments into complete sentences
      return mergeSubtitleSegments(segments);
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
    
    // Translate in small batches
    const batchSize = 5;
    for (let i = 0; i < translatedSubtitles.length; i += batchSize) {
      const batch = translatedSubtitles.slice(i, i + batchSize);
      
      // Translate each segment in parallel within the batch
      await Promise.all(batch.map(async (segment, batchIndex) => {
        const actualIndex = i + batchIndex;
        
        // Skip if already has translation
        if (segment.translation) return;
        
        try {
          const translated = await translateText(segment.text);
          translatedSubtitles[actualIndex].translation = translated;
        } catch (e) {
          console.error('Translation error for segment:', actualIndex, e);
          translatedSubtitles[actualIndex].translation = segment.text; // Fallback to original
        }
      }));
      
      // Small delay between batches
      if (i + batchSize < translatedSubtitles.length) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    return translatedSubtitles;
  } catch (error) {
    console.error('Error translating subtitles:', error);
    return subtitles;
  }
}

// Translate text using Google Translate free API
async function translateText(text: string): Promise<string> {
  const maxRetries = 2;
  
  // Limit text length to avoid URI_TOO_LONG error
  // Google Translate API has a limit of around 2000 chars in URL
  const textToTranslate = text.substring(0, 150);
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Use Google Translate free API endpoint
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(textToTranslate)}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Google returns array of arrays: [[translated_text, original_text, null, null, score], ...]
      if (data && data[0] && Array.isArray(data[0])) {
        const translatedParts = data[0]
          .filter((item: any) => item && typeof item[0] === 'string')
          .map((item: any) => item[0])
          .join('');
        
        if (translatedParts) {
          return translatedParts;
        }
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error(`Translation attempt ${attempt + 1} failed:`, error);
      
      if (attempt === maxRetries - 1) {
        // Last attempt failed, return original text
        return textToTranslate;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  return textToTranslate;
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
