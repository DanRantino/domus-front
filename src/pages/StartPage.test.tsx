import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Provider } from 'react-redux'
import { beforeEach, describe, expect, it } from 'vitest'

import '#/i18n'
import { setupStore } from '#/app/store'
import { stubDomusApi } from '#/test/domusApi'
import { AppThemeProvider } from '#/theme/AppThemeProvider'

import { StartPage } from './StartPage'

function renderStart() {
  return render(
    <MemoryRouter>
      <AppThemeProvider>
        <Provider store={setupStore()}>
          <StartPage />
        </Provider>
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

describe('StartPage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('offers create and invite choices to guests', () => {
    stubDomusApi({ authenticated: false })
    renderStart()

    expect(
      screen.getByRole('heading', { level: 1, name: 'Como você quer começar?' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Criar minha Domus' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Entrar em uma Domus' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Começar' })).toHaveAttribute('href', '/houses/new')
    expect(screen.getByRole('link', { name: 'Usar convite' })).toHaveAttribute(
      'href',
      '/start/invite',
    )
    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute('href', '/dashboard')
    expect(screen.getByRole('link', { name: 'DOMUS' })).toHaveAttribute('href', '/')
  })

  it('shows the account avatar instead of Login when the visitor has a session', async () => {
    stubDomusApi({
      authenticated: true,
      picture: 'https://idp.test/photo.png',
      name: 'Marina',
    })
    renderStart()

    const account = await screen.findByRole('link', { name: 'Ir para o dashboard' })
    expect(account).toHaveAttribute('href', '/dashboard')
    await waitFor(() => {
      expect(account.querySelector('img')).toHaveAttribute('src', 'https://idp.test/photo.png')
    })
    expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument()
  })
})
