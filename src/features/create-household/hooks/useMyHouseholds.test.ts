import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { saveHouseholds } from '#/features/create-household/persistence'
import {
  configureHouseholdsApiMock,
  resetHouseholdsApiMock,
} from '#/features/create-household/api/householdsApi'

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
    resetHouseholdsApiMock()
    configureHouseholdsApiMock({ delayMs: 0 })
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
    saveHouseholds([{ id: 'h1', name: 'Casa Furst', role: 'admin' }])
    const { wrapper } = createHouseholdsWrapper()
    const { result } = renderHook(() => useMyHouseholds(), { wrapper })

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.households).toEqual([{ id: 'h1', name: 'Casa Furst', role: 'admin' }])
  })
})
