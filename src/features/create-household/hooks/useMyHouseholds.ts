import { useLogto } from '@logto/react'

import { useGetMyHouseholdsQuery } from '../api/householdsApi'

export function useMyHouseholds() {
  const { isAuthenticated, isLoading: isAuthLoading } = useLogto()
  const query = useGetMyHouseholdsQuery(undefined, {
    skip: !isAuthenticated,
  })

  const isQueryLoading = isAuthenticated && (query.isUninitialized || query.isLoading)

  return {
    households: query.data ?? [],
    isAuthLoading,
    isLoading: isAuthLoading || isQueryLoading,
    isError: query.isError,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  }
}
