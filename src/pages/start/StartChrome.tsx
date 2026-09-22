import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'

import { useAuthSession } from '#/auth/useAuthSession'
import { DomusLogo } from '#/components/brand/DomusLogo'
import { HomeSessionActions } from '#/pages/home/HomeSessionActions'
import { landing } from '#/pages/home/landing'

type StartChromeProps = {
  children: ReactNode
}

export function StartChrome({ children }: StartChromeProps) {
  const { t } = useTranslation()
  const { isAuthenticated, isLoading } = useAuthSession()

  return (
    <Box sx={{ bgcolor: landing.canvas, color: landing.cream, minHeight: '100svh' }}>
      <Box
        component="header"
        sx={{
          ...landing.gutter,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          py: 2.5,
        }}
      >
        <Link
          component={RouterLink}
          to="/"
          underline="none"
          aria-label={t('home.brand')}
          sx={{ color: landing.cream, lineHeight: 0 }}
        >
          <Box
            component={DomusLogo}
            title={t('home.brand')}
            sx={{ height: 28, width: 'auto', color: 'inherit', display: 'block' }}
          />
        </Link>
        {isAuthenticated && !isLoading ? (
          <HomeSessionActions variant="header" />
        ) : (
          <Typography sx={{ color: landing.muted, fontSize: 14, textAlign: 'right' }}>
            {t('start.loginPrompt')}{' '}
            <Link
              component={RouterLink}
              to="/dashboard"
              underline="none"
              sx={{ color: landing.forest, fontWeight: 600 }}
            >
              {t('start.login')}
            </Link>
          </Typography>
        )}
      </Box>
      <Box component="main" sx={{ px: { xs: 3, md: 8 }, pb: 8 }}>
        {children}
      </Box>
    </Box>
  )
}
