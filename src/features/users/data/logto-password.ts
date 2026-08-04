import { env } from '#/config/env'

export class LogtoAccountError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'LogtoAccountError'
    this.status = status
  }
}

function logtoApiOrigin(): string {
  return env.logtoEndpoint.replace(/\/$/, '')
}

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const json: unknown = await response.json()
    if (json && typeof json === 'object') {
      const record = json as { message?: unknown; error?: unknown }
      if (typeof record.message === 'string' && record.message.trim()) {
        return record.message
      }
      if (typeof record.error === 'string' && record.error.trim()) {
        return record.error
      }
    }
  } catch {
    // ignore non-JSON bodies
  }
  return fallback
}

/**
 * Verifies the caller's current password and returns a short-lived verification record id.
 * @see https://docs.logto.io/end-user-flows/account-settings/by-account-api
 */
export async function verifyPassword(
  accessToken: string,
  password: string,
  signal?: AbortSignal,
): Promise<{ verificationRecordId: string }> {
  const response = await fetch(`${logtoApiOrigin()}/api/verifications/password`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
    signal,
  })

  if (!response.ok) {
    const message = await readErrorMessage(
      response,
      response.status === 401
        ? 'Current password is incorrect.'
        : `Password verification failed (${response.status}).`,
    )
    throw new LogtoAccountError(response.status, message)
  }

  const json: { verificationRecordId?: unknown } = await response.json()
  if (typeof json.verificationRecordId !== 'string' || !json.verificationRecordId) {
    throw new LogtoAccountError(0, 'Password verification did not return a verification id.')
  }

  return { verificationRecordId: json.verificationRecordId }
}

/**
 * Sets a new password via Logto Account API.
 * Requires `logto-verification-id` when the user already has a password (or other security method).
 */
export async function updatePassword(
  accessToken: string,
  password: string,
  verificationRecordId: string,
  signal?: AbortSignal,
): Promise<void> {
  const url = env.logtoPasswordUrl
  if (!url) {
    throw new LogtoAccountError(0, 'VITE_LOGTO_PASSWORD_URL is not configured')
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'logto-verification-id': verificationRecordId,
    },
    body: JSON.stringify({ password }),
    signal,
  })

  if (!response.ok) {
    const message = await readErrorMessage(
      response,
      `Could not update password (${response.status}).`,
    )
    throw new LogtoAccountError(response.status, message)
  }
}
