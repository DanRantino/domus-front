import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

import { landing, landingCtaSx } from '#/pages/home/landing'

type HouseholdFeedbackProps = {
  compact?: boolean
  title?: string
  message?: string
  onRetry: () => void
}

export function HouseholdFeedback({
  compact = false,
  title,
  message,
  onRetry,
}: HouseholdFeedbackProps) {
  const { t } = useTranslation()
  const resolvedTitle = title ?? t('createHousehold.errorTitle')
  const resolvedMessage = message ?? t('createHousehold.error')

  if (compact) {
    return (
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        aria-live="polite"
        sx={{ maxWidth: { sm: 220 } }}
      >
        <Typography variant="caption" sx={{ color: landing.muted, lineHeight: 1.3 }}>
          {resolvedMessage}
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={onRetry}
          sx={{ color: landing.cream, flexShrink: 0, minWidth: 0, px: 1 }}
        >
          {t('createHousehold.retry')}
        </Button>
      </Stack>
    )
  }

  return (
    <Stack spacing={2} alignItems="center" textAlign="center" aria-live="polite" sx={{ maxWidth: 480 }}>
      <Typography component="h1" variant="h4" sx={{ color: landing.cream }}>
        {resolvedTitle}
      </Typography>
      <Alert
        severity="error"
        sx={{
          width: '100%',
          bgcolor: 'rgba(186, 26, 26, 0.16)',
          color: landing.cream,
          '& .MuiAlert-icon': { color: landing.cream },
        }}
      >
        {resolvedMessage}
      </Alert>
      <Button variant="contained" onClick={onRetry} sx={landingCtaSx}>
        {t('createHousehold.retry')}
      </Button>
    </Stack>
  )
}
