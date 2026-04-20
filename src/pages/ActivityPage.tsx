import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useActivityResponse } from '../hooks/useActivityResponse'
import { isBlocked } from '../utils/guardrail'
import { GuardrailAlert } from '../components/GuardrailAlert'
import config from '../config/course.config.json'

export function ActivityPage() {
  const { weekNumber } = useParams<{ weekNumber: string }>()
  const num = parseInt(weekNumber ?? '1', 10)
  const week = config.weeks.find(w => w.weekNumber === num)
  const { response, submit } = useActivityResponse(num)
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
            {response?.submittedAt
              ? new Date(response.submittedAt).toLocaleString()
              : ''}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Activity responses stay in the app and are not exported.
          </p>
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
