import { describe, expect, it } from 'vitest'

import { getLoginHref } from './bff'

describe('getLoginHref', () => {
  it('encodes a local return path for the BFF login', () => {
    expect(getLoginHref('/dashboard')).toBe('/bff/login?returnUrl=%2Fdashboard')
  })
})
