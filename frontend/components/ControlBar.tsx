'use client'

import { formatTime } from '@/lib/api'

interface ControlBarProps {
  currentSegmentIndex: number
  totalSegments: number
  playbackRate: number
  isLooping: boolean
  currentTime: number
  segmentDuration: number
  onPrevious: () => void
  onNext: () => void
  onToggleLoop: () => void
  onPlaybackRateChange: (rate: number) => void
  onSeekBackward: () => void
  onSeekForward: () => void
}

export default function ControlBar({
  currentSegmentIndex,
  totalSegments,
  playbackRate,
  isLooping,
  currentTime,
  segmentDuration,
  onPrevious,
  onNext,
  onToggleLoop,
  onPlaybackRateChange,
  onSeekBackward,
  onSeekForward,
}: ControlBarProps) {
  const playbackRates = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0]

  return (
    <div className="bg-dark-card rounded-xl shadow-lg p-4 border border-dark-border">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-dark-textSecondary mb-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(segmentDuration)}</span>
        </div>
        <div className="h-2 bg-dark-lighter rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300"
            style={{ width: `${Math.min((currentTime / segmentDuration) * 100, 100)}%` }}
          />
        </div>
        <div className="text-center text-sm text-dark-textSecondary mt-1">
          Segment {currentSegmentIndex + 1} of {totalSegments}
        </div>
      </div>

      {/* Main controls */}
      <div className="flex items-center justify-center gap-2">
        {/* Seek backward */}
        <button
          onClick={onSeekBackward}
          className="control-btn p-2"
          title="Seek backward 5s"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
          </svg>
        </button>

        {/* Previous segment */}
        <button
          onClick={onPrevious}
          disabled={currentSegmentIndex === 0}
          className="control-btn p-2 disabled:opacity-30"
          title="Previous segment"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>

        {/* Loop toggle */}
        <button
          onClick={onToggleLoop}
          className={`control-btn p-3 ${isLooping ? 'active bg-orange-500/20 text-orange-500' : ''}`}
          title="Loop current segment"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>

        {/* Next segment */}
        <button
          onClick={onNext}
          disabled={currentSegmentIndex === totalSegments - 1}
          className="control-btn p-2 disabled:opacity-30"
          title="Next segment"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>

        {/* Seek forward */}
        <button
          onClick={onSeekForward}
          className="control-btn p-2"
          title="Seek forward 5s"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
          </svg>
        </button>

        {/* Divider */}
        <div className="w-px h-8 bg-dark-border mx-2" />

        {/* Playback rate */}
        <div className="relative group">
          <button className="control-btn p-2 flex items-center gap-1">
            <span className="text-sm font-medium">{playbackRate}x</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
            <div className="bg-dark-card shadow-xl rounded-lg p-2 border border-dark-border flex gap-1">
              {playbackRates.map((rate) => (
                <button
                  key={rate}
                  onClick={() => onPlaybackRateChange(rate)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    playbackRate === rate
                      ? 'bg-orange-500 text-white'
                      : 'text-dark-textSecondary hover:bg-dark-lighter hover:text-dark-text'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
