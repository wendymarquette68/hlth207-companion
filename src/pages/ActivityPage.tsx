import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useActivityResponse } from '../hooks/useActivityResponse'
import { useProjectConnection } from '../hooks/useProjectConnection'
import { useSession } from '../context/SessionContext'
import { isBlocked } from '../utils/guardrail'
import { GuardrailAlert } from '../components/GuardrailAlert'
import { SaveIndicator } from '../components/SaveIndicator'
import { generateWeeklyNotesPDF } from '../utils/pdf'
import config from '../config/course.config.json'

export function ActivityPage() {
  const { weekNumber } = useParams<{ weekNumber: string }>()
  const num = parseInt(weekNumber ?? '1', 10)
  const week = config.weeks.find(w => w.weekNumber === num)
  const { session } = useSession()
  const { response, submit } = useActivityResponse(num)
  const { note: projectNote, setNote: setProjectNote, savedAt: projectSavedAt } = useProjectConnection(num)
  const [draft, setDraft] = useState(response?.text ?? '')
  const [blocked, setBlocked] = useState(false)
  const [submitted, setSubmitted] = useState(!!response)

  if (!week) {
    return (
      <div>
        <p className="text-slate-600">Activity not found.</p>
        <Link to="/dashboard" className="text-blue-700 text-sm hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (isBlocked(text)) {
      setBlocked(true)
    } else {
      setBlocked(false)
      setDraft(text)
    }
  }

  const handleSubmit = () => {
    if (!draft.trim()) return
    submit(draft)
    setSubmitted(true)
  }

  const handleExportWeekNotes = () => {
    generateWeeklyNotesPDF(
      week.weekNumber,
      week.title,
      week.chapters,
      week.objectives ?? [],
      projectNote,
      session?.studentName ?? '',
      session?.section ?? ''
    )
  }

  const activityTypeBadge: Record<string, string> = {
    scenario: 'Scenario Analysis',
    concept: 'Concept Application',
    policy: 'Policy Thinking',
    reflective: 'Reflection',
    system_mapping: 'System Mapping',
  }

  return (
    <div>
      <Link
        to="/dashboard"
        className="text-sm text-blue-700 hover:underline focus:outline-none focus:underline mb-6 inline-block"
      >
        ← Back to Dashboard
      </Link>

      <div className="mb-2 flex items-center gap-2">
        <span className="text-xs font-semibold bg-blue-100 text-blue-800 rounded-full px-2.5 py-0.5">
          Week {week.weekNumber}
        </span>
        <span className="text-xs font-semibold bg-slate-100 text-slate-600 rounded-full px-2.5 py-0.5">
          {activityTypeBadge[week.activity.type] ?? week.activity.type}
        </span>
      </div>

      <h1 className="text-xl font-bold text-slate-800 mb-1">{week.title}</h1>
      <p className="text-xs text-slate-500 mb-6">{week.chapters}</p>

      {/* Learning Objectives */}
      {week.objectives && week.objectives.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Learning Objectives
          </h2>
          <ul className="space-y-1">
            {week.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-blue-500 mt-0.5 shrink-0">▸</span>
                {obj}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Activity */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
        <h2 className="text-sm font-semibold text-blue-900 mb-2">
          {week.activity.title}
        </h2>
        <p className="text-sm text-slate-700 mb-4 whitespace-pre-line leading-relaxed">
          {week.activity.prompt}
        </p>
        <ol className="list-decimal list-inside space-y-1">
          {week.activity.questions.map((q, i) => (
            <li key={i} className="text-sm text-slate-700">
              {q}
            </li>
          ))}
        </ol>
      </div>

      {/* Activity Response */}
      {submitted ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-700">Your Response</h2>
            <span className="text-xs text-green-600 font-medium">✓ Submitted</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 whitespace-pre-wrap">
            {response?.text}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Submitted{' '}
            {response?.submittedAt ? new Date(response.submittedAt).toLocaleString() : ''}
          </p>
          <p className="text-xs text-slate-400 mt-1 mb-8">
            Activity responses stay in the app and are not exported.
          </p>

          {/* Project Connection */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6">
            <h2 className="text-sm font-semibold text-green-900 mb-1">
              Health Advocacy Project Connection
            </h2>
            <p className="text-xs text-green-700 mb-3 leading-relaxed">
              Is there anything in this week's content that connects to your Health Advocacy Project? If so, what? Think about the issue you are exploring, the population affected, or the policy change you are considering.
            </p>
            <textarea
              id={`project-connection-${num}`}
              rows={5}
              value={projectNote}
              onChange={e => setProjectNote(e.target.value)}
              placeholder="Describe any connections between this week's content and your project..."
              className="w-full rounded-lg border border-green-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-green-500 focus:ring-2 focus:ring-green-100 focus:outline-none resize-y"
            />
            <div className="flex items-center justify-between mt-3">
              <SaveIndicator savedAt={projectSavedAt} />
              <button
                onClick={handleExportWeekNotes}
                className="bg-green-700 hover:bg-green-800 text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
              >
                Export Week {week.weekNumber} Notes PDF
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              The PDF includes this week's learning objectives and your project connection note.
            </p>
          </div>

          {/* Next Step */}
          {week.nextStep && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
                What to do next
              </p>
              <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                {week.nextStep.message}
              </p>
              <Link
                to={week.nextStep.path}
                className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                {week.nextStep.label} →
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div>
          <label
            htmlFor="activity-response"
            className="block text-sm font-semibold text-slate-700 mb-2"
          >
            Your Response
          </label>
          <textarea
            id="activity-response"
            rows={8}
            value={draft}
            onChange={handleChange}
            placeholder="Type your response here..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none resize-y"
          />
          {blocked && (
            <div className="mt-2">
              <GuardrailAlert />
            </div>
          )}
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Responses are saved locally and are not exported as assignments.
          </p>
          <button
            onClick={handleSubmit}
            disabled={!draft.trim() || blocked}
            className="bg-blue-700 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Submit Response
          </button>
        </div>
      )}
    </div>
  )
}
