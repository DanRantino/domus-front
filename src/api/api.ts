import { createApi } from '@reduxjs/toolkit/query/react'

import { domusBaseQuery } from './baseQuery'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: domusBaseQuery,
  tagTypes: ['Me', 'Houses', 'Invitations'],
  endpoints: () => ({}),
})
