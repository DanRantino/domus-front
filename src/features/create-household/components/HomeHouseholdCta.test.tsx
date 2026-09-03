import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'

import '#/i18n'
import { stubDomusApi } from '#/test/domusApi'

import { createHouseholdsWrapper } from '../test/renderWithHouseholds'
import { HomeHouseholdCta } from './HomeHouseholdCta'

describe('HomeHouseholdCta', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('shows the create button for guests', async () => {
    stubDomusApi({ authenticated: false })
    const { wrapper } = createHouseholdsWrapper()
    render(<HomeHouseholdCta variant="header" />, { wrapper })
    expect(await screen.findByRole('link', { name: 'Criar seu espaço' })).toBeInTheDocument()
  })

  it('shows a skeleton while the list is loading', () => {
    stubDomusApi({ authenticated: true, hangGet: true })
    const { wrapper } = createHouseholdsWrapper()
    render(<HomeHouseholdCta variant="header" />, { wrapper })
    expect(screen.getByLabelText('Carregando suas casas...')).toBeInTheDocument()
  })

  it('shows a retry fallback when the list fails', async () => {
    stubDomusApi({ authenticated: true, failGet: true })
    const { wrapper } = createHouseholdsWrapper()
    render(<HomeHouseholdCta variant="drawer" />, { wrapper })

    expect(await screen.findByText('Não foi possível carregar suas casas.')).toBeInTheDocument()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Tentar de novo' }))
    await waitFor(() => {
      expect(screen.getByRole('link', { name: 'Criar seu espaço' })).toBeInTheDocument()
    })
  })

  it('shows the create button when the caller is not provisioned', async () => {
    stubDomusApi({ authenticated: true, notProvisioned: true })
    const { wrapper } = createHouseholdsWrapper()
    render(<HomeHouseholdCta variant="header" />, { wrapper })

    expect(await screen.findByRole('link', { name: 'Criar seu espaço' })).toBeInTheDocument()
  })

  it('shows the switcher when the visitor has households', async () => {
    stubDomusApi({
      authenticated: true,
      houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }],
    })
    const { wrapper } = createHouseholdsWrapper()
    render(<HomeHouseholdCta variant="header" />, { wrapper })
    expect(await screen.findByRole('button', { name: 'Suas casas' })).toHaveTextContent(
      'Casa Furst',
    )
  })
})
