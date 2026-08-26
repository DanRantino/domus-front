import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import InputBase from '@mui/material/InputBase'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { landing, landingCtaSx } from '#/pages/home/landing'
import { fonts } from '#/theme/tokens'

import {
  createHouseholdSchema,
  type CreateHouseholdValues,
} from '../schema'

type CreateHouseholdFormProps = {
  isSubmitting: boolean
  isSubmitError: boolean
  onSubmit: (name: string) => Promise<void>
  onSkip: () => void
  onRetry?: () => void
}

export function CreateHouseholdForm({
  isSubmitting,
  isSubmitError,
  onSubmit,
  onSkip,
  onRetry,
}: CreateHouseholdFormProps) {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateHouseholdValues>({
    resolver: zodResolver(createHouseholdSchema),
    defaultValues: { name: '' },
  })

  const nameError =
    errors.name?.message === 'tooLong'
      ? t('createHousehold.nameTooLong')
      : errors.name
        ? t('createHousehold.nameRequired')
        : undefined

  return (
    <Stack
      component="form"
      noValidate
      spacing={4}
      alignItems="stretch"
      sx={{ width: '100%', maxWidth: 520 }}
      onSubmit={(event) => {
        void handleSubmit(async (values) => {
          await onSubmit(values.name)
        })(event)
      }}
    >
      <Box>
        <Typography
          component="label"
          htmlFor="household-name"
          sx={{
            display: 'block',
            color: landing.muted,
            fontSize: 13,
            mb: 1.5,
            fontFamily: fonts.body,
          }}
        >
          {t('createHousehold.nameLabel')}
        </Typography>
        <InputBase
          id="household-name"
          fullWidth
          placeholder={t('createHousehold.namePlaceholder')}
          disabled={isSubmitting}
          error={Boolean(nameError)}
          inputProps={{ 'aria-invalid': Boolean(nameError) }}
          sx={{
            fontFamily: fonts.headline,
            fontSize: { xs: 28, md: 36 },
            color: landing.cream,
            pb: 1,
            borderBottom: '1px solid',
            borderColor: nameError ? 'error.main' : landing.line,
            '& input::placeholder': {
              color: landing.muted,
              opacity: 1,
              fontFamily: fonts.headline,
            },
          }}
          {...register('name')}
        />
        {nameError ? (
          <Typography role="alert" sx={{ color: 'error.light', fontSize: 13, mt: 1 }}>
            {nameError}
          </Typography>
        ) : null}
      </Box>

      {isSubmitError ? (
        <Alert
          severity="error"
          action={
            onRetry ? (
              <Button
                color="inherit"
                size="small"
                disabled={isSubmitting}
                onClick={() => {
                  onRetry()
                  void handleSubmit(async (values) => {
                    await onSubmit(values.name)
                  })()
                }}
              >
                {t('createHousehold.retry')}
              </Button>
            ) : undefined
          }
          sx={{
            bgcolor: 'rgba(186, 26, 26, 0.16)',
            color: landing.cream,
            '& .MuiAlert-icon': { color: landing.cream },
          }}
        >
          {t('createHousehold.submitError')}
        </Alert>
      ) : null}

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        sx={{ ...landingCtaSx, py: 1.75, fontSize: 16 }}
      >
        {isSubmitting ? (
          <CircularProgress size={22} sx={{ color: landing.cream }} />
        ) : (
          t('createHousehold.submit')
        )}
      </Button>

      <Button
        variant="text"
        disabled={isSubmitting}
        onClick={onSkip}
        sx={{ color: landing.muted, textTransform: 'none' }}
      >
        {t('createHousehold.decideLater')}
      </Button>
    </Stack>
  )
}
