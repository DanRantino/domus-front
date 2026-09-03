import { vi } from 'vitest'

import type { Household } from '#/features/create-household/types'

type StubDomusApiOptions = {
  houses?: Household[]
  hangGet?: boolean
  failGet?: boolean
  failCreate?: boolean
  notProvisioned?: boolean
  provisionAlreadyExists?: boolean
  authenticated?: boolean
  picture?: string | null
  name?: string | null
}

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

function okEnvelope(data: unknown, status = 200): Response {
  return jsonResponse(status, { success: true, data, error: null })
}

function failEnvelope(status: number, code: string, message: string): Response {
  return jsonResponse(status, {
    success: false,
    data: null,
    error: { code, message },
  })
}

function apiPath(pathname: string): string {
  return pathname.startsWith('/api/') ? pathname.slice('/api'.length) : pathname
}

export function stubDomusApi(options: StubDomusApiOptions = {}): void {
  const houses = [...(options.houses ?? [])]
  const authenticated = options.authenticated ?? false
  let failGet = options.failGet ?? false
  let failCreate = options.failCreate ?? false
  let notProvisioned = options.notProvisioned ?? false

  vi.stubGlobal('fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const { pathname } = new URL(url, 'http://localhost')
    const path = apiPath(pathname)
    const method = (input instanceof Request ? input.method : (init?.method ?? 'GET')).toUpperCase()

    if (method === 'GET' && path === '/auth/session') {
      return jsonResponse(200, {
        authenticated,
        picture: options.picture ?? null,
        name: options.name ?? null,
      })
    }

    if (options.hangGet && method === 'GET' && path === '/houses') {
      return new Promise(() => {})
    }

    if (method === 'POST' && (path === '/users/me' || pathname === '/users/me')) {
      if (options.provisionAlreadyExists) {
        notProvisioned = false
        return failEnvelope(409, 'already_exists', 'User already exists')
      }

      if (!notProvisioned) {
        return failEnvelope(409, 'already_exists', 'User already exists')
      }

      notProvisioned = false
      return okEnvelope(
        {
          id: 'user-1',
          full_name: null,
          notify_daily_tasks: true,
          notify_expenses: true,
          notify_family_chat: true,
          theme: 'system',
          houses,
        },
        201,
      )
    }

    if (notProvisioned) {
      return failEnvelope(403, 'not_provisioned', 'User is not provisioned')
    }

    if (method === 'GET' && path === '/houses') {
      if (failGet) {
        failGet = false
        return failEnvelope(500, 'internal_error', 'Failed to load households')
      }

      return okEnvelope(houses)
    }

    if (method === 'GET' && path.startsWith('/houses/')) {
      const id = path.slice('/houses/'.length)
      const house = houses.find((item) => item.id === id)
      if (!house) {
        return failEnvelope(404, 'not_found', 'House not found')
      }

      return okEnvelope(house)
    }

    if (method === 'POST' && path === '/houses') {
      if (failCreate) {
        failCreate = false
        return failEnvelope(500, 'internal_error', 'Failed to create household')
      }

      const rawBody =
        input instanceof Request
          ? await input.text()
          : typeof init?.body === 'string'
            ? init.body
            : ''
      const body = rawBody ? (JSON.parse(rawBody) as { name?: string }) : {}
      const name = body.name?.trim() ?? ''
      if (!name) {
        return failEnvelope(400, 'validation_error', 'Name is required')
      }

      const house: Household = { id: 'created-house', name, role: 'admin' }
      houses.push(house)
      return okEnvelope(house, 201)
    }

    if (method === 'GET' && path === '/users/me') {
      return okEnvelope({
        id: 'user-1',
        full_name: null,
        notify_daily_tasks: true,
        notify_expenses: true,
        notify_family_chat: true,
        theme: 'system',
        houses,
      })
    }

    return failEnvelope(404, 'not_found', 'not found')
  })
}
