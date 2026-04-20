import { useState, useEffect } from 'react'
import { load, save } from '../utils/storage'

export function useProjectConnection(weekNumber: number) {
  const key = `project_connection_${weekNumber}`
  const [note, setNote] = useState<string>(() => load<string>(key) ?? '')
  const [savedAt, setSavedAt] = useState<Date | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      save(key, note)
      setSavedAt(new Date())
    }, 1500)
    return () => clearTimeout(timer)
  }, [note, key])

  return { note, setNote, savedAt }
}
