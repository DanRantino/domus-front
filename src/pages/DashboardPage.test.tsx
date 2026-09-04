import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { describe, expect, it, vi } from 'vitest'

import { setupStore } from '#/app/store'
import '#/i18n'
import { AppThemeProvider } from '#/theme/AppThemeProvider'
import { DashboardPage } from './DashboardPage'

function stubGeolocation(geolocation: Geolocation | undefined) {
  vi.stubGlobal('navigator', {
    ...window.navigator,
    geolocation,
  })
}

function readyGeolocation(): Geolocation {
  return {
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
  }
}

function pendingGeolocation(): Geolocation {
  return {
    getCurrentPosition() {
      // Leave the request hanging so the heading can be asserted independently.
    },
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  }
}

function stubOpenMeteo() {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      return new Response(
        JSON.stringify({
          current: {
            time: '2026-09-04T11:00',
            temperature_2m: 22.4,
            weather_code: 0,
            wind_speed_10m: 8.1,
          },
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    }),
  )
}

function renderDashboard() {
  return render(
    <AppThemeProvider>
      <Provider store={setupStore()}>
        <DashboardPage />
      </Provider>
    </AppThemeProvider>,
  )
}

describe('DashboardPage', () => {
  it('renders a welcome heading and nothing else', () => {
    stubGeolocation(pendingGeolocation())
    renderDashboard()

    expect(screen.getByRole('heading', { level: 1, name: 'Bem-vindo' })).toBeInTheDocument()
    expect(screen.queryByText('Casa Furst')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Convidar para esta casa' }),
    ).not.toBeInTheDocument()
  })

  it('shows current weather for the browser location', async () => {
    stubGeolocation(readyGeolocation())
    stubOpenMeteo()
    renderDashboard()

    expect(await screen.findByText('22 °C')).toBeInTheDocument()
    expect(screen.getByText('Céu limpo')).toBeInTheDocument()
    expect(screen.getByText('Vento 8 km/h')).toBeInTheDocument()
    await waitFor(() => {
      const fetchMock = vi.mocked(fetch)
      expect(fetchMock).toHaveBeenCalled()
    })
  })
})
