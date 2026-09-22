import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '#/i18n'
import { setupStore } from '#/app/store'
import { JoinHouseholdPage } from '#/features/house-invitations/pages/JoinHouseholdPage'
import { stubDomusApi } from '#/test/domusApi'
import { AppThemeProvider } from '#/theme/AppThemeProvider'

const assign = vi.fn()

const pendingInvite = {
  id: 'inv-1',
  house_id: 'h1',
  email: 'guest@example.com',
  role: 'member' as const,
  status: 'pending',
  expires_at: '2026-09-04T00:00:00Z',
  created_at: '2026-08-28T00:00:00Z',
  token: 'invite-token',
}

function renderJoin(path = '/start/invite') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppThemeProvider>
        <Provider store={setupStore()}>
          <JoinHouseholdPage />
        </Provider>
      </AppThemeProvider>
    </MemoryRouter>,
  )
}

describe('JoinHouseholdPage', () => {
  beforeEach(() => {
    sessionStorage.clear()
    assign.mockReset()
    vi.stubGlobal('location', {
      assign,
      pathname: '/start/invite',
      search: '',
    })
  })

  it('previews a valid token and explains the email code', async () => {
    stubDomusApi({
      authenticated: false,
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
      invitations: [pendingInvite],
    })
    renderJoin('/start/invite?token=invite-token')

    expect(screen.getByRole('heading', { name: 'Entrar com convite' })).toBeInTheDocument()
    expect(screen.getByText(/O código é o token enviado no e-mail de convite/)).toBeInTheDocument()
    expect(await screen.findByText('Entrar na Casa Furst')).toBeInTheDocument()
  })

  it('shows an invalid token state', async () => {
    stubDomusApi({
      authenticated: false,
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
    })
    renderJoin('/start/invite?token=unknown')

    expect(await screen.findByText('Este convite não é válido ou já expirou.')).toBeInTheDocument()
  })

  it('sends a pasted code through login when unauthenticated', async () => {
    stubDomusApi({ authenticated: false })
    renderJoin()
    const user = userEvent.setup()

    await user.type(screen.getByLabelText('Código do convite'), 'pasted-token')
    await user.click(screen.getByRole('button', { name: 'Entrar para aceitar' }))

    expect(assign).toHaveBeenCalledWith(
      '/auth/login?returnUrl=%2Fstart%2Finvite%3Ftoken%3Dpasted-token',
    )
  })

  it('retries acceptance when the same token is submitted again', async () => {
    stubDomusApi({
      authenticated: true,
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
      invitations: [pendingInvite],
      failAcceptOnce: true,
    })
    renderJoin('/start/invite?token=invite-token')

    expect(await screen.findByText('Não foi possível aceitar o convite.')).toBeInTheDocument()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Entrar na casa' }))

    await waitFor(() => {
      expect(screen.queryByText('Não foi possível aceitar o convite.')).not.toBeInTheDocument()
    })
  })

  it('accepts a token after the caller is provisioned', async () => {
    stubDomusApi({
      authenticated: true,
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
      invitations: [pendingInvite],
    })
    const stubFetch = globalThis.fetch
    const fetchMock = vi.fn(stubFetch)
    vi.stubGlobal('fetch', fetchMock)

    renderJoin('/start/invite?token=invite-token')

    await waitFor(() => {
      expect(
        fetchMock.mock.calls.some((call) => {
          const requested = String(call[0])
          const method = (call[1]?.method ?? 'GET').toUpperCase()
          return requested.includes('/invitations/accept') && method === 'POST'
        }),
      ).toBe(true)
    })
  })
})
