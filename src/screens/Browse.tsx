import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format, parse, addDays, subDays } from 'date-fns'
import { getEntriesForDate } from '../lib/db'
import { parseDateKey } from '../lib/types'
import type { Entry } from '../lib/types'

export default function Browse() {
  const { dateKey: paramDateKey } = useParams<{ dateKey: string }>()
  const navigate = useNavigate()
  const today = new Date()

  const dateKey = paramDateKey || parseDateKey(today)
  const displayDate = parse(dateKey, 'MM-dd', today)

  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [sharing, setSharing] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    getEntriesForDate(dateKey).then((result) => {
      setEntries(result)
      setLoading(false)
    })
  }, [dateKey])

  function goToDate(date: Date) {
    navigate(`/app/browse/${parseDateKey(date)}`)
  }

  const handleShare = useCallback(async () => {
    if (!cardRef.current || entries.length === 0) return
    setSharing(true)
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const scale = 2
      const width = 400
      const padding = 40
      const lineHeight = 28
      const yearHeight = 20
      const entryGap = 32

      // Calculate height
      let totalHeight = padding + 48 // top padding + date header
      for (const entry of entries) {
        totalHeight += yearHeight + 8
        // Estimate text wrapping
        const maxCharsPerLine = 32
        const lines = Math.ceil(entry.text.length / maxCharsPerLine)
        totalHeight += lines * lineHeight
        totalHeight += entryGap
      }
      totalHeight += padding

      canvas.width = width * scale
      canvas.height = totalHeight * scale
      ctx.scale(scale, scale)

      // Background
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, width, totalHeight)

      // Date header
      ctx.fillStyle = '#e8e4df'
      ctx.font = '500 22px "EB Garamond", Georgia, serif'
      ctx.fillText(format(displayDate, 'MMMM d'), padding, padding + 28)

      let y = padding + 60

      // Entries
      for (const entry of entries) {
        // Year
        ctx.fillStyle = '#3d3a37'
        ctx.font = '500 12px "Inter", sans-serif'
        ctx.fillText(String(entry.year), padding + 16, y + 10)
        y += yearHeight + 4

        // Text with wrapping
        ctx.fillStyle = '#e8e4df'
        ctx.font = '400 17px "EB Garamond", Georgia, serif'
        const words = entry.text.split(' ')
        let line = ''
        const maxWidth = width - padding * 2 - 16
        const textStartY = y
        for (const word of words) {
          const testLine = line ? `${line} ${word}` : word
          if (ctx.measureText(testLine).width > maxWidth) {
            ctx.fillText(line, padding + 16, y)
            y += lineHeight
            line = word
          } else {
            line = testLine
          }
        }
        if (line) {
          ctx.fillText(line, padding + 16, y)
          y += lineHeight
        }

        // Draw left border line for full entry
        ctx.fillStyle = '#1f1d1b'
        ctx.fillRect(padding, textStartY - yearHeight - 4, 2, y - textStartY + yearHeight + 4)

        y += entryGap - lineHeight
      }

      // Branding
      ctx.fillStyle = '#3d3a37'
      ctx.font = 'italic 13px "EB Garamond", Georgia, serif'
      ctx.fillText('Through Line', padding, totalHeight - padding + 8)

      canvas.toBlob(async (blob) => {
        if (!blob) return
        const file = new File([blob], `throughline-${dateKey}.png`, { type: 'image/png' })

        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: `Through Line \u2014 ${format(displayDate, 'MMMM d')}`,
          })
        } else {
          // Fallback: download
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `throughline-${dateKey}.png`
          a.click()
          URL.revokeObjectURL(url)
        }
      }, 'image/png')
    } finally {
      setSharing(false)
    }
  }, [entries, dateKey, displayDate])

  return (
    <div className="screen browse-screen">
      <header className="browse-header">
        <button className="nav-arrow" onClick={() => goToDate(subDays(displayDate, 1))}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="browse-title">
          <span className="browse-date">{format(displayDate, 'MMMM d')}</span>
          <span className="browse-subtitle">Through Line</span>
        </div>
        <button className="nav-arrow" onClick={() => goToDate(addDays(displayDate, 1))}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </header>

      <div className="browse-entries" ref={cardRef}>
        {loading && <div className="browse-loading">Loading...</div>}
        {!loading && entries.length === 0 && (
          <div className="browse-empty">
            <p>No entries for {format(displayDate, 'MMMM d')}.</p>
          </div>
        )}
        {!loading &&
          entries.map((entry) => (
            <div key={entry.year} className="browse-entry">
              <div className="browse-entry-year">{entry.year}</div>
              <p className="browse-entry-text">{entry.text}</p>
              {entry.image && (
                <img className="browse-entry-image" src={entry.image} alt={`${entry.year}`} />
              )}
            </div>
          ))}
      </div>

      {!loading && entries.length > 0 && (
        <button className="share-btn" onClick={handleShare} disabled={sharing}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          {sharing ? 'Sharing...' : 'Share this day'}
        </button>
      )}
    </div>
  )
}
