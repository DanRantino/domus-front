import { isNotProvisionedError } from '#/api/baseQuery'
import { useGetMeQuery } from '#/api/me'
import { useAuthSession } from '#/auth/useAuthSession'

export function useMe() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthSession()
  const query = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  })

  const isQueryLoading = isAuthenticated && (query.isUninitialized || query.isLoading)

  return {
    me: query.data,
    isAuthLoading,
    isLoading: isAuthLoading || isQueryLoading,
    isError: query.isError,
    isNotProvisioned: isNotProvisionedError(query.error),
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    refetch: query.refetch,
  }
}
