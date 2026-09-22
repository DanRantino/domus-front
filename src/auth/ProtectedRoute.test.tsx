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
  vi.stubGlobal('location', {
    assign,
    pathname,
    search: '',
  })

  const router = createMemoryRouter(
    [
      {
        element: <ProtectedRoute publicPaths={['/', '/start', '/start/invite']} />,
        children: [
          { path: '/', element: <p>Public content</p> },
          { path: '/start', element: <p>Start content</p> },
          { path: '/start/invite', element: <p>Invite placeholder</p> },
          { path: '/dashboard', element: <p>Private content</p> },
          { path: '/houses/new', element: <p>Create household</p> },
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

function dispatchPersistedPageShow() {
  const event = new Event('pageshow')
  Object.defineProperty(event, 'persisted', { value: true })
  window.dispatchEvent(event)
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    assign.mockReset()
  })

  it('renders a public path without waiting for the session', () => {
    stubDomusApi({ authenticated: false })
    renderAt('/')

    expect(screen.getByText('Public content')).toBeInTheDocument()
    expect(assign).not.toHaveBeenCalled()
  })

  it('renders the start path without waiting for the session', () => {
    stubDomusApi({ authenticated: false })
    renderAt('/start')

    expect(screen.getByText('Start content')).toBeInTheDocument()
    expect(assign).not.toHaveBeenCalled()
  })

  it('renders the invite placeholder without waiting for the session', () => {
    stubDomusApi({ authenticated: false })
    renderAt('/start/invite')

    expect(screen.getByText('Invite placeholder')).toBeInTheDocument()
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
    expect(screen.queryByText('Private content')).not.toBeInTheDocument()
    await waitFor(() => {
      expect(assign).toHaveBeenCalledWith('/auth/login?returnUrl=%2Fdashboard')
    })
    expect(screen.queryByText('Private content')).not.toBeInTheDocument()
    expect(screen.getByText('Conectando...')).toBeInTheDocument()
  })

  it('does not render the create-household page without a session', async () => {
    stubDomusApi({ authenticated: false })
    renderAt('/houses/new')

    expect(screen.getByText('Conectando...')).toBeInTheDocument()
    expect(screen.queryByText('Create household')).not.toBeInTheDocument()
    await waitFor(() => {
      expect(assign).toHaveBeenCalledWith('/auth/login?returnUrl=%2Fhouses%2Fnew')
    })
    expect(screen.queryByText('Create household')).not.toBeInTheDocument()
  })

  it('waits while the Identity Provider session is loading', () => {
    vi.stubGlobal('fetch', () => new Promise(() => {}))
    renderAt('/dashboard')

    expect(screen.getByText('Conectando...')).toBeInTheDocument()
    expect(screen.queryByText('Private content')).not.toBeInTheDocument()
    expect(assign).not.toHaveBeenCalled()
  })

  it('restarts sign-in after a persisted back-forward cache restore', async () => {
    stubDomusApi({ authenticated: false })
    renderAt('/dashboard')

    await waitFor(() => {
      expect(assign).toHaveBeenCalled()
    })
    const callsBeforeRestore = assign.mock.calls.length

    dispatchPersistedPageShow()

    await waitFor(() => {
      expect(assign.mock.calls.length).toBe(callsBeforeRestore + 1)
    })
    expect(screen.queryByText('Private content')).not.toBeInTheDocument()
  })
})
