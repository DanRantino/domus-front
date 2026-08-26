import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { setupStore } from '#/app/store'
import {
  configureHouseholdsApiMock,
  householdsApi,
  resetHouseholdsApiMock,
} from '#/features/create-household/api/householdsApi'

import { createHouseholdsWrapper } from '../test/renderWithHouseholds'
import { useCreateHousehold } from './useCreateHousehold'

describe('useCreateHousehold', () => {
  beforeEach(() => {
    sessionStorage.clear()
    resetHouseholdsApiMock()
    configureHouseholdsApiMock({ delayMs: 0 })
  })

  it('creates a household and selects it', async () => {
    const store = setupStore()
    await store.dispatch(householdsApi.endpoints.getMyHouseholds.initiate())
    const { wrapper } = createHouseholdsWrapper({ store })
    const { result } = renderHook(() => useCreateHousehold(), { wrapper })

    let createdId = ''
    await act(async () => {
      const household = await result.current.createHousehold('Casa Nova')
      createdId = household.id
    })

    expect(createdId).not.toBe('')
    expect(store.getState().householdSession.selectedId).toBe(createdId)
  })

  it('surfaces a create error', async () => {
    configureHouseholdsApiMock({ failNextCreate: true, delayMs: 0 })
    const store = setupStore()
    const { wrapper } = createHouseholdsWrapper({ store })
    const { result } = renderHook(() => useCreateHousehold(), { wrapper })

    await act(async () => {
      await expect(result.current.createHousehold('Casa Nova')).rejects.toBeTruthy()
    })
  })
})
