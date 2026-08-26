import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'

import { getAccessToken } from './accessToken'
import type { ApiEnvelope } from './types'

function apiBaseUrl(): string {
  const url = import.meta.env.VITE_DOMUS_API_BASE_URL
  if (!url) {
    return ''
  }

  return url.endsWith('/') ? url.slice(0, -1) : url
}

function joinUrl(base: string, path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

function isEnvelope(value: unknown): value is ApiEnvelope<unknown> {
  return typeof value === 'object' && value !== null && 'success' in value
}

export const domusBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args) => {
  const request = typeof args === 'string' ? { url: args } : args
  const method = request.method ?? 'GET'
  const headers = new Headers()
  headers.set('Accept', 'application/json')

  const token = await getAccessToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  let body: string | undefined
  if (request.body !== undefined && method.toUpperCase() !== 'GET') {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(request.body)
  }

  try {
    const response = await fetch(joinUrl(apiBaseUrl(), request.url), {
      method,
      headers,
      body,
    })

    const text = await response.text()
    let parsed: unknown
    if (text) {
      try {
        parsed = JSON.parse(text) as unknown
      } catch {
        parsed = text
      }
    }

    if (isEnvelope(parsed)) {
      if (parsed.success && response.ok) {
        return { data: parsed.data }
      }

      return {
        error: {
          status: response.status,
          data: parsed.error,
        },
      }
    }

    if (!response.ok) {
      return {
        error: {
          status: response.status,
          data: parsed,
        },
      }
    }

    return { data: parsed }
  } catch (error) {
    return {
      error: {
        status: 'FETCH_ERROR',
        error: error instanceof Error ? error.message : String(error),
      },
    }
  }
}

export function getDomusErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== 'object' || !('data' in error)) {
    return undefined
  }

  const data = error.data
  if (
    data &&
    typeof data === 'object' &&
    'code' in data &&
    typeof data.code === 'string'
  ) {
    return data.code
  }

  return undefined
}

export function isNotProvisionedError(error: unknown): boolean {
  return getDomusErrorCode(error) === 'not_provisioned'
}
