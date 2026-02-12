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

export async function getSetting<T>(key: string): Promise<T | undefined> {
  const db = await getDB()
  return db.get('settings', key) as Promise<T | undefined>
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  const db = await getDB()
  await db.put('settings', value, key)
}
