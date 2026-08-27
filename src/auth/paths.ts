export function apiBaseUrl(): string {
  const url = import.meta.env.VITE_DOMUS_API_BASE_URL
  if (!url) {
    return '/api'
  }

  return url.endsWith('/') ? url.slice(0, -1) : url
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
