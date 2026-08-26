import { describe, expect, it, vi } from 'vitest'

import { getAccessToken, setAccessTokenGetter } from './accessToken'
import { getDomusErrorCode, isNotProvisionedError } from './baseQuery'

describe('accessToken', () => {
  it('returns undefined when no getter is registered', async () => {
    setAccessTokenGetter(undefined)
    await expect(getAccessToken()).resolves.toBeUndefined()
  })

  it('delegates to the registered getter', async () => {
    setAccessTokenGetter(async () => 'token-1')
    await expect(getAccessToken()).resolves.toBe('token-1')
  })
})

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
    expect(
      isNotProvisionedError({
        status: 403,
        data: { error: { code: 'not_provisioned' } },
      }),
    ).toBe(true)
    expect(isNotProvisionedError({ status: 403 })).toBe(true)
    expect(isNotProvisionedError({ status: 404, data: { code: 'not_found' } })).toBe(false)
  })
})

describe('domusBaseQuery', () => {
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
