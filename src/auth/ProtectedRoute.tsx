import Typography from '@mui/material/Typography'
import { type ReactNode, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { authLoginPath } from './paths'
import { useAuthSession } from './useAuthSession'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading } = useAuthSession()
  const signInStarted = useRef(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !signInStarted.current) {
      signInStarted.current = true
      window.location.assign(
        authLoginPath(`${window.location.pathname}${window.location.search}`),
      )
    }
  }, [isAuthenticated, isLoading])

  if (isLoading || !isAuthenticated) {
    return <Typography component="p">{t('dashboard.redirecting')}</Typography>
  }

  return children
}
