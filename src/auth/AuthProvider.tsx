import { LogtoProvider, useLogto } from '@logto/react'
import { type ReactNode, useEffect, useMemo } from 'react'

import { setAccessTokenGetter } from '#/api/accessToken'

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
      <AccessTokenBridge />
      {children}
    </LogtoProvider>
  )
}

function AccessTokenBridge() {
  const { getAccessToken, isAuthenticated } = useLogto()
  const resource = import.meta.env.VITE_LOGTO_API_RESOURCE

  useEffect(() => {
    setAccessTokenGetter(async () => {
      if (!isAuthenticated) {
        return undefined
      }

      return resource ? getAccessToken(resource) : getAccessToken()
    })

    return () => setAccessTokenGetter(undefined)
  }, [getAccessToken, isAuthenticated, resource])

  return null
}
