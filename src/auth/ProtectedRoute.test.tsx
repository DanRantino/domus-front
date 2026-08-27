import { render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '#/i18n'
import { setupStore } from '#/app/store'
import { stubDomusApi } from '#/test/domusApi'
import { AppThemeProvider } from '#/theme/AppThemeProvider'

import { ProtectedRoute } from './ProtectedRoute'

const assign = vi.fn()

function renderProtected(child: ReactNode = <p>Private content</p>) {
  return render(
    <AppThemeProvider>
      <Provider store={setupStore()}>
        <ProtectedRoute>{child}</ProtectedRoute>
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

  it('renders children when the caller is authenticated', async () => {
    stubDomusApi({ authenticated: true })
    renderProtected()

    expect(await screen.findByText('Private content')).toBeInTheDocument()
    expect(assign).not.toHaveBeenCalled()
  })

  it('starts sign-in when the caller is not authenticated', async () => {
    stubDomusApi({ authenticated: false })
    renderProtected()

    expect(screen.getByText('Conectando...')).toBeInTheDocument()
    await waitFor(() => {
      expect(assign).toHaveBeenCalledWith('/auth/login?returnUrl=%2Fdashboard')
    })
  })

  it('waits while the Identity Provider session is loading', () => {
    vi.stubGlobal('fetch', () => new Promise(() => {}))
    renderProtected()

    expect(screen.getByText('Conectando...')).toBeInTheDocument()
    expect(screen.queryByText('Private content')).not.toBeInTheDocument()
    expect(assign).not.toHaveBeenCalled()
  })
})
