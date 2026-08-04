import { useLogto } from '@logto/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { env } from '#/config/env'
import type { DomusUser, PatchMeBody, PatchMeSettingsBody } from '#/lib/domus-api/types'

import { updateFullName, updateUserSettings } from '../services/settings'
import { applyThemePreference } from '../theme'
import { meQueryKey } from './use-me-resolution'

async function getDomusAccessToken(
  getAccessToken: (resource?: string) => Promise<string | undefined>,
): Promise<string> {
  const accessToken = env.logtoApiResource
    ? await getAccessToken(env.logtoApiResource)
    : await getAccessToken()

  if (!accessToken) {
    throw new Error('Missing access token')
  }

  return accessToken
}

function setProvisionedUser(queryClient: ReturnType<typeof useQueryClient>, user: DomusUser) {
  queryClient.setQueryData(meQueryKey, { status: 'provisioned' as const, user })
}

export function usePatchMeMutation() {
  const { getAccessToken } = useLogto()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: PatchMeBody) => {
      const token = await getDomusAccessToken(getAccessToken)
      return updateFullName(token, body)
    },
    onSuccess: (user) => {
      setProvisionedUser(queryClient, user)
    },
  })
}

export function usePatchMeSettingsMutation() {
  const { getAccessToken } = useLogto()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: PatchMeSettingsBody) => {
      const token = await getDomusAccessToken(getAccessToken)
      return updateUserSettings(token, body)
    },
    onSuccess: (user) => {
      setProvisionedUser(queryClient, user)
      applyThemePreference(user.settings.theme)
    },
  })
}
