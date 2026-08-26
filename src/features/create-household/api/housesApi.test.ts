import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setAccessTokenGetter } from '#/api/accessToken'
import { api } from '#/api/api'
import { setupStore } from '#/app/store'
import { housesApi } from '#/features/create-household/api/housesApi'
import { stubDomusApi } from '#/test/domusApi'

describe('housesApi', () => {
  beforeEach(() => {
    setAccessTokenGetter(async () => 'test-token')
  })

  it('loads an empty list by default', async () => {
    const store = setupStore()
    const result = await store.dispatch(housesApi.endpoints.getHouses.initiate())
    expect(result.data).toEqual([])
    expect(result.isSuccess).toBe(true)
  })

  it('loads houses from the API', async () => {
    stubDomusApi({ houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }] })
    const store = setupStore()
    const result = await store.dispatch(housesApi.endpoints.getHouses.initiate())
    expect(result.data).toEqual([{ id: 'h1', name: 'Casa Furst', role: 'admin' }])
  })

  it('sends a Bearer token', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers =
        input instanceof Request ? input.headers : new Headers(init?.headers)
      expect(headers.get('Authorization')).toBe('Bearer test-token')
      return new Response(JSON.stringify({ success: true, data: [], error: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    })
    vi.stubGlobal('fetch', fetchMock)

    const store = setupStore()
    await store.dispatch(housesApi.endpoints.getHouses.initiate())
    expect(fetchMock).toHaveBeenCalled()
  })

  it('unwraps a 403 not_provisioned envelope', async () => {
    stubDomusApi({ notProvisioned: true })
    const store = setupStore()
    const result = await store.dispatch(housesApi.endpoints.getHouses.initiate())
    expect(result.isError).toBe(true)
    expect(result.error).toMatchObject({
      data: { code: 'not_provisioned' },
    })
  })

  it('gets a house by id', async () => {
    stubDomusApi({ houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }] })
    const store = setupStore()
    const result = await store.dispatch(housesApi.endpoints.getHouse.initiate('h1'))
    expect(result.data).toEqual({ id: 'h1', name: 'Casa Furst', role: 'admin' })
  })

  it('returns not_found for an unknown house', async () => {
    const store = setupStore()
    const result = await store.dispatch(housesApi.endpoints.getHouse.initiate('missing'))
    expect(result.isError).toBe(true)
    expect(result.error).toMatchObject({
      data: { code: 'not_found' },
    })
  })

  it('creates a house as admin and invalidates the list', async () => {
    const store = setupStore()
    await store.dispatch(housesApi.endpoints.getHouses.initiate())
    const created = await store.dispatch(
      housesApi.endpoints.createHouse.initiate({ name: 'Casa Nova' }),
    )

    expect('data' in created && created.data).toEqual({
      id: 'created-house',
      name: 'Casa Nova',
      role: 'admin',
    })

    await store.dispatch(api.util.invalidateTags(['Houses']))
    const listed = await store.dispatch(
      housesApi.endpoints.getHouses.initiate(undefined, { forceRefetch: true }),
    )
    expect(listed.data?.map((item) => item.name)).toEqual(['Casa Nova'])
  })

  it('rejects an empty name on create', async () => {
    const store = setupStore()
    const result = await store.dispatch(
      housesApi.endpoints.createHouse.initiate({ name: '   ' }),
    )
    expect('error' in result).toBe(true)
  })
})
