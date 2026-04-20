import { useState, useEffect, useCallback } from 'react'
import { load, save } from '../utils/storage'

export type NoteModule = 'health_issue' | 'article_review' | 'policy_advocacy' | 'presentation'

type NoteContent = Record<string, string>

export function useNotes(module: NoteModule) {
  const storageKey = `notes_${module}`
  const [notes, setNotes] = useState<NoteContent>(() => load<NoteContent>(storageKey) ?? {})
  const [savedAt, setSavedAt] = useState<Date | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      save(storageKey, notes)
      setSavedAt(new Date())
    }, 1500)
    return () => clearTimeout(timer)
  }, [notes, storageKey])

  const update = useCallback((field: string, value: string) => {
    setNotes(prev => ({ ...prev, [field]: value }))
  }, [])

  return { notes, update, savedAt }
}
