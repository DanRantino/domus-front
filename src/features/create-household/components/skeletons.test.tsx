import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import '#/i18n'
import { AppThemeProvider } from '#/theme/AppThemeProvider'

import { HouseholdCtaSkeleton } from './HouseholdCtaSkeleton'
import { CreateHouseholdPageSkeleton } from './CreateHouseholdPageSkeleton'
import { HouseholdGateSkeleton } from './HouseholdGateSkeleton'

describe('skeletons', () => {
  it('renders the header CTA skeleton', () => {
    render(
      <AppThemeProvider>
        <HouseholdCtaSkeleton variant="header" />
      </AppThemeProvider>,
    )
    expect(screen.getByLabelText('Carregando suas casas...')).toBeInTheDocument()
  })

  it('renders the drawer CTA skeleton', () => {
    render(
      <AppThemeProvider>
        <HouseholdCtaSkeleton variant="drawer" />
      </AppThemeProvider>,
    )
    expect(screen.getByLabelText('Carregando suas casas...')).toBeInTheDocument()
  })

  it('renders the create page skeleton with a back link', () => {
    render(
      <MemoryRouter>
        <AppThemeProvider>
          <CreateHouseholdPageSkeleton />
        </AppThemeProvider>
      </MemoryRouter>,
    )
    expect(screen.getByLabelText('Carregando suas casas...')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Voltar' })).toHaveAttribute('href', '/')
  })

  it('renders the dashboard gate skeleton', () => {
    render(
      <AppThemeProvider>
        <HouseholdGateSkeleton />
      </AppThemeProvider>,
    )
    expect(screen.getByLabelText('Carregando...')).toBeInTheDocument()
  })
})
