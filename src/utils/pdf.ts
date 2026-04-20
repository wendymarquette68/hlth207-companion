import jsPDF from 'jspdf'
import config from '../config/course.config.json'

export type ExportType =
  | 'health_issue'
  | 'article_review'
  | 'policy_advocacy'
  | 'presentation'
  | 'reflection'

const TITLES: Record<ExportType, string> = {
  health_issue: 'Health Issue Exploration Notes',
  article_review: 'Article Research Notes',
  policy_advocacy: 'Policy Advocacy Notes',
  presentation: 'Presentation Planning Notes',
  reflection: 'App Reflection',
}

interface Section {
  heading: string
  content: string
}

export function generatePDF(
  exportType: ExportType,
  studentName: string,
  section: string,
  sections: Section[]
): void {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 60
  const contentW = pageW - margin * 2
  let y = margin

  const addText = (
    text: string,
    fontSize: number,
    isBold = false,
    color: [number, number, number] = [30, 30, 30]
  ) => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', isBold ? 'bold' : 'normal')
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(text, contentW)
    const lineH = fontSize * 1.4
    if (y + lines.length * lineH > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      y = margin
    }
    doc.text(lines, margin, y)
    y += lines.length * lineH
  }

  const addDivider = () => {
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, y, pageW - margin, y)
    y += 12
  }

  // Header block
  addText(config.courseTitle, 11, false, [100, 100, 100])
  y += 2
  addText(config.semester, 11, false, [100, 100, 100])
  y += 2
  addText(`Student: ${studentName}`, 11, false, [100, 100, 100])
  addText(`Section: ${section}`, 11, false, [100, 100, 100])
  addText(`Generated: ${new Date().toLocaleDateString()}`, 11, false, [100, 100, 100])
  y += 8
  addDivider()

  // Title
  addText(TITLES[exportType], 20, true, [15, 80, 150])
  y += 16
  addDivider()

  // Sections
  for (const sec of sections) {
    if (!sec.content.trim()) continue
    addText(sec.heading, 12, true)
    y += 4
    addText(sec.content, 11)
    y += 16
  }

  // Footer note
  y = doc.internal.pageSize.getHeight() - 36
  doc.setFontSize(9)
  doc.setTextColor(150, 150, 150)
  doc.setFont('helvetica', 'italic')
  doc.text(
    'These are planning notes only. Assignments are written and submitted independently in Blackboard Ultra.',
    margin,
    y,
    { maxWidth: contentW }
  )

  const filename = `${TITLES[exportType].replace(/\s+/g, '_')}_${studentName.replace(/\s+/g, '_')}.pdf`
  doc.save(filename)
}
