import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  SESSION_STORAGE_KEY,
  clearHouseholdPersistence,
  defaultHouseholdSession,
  loadHouseholdSession,
  saveHouseholdSession,
} from './persistence'

describe('household persistence', () => {
  beforeEach(() => {
    sessionStorage.clear()
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

  it('clears the session key', () => {
    saveHouseholdSession({ selectedId: 'h1', skippedCreate: true })
    clearHouseholdPersistence()
    expect(sessionStorage.getItem(SESSION_STORAGE_KEY)).toBeNull()
  })

  it('swallows storage write failures', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('quota')
    })
    expect(() => saveHouseholdSession({ selectedId: 'h1', skippedCreate: false })).not.toThrow()
    spy.mockRestore()
  })

  it('swallows storage read failures', () => {
    const spy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    expect(loadHouseholdSession()).toEqual(defaultHouseholdSession())
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
