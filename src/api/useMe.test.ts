import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { stubDomusApi } from '#/test/domusApi'
import { useMe } from '#/api/useMe'

import { createHouseholdsWrapper } from '#/features/create-household/test/renderWithHouseholds'

describe('useMe', () => {
  beforeEach(() => {
    stubDomusApi({ authenticated: false })
  })

  it('skips the query for guests', async () => {
    const { wrapper } = createHouseholdsWrapper()
    const { result } = renderHook(() => useMe(), { wrapper })
    await vi.waitFor(() => {
      expect(result.current.isAuthLoading).toBe(false)
    })
    expect(result.current.me).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
  })

  it('loads me when authenticated', async () => {
    stubDomusApi({ authenticated: true })
    const { wrapper } = createHouseholdsWrapper()
    const { result } = renderHook(() => useMe(), { wrapper })

    await vi.waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })
    expect(result.current.me?.id).toBe('user-1')
  })
})
