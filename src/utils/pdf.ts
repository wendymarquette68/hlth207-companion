import jsPDF from 'jspdf'
import config from '../config/course.config.json'

// semester label is passed in at call time since it varies by version

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
  isList?: boolean
  items?: string[]
}

function buildDoc(studentName: string, section: string, versionLabel = '') {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const pageW = doc.internal.pageSize.getWidth()
  const margin = 60
  const contentW = pageW - margin * 2
  let y = margin

  const checkPage = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage()
      y = margin
    }
  }

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
    checkPage(lines.length * lineH)
    doc.text(lines, margin, y)
    y += lines.length * lineH
  }

  const addDivider = () => {
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, y, pageW - margin, y)
    y += 12
  }

  const addFooter = () => {
    const footerY = doc.internal.pageSize.getHeight() - 36
    doc.setFontSize(9)
    doc.setTextColor(150, 150, 150)
    doc.setFont('helvetica', 'italic')
    doc.text(
      'These are planning notes only. Assignments are written and submitted independently in Blackboard Ultra.',
      margin,
      footerY,
      { maxWidth: contentW }
    )
  }

  // Header
  addText(config.courseTitle + (versionLabel ? ` · ${versionLabel}` : ''), 11, false, [100, 100, 100])
  y += 2
  addText(`Student: ${studentName}`, 11, false, [100, 100, 100])
  addText(`Section: ${section}`, 11, false, [100, 100, 100])
  addText(`Generated: ${new Date().toLocaleDateString()}`, 11, false, [100, 100, 100])
  y += 8
  addDivider()

  return { doc, addText, addDivider, addFooter, margin, contentW, pageW, getY: () => y, setY: (v: number) => { y = v } }
}

export function generatePDF(
  exportType: ExportType,
  studentName: string,
  section: string,
  sections: Section[],
  versionLabel = ''
): void {
  const { doc, addText, addDivider, addFooter } = buildDoc(studentName, section, versionLabel)

  addText(TITLES[exportType], 20, true, [15, 80, 150])
  addDivider()

  for (const sec of sections) {
    if (sec.isList && sec.items) {
      if (sec.items.length === 0) continue
      addText(sec.heading, 12, true)
      for (const item of sec.items) {
        addText(`  • ${item}`, 11)
      }
      addDivider()
    } else {
      if (!sec.content?.trim()) continue
      addText(sec.heading, 12, true)
      addText(sec.content, 11)
      addDivider()
    }
  }

  addFooter()

  const filename = `${TITLES[exportType].replace(/\s+/g, '_')}_${studentName.replace(/\s+/g, '_')}.pdf`
  doc.save(filename)
}

export function generateWeeklyNotesPDF(
  weekNumber: number,
  weekTitle: string,
  chapters: string,
  objectives: string[],
  projectConnectionIntro: string,
  projectConnectionPrompts: string[],
  projectConnectionNote: string,
  studentName: string,
  section: string,
  versionLabel = ''
): void {
  const { doc, addText, addDivider, addFooter } = buildDoc(studentName, section, versionLabel)

  addText(`Week ${weekNumber}: ${weekTitle}`, 20, true, [15, 80, 150])
  addText(chapters, 11, false, [100, 100, 100])
  addDivider()

  // Learning objectives
  addText('Learning Objectives', 12, true)
  for (const obj of objectives) {
    addText(`  • ${obj}`, 11)
  }
  addDivider()

  // Project connection guiding prompts
  addText('Health Advocacy Project Connection', 12, true)
  if (projectConnectionIntro) {
    addText(projectConnectionIntro, 11, false, [80, 80, 80])
  }
  if (projectConnectionPrompts.length > 0) {
    addText('Guiding questions:', 11, true)
    projectConnectionPrompts.forEach((p, i) => {
      addText(`  ${i + 1}. ${p}`, 11)
    })
  }
  addDivider()

  // Student's notes
  addText('My Project Connection Notes', 12, true)
  if (projectConnectionNote.trim()) {
    addText(projectConnectionNote, 11)
  } else {
    addText('(No notes recorded for this week.)', 11, false, [150, 150, 150])
  }
  addDivider()

  addFooter()

  const filename = `Week_${weekNumber}_Notes_${studentName.replace(/\s+/g, '_')}.pdf`
  doc.save(filename)
}
