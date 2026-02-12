import { useState, useEffect } from 'react'
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

  useEffect(() => {
    setLoading(true)
    getEntriesForDate(dateKey).then((result) => {
      setEntries(result)
      setLoading(false)
    })
  }, [dateKey])

  function goToDate(date: Date) {
    navigate(`/browse/${parseDateKey(date)}`)
  }

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
        </div>
        <button className="nav-arrow" onClick={() => goToDate(addDays(displayDate, 1))}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </header>

      <div className="browse-entries">
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
    </div>
  )
}
