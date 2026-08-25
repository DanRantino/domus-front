import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

import { fetchBffSession, type BffSession } from './bff'

export type SessionStatus = 'loading' | 'anonymous' | 'authenticated'

type SessionContextValue = {
  status: SessionStatus
  session: BffSession | null
}

const SessionContext = createContext<SessionContextValue>({
  status: 'loading',
  session: null,
})

export function useSession() {
  return useContext(SessionContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<SessionContextValue>({
    status: 'loading',
    session: null,
  })

  useEffect(() => {
    let cancelled = false

    void fetchBffSession().then((session) => {
      if (cancelled) {
        return
      }

      setValue(
        session?.authenticated
          ? { status: 'authenticated', session }
          : { status: 'anonymous', session: null },
      )
    })

    return () => {
      cancelled = true
    }
  }, [])

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}
