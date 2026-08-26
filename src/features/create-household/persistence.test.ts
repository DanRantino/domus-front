import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  HOUSEHOLDS_STORAGE_KEY,
  SESSION_STORAGE_KEY,
  clearHouseholdPersistence,
  defaultHouseholdSession,
  loadHouseholdSession,
  loadHouseholds,
  saveHouseholdSession,
  saveHouseholds,
} from './persistence'
import type { Household } from './types'

const sample: Household = { id: 'h1', name: 'Casa Furst', role: 'admin' }

describe('household persistence', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('returns an empty list when nothing is stored', () => {
    expect(loadHouseholds()).toEqual([])
  })

  it('round-trips households', () => {
    saveHouseholds([sample])
    expect(loadHouseholds()).toEqual([sample])
  })

  it('ignores invalid household payloads', () => {
    sessionStorage.setItem(
      HOUSEHOLDS_STORAGE_KEY,
      JSON.stringify([{ nope: true }, null, 'x', sample]),
    )
    expect(loadHouseholds()).toEqual([sample])
  })

  it('returns an empty list when stored JSON is not an array', () => {
    sessionStorage.setItem(HOUSEHOLDS_STORAGE_KEY, JSON.stringify({ id: 'h1' }))
    expect(loadHouseholds()).toEqual([])
  })

  it('returns defaults when session is missing', () => {
    expect(loadHouseholdSession()).toEqual(defaultHouseholdSession())
  })

  it('round-trips session state', () => {
    saveHouseholdSession({ selectedId: 'h1', skippedCreate: true })
    expect(loadHouseholdSession()).toEqual({ selectedId: 'h1', skippedCreate: true })
  })

  it('returns defaults when session JSON is invalid', () => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, '{not-json')
    expect(loadHouseholdSession()).toEqual(defaultHouseholdSession())
  })

  it('returns defaults when session shape is wrong', () => {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ selectedId: 1 }))
    expect(loadHouseholdSession()).toEqual(defaultHouseholdSession())
  })

  it('clears both keys', () => {
    saveHouseholds([sample])
    saveHouseholdSession({ selectedId: 'h1', skippedCreate: true })
    clearHouseholdPersistence()
    expect(sessionStorage.getItem(HOUSEHOLDS_STORAGE_KEY)).toBeNull()
    expect(sessionStorage.getItem(SESSION_STORAGE_KEY)).toBeNull()
  })

  it('swallows storage write failures', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    expect(() => saveHouseholds([sample])).not.toThrow()
    spy.mockRestore()
  })

  it('swallows storage read failures', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(loadHouseholds()).toEqual([])
    spy.mockRestore()
  })

  it('swallows clear failures', () => {
    const spy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(() => clearHouseholdPersistence()).not.toThrow()
    spy.mockRestore()
  })
})
