import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '#/i18n'
import { setupStore } from '#/app/store'
import { stubDomusApi } from '#/test/domusApi'
import { AppThemeProvider } from '#/theme/AppThemeProvider'

import { HomePage } from './HomePage'

function renderHome() {
  return render(
    <MemoryRouter>
      <AppThemeProvider>
        <Provider store={setupStore()}>
          <HomePage />
        </Provider>
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

describe('HomePage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('renders the Domus landing', async () => {
    stubDomusApi({ authenticated: false })
    renderHome()

    expect(screen.getByRole('heading', { level: 1, name: 'A alma digital da sua casa.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Entrar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Começar' })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: 'Criar seu espaço' })).toHaveAttribute(
      'href',
      '/houses/new',
    )
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
    stubDomusApi({ authenticated: false })
    const user = userEvent.setup()
    renderHome()

    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', '/dashboard')

    await user.click(screen.getByRole('button', { name: 'Abrir menu' }))

    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', '/dashboard')
  })

  it('shows the IdP avatar instead of Entrar when the visitor has a session', async () => {
    stubDomusApi({
      authenticated: true,
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
    expect(await screen.findByRole('link', { name: 'Criar seu espaço' })).toBeInTheDocument()
  })

  it('falls back to an initial when the IdP session has no picture', async () => {
    stubDomusApi({ authenticated: true, name: 'Marina' })

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
    vi.stubGlobal('fetch', () => new Promise(() => {}))

    renderHome()

    expect(screen.getByRole('link', { name: 'Entrar' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Ir para o dashboard' })).not.toBeInTheDocument()
  })

  it('shows a household skeleton while memberships are loading', async () => {
    stubDomusApi({ authenticated: true, hangGet: true })

    renderHome()

    await waitFor(() => {
      expect(document.querySelector('[aria-label="Carregando suas casas..."]')).not.toBeNull()
    })
  })

  it('shows a household dropdown when the visitor already has a Domus', async () => {
    stubDomusApi({
      authenticated: true,
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
    })

    renderHome()

    expect(await screen.findByRole('button', { name: 'Suas casas' })).toHaveTextContent(
      'Casa Furst',
    )
  })
})
