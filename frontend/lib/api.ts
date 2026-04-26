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

// API Functions
export async function parseVideo(url: string, useWhisper: boolean = false): Promise<VideoParseResponse> {
  try {
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

    return await response.json();
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
    const response = await fetch(`${API_BASE_URL}/api/video/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(subtitles),
    });

    if (!response.ok) {
      throw new Error('Failed to translate subtitles');
    }

    const result = await response.json();
    return result.success ? result.data : subtitles;
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

// Format time in MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
