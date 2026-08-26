import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { stubDomusApi } from '#/test/domusApi'
import { useMe } from '#/api/useMe'

import { createHouseholdsWrapper } from '#/features/create-household/test/renderWithHouseholds'

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

describe('useMe', () => {
  beforeEach(() => {
    mocks.isAuthenticated = false
    mocks.isLoading = false
  })

  it('skips the query for guests', () => {
    const { wrapper } = createHouseholdsWrapper()
    const { result } = renderHook(() => useMe(), { wrapper })
    expect(result.current.me).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
  })

  it('loads me when authenticated', async () => {
    mocks.isAuthenticated = true
    stubDomusApi()
    const { wrapper } = createHouseholdsWrapper()
    const { result } = renderHook(() => useMe(), { wrapper })

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.me?.id).toBe('user-1')
  })
})
