import { useGetAuthSessionQuery } from '#/api/session'

export function useAuthSession() {
  const query = useGetAuthSessionQuery()
  const session = query.data
  const isAuthenticated = session?.authenticated === true

  return {
    isAuthenticated,
    isLoading: query.isUninitialized || query.isLoading,
    picture: session?.picture ?? undefined,
    name: session?.name ?? undefined,
    isError: query.isError,
  }
}
