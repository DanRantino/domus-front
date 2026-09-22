import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { matchPath, Outlet, useLocation } from 'react-router'

import { authLoginPath } from './paths'
import { useAuthSession } from './useAuthSession'

export function ProtectedRoute({ publicPaths }: { publicPaths: readonly string[] }) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { isAuthenticated, isLoading } = useAuthSession()
  const signInStarted = useRef(false)
  const [pageResume, setPageResume] = useState(0)
  const isPublic = publicPaths.some((path) => matchPath({ path, end: true }, pathname) != null)

  useEffect(() => {
    function onPageShow(event: PageTransitionEvent) {
      if (!event.persisted) {
        return
      }

      signInStarted.current = false
      setPageResume((value) => value + 1)
    }

    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

  useEffect(() => {
    if (isPublic || isLoading || isAuthenticated || signInStarted.current) {
      return
    }

    signInStarted.current = true
    window.location.assign(authLoginPath(`${window.location.pathname}${window.location.search}`))
  }, [isAuthenticated, isLoading, isPublic, pageResume])

  if (isPublic || isAuthenticated) {
    return <Outlet />
  }

  return (
    <Box sx={{ height: '100vh' }}>
      <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
        <Typography component="p">{t('dashboard.redirecting')}</Typography>
        <CircularProgress />
      </Stack>
    </Box>
  )
}
