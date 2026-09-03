import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { api } from '#/api/api'
import '#/api/me'
import '#/features/create-household/api/housesApi'
import '#/features/house-invitations/api/invitationsApi'
import { householdSessionReducer } from '#/features/create-household/slice/householdSessionSlice'

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  householdSession: householdSessionReducer,
})

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
    preloadedState,
  })
}

export const store = setupStore()

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
