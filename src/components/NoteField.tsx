import { useState } from 'react'
import { isBlocked } from '../utils/guardrail'
import { GuardrailAlert } from './GuardrailAlert'

interface NoteFieldProps {
  label: string
  fieldKey: string
  value: string
  onChange: (key: string, value: string) => void
  placeholder?: string
  rows?: number
}

export function NoteField({ label, fieldKey, value, onChange, placeholder, rows = 4 }: NoteFieldProps) {
  const [blocked, setBlocked] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (isBlocked(text)) {
      setBlocked(true)
    } else {
      setBlocked(false)
      onChange(fieldKey, text)
    }
  }

  return (
    <div className="mb-5">
      <label
        htmlFor={fieldKey}
        className="block text-sm font-semibold text-slate-700 mb-1"
      >
        {label}
      </label>
      <textarea
        id={fieldKey}
        rows={rows}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none resize-y"
        aria-describedby={blocked ? `${fieldKey}-alert` : undefined}
      />
      {blocked && (
        <div id={`${fieldKey}-alert`} className="mt-2">
          <GuardrailAlert />
        </div>
      )}
    </div>
  )
}
