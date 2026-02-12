import { useState, useEffect, useCallback } from 'react'
import type { Entry } from '../lib/types'
import { parseDateKey } from '../lib/types'
import { getEntriesForDate, saveEntry, getEntry } from '../lib/db'

export function useEntriesForDate(date: Date) {
  const dateKey = parseDateKey(date)
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    const result = await getEntriesForDate(dateKey)
    setEntries(result)
    setLoading(false)
  }, [dateKey])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { entries, loading, refresh }
}

export function useTodayEntry(date: Date) {
  const dateKey = parseDateKey(date)
  const year = date.getFullYear()
  const [entry, setEntry] = useState<Entry | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEntry(dateKey, year).then((e) => {
      setEntry(e)
      setLoading(false)
    })
  }, [dateKey, year])

  const save = useCallback(
    async (text: string, image?: string) => {
      const newEntry: Entry = {
        dateKey,
        year,
        text,
        image,
        updatedAt: Date.now(),
      }
      await saveEntry(newEntry)
      setEntry(newEntry)
      return newEntry
    },
    [dateKey, year]
  )

  return { entry, loading, save }
}
