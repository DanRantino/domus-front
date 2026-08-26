import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { householdsApi } from '#/features/create-household/api/householdsApi'
import { householdSessionReducer } from '#/features/create-household/slice/householdSessionSlice'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: () => ({}),
})

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [householdsApi.reducerPath]: householdsApi.reducer,
  householdSession: householdSessionReducer,
})

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware, householdsApi.middleware),
    preloadedState,
  })
}

export const store = setupStore()

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
