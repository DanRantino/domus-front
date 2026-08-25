import { beforeEach, describe, expect, it } from 'vitest'

import { SessionStorage, clearLogtoLocalStorage } from './logtoSession'

describe('SessionStorage', () => {
  const storage = new SessionStorage('app')

  beforeEach(() => {
    sessionStorage.clear()
    localStorage.clear()
  })

  it('persists tokens in sessionStorage rather than localStorage', async () => {
    await storage.setItem('idToken', 'id-token')
    await storage.setItem('refreshToken', 'refresh-token')
    await storage.setItem('accessToken', 'access-token')

    expect(sessionStorage.getItem('logto:app:idToken')).toBe('id-token')
    expect(sessionStorage.getItem('logto:app:refreshToken')).toBe('refresh-token')
    expect(sessionStorage.getItem('logto:app:accessToken')).toBe('access-token')
    expect(localStorage.length).toBe(0)

    await expect(storage.getItem('idToken')).resolves.toBe('id-token')
  })

  it('keeps the sign-in session in sessionStorage for the OIDC redirect', async () => {
    await storage.setItem('signInSession', '{"state":"abc"}')

    expect(sessionStorage.getItem('logto:app:signInSession')).toBe('{"state":"abc"}')
    expect(localStorage.length).toBe(0)
  })

  it('removes items from sessionStorage', async () => {
    await storage.setItem('idToken', 'id-token')
    await storage.removeItem('idToken')

    expect(sessionStorage.getItem('logto:app:idToken')).toBeNull()
  })
})

describe('clearLogtoLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('removes leftover Logto keys from localStorage', () => {
    localStorage.setItem('logto:app:idToken', 'stale-token')
    localStorage.setItem('logto:app:refreshToken', 'stale-refresh')
    localStorage.setItem('unrelated', 'keep-me')

    clearLogtoLocalStorage()

    expect(localStorage.getItem('logto:app:idToken')).toBeNull()
    expect(localStorage.getItem('logto:app:refreshToken')).toBeNull()
    expect(localStorage.getItem('unrelated')).toBe('keep-me')
  })
})
