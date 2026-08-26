import Skeleton from '@mui/material/Skeleton'
import { useTranslation } from 'react-i18next'

import { landing } from '#/pages/home/landing'

type Variant = 'header' | 'drawer'

type HouseholdCtaSkeletonProps = {
  variant: Variant
}

export function HouseholdCtaSkeleton({ variant }: HouseholdCtaSkeletonProps) {
  const { t } = useTranslation()

  return (
    <Skeleton
      variant="rounded"
      width={variant === 'header' ? 148 : '100%'}
      height={40}
      aria-label={t('createHousehold.loading')}
      sx={{
        bgcolor: landing.line,
        display: variant === 'header' ? { xs: 'none', sm: 'block' } : 'block',
      }}
    />
  )
}
