import type { Household } from '#/features/create-household/types'

import { api } from './api'

export type Me = {
  id: string
  full_name: string | null
  notify_daily_tasks: boolean
  notify_expenses: boolean
  notify_family_chat: boolean
  theme: string
  houses: Household[]
}

export const meApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<Me, void>({
      query: () => '/users/me',
      providesTags: ['Me'],
    }),
  }),
})

export const { useGetMeQuery } = meApi
