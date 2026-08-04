import { env, isDomusApiConfigured } from '#/config/env'

export class DomusApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'DomusApiError'
    this.status = status
  }
}

export async function domusFetch(
  path: string,
  options: {
    accessToken: string
    method?: string
    body?: unknown
    signal?: AbortSignal
  },
): Promise<Response> {
  if (!isDomusApiConfigured()) {
    throw new DomusApiError(0, 'VITE_DOMUS_API_BASE_URL is not configured')
  }

  const url = `${env.domusApiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`
  const headers: Record<string, string> = {
    Accept: 'application/json',
    Authorization: `Bearer ${options.accessToken}`,
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  return fetch(url, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    signal: options.signal,
  })
}
