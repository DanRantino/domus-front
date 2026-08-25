import { render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '#/i18n'
import { AuthProvider } from './AuthProvider'
import { AppThemeProvider } from '#/theme/AppThemeProvider'

const mocks = vi.hoisted(() => ({
  fetchBffSession: vi.fn(async () => null as
    | {
        authenticated: boolean
        picture: string | null
        name: string | null
        username: string | null
      }
    | null),
}))

vi.mock('#/auth/bff', async (importOriginal) => {
  const actual = await importOriginal<typeof import('#/auth/bff')>()
  return {
    ...actual,
    fetchBffSession: mocks.fetchBffSession,
  }
})

import { ProtectedRoute } from './ProtectedRoute'

function renderProtected(child: ReactNode = <p>Private content</p>) {
  return render(
    <AppThemeProvider>
      <AuthProvider>
        <ProtectedRoute>{child}</ProtectedRoute>
      </AuthProvider>
    </AppThemeProvider>,
  )
}

describe('ProtectedRoute', () => {
  const assign = vi.fn()

  beforeEach(() => {
    mocks.fetchBffSession.mockReset()
    mocks.fetchBffSession.mockResolvedValue(null)
    assign.mockReset()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { assign, pathname: '/dashboard', search: '' },
    })
  })

  it('renders children when the caller is authenticated', async () => {
    mocks.fetchBffSession.mockResolvedValue({
      authenticated: true,
      picture: null,
      name: null,
      username: null,
    })
    renderProtected()

    expect(await screen.findByText('Private content')).toBeInTheDocument()
    expect(assign).not.toHaveBeenCalled()
  })

  it('starts BFF login when the caller is not authenticated', async () => {
    renderProtected()

    expect(screen.getByText('Conectando...')).toBeInTheDocument()
    await waitFor(() => {
      expect(assign).toHaveBeenCalledWith('/bff/login?returnUrl=%2Fdashboard')
    })
  })

  it('waits while the Identity Provider session is loading', () => {
    mocks.fetchBffSession.mockImplementation(() => new Promise(() => {}))
    renderProtected()

    expect(screen.getByText('Conectando...')).toBeInTheDocument()
    expect(screen.queryByText('Private content')).not.toBeInTheDocument()
    expect(assign).not.toHaveBeenCalled()
  })
})
