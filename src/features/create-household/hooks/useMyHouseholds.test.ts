import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { stubDomusApi } from '#/test/domusApi'

import { createHouseholdsWrapper } from '../test/renderWithHouseholds'
import { useMyHouseholds } from './useMyHouseholds'

describe('useMyHouseholds', () => {
  beforeEach(() => {
    sessionStorage.clear()
    stubDomusApi({ authenticated: false })
  })

  it('skips the query for guests', async () => {
    const { wrapper } = createHouseholdsWrapper()
    const { result } = renderHook(() => useMyHouseholds(), { wrapper })
    await vi.waitFor(() => {
      expect(result.current.isAuthLoading).toBe(false)
    })
    expect(result.current.households).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  it('treats auth loading as loading', () => {
    vi.stubGlobal('fetch', () => new Promise(() => {}))
    const { wrapper } = createHouseholdsWrapper()
    const { result } = renderHook(() => useMyHouseholds(), { wrapper })
    expect(result.current.isLoading).toBe(true)
  })

  it('loads households when authenticated', async () => {
    stubDomusApi({
      authenticated: true,
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
    })
    const { wrapper } = createHouseholdsWrapper()
    const { result } = renderHook(() => useMyHouseholds(), { wrapper })

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.households).toEqual([{ id: 'h1', name: 'Casa Furst', role: 'admin' }])
  })

  it('flags not_provisioned', async () => {
    stubDomusApi({ authenticated: true, notProvisioned: true, refuseProvision: true })
    const { wrapper } = createHouseholdsWrapper()
    const { result } = renderHook(() => useMyHouseholds(), { wrapper })

    await vi.waitFor(() => {
      expect(result.current.isNotProvisioned).toBe(true)
    })
  })
})
