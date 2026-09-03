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
    expect(result.current.isError).toBe(true)
  })

  it('continues house creation when provisioning returns already_exists', async () => {
    stubDomusApi({ notProvisioned: true, provisionAlreadyExists: true })
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
    expect(result.current.isError).toBe(false)
  })

  it('provisions then creates when the caller is not provisioned', async () => {
    stubDomusApi({ notProvisioned: true })
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
    expect(result.current.isError).toBe(false)
  })
})
