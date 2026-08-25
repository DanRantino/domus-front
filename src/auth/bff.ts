export type BffSession = {
  authenticated: boolean
  picture: string | null
  name: string | null
  username: string | null
}

export function getLoginHref(returnUrl = '/dashboard') {
  return `/bff/login?returnUrl=${encodeURIComponent(returnUrl)}`
}

export async function fetchBffSession(): Promise<BffSession | null> {
  try {
    const response = await fetch('/bff/session', { credentials: 'same-origin' })
    if (!response.ok) {
      return null
    }

    return (await response.json()) as BffSession
  } catch {
    return null
  }
}
