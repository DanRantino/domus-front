import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { setupStore } from '#/app/store'
import { stubDomusApi } from '#/test/domusApi'

import { createHouseholdsWrapper } from '../test/renderWithHouseholds'
import { useCreateHousehold } from './useCreateHousehold'

describe('useCreateHousehold', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('creates a household and selects it', async () => {
    const store = setupStore()
    const { wrapper } = createHouseholdsWrapper({ store })
    const { result } = renderHook(() => useCreateHousehold(), { wrapper })

    let createdId = ''
    await act(async () => {
      const household = await result.current.createHousehold('Casa Nova')
      createdId = household.id
    })

    expect(createdId).toBe('created-house')
    expect(store.getState().householdSession.selectedId).toBe(createdId)
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
