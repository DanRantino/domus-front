import PersonOutline from '@mui/icons-material/PersonOutline'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'
import { Link as RouterLink } from 'react-router'

import { useSession } from '#/auth/AuthProvider'
import { getLoginHref } from '#/auth/bff'

import { landing } from './landing'

type Variant = 'header' | 'drawer'

type HomeSessionActionsProps = {
  variant: Variant
  onNavigate?: () => void
}

type Identity = {
  picture?: string
  initial?: string
}

function displayInitial(name?: string, username?: string): string | undefined {
  const source = name?.trim() || username?.trim()
  if (!source) {
    return undefined
  }

  return [...source][0]?.toUpperCase()
}

export function HomeSessionActions({ variant, onNavigate }: HomeSessionActionsProps) {
  const { status, session } = useSession()

  if (status === 'authenticated' && session) {
    return (
      <AccountAvatar
        variant={variant}
        picture={session.picture ?? undefined}
        initial={displayInitial(session.name ?? undefined, session.username ?? undefined)}
        onNavigate={onNavigate}
      />
    )
  }

  return <GuestLogin variant={variant} onNavigate={onNavigate} />
}

function GuestLogin({ variant, onNavigate }: HomeSessionActionsProps) {
  const { t } = useTranslation()

  return (
    <Button
      component="a"
      href={getLoginHref('/dashboard')}
      variant="text"
      onClick={onNavigate}
      sx={
        variant === 'header'
          ? {
              display: { xs: 'none', sm: 'inline-flex' },
              color: landing.cream,
              px: 1.5,
              minWidth: 0,
            }
          : { color: landing.cream, justifyContent: 'flex-start', px: 0 }
      }
    >
      {t('home.nav.login')}
    </Button>
  )
}

function AccountAvatar({
  variant,
  picture,
  initial,
  onNavigate,
}: HomeSessionActionsProps & Identity) {
  const { t } = useTranslation()

  return (
    <Button
      component={RouterLink}
      to="/dashboard"
      onClick={onNavigate}
      aria-label={t('home.nav.account')}
      sx={{
        minWidth: 0,
        p: 0.25,
        borderRadius: '50%',
        color: landing.cream,
        justifyContent: variant === 'drawer' ? 'flex-start' : undefined,
      }}
    >
      <Avatar
        src={picture}
        alt=""
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
    </Button>
  )
}
