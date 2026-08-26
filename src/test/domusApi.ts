import { vi } from 'vitest'

import type { Household } from '#/features/create-household/types'

type StubDomusApiOptions = {
  houses?: Household[]
  hangGet?: boolean
  failGet?: boolean
  failCreate?: boolean
  notProvisioned?: boolean
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

export function stubDomusApi(options: StubDomusApiOptions = {}): void {
  const houses = [...(options.houses ?? [])]
  let failGet = options.failGet ?? false
  let failCreate = options.failCreate ?? false

  if (options.hangGet) {
    vi.stubGlobal('fetch', () => new Promise(() => {}))
    return
  }

  vi.stubGlobal('fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : input.url
    const { pathname } = new URL(url, 'http://localhost')
    const method = (
      input instanceof Request ? input.method : (init?.method ?? 'GET')
    ).toUpperCase()

    if (options.notProvisioned) {
      return failEnvelope(403, 'not_provisioned', 'User is not provisioned')
    }

    if (method === 'GET' && pathname === '/houses') {
      if (failGet) {
        failGet = false
        return failEnvelope(500, 'internal_error', 'Failed to load households')
      }

      return okEnvelope(houses)
    }

    if (method === 'GET' && pathname.startsWith('/houses/')) {
      const id = pathname.slice('/houses/'.length)
      const house = houses.find((item) => item.id === id)
      if (!house) {
        return failEnvelope(404, 'not_found', 'House not found')
      }

      return okEnvelope(house)
    }

    if (method === 'POST' && pathname === '/houses') {
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

    if (method === 'GET' && pathname === '/users/me') {
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
