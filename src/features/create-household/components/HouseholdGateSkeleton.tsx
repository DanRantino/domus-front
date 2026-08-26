import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import { useTranslation } from 'react-i18next'

export function HouseholdGateSkeleton() {
  const { t } = useTranslation()

  return (
    <Box
      sx={{ p: 4 }}
      aria-busy="true"
      aria-live="polite"
      aria-label={t('createHousehold.gateLoading')}
    >
      <Skeleton variant="text" width={180} height={48} />
      <Skeleton variant="text" width={280} height={28} sx={{ mt: 1 }} />
    </Box>
  )
}
