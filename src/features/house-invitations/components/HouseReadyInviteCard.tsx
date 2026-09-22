import Button from '@mui/material/Button'
import InputBase from '@mui/material/InputBase'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { landing } from '#/pages/home/landing'
import { fonts } from '#/theme/tokens'

import { inviteEmailSchema, type InviteEmailValues } from '../schema'

type HouseReadyInviteCardProps = {
  emails: string[]
  onAdd: (email: string) => void
}

export function HouseReadyInviteCard({ emails, onAdd }: HouseReadyInviteCardProps) {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteEmailValues>({
    resolver: zodResolver(inviteEmailSchema),
    defaultValues: { email: '' },
  })

  return (
    <Stack
      spacing={2.5}
      sx={{
        width: '100%',
        maxWidth: 560,
        bgcolor: landing.surface,
        color: landing.cream,
        borderRadius: 1,
        px: { xs: 2.5, md: 4 },
        py: { xs: 3, md: 4 },
        textAlign: 'left',
      }}
    >
      <Typography
        sx={{
          fontFamily: fonts.body,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: landing.cream,
        }}
      >
        {t('start.ready.addLabel')}
      </Typography>

      <Stack
        component="form"
        noValidate
        direction="row"
        spacing={2}
        alignItems="center"
        onSubmit={(event) => {
          void handleSubmit((values) => {
            onAdd(values.email)
            reset({ email: '' })
          })(event)
        }}
      >
        <InputBase
          id="ready-invite-email"
          type="email"
          placeholder={t('start.ready.emailPlaceholder')}
          inputProps={{ 'aria-label': t('start.ready.emailLabel') }}
          sx={{
            flex: 1,
            color: landing.cream,
            pb: 1,
            borderBottom: '1px solid',
            borderColor: errors.email ? 'error.main' : landing.line,
            fontFamily: fonts.body,
            '& input::placeholder': { color: landing.muted, opacity: 1 },
          }}
          {...register('email')}
        />
        <Button
          type="submit"
          variant="text"
          sx={{
            color: landing.cream,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            flexShrink: 0,
            minWidth: 'auto',
            px: 0.5,
          }}
        >
          {t('start.ready.add')}
        </Button>
      </Stack>

      {errors.email ? (
        <Typography role="alert" sx={{ color: 'error.light', fontSize: 13 }}>
          {t('start.ready.emailInvalid')}
        </Typography>
      ) : null}

      {emails.length > 0 ? (
        <Stack spacing={1} component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
          {emails.map((email) => (
            <Typography key={email} component="li" sx={{ color: landing.cream, fontSize: 15 }}>
              {email}
            </Typography>
          ))}
        </Stack>
      ) : null}
    </Stack>
  )
}
