import { useLogto } from '@logto/react'
import { useMutation } from '@tanstack/react-query'

import { changePassword, type ChangePasswordInput } from '../services/password'

/**
 * Password change uses the Logto OP opaque access token (no Domus API resource).
 */
export function useChangePasswordMutation() {
  const { getAccessToken } = useLogto()

  return useMutation({
    mutationFn: async (input: ChangePasswordInput) => {
      const accessToken = await getAccessToken()
      if (!accessToken) {
        throw new Error('Missing access token')
      }
      return changePassword(accessToken, input)
    },
  })
}
