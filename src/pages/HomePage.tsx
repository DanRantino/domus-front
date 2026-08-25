import type { SvgIconComponent } from '@mui/icons-material'
import ChecklistOutlined from '@mui/icons-material/ChecklistOutlined'
import PaymentsOutlined from '@mui/icons-material/PaymentsOutlined'
import PhotoLibraryOutlined from '@mui/icons-material/PhotoLibraryOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

import { DomusLockup } from '#/components/brand/DomusMark'
import { elevation, paletteKeys } from '#/theme/tokens'

const pageGutter = { px: { xs: '20px', md: '64px' } } as const

const features: {
  titleKey: string
  bodyKey: string
  Icon: SvgIconComponent
  iconBg: string
  iconColor: string
}[] = [
  {
    titleKey: 'home.features.organization.title',
    bodyKey: 'home.features.organization.body',
    Icon: ChecklistOutlined,
    iconBg: `${paletteKeys.terracottaTint}80`,
    iconColor: paletteKeys.terracotta,
  },
  {
    titleKey: 'home.features.finances.title',
    bodyKey: 'home.features.finances.body',
    Icon: PaymentsOutlined,
    iconBg: `${paletteKeys.forestTint}80`,
    iconColor: paletteKeys.forestDeep,
  },
  {
    titleKey: 'home.features.memories.title',
    bodyKey: 'home.features.memories.body',
    Icon: PhotoLibraryOutlined,
    iconBg: `${paletteKeys.surfaceVariant}80`,
    iconColor: paletteKeys.mutedInk,
  },
]

export function HomePage() {
  const { t } = useTranslation()

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100svh' }}>
      <Box
        component="header"
        sx={{
          ...pageGutter,
          position: 'sticky',
          top: 0,
          zIndex: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          py: 2,
          bgcolor: 'background.default',
        }}
      >
        <DomusLockup size="sm" />
        <Stack direction="row" spacing={3} alignItems="center">
          <Button
            variant="text"
            color="inherit"
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              color: 'text.secondary',
              px: 2,
              py: 1,
            }}
          >
            {t('home.nav.login')}
          </Button>
          <Button variant="contained" sx={{ px: 2, py: 1 }}>
            {t('home.nav.start')}
          </Button>
        </Stack>
      </Box>

      <Box component="main">
        <Box
          component="section"
          sx={{
            ...pageGutter,
            py: { xs: 10, md: 16 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            maxWidth: 896,
            mx: 'auto',
          }}
        >
          <Typography component="h1" variant="h1" sx={{ mb: 3, color: 'text.primary' }}>
            {t('home.hero.title')}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 6, maxWidth: 672 }}>
            {t('home.hero.subtitle')}
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              px: 3,
              py: 1.5,
              transition: 'transform 150ms ease',
              '&:hover': { transform: 'translateY(-2px)' },
            }}
          >
            {t('home.hero.cta')}
          </Button>
        </Box>

        <Box
          component="section"
          sx={[
            { ...pageGutter, py: 10, bgcolor: paletteKeys.surfaceLow },
            (theme) => theme.applyStyles('dark', { bgcolor: paletteKeys.inkElevated }),
          ]}
        >
          <Box
            sx={{
              maxWidth: 1440,
              mx: 'auto',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {features.map((feature) => (
              <Box
                key={feature.titleKey}
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: '12px',
                  p: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: elevation.forest,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  transition: 'transform 300ms ease',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    bgcolor: feature.iconBg,
                    color: feature.iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                  }}
                >
                  <feature.Icon />
                </Box>
                <Typography component="h2" variant="h3">
                  {t(feature.titleKey)}
                </Typography>
                <Typography color="text.secondary">{t(feature.bodyKey)}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Box component="section" sx={{ ...pageGutter, py: 10 }}>
          <Typography component="h2" variant="h1" sx={{ textAlign: 'center', mb: 6 }}>
            {t('home.preview.title')}
          </Typography>
          <Box
            sx={{
              maxWidth: 1024,
              mx: 'auto',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: elevation.forestStrong,
              border: '1px solid',
              borderColor: 'divider',
              lineHeight: 0,
            }}
          >
            <Box
              component="img"
              src="/images/landing-calm.jpg"
              alt={t('home.preview.imageAlt')}
              sx={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Box>
        </Box>

        <Box
          component="section"
          sx={[
            {
              ...pageGutter,
              py: 10,
              bgcolor: `${paletteKeys.forestTint}33`,
              borderTop: '1px solid',
              borderColor: `${paletteKeys.forestBright}4D`,
            },
            (theme) =>
              theme.applyStyles('dark', {
                bgcolor: paletteKeys.inkMuted,
                borderColor: paletteKeys.borderDark,
              }),
          ]}
        >
          <Stack
            spacing={3}
            alignItems="center"
            sx={{ maxWidth: 768, mx: 'auto', textAlign: 'center' }}
          >
            <Typography component="h2" variant="h1">
              {t('home.cta.title')}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {t('home.cta.subtitle')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 2,
                transition: 'transform 150ms ease',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            >
              {t('home.cta.button')}
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  )
}
