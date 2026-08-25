import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '#/i18n'
import { AppThemeProvider } from '#/theme/AppThemeProvider'

const mocks = vi.hoisted(() => ({
  isAuthenticated: false,
  isLoading: false,
  getIdTokenClaims: vi.fn(async () => undefined as
    | { picture?: string; name?: string; username?: string }
    | undefined),
  config: undefined as { endpoint: string; appId: string } | undefined,
}))

vi.mock('@logto/react', () => ({
  useLogto: () => ({
    isAuthenticated: mocks.isAuthenticated,
    isLoading: mocks.isLoading,
    getIdTokenClaims: mocks.getIdTokenClaims,
  }),
}))

vi.mock('#/auth/logtoConfig', () => ({
  getLogtoConfig: () => mocks.config,
}))

import { HomePage } from './HomePage'

function renderHome() {
  return render(
    <MemoryRouter>
      <AppThemeProvider>
        <HomePage />
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

describe('HomePage', () => {
  beforeEach(() => {
    mocks.isAuthenticated = false
    mocks.isLoading = false
    mocks.config = undefined
    mocks.getIdTokenClaims.mockReset()
    mocks.getIdTokenClaims.mockResolvedValue(undefined)
  })

  it('renders the Domus landing', () => {
    renderHome()

    expect(
      screen.getByRole('heading', { level: 1, name: 'A alma digital da sua casa.' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Entrar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Começar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Criar seu espaço' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Uma casa, um lugar para tudo.' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Organização compartilhada' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Sua casa continua sendo sua.' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Criar minha Domus' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'DOMUS' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Nossa visão' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Crie sua Domus' })).toBeInTheDocument()
    expect(screen.getByText('Boa tarde, família.')).toBeInTheDocument()
    expect(screen.getByText('© 2026 Domus Household. Feito para durar.')).toBeInTheDocument()
  })

  it('sends Entrar to /dashboard from the header and drawer', async () => {
    const user = userEvent.setup()
    renderHome()

    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', '/dashboard')

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))

    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', '/dashboard')
  })

  it('shows the IdP avatar instead of Entrar when the visitor has a session', async () => {
    mocks.config = { endpoint: 'https://auth.test', appId: 'app' }
    mocks.isAuthenticated = true
    mocks.getIdTokenClaims.mockResolvedValue({
      picture: 'https://idp.test/photo.png',
      name: 'Marina',
    })

    renderHome()

    const account = await screen.findByRole('link', { name: 'Ir para o dashboard' })
    expect(account).toHaveAttribute('href', '/dashboard')
    await waitFor(() => {
      expect(account.querySelector('img')).toHaveAttribute('src', 'https://idp.test/photo.png')
    })
    expect(screen.queryByRole('link', { name: 'Entrar' })).not.toBeInTheDocument()
  })

  it('falls back to an initial when the IdP session has no picture', async () => {
    mocks.config = { endpoint: 'https://auth.test', appId: 'app' }
    mocks.isAuthenticated = true
    mocks.getIdTokenClaims.mockResolvedValue({ name: 'Marina' })

    renderHome()

    const account = await screen.findByRole('link', { name: 'Ir para o dashboard' })
    expect(account).toHaveAttribute('href', '/dashboard')
    await waitFor(() => {
      expect(account).toHaveTextContent('M')
    })
    expect(account.querySelector('img')).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Entrar' })).not.toBeInTheDocument()
  })

  it('keeps Entrar while the Identity Provider session is loading', () => {
    mocks.config = { endpoint: 'https://auth.test', appId: 'app' }
    mocks.isLoading = true

    renderHome()

    expect(screen.getByRole('link', { name: 'Entrar' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Ir para o dashboard' })).not.toBeInTheDocument()
  })
})
