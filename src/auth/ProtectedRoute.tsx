import Typography from '@mui/material/Typography'
import { type ReactNode, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { useSession } from './AuthProvider'
import { getLoginHref } from './bff'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const { status } = useSession()
  const loginStarted = useRef(false)

  useEffect(() => {
    if (status !== 'anonymous' || loginStarted.current) {
      return
    }

    loginStarted.current = true
    const returnUrl = `${window.location.pathname}${window.location.search}` || '/dashboard'
    window.location.assign(getLoginHref(returnUrl))
  }, [status])

  if (status !== 'authenticated') {
    return <Typography component="p">{t('dashboard.redirecting')}</Typography>
  }

  return children
}
