import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { setupStore } from '#/app/store'

import { createHouseholdsWrapper } from '../test/renderWithHouseholds'
import { useHouseholdSession } from './useHouseholdSession'

describe('useHouseholdSession', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('selects a household and skips create', () => {
    const store = setupStore()
    const { wrapper } = createHouseholdsWrapper({ store })
    const { result } = renderHook(() => useHouseholdSession(), { wrapper })

    act(() => {
      result.current.selectHousehold('h1')
    })
    expect(result.current.selectedId).toBe('h1')

    act(() => {
      result.current.skipCreate()
    })
    expect(result.current.skippedCreate).toBe(true)
  })
})
