'use client'

import { useState, useEffect, useRef } from 'react'
import { SubtitleSegment, lookupWord, DictionaryEntry, formatTime } from '@/lib/api'

interface SubtitlePanelProps {
  subtitles: SubtitleSegment[]
  currentSegmentIndex: number
  onSegmentClick: (segment: SubtitleSegment, index: number) => void
  onSegmentHover: (segment: SubtitleSegment | null) => void
}

export default function SubtitlePanel({
  subtitles,
  currentSegmentIndex,
  onSegmentClick,
  onSegmentHover,
}: SubtitlePanelProps) {
  const listRef = useRef<HTMLDivElement>(null)
  const [selectedWord, setSelectedWord] = useState<{ word: string; entry: DictionaryEntry | null; position: { x: number; y: number } } | null>(null)

  // Auto-scroll to current segment
  useEffect(() => {
    if (listRef.current && currentSegmentIndex >= 0) {
      const activeElement = listRef.current.querySelector(`[data-index="${currentSegmentIndex}"]`)
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentSegmentIndex])

  // Handle word click for dictionary lookup
  const handleWordClick = async (e: React.MouseEvent, text: string) => {
    e.stopPropagation()
    
    // Get clicked word
    const selection = window.getSelection()
    let word = ''
    
    if (selection && selection.toString().trim()) {
      word = selection.toString().trim()
    } else {
      // Get word from click position
      const target = e.target as HTMLElement
      const textContent = target.textContent || ''
      const clickX = e.nativeEvent.offsetX
      
      // Simple word extraction
      const words = textContent.split(/\s+/)
      const charCount = textContent.length
      const charPosition = (clickX / target.clientWidth) * charCount
      
      let currentPos = 0
      for (const w of words) {
        if (currentPos + w.length >= charPosition) {
          word = w.replace(/[^a-zA-Z]/g, '')
          break
        }
        currentPos += w.length + 1
      }
    }
    
    if (!word) return
    
    // Get position for tooltip
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    const entry = await lookupWord(word)
    
    setSelectedWord({
      word,
      entry,
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      }
    })
  }

  // Close tooltip on outside click
  useEffect(() => {
    const handleClick = () => setSelectedWord(null)
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
        <h2 className="font-semibold text-gray-700">📚 字幕列表</h2>
        <span className="text-sm text-gray-500">{subtitles.length} 段</span>
      </div>

      {/* Subtitle list */}
      <div 
        ref={listRef}
        className="flex-1 overflow-y-auto p-3 space-y-2"
        onClick={() => setSelectedWord(null)}
      >
        {subtitles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <p>该视频暂无字幕</p>
            <p className="text-sm mt-1">请尝试其他视频</p>
          </div>
        ) : (
          subtitles.map((segment, index) => (
            <div
              key={segment.id}
              data-index={index}
              className={`
                subtitle-segment p-3 rounded-lg cursor-pointer border-2 transition-all
                ${index === currentSegmentIndex 
                  ? 'active bg-primary-50 border-primary-500 shadow-md' 
                  : 'hover:bg-gray-50 border-transparent hover:border-gray-200'}
              `}
              onClick={() => onSegmentClick(segment, index)}
              onMouseEnter={() => onSegmentHover(segment)}
              onMouseLeave={() => onSegmentHover(null)}
            >
              <div className="flex items-start gap-3">
                <span className="text-xs text-gray-400 font-mono mt-1 min-w-[45px] bg-gray-100 px-1.5 py-0.5 rounded">
                  {formatTime(segment.start)}
                </span>
                <div className="flex-1 min-w-0">
                  {/* 英文原文 */}
                  <p 
                    className="text-gray-800 leading-relaxed font-medium"
                    onClick={(e) => handleWordClick(e, segment.text)}
                  >
                    {segment.text}
                  </p>
                  {/* 中文翻译 */}
                  <p className="text-primary-600 text-sm mt-1.5 font-medium">
                    {segment.translation || '翻译中...'}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Word lookup tooltip */}
      {selectedWord && (
        <div
          className="word-tooltip"
          style={{
            left: Math.min(selectedWord.position.x, window.innerWidth - 200),
            top: Math.max(selectedWord.position.y - 150, 10),
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="font-bold text-lg text-gray-800">{selectedWord.word}</h3>
          {selectedWord.entry ? (
            <>
              {selectedWord.entry.phonetic && (
                <p className="text-sm text-gray-500">{selectedWord.entry.phonetic}</p>
              )}
              {selectedWord.entry.meanings.map((meaning, i) => (
                <div key={i} className="mt-2">
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                    {meaning.partOfSpeech}
                  </span>
                  <p className="text-sm text-gray-700 mt-1">
                    {meaning.definitions[0]?.definition}
                  </p>
                  {meaning.definitions[0]?.example && (
                    <p className="text-xs text-gray-500 italic mt-1">
                      &ldquo;{meaning.definitions[0].example}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </>
          ) : (
            <p className="text-sm text-gray-500 mt-1">未找到释义</p>
          )}
        </div>
      )}
    </div>
  )
}
