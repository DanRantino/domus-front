import type { SvgIconComponent } from '@mui/icons-material'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import MailOutline from '@mui/icons-material/MailOutline'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'

import { landing, landingCtaSx } from '#/pages/home/landing'
import { fonts } from '#/theme/tokens'

import { StartChrome } from './start/StartChrome'

const ghostCtaSx = {
  borderRadius: '4px',
  px: 2.5,
  py: 1.25,
  borderColor: landing.cream,
  color: landing.cream,
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  width: '100%',
  '&:hover': {
    borderColor: landing.cream,
    bgcolor: 'rgba(239, 235, 227, 0.08)',
  },
} as const

const filledCtaSx = {
  ...landingCtaSx,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  width: '100%',
} as const

export function StartPage() {
  const { t } = useTranslation()

  return (
    <StartChrome>
      <Stack alignItems="center" sx={{ pt: { xs: 4, md: 8 } }}>
        <Typography
          component="h1"
          sx={{
            fontFamily: fonts.headline,
            fontWeight: 500,
            fontSize: { xs: 32, md: 48 },
            lineHeight: 1.2,
            textAlign: 'center',
            mb: { xs: 5, md: 8 },
          }}
        >
          {t('start.title')}
        </Typography>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          sx={{ width: '100%', maxWidth: 880, alignItems: 'stretch' }}
        >
          <ChoiceCard
            Icon={HomeOutlined}
            iconTone="forest"
            title={t('start.create.title')}
            description={t('start.create.description')}
            action={t('start.create.cta')}
            to="/houses/new"
            variant="filled"
          />
          <ChoiceCard
            Icon={MailOutline}
            iconTone="ink"
            title={t('start.join.title')}
            description={t('start.join.description')}
            action={t('start.join.cta')}
            to="/start/invite"
            variant="ghost"
          />
        </Stack>
      </Stack>
    </StartChrome>
  )
}

type ChoiceCardProps = {
  Icon: SvgIconComponent
  iconTone: 'forest' | 'ink'
  title: string
  description: string
  action: string
  to: string
  variant: 'filled' | 'ghost'
}

function ChoiceCard({ Icon, iconTone, title, description, action, to, variant }: ChoiceCardProps) {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        bgcolor: landing.surface,
        borderRadius: 2,
        px: { xs: 3.5, md: 4.5 },
        py: { xs: 4.5, md: 5.5 },
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          mb: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 1,
          bgcolor: iconTone === 'forest' ? landing.forest : landing.canvas,
          color: landing.cream,
        }}
      >
        <Icon sx={{ fontSize: 26 }} />
      </Box>
      <Typography
        component="h2"
        sx={{
          fontFamily: fonts.body,
          fontWeight: 700,
          fontSize: 22,
          mb: 1.5,
        }}
      >
        {title}
      </Typography>
      <Typography
        sx={{
          color: landing.muted,
          fontSize: 15,
          lineHeight: 1.65,
          mb: 4,
          flex: 1,
        }}
      >
        {description}
      </Typography>
      <Button
        component={RouterLink}
        to={to}
        variant={variant === 'filled' ? 'contained' : 'outlined'}
        sx={variant === 'filled' ? filledCtaSx : ghostCtaSx}
      >
        {action}
      </Button>
    </Box>
  )
}
