import ArrowBack from '@mui/icons-material/ArrowBack'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router'

import { getDomusErrorCode } from '#/api/baseQuery'
import { useAuthSession } from '#/auth/useAuthSession'
import { authLoginPath } from '#/auth/paths'
import { useHouseholdSession } from '#/features/create-household/hooks/useHouseholdSession'
import {
  useAcceptInvitationMutation,
  useGetInvitationPreviewQuery,
} from '#/features/house-invitations/api/invitationsApi'
import { inviteCodeSchema, type InviteCodeValues } from '#/features/house-invitations/schema'
import { landing, landingCtaSx } from '#/pages/home/landing'
import { StartChrome } from '#/pages/start/StartChrome'
import { fonts } from '#/theme/tokens'

export function JoinHouseholdPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const token = searchParams.get('token')?.trim() ?? ''
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthSession()
  const { selectHousehold } = useHouseholdSession()
  const acceptStarted = useRef(false)

  const preview = useGetInvitationPreviewQuery(token, { skip: token.length === 0 })
  const [acceptInvitation, acceptState] = useAcceptInvitationMutation()

  useEffect(() => {
    if (!token || !isAuthenticated || isAuthLoading || acceptStarted.current) {
      return
    }

    acceptStarted.current = true
    void acceptInvitation({ token })
  }, [acceptInvitation, isAuthenticated, isAuthLoading, token])

  useEffect(() => {
    if (!acceptState.isSuccess || !acceptState.data) {
      return
    }

    selectHousehold(acceptState.data.house_id)
    void navigate('/dashboard', { replace: true })
  }, [acceptState.data, acceptState.isSuccess, navigate, selectHousehold])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteCodeValues>({
    resolver: zodResolver(inviteCodeSchema),
    defaultValues: { token },
  })

  function onSubmit(values: InviteCodeValues) {
    if (!isAuthenticated) {
      window.location.assign(
        authLoginPath(`/start/invite?token=${encodeURIComponent(values.token)}`),
      )
      return
    }

    acceptStarted.current = false
    setSearchParams({ token: values.token })
  }

  const previewHouse = preview.data?.house_name
  const previewMissing = Boolean(token) && preview.isError
  const acceptError = getDomusErrorCode(acceptState.error)

  return (
    <StartChrome>
      <IconButton
        component={RouterLink}
        to="/start"
        aria-label={t('start.back')}
        sx={{ color: landing.cream, mb: { xs: 4, md: 6 } }}
      >
        <ArrowBack />
      </IconButton>
      <Stack
        alignItems="center"
        spacing={2}
        sx={{ maxWidth: 520, mx: 'auto', textAlign: 'center' }}
      >
        <Typography
          component="h1"
          sx={{
            fontFamily: fonts.headline,
            fontWeight: 500,
            fontSize: { xs: 32, md: 44 },
            lineHeight: 1.2,
          }}
        >
          {t('start.invite.title')}
        </Typography>
        <Typography sx={{ color: landing.muted, fontSize: { xs: 16, md: 18 }, lineHeight: 1.7 }}>
          {t('start.invite.description')}
        </Typography>
        {preview.isLoading ? (
          <CircularProgress size={28} sx={{ color: landing.cream }} />
        ) : previewHouse ? (
          <Typography sx={{ color: landing.cream, fontSize: 18 }}>
            {t('start.invite.preview', { name: previewHouse })}
          </Typography>
        ) : null}
        {previewMissing ? (
          <Alert
            severity="error"
            sx={{
              width: '100%',
              bgcolor: 'rgba(186, 26, 26, 0.16)',
              color: landing.cream,
              '& .MuiAlert-icon': { color: landing.cream },
            }}
          >
            {t('start.invite.invalid')}
          </Alert>
        ) : null}
        {acceptError ? (
          <Alert
            severity="error"
            sx={{
              width: '100%',
              bgcolor: 'rgba(186, 26, 26, 0.16)',
              color: landing.cream,
              '& .MuiAlert-icon': { color: landing.cream },
            }}
          >
            {acceptError === 'forbidden'
              ? t('start.invite.emailMismatch')
              : t('start.invite.acceptError')}
          </Alert>
        ) : null}

        <Stack
          component="form"
          noValidate
          spacing={3}
          alignItems="stretch"
          sx={{ width: '100%', pt: 2 }}
          onSubmit={(event) => {
            void handleSubmit(onSubmit)(event)
          }}
        >
          <InputBase
            id="invite-token"
            fullWidth
            placeholder={t('start.invite.codePlaceholder')}
            inputProps={{ 'aria-label': t('start.invite.codeLabel') }}
            sx={{
              fontFamily: fonts.headline,
              fontSize: { xs: 22, md: 28 },
              color: landing.cream,
              pb: 1,
              borderBottom: '1px solid',
              borderColor: errors.token ? 'error.main' : landing.line,
              '& input::placeholder': { color: landing.muted, opacity: 1 },
            }}
            {...register('token')}
          />
          {errors.token ? (
            <Typography role="alert" sx={{ color: 'error.light', fontSize: 13 }}>
              {t('start.invite.codeRequired')}
            </Typography>
          ) : null}

          <Button
            type="submit"
            variant="contained"
            disabled={acceptState.isLoading}
            sx={{ ...landingCtaSx, py: 1.75 }}
          >
            {isAuthenticated ? t('start.invite.submit') : t('start.invite.loginToAccept')}
          </Button>
        </Stack>
      </Stack>
    </StartChrome>
  )
}
