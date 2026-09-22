import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useBrowserLocation } from './useBrowserLocation'

function geoError(code: number): GeolocationPositionError {
  return {
    code,
    message: 'geolocation failed',
    PERMISSION_DENIED: 1,
    POSITION_UNAVAILABLE: 2,
    TIMEOUT: 3,
  }
}

function stubGeolocation(geolocation: Geolocation | undefined) {
  vi.stubGlobal('navigator', {
    ...window.navigator,
    geolocation,
  })
}

describe('useBrowserLocation', () => {
  it('resolves coordinates from the browser', async () => {
    stubGeolocation({
      getCurrentPosition(success) {
        success({
          coords: {
            latitude: -23.55,
            longitude: -46.63,
            accuracy: 10,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        } as GeolocationPosition)
      },
      watchPosition: vi.fn(),
      clearWatch: vi.fn(),
    })

    const { result } = renderHook(() => useBrowserLocation())
    await waitFor(() => expect(result.current.status).toBe('ready'))
    expect(result.current.coordinates).toEqual({ latitude: -23.55, longitude: -46.63 })
  })

  it('marks permission as denied', async () => {
    stubGeolocation({
      getCurrentPosition(_success, error) {
        error?.(geoError(1))
      },
      watchPosition: vi.fn(),
      clearWatch: vi.fn(),
    })

    const { result } = renderHook(() => useBrowserLocation())
    await waitFor(() => expect(result.current.status).toBe('denied'))
    expect(result.current.coordinates).toBeNull()
  })

  it('marks location as unavailable when the API is missing', async () => {
    stubGeolocation(undefined)

    const { result } = renderHook(() => useBrowserLocation())
    await waitFor(() => expect(result.current.status).toBe('unavailable'))
    expect(result.current.coordinates).toBeNull()
  })
})
