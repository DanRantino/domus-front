import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

import { DomusLockup } from '#/components/brand/DomusMark'

export function HomePage() {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100svh',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        px: 3,
        textAlign: 'center',
      }}
    >
      <DomusLockup as="h1" size="lg" />
      <Typography color="text.secondary" sx={{ mt: 2, maxWidth: 420 }}>
        {t('home.tagline')}
      </Typography>
    </Box>
  )
}
