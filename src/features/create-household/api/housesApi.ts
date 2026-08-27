import { api } from '#/api/api'

import type { Household } from '../types'

export const housesApi = api.injectEndpoints({
  endpoints: (build) => ({
    getHouses: build.query<Household[], void>({
      query: () => '/houses',
      providesTags: ['Houses'],
    }),
    getHouse: build.query<Household, string>({
      query: (id) => `/houses/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Houses', id }],
    }),
    createHouse: build.mutation<Household, { name: string }>({
      query: (body) => ({
        url: '/houses',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Houses', 'Me'],
    }),
  }),
})

export const {
  useGetHousesQuery,
  useGetHouseQuery,
  useCreateHouseMutation,
} = housesApi
