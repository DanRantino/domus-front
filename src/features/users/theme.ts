import type { ThemePreference } from '#/lib/domus-api/types'

function systemPrefersDark(): boolean {
  if (typeof window === 'undefined') {
    return false
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function resolveColorScheme(theme: ThemePreference | undefined): 'light' | 'dark' {
  if (theme === 'dark') {
    return 'dark'
  }
  if (theme === 'light') {
    return 'light'
  }
  return systemPrefersDark() ? 'dark' : 'light'
}

export function applyColorScheme(scheme: 'light' | 'dark') {
  if (typeof document === 'undefined') {
    return
  }
  document.documentElement.classList.toggle('dark', scheme === 'dark')
}

export function applyThemePreference(theme: ThemePreference | undefined) {
  applyColorScheme(resolveColorScheme(theme))
}
