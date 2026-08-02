import type { LogtoConfig } from '@logto/react'

import { env, isLogtoConfigured } from '#/config/env'

export function getLogtoConfig(): LogtoConfig | null {
  if (!isLogtoConfigured()) {
    return null
  }

  const config: LogtoConfig = {
    endpoint: env.logtoEndpoint,
    appId: env.logtoAppId,
  }

  if (env.logtoApiResource) {
    config.resources = [env.logtoApiResource]
  }

  return config
}

export const callbackPath = '/callback'
export const postLogoutRedirectPath = '/'

export function absoluteAppUrl(path: string): string {
  if (typeof window === 'undefined') {
    return path
  }
  return new URL(path, window.location.origin).toString()
}
