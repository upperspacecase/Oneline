export interface Entry {
  /** Format: "MM-DD" e.g. "01-15" */
  dateKey: string
  /** The year this entry belongs to */
  year: number
  /** The journal text, max 280 chars */
  text: string
  /** Optional base64 image data */
  image?: string
  /** Timestamp when created/updated */
  updatedAt: number
}

/** Composite key for IndexedDB: "MM-DD:YYYY" */
export type EntryId = string

export function makeEntryId(dateKey: string, year: number): EntryId {
  return `${dateKey}:${year}`
}

export function parseDateKey(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${m}-${d}`
}

export interface AppSettings {
  locked: boolean
  passcode?: string
}
