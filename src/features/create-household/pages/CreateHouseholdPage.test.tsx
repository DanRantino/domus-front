import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '#/i18n'
import {
  configureHouseholdsApiMock,
  resetHouseholdsApiMock,
} from '#/features/create-household/api/householdsApi'
import { loadHouseholds } from '#/features/create-household/persistence'

import { createHouseholdsWrapper } from '../test/renderWithHouseholds'
import { CreateHouseholdPage } from '../pages/CreateHouseholdPage'

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

describe('CreateHouseholdPage', () => {
  beforeEach(() => {
    sessionStorage.clear()
    resetHouseholdsApiMock()
    configureHouseholdsApiMock({ delayMs: 0 })
    mocks.isAuthenticated = true
    mocks.isLoading = false
  })

  it('shows a skeleton while loading', () => {
    configureHouseholdsApiMock({ delayMs: 10_000 })
    const { wrapper } = createHouseholdsWrapper()
    render(<CreateHouseholdPage />, { wrapper })
    expect(screen.getByLabelText('Carregando suas casas...')).toBeInTheDocument()
  })

  it('shows an error fallback and retries', async () => {
    configureHouseholdsApiMock({ failNextGet: true, delayMs: 0 })
    const { wrapper } = createHouseholdsWrapper()
    render(<CreateHouseholdPage />, { wrapper })

    expect(await screen.findByRole('heading', { name: 'Algo deu errado' })).toBeInTheDocument()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Tentar de novo' }))
    expect(await screen.findByRole('heading', { name: 'Como chamamos sua Domus?' })).toBeInTheDocument()
  })

  it('creates a household and persists it', async () => {
    const { wrapper } = createHouseholdsWrapper()
    render(<CreateHouseholdPage />, { wrapper })

    expect(await screen.findByRole('heading', { name: 'Como chamamos sua Domus?' })).toBeInTheDocument()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Nome da Domus'), 'Casa Furst')
    await user.click(screen.getByRole('button', { name: 'Criar minha Domus →' }))

    await waitFor(() => {
      expect(loadHouseholds().map((item) => item.name)).toEqual(['Casa Furst'])
    })
  })

  it('skips creation', async () => {
    const { wrapper, store } = createHouseholdsWrapper()
    render(<CreateHouseholdPage />, { wrapper })

    expect(await screen.findByRole('heading', { name: 'Como chamamos sua Domus?' })).toBeInTheDocument()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Decidir mais tarde' }))
    expect(store.getState().householdSession.skippedCreate).toBe(true)
  })

  it('shows a mutation error', async () => {
    configureHouseholdsApiMock({ failNextCreate: true, delayMs: 0 })
    const { wrapper } = createHouseholdsWrapper()
    render(<CreateHouseholdPage />, { wrapper })

    expect(await screen.findByRole('heading', { name: 'Como chamamos sua Domus?' })).toBeInTheDocument()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Nome da Domus'), 'Casa Furst')
    await user.click(screen.getByRole('button', { name: 'Criar minha Domus →' }))
    expect(await screen.findByText('Não foi possível criar sua Domus.')).toBeInTheDocument()
  })

  it('keeps the back link to the landing', async () => {
    const { wrapper } = createHouseholdsWrapper()
    render(<CreateHouseholdPage />, { wrapper })
    expect(await screen.findByRole('link', { name: 'Voltar' })).toHaveAttribute('href', '/')
  })
})
