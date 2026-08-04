import type { DomusUser, PatchMeBody, PatchMeSettingsBody } from '#/lib/domus-api/types'

import { patchMe, patchMeSettings } from '../data/me'

export async function updateFullName(
  accessToken: string,
  body: PatchMeBody,
  signal?: AbortSignal,
): Promise<DomusUser> {
  return patchMe(accessToken, body, signal)
}

export async function updateUserSettings(
  accessToken: string,
  body: PatchMeSettingsBody,
  signal?: AbortSignal,
): Promise<DomusUser> {
  return patchMeSettings(accessToken, body, signal)
}
