import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'

import { landingCtaSx } from '#/pages/home/landing'

type Variant = 'header' | 'drawer'

type CreateSpaceButtonProps = {
  variant: Variant
  onNavigate?: () => void
}

export function CreateSpaceButton({ variant, onNavigate }: CreateSpaceButtonProps) {
  const { t } = useTranslation()

  return (
    <Button
      component={RouterLink}
      to="/start"
      variant="contained"
      onClick={onNavigate}
      sx={
        variant === 'header'
          ? { ...landingCtaSx, display: { xs: 'none', sm: 'inline-flex' } }
          : landingCtaSx
      }
    >
      {t('home.nav.createSpace')}
    </Button>
  )
}
