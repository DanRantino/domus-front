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
    provisionMe: build.mutation<Me, void>({
      query: () => ({
        url: '/users/me',
        method: 'POST',
      }),
      invalidatesTags: ['Me'],
    }),
  }),
})

export const { useGetMeQuery, useProvisionMeMutation } = meApi
