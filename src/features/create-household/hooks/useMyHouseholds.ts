import { isNotProvisionedError } from '#/api/baseQuery'
import { useAuthSession } from '#/auth/useAuthSession'

import { useGetHousesQuery } from '../api/housesApi'

export function useMyHouseholds() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthSession()
  const query = useGetHousesQuery(undefined, {
    skip: !isAuthenticated,
  })

  const isQueryLoading = isAuthenticated && (query.isUninitialized || query.isLoading)

  return {
    households: query.data ?? [],
    isAuthLoading,
    isLoading: isAuthLoading || isQueryLoading,
    isError: query.isError,
    isNotProvisioned: isNotProvisionedError(query.error),
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  }
}
