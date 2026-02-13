import { useState, useRef, useEffect } from 'react'
import { format } from 'date-fns'
import { useEntriesForDate, useTodayEntry } from '../hooks/useEntries'
import type { Entry } from '../lib/types'

const MAX_CHARS = 280

export default function Today() {
  const today = new Date()
  const { entries, refresh } = useEntriesForDate(today)
  const { entry: todayEntry, save } = useTodayEntry(today)
  const [text, setText] = useState('')
  const [saved, setSaved] = useState(false)
  const [imageData, setImageData] = useState<string | undefined>()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (todayEntry) {
      setText(todayEntry.text)
      setImageData(todayEntry.image)
      setSaved(true)
    }
  }, [todayEntry])

  const pastEntries = entries.filter((e) => e.year !== today.getFullYear())

  async function handleSave() {
    if (!text.trim()) return
    await save(text.trim(), imageData)
    setSaved(true)
    await refresh()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSave()
    }
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImageData(reader.result as string)
      setSaved(false)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="screen today-screen">
      <header className="today-header">
        <time className="today-date">{format(today, 'EEEE')}</time>
        <time className="today-date-full">{format(today, 'MMMM d, yyyy')}</time>
      </header>

      <div className="today-input-area">
        <textarea
          ref={inputRef}
          className="today-input"
          placeholder="Through line."
          value={text}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) {
              setText(e.target.value)
              setSaved(false)
            }
          }}
          onKeyDown={handleKeyDown}
          rows={2}
          maxLength={MAX_CHARS}
        />
        <div className="today-input-footer">
          <span className="char-count">
            {text.length}/{MAX_CHARS}
          </span>
          <div className="today-actions">
            <button
              className="icon-btn"
              onClick={() => fileRef.current?.click()}
              title="Add photo"
              aria-label="Add photo"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              hidden
            />
            <button
              className="save-btn"
              onClick={handleSave}
              disabled={!text.trim() || saved}
            >
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
        {imageData && (
          <div className="today-image-preview">
            <img src={imageData} alt="Today's photo" />
            <button
              className="remove-image"
              onClick={() => {
                setImageData(undefined)
                setSaved(false)
              }}
            >
              &times;
            </button>
          </div>
        )}
      </div>

      {pastEntries.length > 0 && (
        <div className="past-entries">
          <div className="past-entries-label">On this day</div>
          {pastEntries.map((entry: Entry) => (
            <PastEntry key={entry.year} entry={entry} />
          ))}
        </div>
      )}

      {pastEntries.length === 0 && saved && (
        <div className="past-entries-empty">
          <p>This is your first {format(today, 'MMMM d')}.</p>
          <p className="muted">Next year, you'll see this entry right here.</p>
        </div>
      )}
    </div>
  )
}

function PastEntry({ entry }: { entry: Entry }) {
  return (
    <div className="past-entry">
      <span className="past-entry-year">{entry.year}</span>
      <p className="past-entry-text">{entry.text}</p>
      {entry.image && (
        <img className="past-entry-image" src={entry.image} alt={`${entry.year}`} />
      )}
    </div>
  )
}
