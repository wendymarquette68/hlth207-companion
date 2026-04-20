import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { load, save } from '../utils/storage'

interface Session {
  studentName: string
  section: string
}

interface SessionContextType {
  session: Session | null
  startSession: (name: string, section: string) => void
  clearSession: () => void
}

const SessionContext = createContext<SessionContextType | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() =>
    load<Session>('session')
  )

  useEffect(() => {
    if (session) save('session', session)
  }, [session])

  const startSession = (studentName: string, section: string) => {
    setSession({ studentName, section })
  }

  const clearSession = () => {
    setSession(null)
  }

  return (
    <SessionContext.Provider value={{ session, startSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}
