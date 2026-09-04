import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it, vi } from 'vitest'

import '#/i18n'
import { AppThemeProvider } from '#/theme/AppThemeProvider'

import { CreateSpaceButton } from './CreateSpaceButton'

describe('CreateSpaceButton', () => {
  it('links to the create page from the header', () => {
    render(
      <MemoryRouter>
        <AppThemeProvider>
          <CreateSpaceButton variant="header" />
        </AppThemeProvider>
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Criar seu espaço' })).toHaveAttribute('href', '/start')
  })

  it('notifies the drawer when clicked', async () => {
    const onNavigate = vi.fn()
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <AppThemeProvider>
          <CreateSpaceButton variant="drawer" onNavigate={onNavigate} />
        </AppThemeProvider>
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('link', { name: 'Criar seu espaço' }))
    expect(onNavigate).toHaveBeenCalled()
  })
})
