import { env } from '#/config/env'

import { updatePassword, verifyPassword } from '../data/logto-password'

export type ChangePasswordInput = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export function isPasswordChangeConfigured(): boolean {
  return Boolean(env.logtoPasswordUrl && env.logtoEndpoint)
}

/**
 * Change password via Logto Account API:
 * 1) verify current password → verification record
 * 2) POST new password with `logto-verification-id`
 *
 * Uses an IdP (OP) access token — not a Domus API resource token.
 */
export async function changePassword(
  accessToken: string,
  input: ChangePasswordInput,
  signal?: AbortSignal,
): Promise<void> {
  if (!isPasswordChangeConfigured()) {
    throw new Error('Password change is not configured.')
  }

  const currentPassword = input.currentPassword
  const newPassword = input.newPassword
  const confirmPassword = input.confirmPassword

  if (!currentPassword) {
    throw new Error('Current password is required.')
  }
  if (!newPassword) {
    throw new Error('New password is required.')
  }
  if (newPassword !== confirmPassword) {
    throw new Error('New password and confirmation do not match.')
  }
  if (currentPassword === newPassword) {
    throw new Error('New password must be different from the current password.')
  }

  const { verificationRecordId } = await verifyPassword(accessToken, currentPassword, signal)
  await updatePassword(accessToken, newPassword, verificationRecordId, signal)
}
