import { describe, expect, it } from 'vitest'

import { resolveApiBaseUrl } from './paths'

describe('resolveApiBaseUrl', () => {
  it('uses same-origin /api by default', () => {
    expect(resolveApiBaseUrl()).toBe('/api')
    expect(resolveApiBaseUrl('')).toBe('/api')
  })

  it('keeps a relative API prefix', () => {
    expect(resolveApiBaseUrl('/api')).toBe('/api')
    expect(resolveApiBaseUrl('/api/')).toBe('/api')
  })

  it('ignores an absolute API host so the session cookie stays first-party', () => {
    expect(resolveApiBaseUrl('https://api.domus.dev')).toBe('/api')
    expect(resolveApiBaseUrl('http://127.0.0.1:5000/')).toBe('/api')
  })
})
