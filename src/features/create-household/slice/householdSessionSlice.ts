import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { defaultHouseholdSession, loadHouseholdSession, saveHouseholdSession } from '../persistence'
import type { HouseholdSessionState } from '../types'

function persist(state: HouseholdSessionState): void {
  saveHouseholdSession({
    selectedId: state.selectedId,
    skippedCreate: state.skippedCreate,
  })
}

export const householdSessionSlice = createSlice({
  name: 'householdSession',
  initialState: (): HouseholdSessionState => loadHouseholdSession(),
  reducers: {
    selectHousehold(state, action: PayloadAction<string>) {
      state.selectedId = action.payload
      persist(state)
    },
    skipCreate(state) {
      state.skippedCreate = true
      persist(state)
    },
    hydrateSession(_state, action: PayloadAction<HouseholdSessionState>) {
      persist(action.payload)
      return action.payload
    },
    resetSession() {
      const next = defaultHouseholdSession()
      persist(next)
      return next
    },
  },
})

export const { selectHousehold, skipCreate, hydrateSession, resetSession } =
  householdSessionSlice.actions

export const householdSessionReducer = householdSessionSlice.reducer
