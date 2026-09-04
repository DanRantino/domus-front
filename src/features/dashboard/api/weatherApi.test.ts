import { beforeEach, describe, expect, it, vi } from 'vitest'

import { setupStore } from '#/app/store'

import { weatherApi } from './weatherApi'

function requestUrl(input: RequestInfo | URL): URL {
  if (input instanceof URL) {
    return input
  }

  if (typeof input === 'string') {
    return new URL(input)
  }

  return new URL(input.url)
}

function openMeteoBody() {
  return {
    current: {
      time: '2026-09-04T11:00',
      temperature_2m: 22.4,
      weather_code: 0,
      wind_speed_10m: 8.1,
    },
  }
}

describe('weatherApi', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        return new Response(JSON.stringify(openMeteoBody()), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }),
    )
  })

  it('loads current weather from Open-Meteo', async () => {
    const store = setupStore()
    const result = await store.dispatch(
      weatherApi.endpoints.getCurrentWeather.initiate({
        latitude: -23.55,
        longitude: -46.63,
      }),
    )

    expect(result.data).toEqual({
      temperatureC: 22.4,
      weatherCode: 0,
      windSpeedKmh: 8.1,
      time: '2026-09-04T11:00',
    })

    const fetchMock = vi.mocked(fetch)
    expect(fetchMock).toHaveBeenCalled()
    const url = requestUrl(fetchMock.mock.calls[0]?.[0] as RequestInfo | URL)
    expect(url.origin + url.pathname).toBe('https://api.open-meteo.com/v1/forecast')
    expect(url.searchParams.get('latitude')).toBe('-23.55')
    expect(url.searchParams.get('longitude')).toBe('-46.63')
    expect(url.searchParams.get('current')).toBe('temperature_2m,weather_code,wind_speed_10m')
    expect(url.searchParams.get('timezone')).toBe('auto')
  })
})
