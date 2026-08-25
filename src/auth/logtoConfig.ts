import type { LogtoConfig } from '@logto/react'

export function getLogtoConfig(): LogtoConfig | undefined {
  const endpoint = import.meta.env.VITE_LOGTO_ENDPOINT
  const appId = import.meta.env.VITE_LOGTO_APP_ID

  if (!endpoint || !appId) {
    return undefined
  }

  const resource = import.meta.env.VITE_LOGTO_API_RESOURCE

  return {
    endpoint,
    appId,
    resources: resource ? [resource] : undefined,
  }
}

export function getSignInRedirectUri(): string {
  return `${window.location.origin}/callback`
}
