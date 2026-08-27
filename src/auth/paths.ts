export function apiBaseUrl(): string {
  return resolveApiBaseUrl(import.meta.env.VITE_DOMUS_API_BASE_URL)
}

export function resolveApiBaseUrl(url?: string): string {
  const trimmed = url?.trim()
  if (!trimmed || /^https?:\/\//i.test(trimmed)) {
    return '/api'
  }

  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed
}

export function authLoginPath(returnUrl = '/dashboard'): string {
  return `/auth/login?returnUrl=${encodeURIComponent(sanitizeReturnUrl(returnUrl))}`
}

export function authLogoutPath(returnUrl = '/'): string {
  return `/auth/logout?returnUrl=${encodeURIComponent(sanitizeReturnUrl(returnUrl))}`
}

function sanitizeReturnUrl(returnUrl: string): string {
  if (
    !returnUrl.startsWith('/') ||
    returnUrl.startsWith('//') ||
    returnUrl.startsWith('/\\') ||
    returnUrl.includes('\\') ||
    returnUrl.includes('://')
  ) {
    return '/'
  }

  return returnUrl
}
