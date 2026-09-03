import Typography from '@mui/material/Typography'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { matchPath, Outlet, useLocation } from 'react-router'

import { authLoginPath } from './paths'
import { useAuthSession } from './useAuthSession'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'

export function ProtectedRoute({ publicPaths }: { publicPaths: readonly string[] }) {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { isAuthenticated, isLoading } = useAuthSession()
  const signInStarted = useRef(false)
  const isPublic = publicPaths.some((path) => matchPath({ path, end: true }, pathname) != null)

  useEffect(() => {
    if (isPublic || isLoading || isAuthenticated || signInStarted.current) {
      return
    }

    signInStarted.current = true
    window.location.assign(authLoginPath(`${window.location.pathname}${window.location.search}`))
  }, [isAuthenticated, isLoading, isPublic])

  if (isPublic) {
    return <Outlet />
  }

  if (isLoading || !isAuthenticated) {
    return (
      <Box sx={{ height: '100vh' }}>
        <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ height: '100vh' }}>
          <Typography component="p">{t('dashboard.redirecting')}</Typography>
          <CircularProgress />
        </Stack>
      </Box>
    )
  }

  return <Outlet />
}
