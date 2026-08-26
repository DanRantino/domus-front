import { beforeEach, describe, expect, it } from 'vitest'

import { setupStore } from '#/app/store'

import { saveHouseholdSession } from '../persistence'
import {
  hydrateSession,
  resetSession,
  selectHousehold,
  skipCreate,
} from './householdSessionSlice'

describe('householdSessionSlice', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('hydrates from sessionStorage on store creation', () => {
    saveHouseholdSession({ selectedId: 'h1', skippedCreate: true })
    const store = setupStore()
    expect(store.getState().householdSession).toEqual({
      selectedId: 'h1',
      skippedCreate: true,
    })
  })

  it('selects a household and persists it', () => {
    const store = setupStore()
    store.dispatch(selectHousehold('h2'))
    expect(store.getState().householdSession.selectedId).toBe('h2')
    expect(JSON.parse(sessionStorage.getItem('domus.householdSession') ?? '{}')).toMatchObject({
      selectedId: 'h2',
    })
  })

  it('marks create as skipped', () => {
    const store = setupStore()
    store.dispatch(skipCreate())
    expect(store.getState().householdSession.skippedCreate).toBe(true)
  })

  it('hydrates an explicit session', () => {
    const store = setupStore()
    store.dispatch(hydrateSession({ selectedId: 'abc', skippedCreate: true }))
    expect(store.getState().householdSession).toEqual({
      selectedId: 'abc',
      skippedCreate: true,
    })
  })

  it('resets the session', () => {
    const store = setupStore()
    store.dispatch(selectHousehold('h2'))
    store.dispatch(skipCreate())
    store.dispatch(resetSession())
    expect(store.getState().householdSession).toEqual({
      selectedId: null,
      skippedCreate: false,
    })
  })
})
