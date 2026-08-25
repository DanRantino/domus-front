import { useHandleSignInCallback } from '@logto/react'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { getLogtoConfig } from './logtoConfig'

export function CallbackPage() {
  const config = getLogtoConfig()

  if (!config) {
    return <ConfigMissing />
  }

  return <HandleSignInCallback />
}

function HandleSignInCallback() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isLoading } = useHandleSignInCallback(() => {
    void navigate('/dashboard', { replace: true })
  })

  if (isLoading) {
    return <Typography component="p">{t('dashboard.redirecting')}</Typography>
  }

  return null
}

function ConfigMissing() {
  const { t } = useTranslation()
  return <Typography component="p">{t('dashboard.configMissing')}</Typography>
}
