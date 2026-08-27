import ArrowBack from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Stack from '@mui/material/Stack'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'

import { landing } from '#/pages/home/landing'

export function CreateHouseholdPageSkeleton() {
  const { t } = useTranslation()

  return (
    <Box
      sx={{
        bgcolor: landing.canvas,
        color: landing.cream,
        minHeight: '100svh',
        px: { xs: 3, md: 8 },
        py: 3,
      }}
      aria-busy="true"
      aria-live="polite"
      aria-label={t('createHousehold.loading')}
    >
      <IconButton
        component={RouterLink}
        to="/"
        aria-label={t('createHousehold.back')}
        sx={{ color: landing.cream, mb: { xs: 6, md: 10 } }}
      >
        <ArrowBack />
      </IconButton>

      <Stack alignItems="center" spacing={2} sx={{ maxWidth: 560, mx: 'auto', pt: { xs: 2, md: 6 } }}>
        <Skeleton variant="text" width={96} height={20} sx={{ bgcolor: landing.line }} />
        <Skeleton variant="text" width="80%" height={56} sx={{ bgcolor: landing.line }} />
        <Skeleton variant="text" width="90%" height={48} sx={{ bgcolor: landing.line }} />
        <Skeleton variant="rectangular" width="100%" height={48} sx={{ bgcolor: landing.line, mt: 4 }} />
        <Skeleton variant="rounded" width="70%" height={52} sx={{ bgcolor: landing.line, mt: 4 }} />
        <Skeleton variant="text" width={140} height={24} sx={{ bgcolor: landing.line }} />
      </Stack>
    </Box>
  )
}
