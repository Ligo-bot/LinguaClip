'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface VideoInputProps {
  onLoading?: (loading: boolean) => void
}

// Extract video ID from YouTube URL
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }
  return null
}

export default function VideoInput({ onLoading }: VideoInputProps) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!url.trim()) {
      setError('Please enter a YouTube video URL')
      return
    }

    // Extract video ID from URL
    const videoId = extractVideoId(url)
    
    if (!videoId) {
      setError('Invalid YouTube URL. Please enter a valid YouTube video link.')
      return
    }

    setLoading(true)
    onLoading?.(true)

    try {
      // Just navigate to learn page with video_id
      // The learn page will fetch the data itself
      router.push(`/learn/${videoId}`)
    } catch (err) {
      setError('Failed to navigate. Please try again.')
      setLoading(false)
      onLoading?.(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <svg
            className="w-5 h-5 text-dark-textSecondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube video URL here..."
          className="input-dark"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            'Start Learning'
          )}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-red-400 text-sm text-center">{error}</p>
      )}
      <p className="mt-4 text-dark-textSecondary text-sm text-center">
        Supports YouTube videos with or without subtitles
      </p>
    </form>
  )
}
