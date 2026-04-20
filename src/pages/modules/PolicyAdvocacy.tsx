import { useSession } from '../../context/SessionContext'
import { useNotes } from '../../hooks/useNotes'
import { NoteField } from '../../components/NoteField'
import { SaveIndicator } from '../../components/SaveIndicator'
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
      <p className="text-sm text-slate-500 mb-6">
        Organize your policy argument before writing your advocacy letter. These notes are planning
        tools — not the assignment itself.
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
    </div>
  )
}
