import { useLogto } from '@logto/react'
import { useEffect } from 'react'

import type { ThemePreference } from '#/lib/domus-api/types'

import { useMeResolution } from './hooks/use-me-resolution'
import { applyThemePreference } from './theme'

export function ThemeSync() {
  const { isAuthenticated } = useLogto()
  const meQuery = useMeResolution(isAuthenticated)
  const theme: ThemePreference | undefined =
    meQuery.data?.status === 'provisioned' ? meQuery.data.user.settings.theme : undefined

  useEffect(() => {
    applyThemePreference(theme)

    if (theme !== undefined && theme !== 'system') {
      return
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyThemePreference(theme)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [theme])

  return null
}
