import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import '#/i18n'
import { DashboardPage } from './DashboardPage'
import { stubDomusApi } from '#/test/domusApi'
import { createHouseholdsWrapper } from '#/features/create-household/test/renderWithHouseholds'

describe('DashboardPage', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('renders the hello heading', async () => {
    stubDomusApi({ authenticated: true })
    const { wrapper } = createHouseholdsWrapper()
    render(<DashboardPage />, { wrapper })

    expect(await screen.findByRole('heading', { level: 1, name: 'Olá' })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Sua Domus está pronta.' }),
    ).not.toBeInTheDocument()
  })

  it('shows invite management for an admin of the selected house', async () => {
    stubDomusApi({
      authenticated: true,
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
    })
    const { wrapper } = createHouseholdsWrapper({
      preloadedState: { householdSession: { selectedId: 'h1', skippedCreate: false } },
    })
    render(<DashboardPage />, { wrapper })

    expect(
      await screen.findByRole('heading', { name: 'Convidar para esta casa' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })

  it('hides invite management from non-admins', async () => {
    stubDomusApi({
      authenticated: true,
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'member' }],
    })
    const { wrapper } = createHouseholdsWrapper({
      preloadedState: { householdSession: { selectedId: 'h1', skippedCreate: false } },
    })
    render(<DashboardPage />, { wrapper })

    expect(await screen.findByRole('heading', { level: 1, name: 'Olá' })).toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Convidar para esta casa' }),
    ).not.toBeInTheDocument()
  })
})
