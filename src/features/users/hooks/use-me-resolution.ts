import { useLogto } from '@logto/react'
import { useQuery } from '@tanstack/react-query'

import { isDomusApiConfigured } from '#/config/env'

import { resolveCurrentUser } from '../services/me'

export const meQueryKey = ['users', 'me'] as const

export function useMeResolution(enabled: boolean) {
  const { getAccessToken, isAuthenticated } = useLogto()

  return useQuery({
    queryKey: meQueryKey,
    enabled: enabled && isAuthenticated && isDomusApiConfigured(),
    queryFn: ({ signal }) => resolveCurrentUser(getAccessToken, signal),
  })
}
