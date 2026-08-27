import { describe, expect, it } from 'vitest'

import { discardLogtoBrowserTokens } from './discardLogtoBrowserTokens'

describe('discardLogtoBrowserTokens', () => {
  it('removes leftover Logto keys from localStorage and sessionStorage', () => {
    localStorage.setItem('logto:app:idToken', 'stale-token')
    sessionStorage.setItem('logto:app:refreshToken', 'stale-refresh')
    localStorage.setItem('unrelated', 'keep-me')

    discardLogtoBrowserTokens()

    expect(localStorage.getItem('logto:app:idToken')).toBeNull()
    expect(sessionStorage.getItem('logto:app:refreshToken')).toBeNull()
    expect(localStorage.getItem('unrelated')).toBe('keep-me')
  })
})
