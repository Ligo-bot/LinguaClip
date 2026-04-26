'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { SubtitleSegment, VideoInfo, formatTime, translateSubtitles } from '@/lib/api'
import Head from 'next/head'

// Dynamic import to avoid SSR issues with YouTube iframe
const VideoPlayer = dynamic(() => import('@/components/VideoPlayer'), { ssr: false })
const SubtitlePanel = dynamic(() => import('@/components/SubtitlePanel'), { ssr: false })
const ControlBar = dynamic(() => import('@/components/ControlBar'), { ssr: false })

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
  const [hoveredSegment, setHoveredSegment] = useState<SubtitleSegment | null>(null)
  
  // Ref for triggering seek
  const seekTimeRef = useRef<number | null>(null)

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading video...</p>
        </div>
      </div>
    )
  }

  if (error || !videoInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Video Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'Unable to load video'}</p>
          <a href="/" className="text-primary-600 hover:text-primary-700 font-medium">
            ← Back to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{videoInfo.title} - LinguaClip</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </a>
              <div className="h-6 w-px bg-gray-200" />
              <h1 className="font-semibold text-gray-800 truncate max-w-md">{videoInfo.title}</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{videoInfo.channel}</span>
              {translating && (
                <span className="text-primary-600 animate-pulse">Translating...</span>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full p-4">
          {/* Desktop Layout */}
          <div className="hidden lg:block">
            <div className="grid grid-cols-2 gap-6">
              {/* Video Column */}
              <div className="space-y-4">
                <VideoPlayer
                  videoId={videoId}
                  currentTime={currentTime}
                  seekTime={seekTimeRef.current}
                  playbackRate={playbackRate}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={handleVideoEnded}
                  onSeekComplete={() => { seekTimeRef.current = null }}
                />
                
                {/* Current subtitle display */}
                {currentSegment && (
                  <div className="bg-white rounded-xl shadow-lg p-4">
                    <div className="text-center">
                      <p className="text-xl font-medium text-gray-800 leading-relaxed">
                        {currentSegment.text}
                      </p>
                      <p className="text-lg text-primary-600 mt-2 font-medium">
                        {currentSegment.translation || '翻译中...'}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        {formatTime(currentSegment.start)} - {formatTime(currentSegment.end)}
                      </p>
                    </div>
                  </div>
                )}
                
                <ControlBar
                  currentSegmentIndex={currentSegmentIndex}
                  totalSegments={videoInfo.subtitles.length}
                  playbackRate={playbackRate}
                  isLooping={isLooping}
                  currentTime={currentTime}
                  segmentDuration={totalDuration}
                  onPrevious={goToPreviousSegment}
                  onNext={goToNextSegment}
                  onToggleLoop={toggleLoop}
                  onPlaybackRateChange={setPlaybackRate}
                  onSeekBackward={seekBackward}
                  onSeekForward={seekForward}
                />
              </div>
              
              {/* Subtitle Column */}
              <div className="h-[calc(100vh-200px)]">
                <SubtitlePanel
                  subtitles={videoInfo.subtitles}
                  currentSegmentIndex={currentSegmentIndex}
                  onSegmentClick={handleSegmentClick}
                  onSegmentHover={setHoveredSegment}
                />
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-4">
            {/* Video */}
            <div className="aspect-video">
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
            
            {/* Current subtitle */}
            {currentSegment && (
              <div className="bg-white rounded-xl shadow-lg p-4">
                <p className="text-lg font-medium text-gray-800 text-center">
                  {currentSegment.text}
                </p>
                <p className="text-base text-primary-600 mt-2 text-center font-medium">
                  {currentSegment.translation || '翻译中...'}
                </p>
              </div>
            )}
            
            {/* Controls */}
            <ControlBar
              currentSegmentIndex={currentSegmentIndex}
              totalSegments={videoInfo.subtitles.length}
              playbackRate={playbackRate}
              isLooping={isLooping}
              currentTime={currentTime}
              segmentDuration={totalDuration}
              onPrevious={goToPreviousSegment}
              onNext={goToNextSegment}
              onToggleLoop={toggleLoop}
              onPlaybackRateChange={setPlaybackRate}
              onSeekBackward={seekBackward}
              onSeekForward={seekForward}
            />
            
            {/* Subtitles */}
            <div className="h-64">
              <SubtitlePanel
                subtitles={videoInfo.subtitles}
                currentSegmentIndex={currentSegmentIndex}
                onSegmentClick={handleSegmentClick}
                onSegmentHover={setHoveredSegment}
              />
            </div>
          </div>

          {/* No subtitles message */}
          {videoInfo.subtitles.length === 0 && (
            <div className="mt-8 text-center">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-md mx-auto">
                <svg className="w-12 h-12 mx-auto text-yellow-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">No Subtitles Available</h3>
                <p className="text-yellow-700 text-sm">
                  This video doesn&apos;t have subtitles. Try using the Whisper AI transcription feature for automatic subtitle generation.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
