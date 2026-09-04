import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes } from 'react-router'
import { beforeEach, describe, expect, it } from 'vitest'

import '#/i18n'
import { stubDomusApi } from '#/test/domusApi'
import { DashboardPage } from '#/pages/DashboardPage'

import { HouseReadyPage } from '#/features/house-invitations/pages/HouseReadyPage'

import { HouseholdGate } from '../components/HouseholdGate'
import { createHouseholdsWrapper } from '../test/renderWithHouseholds'
import { CreateHouseholdPage } from '../pages/CreateHouseholdPage'

describe('CreateHouseholdPage', () => {
  beforeEach(() => {
    sessionStorage.clear()
    stubDomusApi({ authenticated: true })
  })

  it('shows a skeleton while loading', () => {
    stubDomusApi({ authenticated: true, hangGet: true })
    const { wrapper } = createHouseholdsWrapper()
    render(<CreateHouseholdPage />, { wrapper })
    expect(screen.getByLabelText('Carregando suas casas...')).toBeInTheDocument()
  })

  it('shows an error fallback and retries', async () => {
    stubDomusApi({ authenticated: true, failGet: true })
    const { wrapper } = createHouseholdsWrapper()
    render(<CreateHouseholdPage />, { wrapper })

    expect(await screen.findByRole('heading', { name: 'Algo deu errado' })).toBeInTheDocument()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Tentar de novo' }))
    expect(
      await screen.findByRole('heading', { name: 'Como chamamos sua Domus?' }),
    ).toBeInTheDocument()
  })

  it('creates a household after provisioning when the caller is not provisioned', async () => {
    stubDomusApi({ authenticated: true, notProvisioned: true })
    const { wrapper, store } = createHouseholdsWrapper()
    render(<CreateHouseholdPage />, { wrapper })

    expect(
      await screen.findByRole('heading', { name: 'Como chamamos sua Domus?' }),
    ).toBeInTheDocument()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Nome da Domus'), 'Casa Furst')
    await user.click(screen.getByRole('button', { name: 'Criar minha Domus →' }))

    await waitFor(() => {
      expect(store.getState().householdSession.selectedId).toBe('created-house')
    })
  })

  it('creates a household and goes to the ready invite step', async () => {
    const { wrapper, store } = createHouseholdsWrapper({ route: '/houses/new' })
    render(
      <Routes>
        <Route path="/houses/new" element={<CreateHouseholdPage />} />
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

    expect(
      await screen.findByRole('heading', { name: 'Como chamamos sua Domus?' }),
    ).toBeInTheDocument()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Nome da Domus'), 'Casa Furst')
    await user.click(screen.getByRole('button', { name: 'Criar minha Domus →' }))

    await waitFor(() => {
      expect(store.getState().householdSession.selectedId).toBe('created-house')
    })
    expect(
      await screen.findByRole('heading', { name: 'Sua Domus está pronta.' }),
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Olá' })).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Como chamamos sua Domus?' }),
    ).not.toBeInTheDocument()
  })

  it('skips creation without showing the ready invite step', async () => {
    stubDomusApi({ authenticated: true })
    const { wrapper, store } = createHouseholdsWrapper({ route: '/houses/new' })
    render(
      <Routes>
        <Route path="/houses/new" element={<CreateHouseholdPage />} />
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

    expect(
      await screen.findByRole('heading', { name: 'Como chamamos sua Domus?' }),
    ).toBeInTheDocument()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Decidir mais tarde' }))
    expect(store.getState().householdSession.skippedCreate).toBe(true)
    expect(await screen.findByRole('heading', { name: 'Olá' })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Sua Domus está pronta.' }),
    ).not.toBeInTheDocument()
  })

  it('shows a mutation error', async () => {
    stubDomusApi({ authenticated: true, failCreate: true })
    const { wrapper } = createHouseholdsWrapper()
    render(<CreateHouseholdPage />, { wrapper })

    expect(
      await screen.findByRole('heading', { name: 'Como chamamos sua Domus?' }),
    ).toBeInTheDocument()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Nome da Domus'), 'Casa Furst')
    await user.click(screen.getByRole('button', { name: 'Criar minha Domus →' }))
    expect(await screen.findByText('Não foi possível criar sua Domus.')).toBeInTheDocument()
  })

  it('keeps the back link to the start page', async () => {
    const { wrapper } = createHouseholdsWrapper()
    render(<CreateHouseholdPage />, { wrapper })
    expect(await screen.findByRole('link', { name: 'Voltar' })).toHaveAttribute('href', '/start')
  })
})
