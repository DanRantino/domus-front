import { env, isDomusApiConfigured } from '#/config/env'
import { DomusApiError } from '#/lib/domus-api/client'
import type { MeResolution } from '#/lib/domus-api/types'

import { fetchMe, provisionMe, resolveMeError } from '../data/me'

/** Single-flight guard so Strict Mode / remounts do not stack duplicate POSTs. */
let provisionInFlight: Promise<'created' | 'already_exists'> | null = null

async function provisionOnce(
  accessToken: string,
  signal?: AbortSignal,
): Promise<'created' | 'already_exists'> {
  if (!provisionInFlight) {
    provisionInFlight = provisionMe(accessToken, signal).finally(() => {
      provisionInFlight = null
    })
  }
  return provisionInFlight
}

export async function resolveCurrentUser(
  getAccessToken: (resource?: string) => Promise<string | undefined>,
  signal?: AbortSignal,
): Promise<MeResolution> {
  if (!isDomusApiConfigured()) {
    return { status: 'api_unconfigured' }
  }

  const accessToken = env.logtoApiResource
    ? await getAccessToken(env.logtoApiResource)
    : await getAccessToken()

  if (!accessToken) {
    return { status: 'unauthenticated' }
  }

  try {
    const user = await fetchMe(accessToken, signal)
    return { status: 'provisioned', user }
  } catch (error) {
    if (!(error instanceof DomusApiError) || error.status !== 403) {
      return resolveMeError(error)
    }

    // Unprovisioned: explicit POST /me (not a GET side effect), then re-resolve.
    try {
      await provisionOnce(accessToken, signal)
      const user = await fetchMe(accessToken, signal)
      return { status: 'provisioned', user }
    } catch (provisionError) {
      return resolveMeError(provisionError)
    }
  }
}
