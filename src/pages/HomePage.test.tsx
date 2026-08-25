import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '#/i18n'
import { AuthProvider } from '#/auth/AuthProvider'
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

import { HomePage } from './HomePage'

function renderHome() {
  return render(
    <MemoryRouter>
      <AppThemeProvider>
        <AuthProvider>
          <HomePage />
        </AuthProvider>
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

describe('HomePage', () => {
  beforeEach(() => {
    mocks.fetchBffSession.mockReset()
    mocks.fetchBffSession.mockResolvedValue(null)
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

  it('sends Entrar to the BFF login from the header and drawer', async () => {
    const user = userEvent.setup()
    renderHome()

    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute(
      'href',
      '/bff/login?returnUrl=%2Fdashboard',
    )

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))

    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute(
      'href',
      '/bff/login?returnUrl=%2Fdashboard',
    )
  })

  it('shows the IdP avatar instead of Entrar when the visitor has a session', async () => {
    mocks.fetchBffSession.mockResolvedValue({
      authenticated: true,
      picture: 'https://idp.test/photo.png',
      name: 'Marina',
      username: null,
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
    mocks.fetchBffSession.mockResolvedValue({
      authenticated: true,
      picture: null,
      name: 'Marina',
      username: null,
    })

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
    mocks.fetchBffSession.mockImplementation(() => new Promise(() => {}))

    renderHome()

    expect(screen.getByRole('link', { name: 'Entrar' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Ir para o dashboard' })).not.toBeInTheDocument()
  })
})
