import { useSession } from '../../context/SessionContext'
import { useNotes } from '../../hooks/useNotes'
import { NoteField } from '../../components/NoteField'
import { SaveIndicator } from '../../components/SaveIndicator'
import { generatePDF } from '../../utils/pdf'

const FIELDS = [
  { key: 'issue_overview', label: 'Issue Overview', placeholder: 'Summarize the health issue for an audience unfamiliar with it.' },
  { key: 'evidence', label: 'Evidence from Research', placeholder: 'Which findings from your articles will you highlight? Why are they compelling?' },
  { key: 'recommendation', label: 'Policy Recommendation', placeholder: 'State your specific recommendation clearly.' },
  { key: 'call_to_action', label: 'Call to Action', placeholder: 'What do you want your audience to do after hearing your presentation?' },
  { key: 'key_slides', label: 'Key Presentation Slides / Talking Points', placeholder: 'List the main slides or talking points you plan to include.' },
]

export function Presentation() {
  const { session } = useSession()
  const { notes, update, savedAt } = useNotes('presentation')

  const handleExport = () => {
    const sections = FIELDS.map(f => ({ heading: f.label, content: notes[f.key] ?? '' }))
    generatePDF('presentation', session?.studentName ?? '', session?.section ?? '', sections)
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-1">Presentation Planning Notes</h1>
      <p className="text-sm text-slate-500 mb-6">
        Organize your advocacy presentation structure. These notes help you plan — your actual
        slides and script are created independently.
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
