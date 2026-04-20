import { useSession } from '../../context/SessionContext'
import { useCourseVersion } from '../../hooks/useCourseVersion'
import { useNotes } from '../../hooks/useNotes'
import { NoteField } from '../../components/NoteField'
import { SaveIndicator } from '../../components/SaveIndicator'
import { NextStepBox } from '../../components/NextStepBox'
import { generatePDF } from '../../utils/pdf'

const FIELDS = [
  { key: 'issue', label: 'What health issue are you exploring?', placeholder: 'Describe the health policy issue.' },
  { key: 'population', label: 'Which population is affected?', placeholder: 'Be specific about who is impacted and how.' },
  { key: 'importance', label: 'Why is this issue important?', placeholder: 'What are the consequences of inaction?' },
  { key: 'policy_level', label: 'What level of policy is involved?', placeholder: 'Local, state, federal, or multiple levels?' },
]

export function HealthIssue() {
  const { session } = useSession()
  const version = useCourseVersion()
  const { notes, update, savedAt } = useNotes('health_issue')

  const handleExport = () => {
    const sections = FIELDS.map(f => ({ heading: f.label, content: notes[f.key] ?? '' }))
    generatePDF('health_issue', session?.studentName ?? '', session?.section ?? '', sections, version.label)
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-1">Health Issue Exploration</h1>
      <p className="text-sm text-slate-500 mb-2">
        Identify and describe the health policy issue for your project. These notes will help you
        write your assignment — they are not the assignment itself.
      </p>
      <p className="text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-6">
        Complete all four fields below. When you are done, export your notes as a PDF and use it
        as a reference while writing your Health Issue assignment in Blackboard.
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
        message="Once you have exported your Health Issue Exploration PDF, go to Article Research Notes. You will organize notes from three scholarly articles that support your health issue and policy argument. Have your articles ready before you begin."
        label="Go to Article Research Notes"
        path="/notes/article-review"
        secondaryMessage="You can also return to the Dashboard to continue this week's activity or check your overall progress."
        secondaryLabel="Back to Dashboard"
        secondaryPath="/dashboard"
      />
    </div>
  )
}
