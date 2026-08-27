import { api } from './api'

export type AuthSession = {
  authenticated: boolean
  picture: string | null
  name: string | null
}

export const sessionApi = api.injectEndpoints({
  endpoints: (build) => ({
    getAuthSession: build.query<AuthSession, void>({
      query: () => '/auth/session',
    }),
  }),
})

export const { useGetAuthSessionQuery } = sessionApi
