import { render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '#/i18n'
import { AppThemeProvider } from '#/theme/AppThemeProvider'

const mocks = vi.hoisted(() => ({
  signIn: vi.fn(),
  isAuthenticated: false,
  isLoading: false,
  config: { endpoint: 'https://auth.test', appId: 'app' } as
    | { endpoint: string; appId: string }
    | undefined,
}))

vi.mock('@logto/react', () => ({
  useLogto: () => ({
    isAuthenticated: mocks.isAuthenticated,
    isLoading: mocks.isLoading,
    signIn: mocks.signIn,
  }),
}))

vi.mock('#/auth/logtoConfig', () => ({
  getLogtoConfig: () => mocks.config,
  getSignInRedirectUri: () => 'http://localhost:3000/callback',
}))

import { ProtectedRoute } from './ProtectedRoute'

function renderProtected(child: ReactNode = <p>Private content</p>) {
  return render(
    <AppThemeProvider>
      <ProtectedRoute>{child}</ProtectedRoute>
    </AppThemeProvider>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    mocks.signIn.mockReset()
    mocks.isAuthenticated = false
    mocks.isLoading = false
    mocks.config = { endpoint: 'https://auth.test', appId: 'app' }
  })

  it('renders children when the caller is authenticated', () => {
    mocks.isAuthenticated = true
    renderProtected()

    expect(screen.getByText('Private content')).toBeInTheDocument()
    expect(mocks.signIn).not.toHaveBeenCalled()
  })

  it('starts sign-in when the caller is not authenticated', async () => {
    renderProtected()

    expect(screen.getByText('Conectando...')).toBeInTheDocument()
    await waitFor(() => {
      expect(mocks.signIn).toHaveBeenCalledWith('http://localhost:3000/callback')
    })
  })

  it('waits while the Identity Provider session is loading', () => {
    mocks.isLoading = true
    renderProtected()

    expect(screen.getByText('Conectando...')).toBeInTheDocument()
    expect(screen.queryByText('Private content')).not.toBeInTheDocument()
    expect(mocks.signIn).not.toHaveBeenCalled()
  })

  it('shows a config-missing state when Logto is not configured', () => {
    mocks.config = undefined
    renderProtected()

    expect(screen.getByText('Autenticação não configurada.')).toBeInTheDocument()
    expect(mocks.signIn).not.toHaveBeenCalled()
  })
})
