import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Routes, Route } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '#/i18n'
import { skipCreate } from '#/features/create-household/slice/householdSessionSlice'
import { setupStore } from '#/app/store'
import { stubDomusApi } from '#/test/domusApi'

import { createHouseholdsWrapper } from '../test/renderWithHouseholds'
import { HouseholdGate } from './HouseholdGate'

const mocks = vi.hoisted(() => ({
  isAuthenticated: true,
  isLoading: false,
}))

vi.mock('@logto/react', () => ({
  useLogto: () => ({
    isAuthenticated: mocks.isAuthenticated,
    isLoading: mocks.isLoading,
  }),
}))

function renderGate(store = setupStore()) {
  const { wrapper } = createHouseholdsWrapper({ store, route: '/dashboard' })
  return render(
    <Routes>
      <Route
        path="/dashboard"
        element={
          <HouseholdGate>
            <p>Dashboard ok</p>
          </HouseholdGate>
        }
      />
      <Route path="/houses/new" element={<p>Create page</p>} />
    </Routes>,
    { wrapper },
  )
}

describe('HouseholdGate', () => {
  beforeEach(() => {
    sessionStorage.clear()
    mocks.isAuthenticated = true
    mocks.isLoading = false
  })

  it('shows a skeleton while loading', () => {
    stubDomusApi({ hangGet: true })
    renderGate()
    expect(screen.getByLabelText('Carregando...')).toBeInTheDocument()
    expect(screen.queryByText('Create page')).not.toBeInTheDocument()
  })

  it('shows an error fallback instead of redirecting', async () => {
    stubDomusApi({ failGet: true })
    renderGate()
    expect(await screen.findByRole('heading', { name: 'Algo deu errado' })).toBeInTheDocument()
    expect(screen.queryByText('Create page')).not.toBeInTheDocument()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Tentar de novo' }))
    expect(await screen.findByText('Create page')).toBeInTheDocument()
  })

  it('shows a not-provisioned state without retry', async () => {
    stubDomusApi({ notProvisioned: true })
    renderGate()
    expect(await screen.findByRole('heading', { name: 'Sem acesso à Domus' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Tentar de novo' })).not.toBeInTheDocument()
  })

  it('redirects to create when there are no households', async () => {
    renderGate()
    expect(await screen.findByText('Create page')).toBeInTheDocument()
  })

  it('renders children when the visitor already has a household', async () => {
    stubDomusApi({ houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }] })
    renderGate()
    expect(await screen.findByText('Dashboard ok')).toBeInTheDocument()
  })

  it('renders children when create was skipped', async () => {
    const store = setupStore()
    store.dispatch(skipCreate())
    renderGate(store)
    expect(await screen.findByText('Dashboard ok')).toBeInTheDocument()
  })
})
