import { useLogto } from '@logto/react'
import Typography from '@mui/material/Typography'
import { type ReactNode, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { getLogtoConfig, getSignInRedirectUri } from './logtoConfig'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const config = getLogtoConfig()

  if (!config) {
    return <ConfigMissing />
  }

  return <RequireAuth>{children}</RequireAuth>
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading, signIn } = useLogto()
  const signInStarted = useRef(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !signInStarted.current) {
      signInStarted.current = true
      void signIn(getSignInRedirectUri())
    }
  }, [isAuthenticated, isLoading, signIn])

  if (isLoading || !isAuthenticated) {
    return <Typography component="p">{t('dashboard.redirecting')}</Typography>
  }

  return children
}

function ConfigMissing() {
  const { t } = useTranslation()
  return <Typography component="p">{t('dashboard.configMissing')}</Typography>
}
