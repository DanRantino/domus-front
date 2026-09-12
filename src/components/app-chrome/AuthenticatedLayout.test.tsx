import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import '#/i18n'
import { setupStore } from '#/app/store'
import { stubDomusApi } from '#/test/domusApi'
import { AppThemeProvider } from '#/theme/AppThemeProvider'

import { AuthenticatedLayout } from './AuthenticatedLayout'

function renderLayout(pathname: string) {
  const router = createMemoryRouter(
    [
      {
        element: <AuthenticatedLayout />,
        children: [
          { path: '/dashboard', element: <p>Dashboard body</p> },
          { path: '/log', element: <p>Log body</p> },
          { path: '/larder', element: null },
          { path: '/households', element: null },
        ],
      },
    ],
    { initialEntries: [pathname] },
  )

  return render(
    <AppThemeProvider>
      <Provider
        store={setupStore({
          householdSession: { selectedId: 'h1', skippedCreate: false },
        })}
      >
        <RouterProvider router={router} />
      </Provider>
    </AppThemeProvider>,
  )
}

describe('AuthenticatedLayout', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('renders the app navbar around authenticated pages', async () => {
    stubDomusApi({
      authenticated: true,
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
    })
    renderLayout('/dashboard')

    expect(screen.getByRole('link', { name: 'DOMUS' })).toHaveAttribute('href', '/dashboard')
    expect(screen.getByRole('link', { name: 'Santuário' })).toHaveAttribute('href', '/dashboard')
    expect(screen.getByRole('link', { name: 'Diário' })).toHaveAttribute('href', '/log')
    expect(screen.getByRole('link', { name: 'Despensa' })).toHaveAttribute('href', '/larder')
    expect(screen.getByRole('link', { name: 'Casas' })).toHaveAttribute('href', '/households')
    expect(screen.getByRole('link', { name: 'Santuário' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Notificações' })).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Suas casas' })).toHaveTextContent('Casa Furst')
    })
    expect(screen.getByText('Dashboard body')).toBeInTheDocument()
  })

  it('shows the IdP avatar photo', async () => {
    stubDomusApi({
      authenticated: true,
      picture: 'https://idp.test/photo.png',
      name: 'Marina',
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
    })
    renderLayout('/dashboard')

    await waitFor(() => {
      const account = screen.getByRole('button', { name: 'Conta' })
      expect(account.querySelector('img')).toHaveAttribute('src', 'https://idp.test/photo.png')
    })
  })

  it('falls back to an initial when the IdP session has no picture', async () => {
    stubDomusApi({
      authenticated: true,
      name: 'Marina',
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
    })
    renderLayout('/dashboard')

    await waitFor(() => {
      const account = screen.getByRole('button', { name: 'Conta' })
      expect(account).toHaveTextContent('M')
      expect(account.querySelector('img')).not.toBeInTheDocument()
    })
  })

  it('opens an account menu with a logout link', async () => {
    stubDomusApi({
      authenticated: true,
      name: 'Marina',
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
    })
    const user = userEvent.setup()
    renderLayout('/dashboard')

    await user.click(await screen.findByRole('button', { name: 'Conta' }))

    expect(screen.getByRole('menuitem', { name: 'Sair' })).toHaveAttribute(
      'href',
      '/auth/logout?returnUrl=%2F',
    )
  })

  it('marks the matching nav item as current', () => {
    stubDomusApi({ authenticated: true })
    renderLayout('/log')

    expect(screen.getByRole('link', { name: 'Diário' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Santuário' })).not.toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByText('Log body')).toBeInTheDocument()
  })
})
