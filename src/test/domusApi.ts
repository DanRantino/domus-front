import { vi } from 'vitest'

import type { Household } from '#/features/create-household/types'
import type { HouseInvitation } from '#/features/house-invitations/types'

type StubInvitation = HouseInvitation & { token?: string }

type StubDomusApiOptions = {
  houses?: Household[]
  invitations?: StubInvitation[]
  hangGet?: boolean
  failGet?: boolean
  failCreate?: boolean
  failInvite?: boolean
  inviteEmailFailed?: boolean
  failAcceptOnce?: boolean
  notProvisioned?: boolean
  provisionAlreadyExists?: boolean
  provisionable?: boolean
  failProvision?: boolean
  refuseProvision?: boolean
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

function requestBody(input: RequestInfo | URL, init?: RequestInit): Promise<string> {
  if (input instanceof Request) {
    return input.text()
  }

  return Promise.resolve(typeof init?.body === 'string' ? init.body : '')
}

export function stubDomusApi(options: StubDomusApiOptions = {}): void {
  const houses = [...(options.houses ?? [])]
  const invitations: StubInvitation[] = [...(options.invitations ?? [])]
  const authenticated = options.authenticated ?? false
  let failGet = options.failGet ?? false
  let failCreate = options.failCreate ?? false
  const failInvite = options.failInvite ?? false
  const inviteEmailFailed = options.inviteEmailFailed ?? false
  let failAcceptOnce = options.failAcceptOnce ?? false
  let blocked = Boolean(options.notProvisioned || options.provisionable)

  function meBody() {
    return {
      id: 'user-1',
      name: null,
      profile: {
        theme: 'system',
        notifyDailyTasks: true,
        notifyExpenses: true,
        notifyFamilyChat: true,
      },
      houses,
    }
  }

  function restMeBody() {
    return {
      id: 'user-1',
      full_name: null,
      notify_daily_tasks: true,
      notify_expenses: true,
      notify_family_chat: true,
      theme: 'system',
      houses,
    }
  }

  vi.stubGlobal('fetch', async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
    const parsed = new URL(url, 'http://localhost')
    const path = apiPath(parsed.pathname)
    const method = (input instanceof Request ? input.method : (init?.method ?? 'GET')).toUpperCase()

    if (method === 'GET' && path === '/auth/session') {
      return jsonResponse(200, {
        authenticated,
        picture: options.picture ?? null,
        name: options.name ?? null,
      })
    }

    if (method === 'GET' && path === '/invitations/preview') {
      const token = parsed.searchParams.get('token') ?? ''
      const invitation = invitations.find(
        (item) => item.token === token && item.status === 'pending',
      )
      const house = invitation ? houses.find((item) => item.id === invitation.house_id) : undefined
      if (!invitation || !house) {
        return failEnvelope(404, 'not_found', 'Invitation not found')
      }

      return okEnvelope({ house_name: house.name })
    }

    if (options.hangGet && method === 'GET' && path === '/houses') {
      return new Promise(() => {})
    }

    if (method === 'POST' && path === '/users/me') {
      if (options.failProvision) {
        return failEnvelope(500, 'internal_error', 'Failed to provision')
      }

      if (options.refuseProvision) {
        return failEnvelope(403, 'not_provisioned', 'User is not provisioned')
      }

      if (options.provisionAlreadyExists) {
        blocked = false
        return failEnvelope(409, 'already_exists', 'User already exists')
      }

      if (!blocked) {
        return failEnvelope(409, 'already_exists', 'User already exists')
      }

      blocked = false
      return okEnvelope(restMeBody(), 201)
    }

    if (method === 'POST' && path === '/graphql') {
      if (options.hangGet) {
        return new Promise(() => {})
      }

      if (blocked) {
        return jsonResponse(200, {
          data: { me: null },
          errors: [
            {
              message: 'User is not provisioned',
              extensions: { code: 'not_provisioned' },
            },
          ],
        })
      }

      if (failGet) {
        failGet = false
        return jsonResponse(200, {
          errors: [{ message: 'Failed to load', extensions: { code: 'internal_error' } }],
        })
      }

      return jsonResponse(200, { data: { me: meBody() } })
    }

    if (blocked) {
      return failEnvelope(403, 'not_provisioned', 'User is not provisioned')
    }

    if (method === 'POST' && path === '/invitations/accept') {
      if (failAcceptOnce) {
        failAcceptOnce = false
        return failEnvelope(500, 'internal_error', 'Failed to accept')
      }

      const rawBody = await requestBody(input, init)
      const body = rawBody ? (JSON.parse(rawBody) as { token?: string }) : {}
      const invitation = invitations.find(
        (item) => item.token === body.token && item.status === 'pending',
      )
      const house = invitation ? houses.find((item) => item.id === invitation.house_id) : undefined
      if (!invitation || !house) {
        return failEnvelope(404, 'not_found', 'Invitation not found')
      }

      invitation.status = 'accepted'
      if (!houses.some((item) => item.id === house.id)) {
        houses.push({ id: house.id, name: house.name, role: invitation.role })
      }

      return okEnvelope({
        house_id: house.id,
        house_name: house.name,
        role: invitation.role,
      })
    }

    const invitationMatch = path.match(
      /^\/houses\/([^/]+)\/invitations(?:\/([^/]+))?(?:\/resend)?$/,
    )
    if (invitationMatch) {
      const houseId = invitationMatch[1] ?? ''
      const invitationId = invitationMatch[2]
      const isResend = path.endsWith('/resend')

      if (method === 'GET' && !invitationId) {
        return okEnvelope(
          invitations.filter((item) => item.house_id === houseId && item.status === 'pending'),
        )
      }

      if (method === 'POST' && !invitationId) {
        if (failInvite) {
          return failEnvelope(500, 'internal_error', 'Failed to invite')
        }

        const rawBody = await requestBody(input, init)
        const body = rawBody ? (JSON.parse(rawBody) as { email?: string; role?: string }) : {}
        const email = body.email?.trim().toLowerCase() ?? ''
        if (!email.includes('@')) {
          return failEnvelope(400, 'validation_error', 'Email is required')
        }

        const invitation: StubInvitation = {
          id: `invite-${invitations.length + 1}`,
          house_id: houseId,
          email,
          role: body.role === 'admin' ? 'admin' : 'member',
          status: 'pending',
          expires_at: '2026-09-04T00:00:00Z',
          created_at: '2026-08-28T00:00:00Z',
          token: 'new-token',
          email_sent: !inviteEmailFailed,
        }
        invitations.push(invitation)
        return okEnvelope(invitation, 201)
      }

      const invitation = invitations.find(
        (item) => item.id === invitationId && item.house_id === houseId,
      )
      if (!invitation) {
        return failEnvelope(404, 'not_found', 'Invitation not found')
      }

      if (method === 'DELETE') {
        invitation.status = 'revoked'
        return okEnvelope(invitation)
      }

      if (method === 'POST' && isResend) {
        invitation.token = 'rotated-token'
        return okEnvelope({ ...invitation, token: invitation.token, email_sent: true })
      }
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

      const rawBody = await requestBody(input, init)
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
      return okEnvelope(restMeBody())
    }

    return failEnvelope(404, 'not_found', 'not found')
  })
}
