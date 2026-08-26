import ArrowBack from '@mui/icons-material/ArrowBack'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useNavigate } from 'react-router'

import { landing } from '#/pages/home/landing'
import { fonts } from '#/theme/tokens'

import { useCreateHousehold } from '../hooks/useCreateHousehold'
import { useHouseholdSession } from '../hooks/useHouseholdSession'
import { useMyHouseholds } from '../hooks/useMyHouseholds'
import { CreateHouseholdForm } from '../components/CreateHouseholdForm'
import { CreateHouseholdPageSkeleton } from '../components/CreateHouseholdPageSkeleton'
import { HouseholdFeedback } from '../components/HouseholdFeedback'

export function CreateHouseholdPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isLoading, isError, isNotProvisioned, refetch } = useMyHouseholds()
  const { skipCreate } = useHouseholdSession()
  const { createHousehold, isSubmitting, isError: isSubmitError, reset } = useCreateHousehold()

  if (isLoading) {
    return <CreateHouseholdPageSkeleton />
  }

  async function handleCreate(name: string) {
    try {
      await createHousehold(name)
      void navigate('/dashboard')
    } catch {
      // Mutation error is shown through isSubmitError.
    }
  }

  function handleSkip() {
    skipCreate()
    void navigate('/dashboard')
  }

  return (
    <Box
      sx={{
        bgcolor: landing.canvas,
        color: landing.cream,
        minHeight: '100svh',
        px: { xs: 3, md: 8 },
        py: 3,
      }}
    >
      <IconButton
        component={RouterLink}
        to="/"
        aria-label={t('createHousehold.back')}
        sx={{ color: landing.cream, mb: { xs: 4, md: 8 } }}
      >
        <ArrowBack />
      </IconButton>

      <Stack alignItems="center" spacing={2} sx={{ maxWidth: 640, mx: 'auto', pt: { xs: 2, md: 6 } }}>
        {isError && !isNotProvisioned ? (
          <HouseholdFeedback onRetry={() => void refetch()} />
        ) : (
          <>
            <Typography
              sx={{
                color: landing.forest,
                letterSpacing: '0.18em',
                fontSize: 12,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontFamily: fonts.body,
              }}
            >
              {t('createHousehold.eyebrow')}
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontFamily: fonts.headline,
                fontSize: { xs: 36, md: 56 },
                fontWeight: 500,
                textAlign: 'center',
                lineHeight: 1.15,
                color: landing.cream,
              }}
            >
              {t('createHousehold.title')}
            </Typography>
            <Typography
              sx={{
                color: landing.muted,
                textAlign: 'center',
                maxWidth: 480,
                fontSize: { xs: 15, md: 17 },
                lineHeight: 1.6,
                mb: 2,
              }}
            >
              {t('createHousehold.description')}
            </Typography>
            <CreateHouseholdForm
              isSubmitting={isSubmitting}
              isSubmitError={isSubmitError}
              onSubmit={handleCreate}
              onSkip={handleSkip}
              onRetry={() => reset()}
            />
          </>
        )}
      </Stack>
    </Box>
  )
}
