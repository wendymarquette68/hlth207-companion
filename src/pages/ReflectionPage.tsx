import { useState, useEffect } from 'react'
import { useSession } from '../context/SessionContext'
import { load, save } from '../utils/storage'
import { generatePDF } from '../utils/pdf'
import { SaveIndicator } from '../components/SaveIndicator'
import config from '../config/course.config.json'

function getCurrentWeek(): number {
  return config.weeks.length
}

export function ReflectionPage() {
  const { session } = useSession()
  const isUnlocked = getCurrentWeek() >= config.reflectionUnlockWeek
  const storageKey = 'reflection'

  const [responses, setResponses] = useState<string[]>(() => {
    const saved = load<string[]>(storageKey)
    return saved ?? config.reflectionPrompts.map(() => '')
  })
  const [savedAt, setSavedAt] = useState<Date | null>(null)

  useEffect(() => {
    if (!isUnlocked) return
    const timer = setTimeout(() => {
      save(storageKey, responses)
      setSavedAt(new Date())
    }, 1500)
    return () => clearTimeout(timer)
  }, [responses, isUnlocked])

  const handleChange = (index: number, value: string) => {
    setResponses(prev => {
      const next = [...prev]
      next[index] = value
      return next
    })
  }

  const handleExport = () => {
    const sections = config.reflectionPrompts.map((prompt, i) => ({
      heading: prompt,
      content: responses[i] ?? '',
    }))
    generatePDF('reflection', session?.studentName ?? '', session?.section ?? '', sections)
  }

  if (!isUnlocked) {
    return (
      <div>
        <h1 className="text-xl font-bold text-slate-800 mb-2">App Reflection</h1>
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-6 text-center">
          <p className="text-slate-500 text-sm mb-1">🔒 This module unlocks in Week {config.reflectionUnlockWeek}.</p>
          <p className="text-slate-400 text-xs">
            Complete your weekly activities and planning notes until then.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-800 mb-1">App Reflection</h1>
      <p className="text-sm text-slate-500 mb-6">
        Reflect on your experience using the HLTH 207 Companion App this semester. Export your
        completed reflection as a PDF and submit it in Blackboard.
      </p>

      {config.reflectionPrompts.map((prompt, i) => (
        <div key={i} className="mb-5">
          <label
            htmlFor={`reflection-${i}`}
            className="block text-sm font-semibold text-slate-700 mb-1"
          >
            {i + 1}. {prompt}
          </label>
          <textarea
            id={`reflection-${i}`}
            rows={4}
            value={responses[i]}
            onChange={e => handleChange(i, e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none resize-y"
          />
        </div>
      ))}

      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={handleExport}
          className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Export Reflection PDF
        </button>
        <SaveIndicator savedAt={savedAt} />
      </div>
      <p className="text-xs text-slate-400 mt-3">
        After exporting, submit the PDF in Blackboard Ultra.
      </p>
    </div>
  )
}
