import { useState } from 'react'
import { load, save } from '../utils/storage'

interface ActivityResponse {
  text: string
  submittedAt: string
}

export function useActivityResponse(weekNumber: number) {
  const key = `activity_${weekNumber}`
  const [response, setResponse] = useState<ActivityResponse | null>(() =>
    load<ActivityResponse>(key)
  )

  const submit = (text: string) => {
    const r: ActivityResponse = { text, submittedAt: new Date().toISOString() }
    save(key, r)
    setResponse(r)
  }

  return { response, submit }
}
