import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Entry, EntryId } from './types'
import { makeEntryId } from './types'

interface OneLineDB extends DBSchema {
  entries: {
    key: EntryId
    value: Entry
    indexes: {
      'by-dateKey': string
      'by-year': number
    }
  }
  settings: {
    key: string
    value: unknown
  }
}

let dbPromise: Promise<IDBPDatabase<OneLineDB>> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<OneLineDB>('oneline-journal', 1, {
      upgrade(db) {
        const entryStore = db.createObjectStore('entries', { keyPath: undefined })
        entryStore.createIndex('by-dateKey', 'dateKey')
        entryStore.createIndex('by-year', 'year')
        db.createObjectStore('settings')
      },
    })
  }
  return dbPromise
}

export async function getEntry(dateKey: string, year: number): Promise<Entry | undefined> {
  const db = await getDB()
  return db.get('entries', makeEntryId(dateKey, year))
}

export async function getEntriesForDate(dateKey: string): Promise<Entry[]> {
  const db = await getDB()
  const entries = await db.getAllFromIndex('entries', 'by-dateKey', dateKey)
  return entries.sort((a, b) => a.year - b.year)
}

export async function saveEntry(entry: Entry): Promise<void> {
  const db = await getDB()
  await db.put('entries', entry, makeEntryId(entry.dateKey, entry.year))
}

export async function deleteEntry(dateKey: string, year: number): Promise<void> {
  const db = await getDB()
  await db.delete('entries', makeEntryId(dateKey, year))
}

export async function getAllEntries(): Promise<Entry[]> {
  const db = await getDB()
  return db.getAll('entries')
}

export async function getEntriesForYear(year: number): Promise<Entry[]> {
  const db = await getDB()
  return db.getAllFromIndex('entries', 'by-year', year)
}

export async function getEntriesForMonth(year: number, month: number): Promise<Entry[]> {
  const db = await getDB()
  const allForYear = await db.getAllFromIndex('entries', 'by-year', year)
  const monthStr = String(month).padStart(2, '0')
  return allForYear.filter((e) => e.dateKey.startsWith(monthStr + '-'))
}

export async function getEarliestEntry(): Promise<Entry | undefined> {
  const db = await getDB()
  const all = await db.getAll('entries')
  if (all.length === 0) return undefined
  return all.reduce((earliest, e) =>
    e.updatedAt < earliest.updatedAt ? e : earliest
  )
}

export async function getStreakStats(): Promise<{ current: number; longest: number }> {
  const db = await getDB()
  const all = await db.getAll('entries')
  if (all.length === 0) return { current: 0, longest: 0 }

  // Get unique date strings (YYYY-MM-DD) from entries
  const dateSet = new Set<string>()
  for (const entry of all) {
    const [mm, dd] = entry.dateKey.split('-')
    dateSet.add(`${entry.year}-${mm}-${dd}`)
  }

  const dates = Array.from(dateSet).sort().reverse()
  if (dates.length === 0) return { current: 0, longest: 0 }

  // Calculate longest streak from all sorted dates
  const allSorted = Array.from(dateSet).sort()
  let longest = 1
  let run = 1
  for (let i = 1; i < allSorted.length; i++) {
    const prev = new Date(allSorted[i - 1])
    const curr = new Date(allSorted[i])
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    if (Math.round(diff) === 1) {
      run++
      if (run > longest) longest = run
    } else {
      run = 1
    }
  }

  // Calculate current streak (counting back from today)
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  let current = 0
  const checkDate = new Date(today)
  // Allow starting from today or yesterday
  if (!dateSet.has(todayStr)) {
    checkDate.setDate(checkDate.getDate() - 1)
  }

  while (true) {
    const ds = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`
    if (dateSet.has(ds)) {
      current++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      break
    }
  }

  return { current, longest }
}

export async function getSetting<T>(key: string): Promise<T | undefined> {
  const db = await getDB()
  return db.get('settings', key) as Promise<T | undefined>
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  const db = await getDB()
  await db.put('settings', value, key)
}
