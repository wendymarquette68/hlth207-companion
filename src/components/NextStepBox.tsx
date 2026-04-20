import { Link } from 'react-router-dom'

interface NextStepBoxProps {
  message: string
  label: string
  path: string
  secondaryMessage?: string
  secondaryLabel?: string
  secondaryPath?: string
}

export function NextStepBox({
  message,
  label,
  path,
  secondaryMessage,
  secondaryLabel,
  secondaryPath,
}: NextStepBoxProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-8">
      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
        What to do next
      </p>
      <p className="text-sm text-slate-700 mb-4 leading-relaxed">{message}</p>
      <div className="flex flex-wrap gap-3">
        <Link
          to={path}
          className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          {label} →
        </Link>
        {secondaryLabel && secondaryPath && (
          <Link
            to={secondaryPath}
            className="inline-block bg-white border border-blue-300 hover:border-blue-500 text-blue-700 font-semibold px-5 py-2 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
          >
            {secondaryLabel} →
          </Link>
        )}
      </div>
      {secondaryMessage && (
        <p className="text-xs text-slate-500 mt-3 leading-relaxed">{secondaryMessage}</p>
      )}
    </div>
  )
}
