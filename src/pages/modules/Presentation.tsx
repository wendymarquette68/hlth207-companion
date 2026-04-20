import { useSession } from '../../context/SessionContext'
import { useCourseVersion } from '../../hooks/useCourseVersion'
import { useNotes } from '../../hooks/useNotes'
import { NoteField } from '../../components/NoteField'
import { SaveIndicator } from '../../components/SaveIndicator'
import { NextStepBox } from '../../components/NextStepBox'
import { generatePDF } from '../../utils/pdf'
import { save } from '../../utils/storage'

const FIELDS = [
  { key: 'issue_overview', label: 'Issue Overview', placeholder: 'Summarize the health issue for an audience unfamiliar with it.' },
  { key: 'evidence', label: 'Evidence from Research', placeholder: 'Which findings from your articles will you highlight? Why are they compelling?' },
  { key: 'recommendation', label: 'Policy Recommendation', placeholder: 'State your specific recommendation clearly.' },
  { key: 'call_to_action', label: 'Call to Action', placeholder: 'What do you want your audience to do after hearing your presentation?' },
  { key: 'key_slides', label: 'Key Presentation Slides / Talking Points', placeholder: 'List the main slides or talking points you plan to include.' },
]

export function Presentation() {
  const { session } = useSession()
  const version = useCourseVersion()
  const { notes, update, savedAt } = useNotes('presentation')

  const handleExport = () => {
    const sections = FIELDS.map(f => ({ heading: f.label, content: notes[f.key] ?? '' }))
    generatePDF('presentation', session?.studentName ?? '', session?.section ?? '', sections, version.label)
    save('presentation_exported', true)
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-1">Presentation Planning Notes</h1>
      <p className="text-sm text-slate-500 mb-2">
        Organize your advocacy presentation structure. These notes help you plan — your actual
        slides and script are created independently in your presentation tool.
      </p>
      <p className="text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-6">
        Use your Policy Advocacy Notes PDF as a reference while completing these fields. When you
        are done, export your Presentation Planning PDF. Then complete the App Reflection — it is
        your final submission for this course.
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
        message="You have completed all four planning note modules. Your final step in the app is the App Reflection. Open the Reflection module, respond to the five prompts, export your Reflection PDF, and submit it in Blackboard Ultra."
        label="Go to App Reflection"
        path="/reflection"
        secondaryMessage="You can also return to the Dashboard to review your weekly activities or revisit any planning module."
        secondaryLabel="Back to Dashboard"
        secondaryPath="/dashboard"
      />
    </div>
  )
}
