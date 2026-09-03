import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { discardLogtoBrowserTokens } from './discardLogtoBrowserTokens'

export function AuthProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    discardLogtoBrowserTokens()
  }, [])

  return children
}
