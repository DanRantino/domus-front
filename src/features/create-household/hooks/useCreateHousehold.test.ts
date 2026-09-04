import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { setupStore } from '#/app/store'
import { stubDomusApi } from '#/test/domusApi'

import { housesApi } from '../api/housesApi'
import { createHouseholdsWrapper } from '../test/renderWithHouseholds'
import { useCreateHousehold } from './useCreateHousehold'

describe('useCreateHousehold', () => {
  beforeEach(() => {
    sessionStorage.clear()
    stubDomusApi({ authenticated: true })
  })

  it('creates a household, selects it, and writes it into the houses cache', async () => {
    const store = setupStore()
    const listed = store.dispatch(housesApi.endpoints.getHouses.initiate())
    await listed

    stubDomusApi({ authenticated: true, hangGet: true })

    const { wrapper } = createHouseholdsWrapper({ store })
    const { result } = renderHook(() => useCreateHousehold(), { wrapper })

    let createdId = ''
    await act(async () => {
      const household = await result.current.createHousehold('Casa Nova')
      createdId = household.id
    })

    expect(createdId).toBe('created-house')
    expect(store.getState().householdSession.selectedId).toBe(createdId)
    expect(housesApi.endpoints.getHouses.select(undefined)(store.getState()).data).toEqual([
      { id: 'created-house', name: 'Casa Nova', role: 'admin' },
    ])
    listed.unsubscribe()
  })

  it('surfaces a create error', async () => {
    stubDomusApi({ failCreate: true })
    const store = setupStore()
    const { wrapper } = createHouseholdsWrapper({ store })
    const { result } = renderHook(() => useCreateHousehold(), { wrapper })

    await act(async () => {
      await expect(result.current.createHousehold('Casa Nova')).rejects.toBeTruthy()
    })
  })
})
