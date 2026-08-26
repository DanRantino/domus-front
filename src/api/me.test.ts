import { describe, expect, it } from 'vitest'

import { meApi } from '#/api/me'
import { setupStore } from '#/app/store'
import { stubDomusApi } from '#/test/domusApi'

describe('getMe', () => {
  it('loads the current user envelope', async () => {
    stubDomusApi({ houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }] })
    const store = setupStore()
    const result = await store.dispatch(meApi.endpoints.getMe.initiate())

    expect(result.isSuccess).toBe(true)
    expect(result.data).toEqual({
      id: 'user-1',
      full_name: null,
      notify_daily_tasks: true,
      notify_expenses: true,
      notify_family_chat: true,
      theme: 'system',
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
    })
  })

  it('surfaces not_provisioned', async () => {
    stubDomusApi({ notProvisioned: true })
    const store = setupStore()
    const result = await store.dispatch(meApi.endpoints.getMe.initiate())
    expect(result.isError).toBe(true)
    expect(result.error).toMatchObject({
      data: { code: 'not_provisioned' },
    })
  })

  it('provisions the current user', async () => {
    stubDomusApi({ notProvisioned: true })
    const store = setupStore()
    const result = await store.dispatch(meApi.endpoints.provisionMe.initiate())

    expect('data' in result && result.data).toMatchObject({
      id: 'user-1',
      theme: 'system',
      houses: [],
    })
  })
})
