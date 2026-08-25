import { LogtoProvider } from '@logto/react'
import type { ReactNode } from 'react'
import { useMemo } from 'react'

import { getLogtoConfig } from './logtoConfig'
import { SessionLogtoClient, clearLogtoLocalStorage } from './logtoSession'

export function AuthProvider({ children }: { children: ReactNode }) {
  const config = useMemo(() => getLogtoConfig(), [])

  if (!config) {
    return children
  }

  clearLogtoLocalStorage()

  return (
    <LogtoProvider config={config} LogtoClientClass={SessionLogtoClient}>
      {children}
    </LogtoProvider>
  )
}
