'use client'

import { useState, useEffect, useRef } from 'react'
import { SubtitleSegment, lookupWord, DictionaryEntry, formatTime } from '@/lib/api'
import { highlightPhrases, HighlightedSegment } from '@/lib/phrases'

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
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map())
  const [selectedWord, setSelectedWord] = useState<{ word: string; entry: DictionaryEntry | null; position: { x: number; y: number } } | null>(null)
  const [highlightedCache, setHighlightedCache] = useState<Map<number, HighlightedSegment>>(new Map())
  const [showPhrases, setShowPhrases] = useState(true)
  const [clickedIndex, setClickedIndex] = useState<number | null>(null)

  // 缓存高亮结果
  useEffect(() => {
    const cache = new Map<number, HighlightedSegment>()
    subtitles.forEach((segment, index) => {
      cache.set(index, highlightPhrases(segment.text))
    })
    setHighlightedCache(cache)
  }, [subtitles])

  // Auto-scroll to current segment when playing (not clicking)
  useEffect(() => {
    if (clickedIndex !== null) {
      // User is manually interacting, don't auto-scroll
      return
    }
    
    if (listRef.current && currentSegmentIndex >= 0) {
      const activeElement = itemRefs.current.get(currentSegmentIndex)
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentSegmentIndex, clickedIndex])

  // Clear clicked state after a delay when user clicks a segment
  useEffect(() => {
    if (clickedIndex !== null) {
      const timer = setTimeout(() => {
        setClickedIndex(null)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [clickedIndex])

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
      const charPosition = clickX > 0 ? (clickX / target.clientWidth) * charCount : 0
      
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

  // 渲染带高亮的文本
  const renderHighlightedText = (index: number) => {
    const highlighted = highlightedCache.get(index)
    if (!highlighted || highlighted.segments.length === 0) {
      return <span>{subtitles[index].text}</span>
    }

    const elements: React.ReactNode[] = []
    let lastEnd = 0

    highlighted.segments.forEach((seg, segIndex) => {
      // 添加高亮前的普通文本
      if (seg.start > lastEnd) {
        elements.push(
          <span key={`text-${segIndex}`}>
            {subtitles[index].text.slice(lastEnd, seg.start)}
          </span>
        )
      }
      
      // 添加高亮的短语
      elements.push(
        <span
          key={`highlight-${segIndex}`}
          className="phrase-highlight"
          title={`${seg.phrase.type === 'phrasal' ? '短语动词' : '习语'}: ${seg.phrase.meaning}`}
        >
          {subtitles[index].text.slice(seg.start, seg.end)}
        </span>
      )
      
      lastEnd = seg.end
    })

    // 添加最后一段普通文本
    if (lastEnd < subtitles[index].text.length) {
      elements.push(
        <span key="text-last">
          {subtitles[index].text.slice(lastEnd)}
        </span>
      )
    }

    return <>{elements}</>
  }

  // Handle segment click
  const handleSegmentClick = (segment: SubtitleSegment, index: number) => {
    setClickedIndex(index)
    onSegmentClick(segment, index)
    
    // Scroll the clicked item into view
    setTimeout(() => {
      const element = itemRefs.current.get(index)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  return (
    <div className="flex flex-col h-full bg-dark-card rounded-xl shadow-lg overflow-hidden border border-dark-border">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-dark-lighter border-b border-dark-border">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-dark-text">📚 字幕列表</h2>
          {showPhrases && (
            <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full">
              短语标注
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPhrases(!showPhrases)}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              showPhrases 
                ? 'bg-orange-500/20 text-orange-400' 
                : 'bg-dark-border text-dark-textSecondary hover:text-dark-text'
            }`}
            title={showPhrases ? '关闭短语标注' : '开启短语标注'}
          >
            {showPhrases ? '✓ 标注' : '○ 标注'}
          </button>
          <span className="text-sm text-dark-textSecondary">{subtitles.length} 段</span>
        </div>
      </div>

      {/* Subtitle list */}
      <div 
        ref={listRef}
        className="flex-1 overflow-y-auto p-3 space-y-2"
        onClick={() => setSelectedWord(null)}
      >
        {subtitles.length === 0 ? (
          <div className="text-center py-8 text-dark-textSecondary">
            <svg className="w-12 h-12 mx-auto mb-3 text-dark-textSecondary/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <p>该视频暂无字幕</p>
            <p className="text-sm mt-1">请尝试其他视频</p>
          </div>
        ) : (
          subtitles.map((segment, index) => {
            // Determine if this segment is selected (current playing OR clicked)
            const isCurrent = index === currentSegmentIndex
            const isClicked = index === clickedIndex
            const isSelected = isCurrent || isClicked
            
            return (
              <div
                key={segment.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(index, el)
                }}
                data-index={index}
                className={`
                  subtitle-segment p-3 rounded-lg cursor-pointer border-2 transition-all duration-200
                  ${isSelected 
                    ? 'bg-orange-500/20 border-orange-500 shadow-lg shadow-orange-500/20 transform scale-[1.02]' 
                    : 'bg-dark-lighter/50 border-dark-border hover:border-dark-borderHover hover:bg-dark-lighter'}
                `}
                onClick={() => handleSegmentClick(segment, index)}
                onMouseEnter={() => onSegmentHover(segment)}
                onMouseLeave={() => onSegmentHover(null)}
              >
                <div className="flex items-start gap-3">
                  <span className={`text-xs font-mono mt-1 min-w-[45px] px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-orange-500/30 text-orange-400' : 'bg-dark-lighter text-dark-textSecondary'
                  }`}>
                    {formatTime(segment.start)}
                  </span>
                  <div className="flex-1 min-w-0">
                    {/* 英文原文 - 带高亮 */}
                    <p 
                      className={`leading-relaxed font-medium ${isSelected ? 'text-white' : 'text-dark-text'}`}
                      onClick={(e) => handleWordClick(e, segment.text)}
                    >
                      {renderHighlightedText(index)}
                    </p>
                    {/* 中文翻译 - 英中对照显示 */}
                    <p className={`text-sm mt-1.5 font-normal ${isSelected ? 'text-orange-300' : 'text-orange-400'}`}>
                      {segment.translation || '翻译中...'}
                    </p>
                  </div>
                  {/* 选中指示器 */}
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
            )
          })
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
          <h3 className="font-bold text-lg text-dark-text">{selectedWord.word}</h3>
          {selectedWord.entry ? (
            <>
              {selectedWord.entry.phonetic && (
                <p className="text-sm text-dark-textSecondary">{selectedWord.entry.phonetic}</p>
              )}
              {selectedWord.entry.meanings.map((meaning, i) => (
                <div key={i} className="mt-2">
                  <span className="text-xs font-medium text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded">
                    {meaning.partOfSpeech}
                  </span>
                  <p className="text-sm text-dark-text mt-1">
                    {meaning.definitions[0]?.definition}
                  </p>
                  {meaning.definitions[0]?.example && (
                    <p className="text-xs text-dark-textSecondary italic mt-1">
                      &ldquo;{meaning.definitions[0].example}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </>
          ) : (
            <p className="text-sm text-dark-textSecondary mt-1">未找到释义</p>
          )}
        </div>
      )}
    </div>
  )
}
