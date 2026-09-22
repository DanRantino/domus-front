import { useEffect, useState } from 'react'

import type { Coordinates } from '../types'

export type BrowserLocationStatus = 'loading' | 'ready' | 'denied' | 'unavailable'

export type BrowserLocationState =
  | { status: 'loading'; coordinates: null }
  | { status: 'ready'; coordinates: Coordinates }
  | { status: 'denied'; coordinates: null }
  | { status: 'unavailable'; coordinates: null }

const PERMISSION_DENIED = 1

export function useBrowserLocation(): BrowserLocationState {
  const [state, setState] = useState<BrowserLocationState>(() =>
    navigator.geolocation
      ? { status: 'loading', coordinates: null }
      : { status: 'unavailable', coordinates: null },
  )

  useEffect(() => {
    if (!navigator.geolocation) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          status: 'ready',
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
        })
      },
      (error) => {
        if (error.code === PERMISSION_DENIED) {
          setState({ status: 'denied', coordinates: null })
          return
        }

        setState({ status: 'unavailable', coordinates: null })
      },
    )
  }, [])

  return state
}
