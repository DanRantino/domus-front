type AccessTokenGetter = () => Promise<string | undefined>

let getter: AccessTokenGetter | undefined

export function setAccessTokenGetter(next: AccessTokenGetter | undefined): void {
  getter = next
}

export async function getAccessToken(): Promise<string | undefined> {
  return getter?.()
}
