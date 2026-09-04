import { describe, expect, it } from 'vitest'

import { meApi } from '#/api/me'
import { setupStore } from '#/app/store'
import { stubDomusApi } from '#/test/domusApi'

describe('getMe', () => {
  it('loads the current user from GraphQL me', async () => {
    stubDomusApi({ houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }] })
    const store = setupStore()
    const result = await store.dispatch(meApi.endpoints.getMe.initiate())

    expect(result.isSuccess).toBe(true)
    expect(result.data).toEqual({
      id: 'user-1',
      name: null,
      profile: {
        theme: 'system',
        notifyDailyTasks: true,
        notifyExpenses: true,
        notifyFamilyChat: true,
      },
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
    })
  })

  it('silently provisions getMe when the caller is not provisioned', async () => {
    stubDomusApi({ notProvisioned: true })
    const store = setupStore()
    const result = await store.dispatch(meApi.endpoints.getMe.initiate())
    expect(result.isSuccess).toBe(true)
    expect(result.data).toMatchObject({
      id: 'user-1',
      profile: { theme: 'system' },
      houses: [],
    })
  })

  it('provisions the current user', async () => {
    stubDomusApi({ notProvisioned: true })
    const store = setupStore()
    const result = await store.dispatch(meApi.endpoints.provisionMe.initiate())

    expect('data' in result && result.data).toMatchObject({
      id: 'user-1',
      profile: { theme: 'system' },
      houses: [],
    })
  })
})
