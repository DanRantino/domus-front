import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import '#/i18n'
import { AppThemeProvider } from '#/theme/AppThemeProvider'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders the Domus home', () => {
    render(
      <AppThemeProvider>
        <HomePage />
      </AppThemeProvider>,
    )

    expect(screen.getByRole('heading', { name: 'Domus' })).toBeInTheDocument()
    expect(screen.getByText('Um lugar calmo para organizar a casa.')).toBeInTheDocument()
  })
})
