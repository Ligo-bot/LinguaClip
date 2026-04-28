'use client'

import { useEffect, useRef, useState } from 'react'

interface VideoPlayerProps {
  videoId: string
  currentTime: number
  seekTime: number | null
  playbackRate: number
  onTimeUpdate: (time: number) => void
  onEnded: () => void
  onSeekComplete: () => void
}

export default function VideoPlayer({
  videoId,
  currentTime,
  seekTime,
  playbackRate,
  onTimeUpdate,
  onEnded,
  onSeekComplete,
}: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isReady, setIsReady] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastTimeRef = useRef<number>(0)

  // Poll current time from YouTube player
  useEffect(() => {
    if (!isReady) return

    // Request current time every 500ms
    intervalRef.current = setInterval(() => {
      const iframe = iframeRef.current
      if (iframe && iframe.contentWindow) {
        // Request player state info
        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: 'listening',
          }),
          '*'
        )
      }
    }, 500)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isReady])

  // Listen for YouTube iframe messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // YouTube sends messages with various formats
      try {
        if (typeof event.data === 'string') {
          const data = JSON.parse(event.data)
          
          // Handle time updates
          if (data.event === 'onStateChange' || data.event === 'infoDelivery') {
            if (data.info) {
              // Current time update
              if (typeof data.info.currentTime === 'number') {
                const newTime = data.info.currentTime
                // Only update if time changed significantly (more than 0.1s)
                if (Math.abs(newTime - lastTimeRef.current) > 0.1) {
                  lastTimeRef.current = newTime
                  onTimeUpdate(newTime)
                }
              }
              // Player state: 0 = ended, 1 = playing, 2 = paused
              if (data.info.playerState === 0) {
                onEnded()
              }
            }
          }
          
          // Initial info delivery
          if (data.event === 'initialDelivery' && data.info) {
            if (typeof data.info.currentTime === 'number') {
              lastTimeRef.current = data.info.currentTime
              onTimeUpdate(data.info.currentTime)
            }
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [onTimeUpdate, onEnded])

  // Handle playback rate change
  useEffect(() => {
    const iframe = iframeRef.current
    if (iframe && iframe.contentWindow && isReady) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'setPlaybackRate',
          args: [playbackRate],
        }),
        '*'
      )
    }
  }, [playbackRate, isReady])

  // Handle seek when seekTime changes
  useEffect(() => {
    if (seekTime !== null && isReady) {
      const iframe = iframeRef.current
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [seekTime, true],
          }),
          '*'
        )
        // Also play the video
        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'playVideo',
            args: [],
          }),
          '*'
        )
        onSeekComplete()
      }
    }
  }, [seekTime, isReady, onSeekComplete])

  const handleIframeLoad = () => {
    setIsReady(true)
    // Start listening to player events
    const iframe = iframeRef.current
    if (iframe && iframe.contentWindow) {
      // Tell YouTube we want to receive events
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'listening',
        }),
        '*'
      )
      // Set initial playback rate
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'setPlaybackRate',
          args: [playbackRate],
        }),
        '*'
      )
    }
  }

  return (
    <div className="relative w-full h-full bg-gray-900">
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=1&cc_lang_pref=en&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={handleIframeLoad}
        className="absolute top-0 left-0 w-full h-full"
        title="YouTube video player"
      />
    </div>
  )
}
