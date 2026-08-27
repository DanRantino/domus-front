import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import '#/i18n'
import { AppThemeProvider } from '#/theme/AppThemeProvider'

import { HouseholdFeedback } from './HouseholdFeedback'

describe('HouseholdFeedback', () => {
  it('renders a compact retry control', async () => {
    const onRetry = vi.fn()
    const user = userEvent.setup()
    render(
      <AppThemeProvider>
        <HouseholdFeedback compact onRetry={onRetry} />
      </AppThemeProvider>,
    )

    expect(screen.getByText('Não foi possível carregar suas casas.')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tentar de novo' }))
    expect(onRetry).toHaveBeenCalled()
  })

  it('renders a full-page fallback with custom copy', async () => {
    const onRetry = vi.fn()
    const user = userEvent.setup()
    render(
      <AppThemeProvider>
        <HouseholdFeedback title="Falha" message="Sem rede" onRetry={onRetry} />
      </AppThemeProvider>,
    )

    expect(screen.getByRole('heading', { name: 'Falha' })).toBeInTheDocument()
    expect(screen.getByText('Sem rede')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Tentar de novo' }))
    expect(onRetry).toHaveBeenCalled()
  })

  it('renders compact copy without retry', () => {
    render(
      <AppThemeProvider>
        <HouseholdFeedback compact message="Sem acesso" />
      </AppThemeProvider>,
    )

    expect(screen.getByText('Sem acesso')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Tentar de novo' })).not.toBeInTheDocument()
  })
})
