import { useSession } from '../../context/SessionContext'
import { useNotes } from '../../hooks/useNotes'
import { NoteField } from '../../components/NoteField'
import { SaveIndicator } from '../../components/SaveIndicator'
import { NextStepBox } from '../../components/NextStepBox'
import { generatePDF } from '../../utils/pdf'

const FIELDS = [
  { key: 'change', label: 'What policy change is needed?', placeholder: 'State your recommendation clearly and specifically.' },
  { key: 'evidence', label: 'What evidence supports this change?', placeholder: 'Cite findings from your research articles.' },
  { key: 'actor', label: 'Who should act?', placeholder: 'Name the specific decision-maker or governing body.' },
  { key: 'impact', label: 'What impact would this policy have?', placeholder: 'Describe the expected outcomes for the affected population.' },
]

export function PolicyAdvocacy() {
  const { session } = useSession()
  const { notes, update, savedAt } = useNotes('policy_advocacy')

  const handleExport = () => {
    const sections = FIELDS.map(f => ({ heading: f.label, content: notes[f.key] ?? '' }))
    generatePDF('policy_advocacy', session?.studentName ?? '', session?.section ?? '', sections)
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-1">Policy Advocacy Notes</h1>
      <p className="text-sm text-slate-500 mb-2">
        Organize your policy argument before writing your Policy Letter. These notes are planning
        tools — not the assignment itself.
      </p>
      <p className="text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-6">
        Use your Article Research Notes PDF as a reference while completing these fields. When you
        are done, export your Policy Advocacy Notes PDF and use it while writing your Policy Letter
        in Blackboard.
      </p>

      {FIELDS.map(f => (
        <NoteField
          key={f.key}
          label={f.label}
          fieldKey={f.key}
          value={notes[f.key] ?? ''}
          onChange={update}
          placeholder={f.placeholder}
        />
      ))}

      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={handleExport}
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Export PDF
        </button>
        <SaveIndicator savedAt={savedAt} />
      </div>

      <NextStepBox
        message="Once you have exported your Policy Advocacy Notes PDF, go to Presentation Planning Notes. You will organize how you will present your issue, evidence, and policy recommendation to an audience."
        label="Go to Presentation Planning Notes"
        path="/notes/presentation"
        secondaryMessage="You can also return to the Dashboard to continue this week's activity or review your progress."
        secondaryLabel="Back to Dashboard"
        secondaryPath="/dashboard"
      />
    </div>
  )
}
