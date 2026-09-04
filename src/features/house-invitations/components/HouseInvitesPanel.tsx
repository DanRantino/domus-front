import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import InputBase from '@mui/material/InputBase'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { landing, landingCtaSx } from '#/pages/home/landing'
import { fonts } from '#/theme/tokens'

import {
  useCreateHouseInvitationMutation,
  useGetHouseInvitationsQuery,
  useResendHouseInvitationMutation,
  useRevokeHouseInvitationMutation,
} from '../api/invitationsApi'
import { createInvitationSchema, type CreateInvitationValues } from '../schema'

type HouseInvitesPanelProps = {
  houseId: string
}

export function HouseInvitesPanel({ houseId }: HouseInvitesPanelProps) {
  const { t } = useTranslation()
  const {
    data: invitations = [],
    isLoading,
    isError,
    refetch,
  } = useGetHouseInvitationsQuery(houseId)
  const [createInvitation, createState] = useCreateHouseInvitationMutation()
  const [revokeInvitation] = useRevokeHouseInvitationMutation()
  const [resendInvitation] = useResendHouseInvitationMutation()

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateInvitationValues>({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: { email: '', role: 'member' },
  })

  async function onSubmit(values: CreateInvitationValues) {
    await createInvitation({ houseId, email: values.email, role: values.role }).unwrap()
    reset({ email: '', role: 'member' })
  }

  return (
    <Stack spacing={3} sx={{ width: '100%', maxWidth: 560, mt: 6, textAlign: 'left' }}>
      <Typography
        component="h2"
        sx={{ fontFamily: fonts.headline, fontSize: 24, color: landing.cream }}
      >
        {t('invites.title')}
      </Typography>
      <Typography sx={{ color: landing.muted, fontSize: 15, lineHeight: 1.6 }}>
        {t('invites.description')}
      </Typography>

      <Stack
        component="form"
        noValidate
        spacing={2}
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event)
        }}
      >
        <InputBase
          id="invite-email"
          type="email"
          placeholder={t('invites.emailPlaceholder')}
          inputProps={{ 'aria-label': t('invites.emailLabel') }}
          sx={{
            color: landing.cream,
            pb: 1,
            borderBottom: '1px solid',
            borderColor: errors.email ? 'error.main' : landing.line,
            '& input::placeholder': { color: landing.muted, opacity: 1 },
          }}
          {...register('email')}
        />
        {errors.email ? (
          <Typography role="alert" sx={{ color: 'error.light', fontSize: 13 }}>
            {t('invites.emailInvalid')}
          </Typography>
        ) : null}
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              size="small"
              aria-label={t('invites.roleLabel')}
              sx={{ color: landing.cream, alignSelf: 'flex-start', minWidth: 160 }}
            >
              <MenuItem value="member">{t('invites.roleMember')}</MenuItem>
              <MenuItem value="admin">{t('invites.roleAdmin')}</MenuItem>
            </Select>
          )}
        />
        {createState.isError ? (
          <Alert
            severity="error"
            sx={{
              bgcolor: 'rgba(186, 26, 26, 0.16)',
              color: landing.cream,
              '& .MuiAlert-icon': { color: landing.cream },
            }}
          >
            {t('invites.createError')}
          </Alert>
        ) : null}
        <Button
          type="submit"
          variant="contained"
          disabled={createState.isLoading}
          sx={{ ...landingCtaSx, alignSelf: 'flex-start' }}
        >
          {createState.isLoading ? (
            <CircularProgress size={18} sx={{ color: landing.cream }} />
          ) : (
            t('invites.submit')
          )}
        </Button>
      </Stack>

      {isLoading ? (
        <CircularProgress size={22} sx={{ color: landing.cream }} />
      ) : isError ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => void refetch()}>
              {t('invites.retry')}
            </Button>
          }
          sx={{
            bgcolor: 'rgba(186, 26, 26, 0.16)',
            color: landing.cream,
            '& .MuiAlert-icon': { color: landing.cream },
          }}
        >
          {t('invites.loadError')}
        </Alert>
      ) : invitations.length === 0 ? (
        <Typography sx={{ color: landing.muted }}>{t('invites.empty')}</Typography>
      ) : (
        <Stack spacing={1.5} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {invitations.map((invitation) => (
            <Stack
              key={invitation.id}
              component="li"
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              alignItems={{ sm: 'center' }}
              justifyContent="space-between"
              sx={{
                border: '1px solid',
                borderColor: landing.line,
                borderRadius: 1,
                p: 1.5,
              }}
            >
              <Typography sx={{ color: landing.cream }}>
                {invitation.email} ·{' '}
                {t(`invites.role${invitation.role === 'admin' ? 'Admin' : 'Member'}`)}
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  onClick={() => {
                    void resendInvitation({ houseId, invitationId: invitation.id })
                  }}
                  sx={{ color: landing.cream, textTransform: 'none' }}
                >
                  {t('invites.resend')}
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    void revokeInvitation({ houseId, invitationId: invitation.id })
                  }}
                  sx={{ color: landing.cream, textTransform: 'none' }}
                >
                  {t('invites.revoke')}
                </Button>
              </Stack>
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  )
}
