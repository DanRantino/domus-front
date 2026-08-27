import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import '#/i18n'
import { AppThemeProvider } from '#/theme/AppThemeProvider'
import { DashboardPage } from './DashboardPage'

describe('DashboardPage', () => {
  it('renders the hello placeholder', () => {
    render(
      <AppThemeProvider>
        <DashboardPage />
      </AppThemeProvider>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Olá' })).toBeInTheDocument()
  })
})
