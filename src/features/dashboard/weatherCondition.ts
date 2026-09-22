import type { WeatherCondition } from './types'

export function weatherConditionFromCode(code: number): WeatherCondition {
  if (code === 0) {
    return 'clear'
  }

  if (code === 1 || code === 2 || code === 3) {
    return 'cloudy'
  }

  if (code === 45 || code === 48) {
    return 'fog'
  }

  if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
    return 'snow'
  }

  if (code >= 95 && code <= 99) {
    return 'storm'
  }

  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return 'rain'
  }

  return 'cloudy'
}
