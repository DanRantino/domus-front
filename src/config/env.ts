function readEnv(name: string): string {
  const value = import.meta.env[name]
  return typeof value === 'string' ? value.trim() : ''
}

export const env = {
  logtoEndpoint: readEnv('VITE_LOGTO_ENDPOINT'),
  logtoAppId: readEnv('VITE_LOGTO_APP_ID'),
  logtoApiResource: readEnv('VITE_LOGTO_API_RESOURCE'),
  domusApiBaseUrl: readEnv('VITE_DOMUS_API_BASE_URL').replace(/\/$/, ''),
}

export function isLogtoConfigured(): boolean {
  return Boolean(env.logtoEndpoint && env.logtoAppId)
}

export function isDomusApiConfigured(): boolean {
  return Boolean(env.domusApiBaseUrl)
}
