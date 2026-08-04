import { DomusApiError, domusFetch } from './client'
import {
  domusUserSchema,
  type DomusUser,
  type MeResolution,
  type PatchMeBody,
  type PatchMeSettingsBody,
} from './types'

async function parseCurrentUser(response: Response): Promise<DomusUser> {
  const json: { data?: unknown } = await response.json()
  return domusUserSchema.parse(json?.data)
}

export async function fetchMe(accessToken: string, signal?: AbortSignal): Promise<DomusUser> {
  const response = await domusFetch('/users/me', { accessToken, signal })

  if (response.status === 401) {
    throw new DomusApiError(401, 'Unauthenticated')
  }

  if (response.status === 403) {
    throw new DomusApiError(403, 'User not provisioned')
  }

  if (!response.ok) {
    throw new DomusApiError(response.status, `GET /me failed with status ${response.status}`)
  }

  return parseCurrentUser(response)
}

/**
 * Self-serve provision. Does not mutate on GET — callers must invoke this explicitly.
 * 201 = created; 409 = already provisioned (treated as success by orchestrators).
 */
export async function provisionMe(
  accessToken: string,
  signal?: AbortSignal,
): Promise<'created' | 'already_exists'> {
  const response = await domusFetch('/users/me', {
    accessToken,
    method: 'POST',
    signal,
  })

  if (response.status === 401) {
    throw new DomusApiError(401, 'Unauthenticated')
  }

  if (response.status === 201) {
    return 'created'
  }

  if (response.status === 409) {
    return 'already_exists'
  }

  throw new DomusApiError(response.status, `POST /me failed with status ${response.status}`)
}

export async function patchMe(
  accessToken: string,
  body: PatchMeBody,
  signal?: AbortSignal,
): Promise<DomusUser> {
  const response = await domusFetch('/users/me', {
    accessToken,
    method: 'PATCH',
    body,
    signal,
  })

  if (response.status === 401) {
    throw new DomusApiError(401, 'Unauthenticated')
  }

  if (response.status === 403) {
    throw new DomusApiError(403, 'User not provisioned')
  }

  if (!response.ok) {
    throw new DomusApiError(response.status, `PATCH /me failed with status ${response.status}`)
  }

  return parseCurrentUser(response)
}

export async function patchMeSettings(
  accessToken: string,
  body: PatchMeSettingsBody,
  signal?: AbortSignal,
): Promise<DomusUser> {
  const response = await domusFetch('/users/me/settings', {
    accessToken,
    method: 'PATCH',
    body,
    signal,
  })

  if (response.status === 401) {
    throw new DomusApiError(401, 'Unauthenticated')
  }

  if (response.status === 403) {
    throw new DomusApiError(403, 'User not provisioned')
  }

  if (response.status === 400) {
    throw new DomusApiError(400, 'Validation error')
  }

  if (!response.ok) {
    throw new DomusApiError(
      response.status,
      `PATCH /me/settings failed with status ${response.status}`,
    )
  }

  return parseCurrentUser(response)
}

export function resolveMeError(error: unknown): MeResolution {
  if (error instanceof DomusApiError) {
    if (error.status === 401) {
      return { status: 'unauthenticated' }
    }
    if (error.status === 403) {
      return { status: 'not_provisioned' }
    }
    return { status: 'error', message: error.message }
  }

  if (error instanceof Error) {
    return { status: 'error', message: error.message }
  }

  return { status: 'error', message: 'Unknown error while resolving Domus User' }
}
