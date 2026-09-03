import Check from '@mui/icons-material/Check'
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate } from 'react-router'

import { useHouseholdSession } from '#/features/create-household/hooks/useHouseholdSession'
import { useMyHouseholds } from '#/features/create-household/hooks/useMyHouseholds'
import { HouseReadyInviteCard } from '#/features/house-invitations/components/HouseReadyInviteCard'
import { useCreateHouseInvitationMutation } from '#/features/house-invitations/api/invitationsApi'
import { landing, landingCtaSx } from '#/pages/home/landing'
import { fonts, paletteKeys } from '#/theme/tokens'

export function HouseReadyPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { households, isLoading } = useMyHouseholds()
  const { selectedId } = useHouseholdSession()
  const [createInvitation] = useCreateHouseInvitationMutation()
  const [emails, setEmails] = useState<string[]>([])
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState(false)

  const selected = households.find((household) => household.id === selectedId) ?? households[0]

  function addEmail(email: string) {
    const normalized = email.trim().toLowerCase()
    setEmails((current) => (current.includes(normalized) ? current : [...current, normalized]))
  }

  async function handleSend() {
    if (!selected || emails.length === 0 || isSending) {
      return
    }

    setIsSending(true)
    setSendError(false)
    const failed: string[] = []

    for (const email of emails) {
      try {
        await createInvitation({ houseId: selected.id, email, role: 'member' }).unwrap()
      } catch {
        failed.push(email)
      }
    }

    if (failed.length > 0) {
      setEmails(failed)
      setSendError(true)
      setIsSending(false)
      return
    }

    void navigate('/dashboard')
  }

  function handleLater() {
    void navigate('/dashboard')
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          bgcolor: paletteKeys.white,
          minHeight: '100svh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={28} sx={{ color: landing.forest }} />
      </Box>
    )
  }

  if (!selectedId || !selected) {
    return <Navigate to="/start" replace />
  }

  if (selected.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <Box
      sx={{
        bgcolor: paletteKeys.white,
        minHeight: '100svh',
        px: { xs: 3, md: 8 },
        py: { xs: 6, md: 10 },
      }}
    >
      <Stack alignItems="center" spacing={2.5} sx={{ maxWidth: 640, mx: 'auto' }}>
        <Check sx={{ fontSize: 28, color: landing.muted }} aria-hidden />
        <Typography
          component="h1"
          sx={{
            fontFamily: fonts.headline,
            fontWeight: 500,
            fontSize: { xs: 32, md: 48 },
            lineHeight: 1.15,
            textAlign: 'center',
            color: landing.muted,
          }}
        >
          {t('start.ready.title')}
        </Typography>
        <Typography
          sx={{
            fontFamily: fonts.body,
            fontSize: { xs: 16, md: 18 },
            color: paletteKeys.mutedInk,
            textAlign: 'center',
            mb: 1,
          }}
        >
          {t('start.ready.subtitle')}
        </Typography>

        <HouseReadyInviteCard emails={emails} onAdd={addEmail} />

        {sendError ? (
          <Alert severity="error" sx={{ width: '100%', maxWidth: 560 }}>
            {t('start.ready.sendError')}
          </Alert>
        ) : null}

        <Stack spacing={1.5} alignItems="center" sx={{ width: '100%', maxWidth: 360, pt: 2 }}>
          <Button
            type="button"
            variant="contained"
            disabled={emails.length === 0 || isSending}
            onClick={() => {
              void handleSend()
            }}
            sx={{
              ...landingCtaSx,
              width: '100%',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {isSending ? (
              <CircularProgress size={18} sx={{ color: landing.cream }} />
            ) : (
              t('start.ready.send')
            )}
          </Button>
          <Button
            type="button"
            variant="text"
            disabled={isSending}
            onClick={handleLater}
            sx={{
              color: landing.muted,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {t('start.ready.later')}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
