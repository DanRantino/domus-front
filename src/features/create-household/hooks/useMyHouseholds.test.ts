import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { stubDomusApi } from '#/test/domusApi'

import { createHouseholdsWrapper } from '../test/renderWithHouseholds'
import { useMyHouseholds } from './useMyHouseholds'

const mocks = vi.hoisted(() => ({
  isAuthenticated: false,
  isLoading: false,
}))

vi.mock('@logto/react', () => ({
  useLogto: () => ({
    isAuthenticated: mocks.isAuthenticated,
    isLoading: mocks.isLoading,
  }),
}))

describe('useMyHouseholds', () => {
  beforeEach(() => {
    sessionStorage.clear()
    mocks.isAuthenticated = false
    mocks.isLoading = false
  })

  it('skips the query for guests', () => {
    const { wrapper } = createHouseholdsWrapper()
    const { result } = renderHook(() => useMyHouseholds(), { wrapper })
    expect(result.current.households).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  it('treats auth loading as loading', () => {
    mocks.isLoading = true
    const { wrapper } = createHouseholdsWrapper()
    const { result } = renderHook(() => useMyHouseholds(), { wrapper })
    expect(result.current.isLoading).toBe(true)
  })

  it('loads households when authenticated', async () => {
    mocks.isAuthenticated = true
    stubDomusApi({ houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }] })
    const { wrapper } = createHouseholdsWrapper()
    const { result } = renderHook(() => useMyHouseholds(), { wrapper })

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.households).toEqual([{ id: 'h1', name: 'Casa Furst', role: 'admin' }])
  })

  it('flags not_provisioned', async () => {
    mocks.isAuthenticated = true
    stubDomusApi({ notProvisioned: true })
    const { wrapper } = createHouseholdsWrapper()
    const { result } = renderHook(() => useMyHouseholds(), { wrapper })

    await vi.waitFor(() => {
      expect(result.current.isNotProvisioned).toBe(true)
    })
  })
})
