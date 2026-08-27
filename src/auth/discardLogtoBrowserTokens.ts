const LOGTO_KEY_PREFIX = 'logto:'

export function discardLogtoBrowserTokens(): void {
  removeLogtoKeys(window.localStorage)
  removeLogtoKeys(window.sessionStorage)
}

function removeLogtoKeys(storage: Storage): void {
  const keys: string[] = []
  for (let index = 0; index < storage.length; index += 1) {
    const key = storage.key(index)
    if (key?.startsWith(LOGTO_KEY_PREFIX)) {
      keys.push(key)
    }
  }

  for (const key of keys) {
    storage.removeItem(key)
  }
}
