import HomeOutlined from '@mui/icons-material/HomeOutlined'
import NotificationsNoneOutlined from '@mui/icons-material/NotificationsNoneOutlined'
import PersonOutline from '@mui/icons-material/PersonOutline'
import Avatar from '@mui/material/Avatar'
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router'

import { useAuthSession } from '#/auth/useAuthSession'
import { HouseholdSwitcher } from '#/features/create-household/components/HouseholdSwitcher'
import { useMyHouseholds } from '#/features/create-household/hooks/useMyHouseholds'
import { landing } from '#/pages/home/landing'
import { fonts, palette } from '#/theme/tokens'

const navItems = [
  { to: '/dashboard', key: 'appNav.sanctuary' },
  { to: '/log', key: 'appNav.log' },
  { to: '/larder', key: 'appNav.larder' },
  { to: '/households', key: 'appNav.households' },
] as const

const accent = palette.primary[300]

function displayInitial(name?: string): string | undefined {
  const source = name?.trim()
  if (!source) {
    return undefined
  }

  return [...source][0]?.toUpperCase()
}

export function AppNavbar() {
  const { t } = useTranslation()
  const { households } = useMyHouseholds()
  const { picture, name } = useAuthSession()
  const initial = displayInitial(name)

  return (
    <Box
      component="header"
      sx={{
        ...landing.gutter,
        display: 'grid',
        gridTemplateColumns: { xs: 'auto 1fr', md: '1fr auto 1fr' },
        alignItems: 'center',
        gap: 2,
        py: 2,
        bgcolor: landing.canvas,
      }}
    >
      <Link
        component={NavLink}
        to="/dashboard"
        underline="none"
        aria-label={t('home.brand')}
        sx={{
          justifySelf: 'start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1.25,
          color: landing.cream,
        }}
      >
        <HomeOutlined sx={{ color: accent, fontSize: 22 }} />
        <Typography
          component="span"
          sx={{
            fontFamily: fonts.headline,
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: landing.cream,
          }}
        >
          {t('appNav.brand')}
        </Typography>
      </Link>

      <Stack
        component="nav"
        direction="row"
        spacing={4}
        sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}
      >
        {navItems.map((item) => (
          <Link
            key={item.key}
            component={NavLink}
            to={item.to}
            end
            underline="none"
            sx={{
              color: landing.cream,
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              pb: 0.75,
              borderBottom: '1.5px solid transparent',
              '&.active': {
                borderBottomColor: accent,
              },
            }}
          >
            {t(item.key)}
          </Link>
        ))}
      </Stack>

      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ justifySelf: 'end' }}>
        <IconButton aria-label={t('appNav.notifications')} sx={{ color: landing.cream }}>
          <Badge
            variant="dot"
            overlap="circular"
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: palette.tertiary[400],
                width: 8,
                height: 8,
                minWidth: 8,
                top: 4,
                right: 4,
              },
            }}
          >
            <NotificationsNoneOutlined />
          </Badge>
        </IconButton>
        <HouseholdSwitcher households={households} variant="navbar" />
        <Avatar
          src={picture}
          alt={picture ? t('appNav.account') : undefined}
          aria-label={picture ? undefined : t('appNav.account')}
          sx={{
            width: 32,
            height: 32,
            border: '1px solid',
            borderColor: landing.line,
            bgcolor: landing.surface,
            color: landing.cream,
            fontSize: 14,
          }}
        >
          {initial ?? <PersonOutline sx={{ fontSize: 20 }} />}
        </Avatar>
      </Stack>
    </Box>
  )
}
