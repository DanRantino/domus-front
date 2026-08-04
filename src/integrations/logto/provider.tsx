import { LogtoProvider } from '@logto/react'
import { useEffect, useState, type ReactNode } from 'react'

import { BootstrapSurface } from '#/features/users/components/surfaces'

import { getLogtoConfig } from './config'

function ClientOnly({ children, fallback }: { children: ReactNode; fallback: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return fallback
  }

  return children
}

export function AppLogtoProvider({ children }: { children: ReactNode }) {
  const config = getLogtoConfig()

  if (!config) {
    return children
  }

  return (
    <ClientOnly fallback={<BootstrapSurface message="Loading authentication…" />}>
      <LogtoProvider config={config}>{children}</LogtoProvider>
    </ClientOnly>
  )
}
