'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { SubtitleSegment, VideoInfo, formatTime, translateSubtitles } from '@/lib/api'

// Dynamic import to avoid SSR issues with YouTube iframe
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), { ssr: false })

export default function LearnPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const videoId = params.videoId as string

  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [translating, setTranslating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Player state
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [playbackRate, setPlaybackRate] = useState(1.0)
  const [isLooping, setIsLooping] = useState(false)
  
  // Ref for triggering seek
  const seekTimeRef = useRef<number | null>(null)
  const subtitleListRef = useRef<HTMLDivElement>(null)
  const segmentRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  // Load video data from URL params or fetch
  useEffect(() => {
    const loadVideoData = async () => {
      try {
        // Try to get data from URL params first
        const dataParam = searchParams.get('data')
        if (dataParam) {
          const parsed = JSON.parse(decodeURIComponent(dataParam)) as VideoInfo
          setVideoInfo(parsed)
          setLoading(false)
          return
        }

        // Otherwise, fetch from API
        const response = await fetch(`/api/video/info/${videoId}`)
        if (!response.ok) {
          throw new Error('Failed to load video')
        }
        const result = await response.json()
        if (result.success) {
          setVideoInfo(result.data)
        } else {
          throw new Error('Video not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load video')
      } finally {
        setLoading(false)
      }
    }

    loadVideoData()
  }, [videoId, searchParams])

  // Auto-translate subtitles when video info loads
  useEffect(() => {
    const autoTranslate = async () => {
      if (videoInfo && videoInfo.subtitles.length > 0) {
        // Check if any subtitle needs translation
        const needsTranslation = videoInfo.subtitles.some(s => !s.translation)
        if (!needsTranslation) return
        
        setTranslating(true)
        try {
          const translated = await translateSubtitles(videoInfo.subtitles)
          setVideoInfo(prev => prev ? { ...prev, subtitles: translated } : null)
        } catch (err) {
          console.error('Translation failed:', err)
        } finally {
          setTranslating(false)
        }
      }
    }
    
    autoTranslate()
  }, [videoInfo?.subtitles.length])

  // Get current segment
  const currentSegment = videoInfo?.subtitles[currentSegmentIndex]
  
  // Calculate total duration from segments or video info
  const totalDuration = videoInfo?.duration 
    ? videoInfo.duration 
    : videoInfo?.subtitles[videoInfo.subtitles.length - 1]?.end || 0

  // Update current segment based on video time
  const updateCurrentSegment = useCallback((time: number) => {
    setCurrentTime(time)
    
    if (!videoInfo?.subtitles || videoInfo.subtitles.length === 0) return

    // Find the segment that contains current time
    const segmentIndex = videoInfo.subtitles.findIndex(
      (seg) => time >= seg.start && time < seg.end
    )

    if (segmentIndex !== -1 && segmentIndex !== currentSegmentIndex) {
      setCurrentSegmentIndex(segmentIndex)
    }
  }, [videoInfo, currentSegmentIndex])

  // Handle segment click - seek to that segment
  const handleSegmentClick = (segment: SubtitleSegment, index: number) => {
    setCurrentSegmentIndex(index)
    seekTimeRef.current = segment.start
    setCurrentTime(segment.start)
  }

  // Handle video ended
  const handleVideoEnded = () => {
    if (isLooping && currentSegment) {
      // Loop back to current segment start
      seekTimeRef.current = currentSegment.start
      setCurrentTime(currentSegment.start)
    }
  }

  // Handle time update from player
  const handleTimeUpdate = (time: number) => {
    updateCurrentSegment(time)
    
    // Handle looping
    if (isLooping && currentSegment) {
      if (time >= currentSegment.end) {
        seekTimeRef.current = currentSegment.start
        setCurrentTime(currentSegment.start)
      }
    }
  }

  // Navigation functions
  const goToPreviousSegment = () => {
    if (currentSegmentIndex > 0 && videoInfo) {
      const newIndex = currentSegmentIndex - 1
      setCurrentSegmentIndex(newIndex)
      seekTimeRef.current = videoInfo.subtitles[newIndex].start
      setCurrentTime(videoInfo.subtitles[newIndex].start)
    }
  }

  const goToNextSegment = () => {
    if (videoInfo && currentSegmentIndex < videoInfo.subtitles.length - 1) {
      const newIndex = currentSegmentIndex + 1
      setCurrentSegmentIndex(newIndex)
      seekTimeRef.current = videoInfo.subtitles[newIndex].start
      setCurrentTime(videoInfo.subtitles[newIndex].start)
    }
  }

  const seekBackward = () => {
    const newTime = Math.max(0, currentTime - 5)
    seekTimeRef.current = newTime
    setCurrentTime(newTime)
  }

  const seekForward = () => {
    const newTime = Math.min(totalDuration, currentTime + 5)
    seekTimeRef.current = newTime
    setCurrentTime(newTime)
  }

  const toggleLoop = () => {
    setIsLooping(!isLooping)
  }

  // Auto-scroll to current segment
  useEffect(() => {
    if (segmentRefs.current.has(currentSegmentIndex)) {
      const element = segmentRefs.current.get(currentSegmentIndex)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentSegmentIndex])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading video...</p>
        </div>
      </div>
    )
  }

  if (error || !videoInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Video Not Found</h2>
          <p className="text-gray-400 mb-4">{error || 'Unable to load video'}</p>
          <a href="/" className="text-orange-500 hover:text-orange-400 font-medium">
            ← Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] flex flex-col">
      {/* Header */}
      <header className="bg-[#1F1F1F] border-b border-gray-800 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Back</span>
            </a>
            <div className="h-6 w-px bg-gray-700" />
            <h1 className="font-semibold text-white truncate max-w-md">{videoInfo.title}</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{videoInfo.channel}</span>
            {translating && (
              <span className="text-orange-500 animate-pulse">Translating...</span>
            )}
          </div>
        </div>
      </header>

      {/* Video Section - Fixed at top, always visible */}
      <div className="fixed top-[57px] left-0 right-0 z-40 bg-[#0D0D0D]">
        <div className="max-w-3xl mx-auto px-4 py-3">
          {/* Video Player */}
          <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
            <VideoPlayer
              videoId={videoId}
              currentTime={currentTime}
              seekTime={seekTimeRef.current}
              playbackRate={playbackRate}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              onSeekComplete={() => { seekTimeRef.current = null }}
            />
          </div>
          
          {/* Control Bar */}
          <div className="mt-3 flex items-center justify-between bg-[#1F1F1F] rounded-lg p-3">
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousSegment}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                title="Previous segment"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
              </button>
              <button
                onClick={seekBackward}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                title="Back 5s"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.334 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-white font-mono text-sm">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
              <span className="text-gray-400 text-sm">
                {currentSegmentIndex + 1} / {videoInfo.subtitles.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={seekForward}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                title="Forward 5s"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                </svg>
              </button>
              <button
                onClick={goToNextSegment}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                title="Next segment"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={playbackRate}
                onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                className="bg-gray-800 text-white rounded-lg px-3 py-2 text-sm border-none outline-none cursor-pointer"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
              <button
                onClick={toggleLoop}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isLooping 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                Loop
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subtitle List - Scrollable below video */}
      <div 
        ref={subtitleListRef}
        className="flex-1 overflow-y-auto px-4 pt-[320px] pb-8"
        style={{ paddingTop: '340px' }}
      >
        <div className="max-w-3xl mx-auto space-y-2">
          {videoInfo.subtitles.map((segment, index) => {
            const isCurrent = index === currentSegmentIndex
            
            return (
              <div
                key={segment.id}
                ref={(el) => {
                  if (el) segmentRefs.current.set(index, el)
                }}
                onClick={() => handleSegmentClick(segment, index)}
                className={`
                  p-4 rounded-xl cursor-pointer border-2 transition-all duration-200
                  ${isCurrent 
                    ? 'bg-orange-500/20 border-orange-500 shadow-lg shadow-orange-500/20' 
                    : 'bg-[#1F1F1F] border-gray-800 hover:border-gray-600'}
                `}
              >
                <div className="flex items-start gap-3">
                  <span className={`
                    text-xs font-mono mt-1 min-w-[50px] px-2 py-1 rounded
                    ${isCurrent ? 'bg-orange-500/30 text-orange-400' : 'bg-gray-800 text-gray-400'}
                  `}>
                    {formatTime(segment.start)}
                  </span>
                  <div className="flex-1 min-w-0">
                    {/* English text */}
                    <p className={`leading-relaxed ${isCurrent ? 'text-white font-medium' : 'text-gray-200'}`}>
                      {segment.text}
                    </p>
                    {/* Chinese translation */}
                    <p className={`text-sm mt-2 ${isCurrent ? 'text-orange-300' : 'text-orange-400'}`}>
                      {segment.translation || '翻译中...'}
                    </p>
                  </div>
                  {/* Current indicator */}
                  {isCurrent && (
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
