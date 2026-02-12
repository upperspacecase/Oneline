import { jsPDF } from 'jspdf'
import { format, parse } from 'date-fns'
import type { Entry } from './types'
import { getAllEntries } from './db'

export async function exportToPDF(): Promise<void> {
  const entries = await getAllEntries()
  if (entries.length === 0) return

  entries.sort((a, b) => {
    if (a.dateKey !== b.dateKey) return a.dateKey.localeCompare(b.dateKey)
    return a.year - b.year
  })

  const doc = new jsPDF({ unit: 'mm', format: 'a5' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  const usable = pageWidth - margin * 2
  let y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('One Line', pageWidth / 2, y, { align: 'center' })
  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text('One line. Every day. For five years.', pageWidth / 2, y, { align: 'center' })
  y += 12

  // Group by dateKey
  const grouped = new Map<string, Entry[]>()
  for (const entry of entries) {
    const list = grouped.get(entry.dateKey) || []
    list.push(entry)
    grouped.set(entry.dateKey, list)
  }

  for (const [dateKey, dateEntries] of grouped) {
    if (y > doc.internal.pageSize.getHeight() - 20) {
      doc.addPage()
      y = margin
    }

    const parsed = parse(dateKey, 'MM-dd', new Date())
    const dateLabel = format(parsed, 'MMMM d')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text(dateLabel, margin, y)
    y += 5

    for (const entry of dateEntries) {
      if (y > doc.internal.pageSize.getHeight() - 15) {
        doc.addPage()
        y = margin
      }
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.text(`${entry.year}`, margin, y)
      const lines = doc.splitTextToSize(entry.text, usable - 12)
      doc.text(lines, margin + 12, y)
      y += lines.length * 3.5 + 2
    }

    y += 3
  }

  doc.save('oneline-journal.pdf')
}
