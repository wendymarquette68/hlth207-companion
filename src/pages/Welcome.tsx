import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '../context/SessionContext'
import config from '../config/course.config.json'

export function Welcome() {
  const { startSession } = useSession()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [section, setSection] = useState('')
  const [versionId, setVersionId] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !section.trim() || !versionId) {
      setError('Please complete all fields before continuing.')
      return
    }
    startSession(name.trim(), section.trim(), versionId)
    navigate('/dashboard')
  }

  const selectedVersion = config.versions.find(v => v.id === versionId)

  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          HLTH 207 Companion App
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Guided learning workspace for the Health Advocacy Project
        </p>

        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          This app helps you apply course readings, organize research ideas, and
          plan your Health Advocacy Project. Assignments are written and submitted
          independently in Blackboard Ultra.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              htmlFor="student-name"
              className="block text-sm font-semibold text-slate-700 mb-1"
            >
              Your Full Name
            </label>
            <input
              id="student-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="First Last"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              autoComplete="name"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="section"
              className="block text-sm font-semibold text-slate-700 mb-1"
            >
              Course Section
            </label>
            <input
              id="section"
              type="text"
              value={section}
              onChange={e => setSection(e.target.value)}
              placeholder="e.g. Section 01"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              How many weeks is your course?
            </label>
            <div className="space-y-2">
              {config.versions.map(v => (
                <label
                  key={v.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    versionId === v.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="version"
                    value={v.id}
                    checked={versionId === v.id}
                    onChange={() => setVersionId(v.id)}
                    className="mt-0.5 accent-blue-700"
                  />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{v.label}</p>
                    <p className="text-xs text-slate-500">{v.description}</p>
                  </div>
                </label>
              ))}
            </div>

            {selectedVersion && (
              <p className="text-xs text-blue-700 mt-2 px-1">
                Your course has <strong>{selectedVersion.weeks.length} modules</strong>.
                Activities and content are paced for {selectedVersion.description.toLowerCase()}.
              </p>
            )}
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600 mb-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            Get Started
          </button>
        </form>

        <p className="text-xs text-slate-400 mt-5 text-center">
          Your notes are stored locally on this device and cleared when you sign out.
        </p>
      </div>
    </div>
  )
}
