import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

export function DashboardPage() {
  const { t } = useTranslation()

  return (
    <Typography component="h1" variant="h1">
      {t('dashboard.hello')}
    </Typography>
  )
}
