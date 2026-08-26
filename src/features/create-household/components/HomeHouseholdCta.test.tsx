import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '#/i18n'
import { stubDomusApi } from '#/test/domusApi'

import { createHouseholdsWrapper } from '../test/renderWithHouseholds'
import { HomeHouseholdCta } from './HomeHouseholdCta'

const mocks = vi.hoisted(() => ({
  isAuthenticated: false,
  isLoading: false,
  config: undefined as { endpoint: string; appId: string } | undefined,
}))

vi.mock('@logto/react', () => ({
  useLogto: () => ({
    isAuthenticated: mocks.isAuthenticated,
    isLoading: mocks.isLoading,
  }),
}))

vi.mock('#/auth/logtoConfig', () => ({
  getLogtoConfig: () => mocks.config,
}))

describe('HomeHouseholdCta', () => {
  beforeEach(() => {
    sessionStorage.clear()
    mocks.isAuthenticated = false
    mocks.isLoading = false
    mocks.config = undefined
  })

  it('shows the create button when Logto is not configured', () => {
    const { wrapper } = createHouseholdsWrapper()
    render(<HomeHouseholdCta variant="header" />, { wrapper })
    expect(screen.getByRole('link', { name: 'Criar seu espaço' })).toBeInTheDocument()
  })

  it('shows the create button for guests', () => {
    mocks.config = { endpoint: 'https://auth.test', appId: 'app' }
    const { wrapper } = createHouseholdsWrapper()
    render(<HomeHouseholdCta variant="header" />, { wrapper })
    expect(screen.getByRole('link', { name: 'Criar seu espaço' })).toBeInTheDocument()
  })

  it('shows a skeleton while the list is loading', () => {
    mocks.config = { endpoint: 'https://auth.test', appId: 'app' }
    mocks.isAuthenticated = true
    stubDomusApi({ hangGet: true })
    const { wrapper } = createHouseholdsWrapper()
    render(<HomeHouseholdCta variant="header" />, { wrapper })
    expect(screen.getByLabelText('Carregando suas casas...')).toBeInTheDocument()
  })

  it('shows a retry fallback when the list fails', async () => {
    mocks.config = { endpoint: 'https://auth.test', appId: 'app' }
    mocks.isAuthenticated = true
    stubDomusApi({ failGet: true })
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
    mocks.config = { endpoint: 'https://auth.test', appId: 'app' }
    mocks.isAuthenticated = true
    stubDomusApi({ notProvisioned: true })
    const { wrapper } = createHouseholdsWrapper()
    render(<HomeHouseholdCta variant="header" />, { wrapper })

    expect(await screen.findByRole('link', { name: 'Criar seu espaço' })).toBeInTheDocument()
  })

  it('shows the switcher when the visitor has households', async () => {
    mocks.config = { endpoint: 'https://auth.test', appId: 'app' }
    mocks.isAuthenticated = true
    stubDomusApi({ houses: [{ id: 'h1', name: 'Casa Furst', role: 'admin' }] })
    const { wrapper } = createHouseholdsWrapper()
    render(<HomeHouseholdCta variant="header" />, { wrapper })
    expect(await screen.findByRole('button', { name: 'Suas casas' })).toHaveTextContent(
      'Casa Furst',
    )
  })
})
