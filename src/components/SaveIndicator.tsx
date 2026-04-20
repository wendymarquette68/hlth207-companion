interface Props {
  savedAt: Date | null
}

export function SaveIndicator({ savedAt }: Props) {
  if (!savedAt) return null
  return (
    <p className="text-xs text-slate-400" aria-live="polite">
      Saved {savedAt.toLocaleTimeString()}
    </p>
  )
}
