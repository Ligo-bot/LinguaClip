'use client'

import { useEffect, useRef, useState } from 'react'
import { formatTime } from '@/lib/api'

interface VideoPlayerProps {
  videoId: string
  currentTime: number
  playbackRate: number
  onTimeUpdate: (time: number) => void
  onEnded: () => void
}

export default function VideoPlayer({
  videoId,
  currentTime,
  playbackRate,
  onTimeUpdate,
  onEnded,
}: VideoPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isReady, setIsReady] = useState(false)

  // Calculate current time from iframe (approximation based on postMessage)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === 'object' && event.data.videoId === videoId) {
        if (event.data.event === 'infoDelivery' && event.data.info) {
          if (event.data.info.currentTime) {
            onTimeUpdate(event.data.info.currentTime)
          }
          if (event.data.info.playerState === 0) {
            // Video ended
            onEnded()
          }
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [videoId, onTimeUpdate, onEnded])

  // Handle playback rate change
  useEffect(() => {
    const iframe = iframeRef.current
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'setPlaybackRate',
          args: [playbackRate],
        }),
        '*'
      )
    }
  }, [playbackRate])

  // Seek to specific time
  const seekTo = (time: number) => {
    const iframe = iframeRef.current
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'seekTo',
          args: [time, true],
        }),
        '*'
      )
    }
  }

  // Seek when currentTime changes significantly (from external control)
  useEffect(() => {
    if (isReady) {
      const iframe = iframeRef.current
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [currentTime, true],
          }),
          '*'
        )
      }
    }
  }, [Math.floor(currentTime / 5)]) // Only seek when 5-second boundaries change

  const handleIframeLoad = () => {
    setIsReady(true)
    // Set playback rate after load
    const iframe = iframeRef.current
    if (iframe && iframe.contentWindow) {
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

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  return (
    <div className="video-container bg-gray-900">
      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=1&cc_lang_pref=en`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={handleIframeLoad}
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  )
}

// Helper component for subtitle sync display
export function SubtitleOverlay({ 
  text, 
  translation 
}: { 
  text: string
  translation?: string 
}) {
  return (
    <div className="absolute bottom-4 left-0 right-0 text-center px-4 pointer-events-none">
      <div className="inline-block bg-black/80 text-white px-4 py-2 rounded-lg max-w-3xl">
        <p className="text-lg font-medium">{text}</p>
        {translation && (
          <p className="text-sm text-gray-300 mt-1">{translation}</p>
        )}
      </div>
    </div>
  )
}
