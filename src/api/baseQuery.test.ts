import { describe, expect, it, vi } from 'vitest'

import { getDomusErrorCode, isNotProvisionedError } from './baseQuery'

describe('getDomusErrorCode', () => {
  it('reads the envelope code from an RTK error', () => {
    expect(getDomusErrorCode({ status: 403, data: { code: 'not_provisioned' } })).toBe(
      'not_provisioned',
    )
  })

  it('returns undefined for unknown shapes', () => {
    expect(getDomusErrorCode(undefined)).toBeUndefined()
    expect(getDomusErrorCode({ status: 500 })).toBeUndefined()
    expect(getDomusErrorCode({ status: 400, data: 'oops' })).toBeUndefined()
  })

  it('detects not_provisioned', () => {
    expect(isNotProvisionedError({ status: 403, data: { code: 'not_provisioned' } })).toBe(true)
    expect(isNotProvisionedError({ status: 404, data: { code: 'not_found' } })).toBe(false)
  })
})

describe('domusBaseQuery', () => {
  it('silently provisions and retries on 403 not_provisioned', async () => {
    const { stubDomusApi } = await import('#/test/domusApi')
    stubDomusApi({ authenticated: true, provisionable: true })

    const { setupStore } = await import('#/app/store')
    const { housesApi } = await import('#/features/create-household/api/housesApi')
    const store = setupStore()
    const result = await store.dispatch(housesApi.endpoints.getHouses.initiate())

    expect(result.isSuccess).toBe(true)
    expect(result.data).toEqual([])
  })

  it('surfaces a provisioning failure instead of the original 403', async () => {
    const { stubDomusApi } = await import('#/test/domusApi')
    stubDomusApi({ authenticated: true, notProvisioned: true, failProvision: true })

    const { setupStore } = await import('#/app/store')
    const { housesApi } = await import('#/features/create-household/api/housesApi')
    const { getDomusErrorCode } = await import('./baseQuery')
    const store = setupStore()
    const result = await store.dispatch(housesApi.endpoints.getHouses.initiate())

    expect(result.isError).toBe(true)
    expect(getDomusErrorCode(result.error)).toBe('internal_error')
    expect(result.error && 'status' in result.error ? result.error.status : undefined).toBe(500)
  })

  it('passes through a 401 without an envelope', async () => {
    vi.stubGlobal(
      'fetch',
      async () =>
        new Response('', {
          status: 401,
        }),
    )

    const { setupStore } = await import('#/app/store')
    const { housesApi } = await import('#/features/create-household/api/housesApi')
    const store = setupStore()
    const result = await store.dispatch(housesApi.endpoints.getHouses.initiate())
    expect(result.isError).toBe(true)
  })

  it('passes through a network failure without an envelope', async () => {
    vi.stubGlobal('fetch', async () => {
      throw new TypeError('Failed to fetch')
    })

    const { setupStore } = await import('#/app/store')
    const { housesApi } = await import('#/features/create-household/api/housesApi')
    const store = setupStore()
    const result = await store.dispatch(housesApi.endpoints.getHouses.initiate())
    expect(result.isError).toBe(true)
  })
})
