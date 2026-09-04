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

function requestParts(args: string | FetchArgs): { url: string; method: string } {
  const request = typeof args === 'string' ? { url: args } : args
  return {
    url: request.url,
    method: (request.method ?? 'GET').toUpperCase(),
  }
}

function isProvisionRequest(args: string | FetchArgs): boolean {
  const { url, method } = requestParts(args)
  return method === 'POST' && (url === '/users/me' || url.endsWith('/users/me'))
}

type ProvisionResult = { ok: true } | { ok: false; error: FetchBaseQueryError }

let provisionInFlight: Promise<ProvisionResult> | null = null

async function provisionSelf(): Promise<ProvisionResult> {
  if (provisionInFlight) {
    return provisionInFlight
  }

  provisionInFlight = (async () => {
    const result = await execute({ url: '/users/me', method: 'POST' })
    if ('data' in result || result.error.status === 409) {
      return { ok: true }
    }

    return { ok: false, error: result.error }
  })()

  try {
    return await provisionInFlight
  } finally {
    provisionInFlight = null
  }
}

async function execute(
  args: string | FetchArgs,
): Promise<{ data: unknown } | { error: FetchBaseQueryError }> {
  const request = typeof args === 'string' ? { url: args } : args
  const method = request.method ?? 'GET'
  const headers = new Headers()
  headers.set('Accept', 'application/json')

  let body: string | undefined
  if (request.body !== undefined && method.toUpperCase() !== 'GET') {
    headers.set('Content-Type', 'application/json')
    body = JSON.stringify(request.body)
  }

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
}

export const domusBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
) => {
  try {
    const result = await execute(args)
    if ('error' in result && isNotProvisionedError(result.error) && !isProvisionRequest(args)) {
      const provisioned = await provisionSelf()
      if (provisioned.ok) {
        return await execute(args)
      }

      return { error: provisioned.error }
    }

    return result
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
