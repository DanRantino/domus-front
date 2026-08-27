import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import '#/i18n'
import { stubDomusApi } from '#/test/domusApi'

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
    expect(await screen.findByRole('heading', { name: 'Como chamamos sua Domus?' })).toBeInTheDocument()
  })

  it('shows a not-provisioned state', async () => {
    stubDomusApi({ authenticated: true, notProvisioned: true })
    const { wrapper } = createHouseholdsWrapper()
    render(<CreateHouseholdPage />, { wrapper })

    expect(await screen.findByRole('heading', { name: 'Sem acesso à Domus' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Tentar de novo' })).not.toBeInTheDocument()
  })

  it('creates a household and selects it', async () => {
    const { wrapper, store } = createHouseholdsWrapper()
    render(<CreateHouseholdPage />, { wrapper })

    expect(await screen.findByRole('heading', { name: 'Como chamamos sua Domus?' })).toBeInTheDocument()
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Nome da Domus'), 'Casa Furst')
    await user.click(screen.getByRole('button', { name: 'Criar minha Domus →' }))

    await waitFor(() => {
      expect(store.getState().householdSession.selectedId).toBe('created-house')
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
    stubDomusApi({ authenticated: true, failCreate: true })
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
