import { describe, expect, it } from 'vitest'

import { weatherConditionFromCode } from './weatherCondition'

describe('weatherConditionFromCode', () => {
  it('maps WMO weather codes to condition groups', () => {
    expect(weatherConditionFromCode(0)).toBe('clear')
    expect(weatherConditionFromCode(2)).toBe('cloudy')
    expect(weatherConditionFromCode(45)).toBe('fog')
    expect(weatherConditionFromCode(61)).toBe('rain')
    expect(weatherConditionFromCode(75)).toBe('snow')
    expect(weatherConditionFromCode(95)).toBe('storm')
  })
})
