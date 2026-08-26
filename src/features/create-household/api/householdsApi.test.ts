import { beforeEach, describe, expect, it } from 'vitest'

import { setupStore } from '#/app/store'

import { saveHouseholds } from '../persistence'
import {
  configureHouseholdsApiMock,
  getHouseholdsApiMock,
  householdsApi,
  resetHouseholdsApiMock,
} from './householdsApi'

describe('householdsApi', () => {
  beforeEach(() => {
    sessionStorage.clear()
    resetHouseholdsApiMock()
    configureHouseholdsApiMock({ delayMs: 0 })
  })

  it('loads an empty list by default', async () => {
    const store = setupStore()
    const result = await store.dispatch(householdsApi.endpoints.getMyHouseholds.initiate())
    expect(result.data).toEqual([])
    expect(result.isSuccess).toBe(true)
  })

  it('loads persisted households', async () => {
    saveHouseholds([{ id: 'h1', name: 'Casa Furst', role: 'admin' }])
    const store = setupStore()
    const result = await store.dispatch(householdsApi.endpoints.getMyHouseholds.initiate())
    expect(result.data).toEqual([{ id: 'h1', name: 'Casa Furst', role: 'admin' }])
  })

  it('fails the next get and succeeds after retry', async () => {
    configureHouseholdsApiMock({ failNextGet: true, delayMs: 0 })
    const store = setupStore()
    const failed = await store.dispatch(householdsApi.endpoints.getMyHouseholds.initiate())
    expect(failed.isError).toBe(true)

    const retried = await store.dispatch(
      householdsApi.endpoints.getMyHouseholds.initiate(undefined, { forceRefetch: true }),
    )
    expect(retried.isSuccess).toBe(true)
    expect(retried.data).toEqual([])
  })

  it('creates a household as admin and patches the cache', async () => {
    const store = setupStore()
    await store.dispatch(householdsApi.endpoints.getMyHouseholds.initiate())
    const created = await store.dispatch(
      householdsApi.endpoints.createHousehold.initiate({ name: '  Casa Nova  ' }),
    )

    expect('data' in created && created.data?.name).toBe('Casa Nova')
    expect('data' in created && created.data?.role).toBe('admin')

    const cached = householdsApi.endpoints.getMyHouseholds.select()(store.getState())
    expect(cached.data?.map((item) => item.name)).toEqual(['Casa Nova'])
  })

  it('rejects an empty name on create', async () => {
    const store = setupStore()
    const result = await store.dispatch(
      householdsApi.endpoints.createHousehold.initiate({ name: '   ' }),
    )
    expect('error' in result).toBe(true)
  })

  it('fails the next create', async () => {
    configureHouseholdsApiMock({ failNextCreate: true, delayMs: 0 })
    const store = setupStore()
    const result = await store.dispatch(
      householdsApi.endpoints.createHousehold.initiate({ name: 'Casa Nova' }),
    )
    expect('error' in result).toBe(true)
  })

  it('waits when a mock delay is configured', async () => {
    configureHouseholdsApiMock({ delayMs: 5 })
    const store = setupStore()
    const result = await store.dispatch(householdsApi.endpoints.getMyHouseholds.initiate())
    expect(result.isSuccess).toBe(true)
  })

  it('exposes mock getters after configure', () => {
    configureHouseholdsApiMock({ delayMs: 50 })
    expect(getHouseholdsApiMock().delayMs).toBe(50)
  })
})
