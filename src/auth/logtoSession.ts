import {
  BaseClient,
  createRequester,
  generateCodeChallenge,
  generateCodeVerifier,
  generateState,
} from '@logto/browser'
import type { LogtoConfig, Storage } from '@logto/browser'

type LogtoStorageKey = 'idToken' | 'refreshToken' | 'accessToken' | 'signInSession'

const keyPrefix = 'logto'

/** Tab-scoped storage so tokens are not persisted in localStorage across browser sessions. */

export class SessionStorage implements Storage<LogtoStorageKey> {
  private readonly appId: string

  constructor(appId: string) {
    this.appId = appId
  }

  getKey(item?: string) {
    if (item === undefined) {
      return `${keyPrefix}:${this.appId}`
    }

    return `${keyPrefix}:${this.appId}:${item}`
  }

  async getItem(key: LogtoStorageKey) {
    if (typeof window === 'undefined') {
      return null
    }

    return sessionStorage.getItem(this.getKey(key))
  }

  async setItem(key: LogtoStorageKey, value: string) {
    if (typeof window === 'undefined') {
      return
    }

    sessionStorage.setItem(this.getKey(key), value)
  }

  async removeItem(key: LogtoStorageKey) {
    if (typeof window === 'undefined') {
      return
    }

    sessionStorage.removeItem(this.getKey(key))
  }
}

export function clearLogtoLocalStorage() {
  if (typeof window === 'undefined') {
    return
  }

  const keysToRemove: string[] = []

  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index)
    if (key?.startsWith(`${keyPrefix}:`)) {
      keysToRemove.push(key)
    }
  }

  for (const key of keysToRemove) {
    localStorage.removeItem(key)
  }
}

const navigate = (url: string) => {
  window.location.assign(url)
}

export class SessionLogtoClient extends BaseClient {
  constructor(config: LogtoConfig, unstable_enableCache = false) {
    void unstable_enableCache
    super(config, {
      requester: createRequester(fetch),
      navigate,
      storage: new SessionStorage(config.appId),
      generateCodeChallenge,
      generateCodeVerifier,
      generateState,
    })
  }
}
