import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { apiBaseUrl } from '#/auth/paths'
import type { ApiEnvelope } from './types'

function joinUrl(base: string, path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

function isEnvelope(value: unknown): boolean {
  return typeof value === 'object' && value !== null && 'success' in value
}

export const domusBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
) => {
  const request = typeof args === 'string' ? { url: args } : args
  const method = request.method ?? 'GET'
  const headers = new Headers()
  headers.set('Accept', 'application/json')

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
      credentials: 'include',
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
      const envelope = parsed as ApiEnvelope<unknown>
      if (envelope.success && response.ok) {
        return { data: envelope.data }
      }

      return {
        error: {
          status: response.status,
          data: envelope.error,
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
  if (data && typeof data === 'object' && 'code' in data && typeof data.code === 'string') {
    return data.code
  }

  return undefined
}

export function isNotProvisionedError(error: unknown): boolean {
  return getDomusErrorCode(error) === 'not_provisioned'
}
