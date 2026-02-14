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
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const usable = pageWidth - margin * 2
  let y = margin

  // Title page
  doc.setFont('times', 'normal')
  doc.setFontSize(36)
  doc.text('Through Line', pageWidth / 2, pageHeight / 2 - 20, { align: 'center' })
  doc.setFontSize(12)
  doc.setTextColor(120, 120, 120)
  doc.text('Remember everything. Write almost nothing.', pageWidth / 2, pageHeight / 2, { align: 'center' })
  doc.setTextColor(180, 180, 180)
  doc.setFontSize(10)
  const dateRange = getDateRange(entries)
  doc.text(dateRange, pageWidth / 2, pageHeight / 2 + 16, { align: 'center' })

  // Start entries on new page
  doc.addPage()
  y = margin
  doc.setTextColor(0, 0, 0)

  // Group by dateKey
  const grouped = new Map<string, Entry[]>()
  for (const entry of entries) {
    const list = grouped.get(entry.dateKey) || []
    list.push(entry)
    grouped.set(entry.dateKey, list)
  }

  for (const [dateKey, dateEntries] of grouped) {
    // Check if we need a new page for the date header + at least one entry
    if (y > pageHeight - 40) {
      doc.addPage()
      y = margin
    }

    const parsed = parse(dateKey, 'MM-dd', new Date())
    const dateLabel = format(parsed, 'MMMM d')

    // Date header — serif, larger
    doc.setFont('times', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(60, 60, 60)
    doc.text(dateLabel, margin, y)
    y += 2

    // Thin rule under date
    doc.setDrawColor(200, 200, 200)
    doc.setLineWidth(0.3)
    doc.line(margin, y, margin + usable, y)
    y += 6

    for (const entry of dateEntries) {
      if (y > pageHeight - 25) {
        doc.addPage()
        y = margin
      }

      // Year label
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(`${entry.year}`, margin, y)
      y += 4

      // Entry text — serif body
      doc.setFont('times', 'normal')
      doc.setFontSize(11)
      doc.setTextColor(30, 30, 30)
      const lines = doc.splitTextToSize(entry.text, usable)
      doc.text(lines, margin, y)
      y += lines.length * 4.5

      // Inline photo if present
      if (entry.image) {
        try {
          if (y > pageHeight - 55) {
            doc.addPage()
            y = margin
          }
          const imgWidth = Math.min(usable, 80)
          const imgHeight = imgWidth * 0.6
          doc.addImage(entry.image, 'JPEG', margin, y, imgWidth, imgHeight)
          y += imgHeight + 4
        } catch {
          // Skip if image can't be embedded
        }
      }

      y += 4
    }

    y += 6
  }

  // Footer on last page
  doc.setFont('times', 'italic')
  doc.setFontSize(9)
  doc.setTextColor(160, 160, 160)
  doc.text('Through Line. Every day. For the rest of your life.', pageWidth / 2, pageHeight - 15, { align: 'center' })

  doc.save('throughline-journal.pdf')
}

function getDateRange(entries: Entry[]): string {
  if (entries.length === 0) return ''
  const years = entries.map((e) => e.year)
  const minYear = Math.min(...years)
  const maxYear = Math.max(...years)
  if (minYear === maxYear) return String(minYear)
  return `${minYear} \u2013 ${maxYear}`
}
