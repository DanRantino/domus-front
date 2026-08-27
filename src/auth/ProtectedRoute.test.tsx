import { render, screen, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '#/i18n'
import { setupStore } from '#/app/store'
import { stubDomusApi } from '#/test/domusApi'
import { AppThemeProvider } from '#/theme/AppThemeProvider'

import { ProtectedRoute } from './ProtectedRoute'

const assign = vi.fn()

function renderAt(pathname: string) {
  const router = createMemoryRouter(
    [
      {
        element: <ProtectedRoute publicPaths={['/']} />,
        children: [
          { path: '/', element: <p>Public content</p> },
          { path: '/dashboard', element: <p>Private content</p> },
        ],
      },
    ],
    { initialEntries: [pathname] },
  )

  return render(
    <AppThemeProvider>
      <Provider store={setupStore()}>
        <RouterProvider router={router} />
      </Provider>
    </AppThemeProvider>,
  )
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    assign.mockReset()
    vi.stubGlobal('location', {
      assign,
      pathname: '/dashboard',
      search: '',
    })
  })

  it('renders a public path without waiting for the session', () => {
    stubDomusApi({ authenticated: false })
    renderAt('/')

    expect(screen.getByText('Public content')).toBeInTheDocument()
    expect(assign).not.toHaveBeenCalled()
  })

  it('renders the outlet when the caller is authenticated', async () => {
    stubDomusApi({ authenticated: true })
    renderAt('/dashboard')

    expect(await screen.findByText('Private content')).toBeInTheDocument()
    expect(assign).not.toHaveBeenCalled()
  })

  it('starts sign-in when the caller is not authenticated', async () => {
    stubDomusApi({ authenticated: false })
    renderAt('/dashboard')

    expect(screen.getByText('Conectando...')).toBeInTheDocument()
    await waitFor(() => {
      expect(assign).toHaveBeenCalledWith('/auth/login?returnUrl=%2Fdashboard')
    })
  })

  it('waits while the Identity Provider session is loading', () => {
    vi.stubGlobal('fetch', () => new Promise(() => {}))
    renderAt('/dashboard')

    expect(screen.getByText('Conectando...')).toBeInTheDocument()
    expect(screen.queryByText('Private content')).not.toBeInTheDocument()
    expect(assign).not.toHaveBeenCalled()
  })
})
