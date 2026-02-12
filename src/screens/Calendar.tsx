import { useState, useEffect } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  addMonths,
  subMonths,
  isSameDay,
  isToday,
} from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { getEntriesForMonth } from '../lib/db'
import { parseDateKey } from '../lib/types'

export default function Calendar() {
  const navigate = useNavigate()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [filledDays, setFilledDays] = useState<Set<string>>(new Set())
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth() + 1

  useEffect(() => {
    getEntriesForMonth(year, month).then((entries) => {
      setFilledDays(new Set(entries.map((e) => e.dateKey)))
    })
  }, [year, month])

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
  const startPad = getDay(monthStart)

  // Count entries this month and total days
  const totalDays = days.length
  const filledCount = filledDays.size
  const daysElapsed = isToday(currentMonth) || currentMonth < new Date()
    ? Math.min(new Date().getDate(), totalDays)
    : 0

  function handleDayClick(day: Date) {
    const dateKey = parseDateKey(day)
    navigate(`/browse/${dateKey}`)
  }

  return (
    <div className="screen calendar-screen">
      <header className="calendar-header">
        <button className="nav-arrow" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="calendar-title">
          <span className="calendar-month">{format(currentMonth, 'MMMM yyyy')}</span>
          {daysElapsed > 0 && (
            <span className="calendar-stat">
              {filledCount}/{daysElapsed} days
            </span>
          )}
        </div>
        <button className="nav-arrow" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </header>

      <div className="calendar-weekdays">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} className="calendar-weekday">{d}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {Array.from({ length: startPad }).map((_, i) => (
          <div key={`pad-${i}`} className="calendar-day empty" />
        ))}
        {days.map((day) => {
          const dateKey = parseDateKey(day)
          const filled = filledDays.has(dateKey)
          const today = isSameDay(day, new Date())
          return (
            <button
              key={dateKey}
              className={[
                'calendar-day',
                filled && 'filled',
                today && 'today',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleDayClick(day)}
            >
              <span className="calendar-day-num">{format(day, 'd')}</span>
              {filled && <span className="calendar-dot" />}
            </button>
          )
        })}
      </div>

      {filledCount > 0 && (
        <div className="calendar-streak-bar">
          <div
            className="calendar-streak-fill"
            style={{ width: `${daysElapsed > 0 ? (filledCount / daysElapsed) * 100 : 0}%` }}
          />
        </div>
      )}
    </div>
  )
}
