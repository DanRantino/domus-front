import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import '#/i18n'
import { stubDomusApi } from '#/test/domusApi'
import { createHouseholdsWrapper } from '#/features/create-household/test/renderWithHouseholds'

import { HouseInvitesPanel } from './HouseInvitesPanel'

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

describe('HouseInvitesPanel', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('lets an admin send an invitation and lists it', async () => {
    stubDomusApi({
      authenticated: true,
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
    })
    const { wrapper } = createHouseholdsWrapper()
    render(<HouseInvitesPanel houseId="h1" />, { wrapper })
    const user = userEvent.setup()

    expect(await screen.findByText('Nenhum convite pendente.')).toBeInTheDocument()
    await user.type(screen.getByLabelText('E-mail'), 'guest@example.com')
    await user.click(screen.getByRole('button', { name: 'Enviar convite' }))

    expect(await screen.findByText(/guest@example.com/)).toBeInTheDocument()
  })

  it('lists existing pending invitations', async () => {
    stubDomusApi({
      authenticated: true,
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
      invitations: [pendingInvite],
    })
    const { wrapper } = createHouseholdsWrapper()
    render(<HouseInvitesPanel houseId="h1" />, { wrapper })

    expect(await screen.findByText(/guest@example.com/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reenviar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Revogar' })).toBeInTheDocument()
  })
})
