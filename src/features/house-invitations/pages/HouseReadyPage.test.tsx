import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import '#/i18n'
import { HouseholdGate } from '#/features/create-household/components/HouseholdGate'
import { createHouseholdsWrapper } from '#/features/create-household/test/renderWithHouseholds'
import { DashboardPage } from '#/pages/DashboardPage'
import { stubDomusApi } from '#/test/domusApi'

import { HouseReadyPage } from './HouseReadyPage'

function renderReady() {
  const { wrapper } = createHouseholdsWrapper({
    route: '/start/ready',
    preloadedState: { householdSession: { selectedId: 'h1', skippedCreate: false } },
  })

  return render(
    <Routes>
      <Route path="/start/ready" element={<HouseReadyPage />} />
      <Route
        path="/dashboard"
        element={
          <HouseholdGate>
            <DashboardPage />
          </HouseholdGate>
        }
      />
    </Routes>,
    { wrapper },
  )
}

describe('HouseReadyPage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('adds emails locally, sends invitations, and continues to the dashboard', async () => {
    stubDomusApi({
      authenticated: true,
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
    })
    renderReady()
    const user = userEvent.setup()

    expect(
      await screen.findByRole('heading', { name: 'Sua Domus está pronta.' }),
    ).toBeInTheDocument()

    await user.type(screen.getByLabelText('E-mail'), 'ana@email.com')
    await user.click(screen.getByRole('button', { name: 'Adicionar' }))
    await user.type(screen.getByLabelText('E-mail'), 'joao.silva@email.com')
    await user.click(screen.getByRole('button', { name: 'Adicionar' }))

    expect(screen.getByText('ana@email.com')).toBeInTheDocument()
    expect(screen.getByText('joao.silva@email.com')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Enviar convites e continuar' }))

    expect(await screen.findByRole('heading', { name: 'Olá' })).toBeInTheDocument()
    expect(await screen.findByText(/ana@email.com/)).toBeInTheDocument()
    expect(screen.getByText(/joao.silva@email.com/)).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Sua Domus está pronta.' }),
    ).not.toBeInTheDocument()
  })

  it('skips invitations and goes to the dashboard', async () => {
    stubDomusApi({
      authenticated: true,
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
    })
    renderReady()
    const user = userEvent.setup()

    expect(
      await screen.findByRole('heading', { name: 'Sua Domus está pronta.' }),
    ).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Fazer isso depois' }))

    expect(await screen.findByRole('heading', { name: 'Olá' })).toBeInTheDocument()
    expect(screen.getByText('Nenhum convite pendente.')).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Sua Domus está pronta.' }),
    ).not.toBeInTheDocument()
  })

  it('ignores a duplicate email and stays on send failure', async () => {
    stubDomusApi({
      authenticated: true,
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
      failInvite: true,
    })
    renderReady()
    const user = userEvent.setup()

    expect(
      await screen.findByRole('heading', { name: 'Sua Domus está pronta.' }),
    ).toBeInTheDocument()

    await user.type(screen.getByLabelText('E-mail'), 'ana@email.com')
    await user.click(screen.getByRole('button', { name: 'Adicionar' }))
    await user.type(screen.getByLabelText('E-mail'), 'Ana@email.com')
    await user.click(screen.getByRole('button', { name: 'Adicionar' }))

    expect(screen.getAllByText('ana@email.com')).toHaveLength(1)

    await user.click(screen.getByRole('button', { name: 'Enviar convites e continuar' }))

    expect(await screen.findByText('Não foi possível enviar alguns convites.')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Sua Domus está pronta.' })).toBeInTheDocument()
  })

  it('rejects an invalid email without adding it', async () => {
    stubDomusApi({
      authenticated: true,
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
    })
    renderReady()
    const user = userEvent.setup()

    expect(
      await screen.findByRole('heading', { name: 'Sua Domus está pronta.' }),
    ).toBeInTheDocument()

    await user.type(screen.getByLabelText('E-mail'), 'not-an-email')
    await user.click(screen.getByRole('button', { name: 'Adicionar' }))

    expect(await screen.findByText('Informe um e-mail válido.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Enviar convites e continuar' })).toBeDisabled()
  })

  it('sends a non-admin to the dashboard', async () => {
    stubDomusApi({
      authenticated: true,
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'member' }],
    })
    renderReady()

    expect(await screen.findByRole('heading', { name: 'Olá' })).toBeInTheDocument()
    await waitFor(() => {
      expect(
        screen.queryByRole('heading', { name: 'Sua Domus está pronta.' }),
      ).not.toBeInTheDocument()
    })
  })
})
