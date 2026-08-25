import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import '#/i18n'
import { AppThemeProvider } from '#/theme/AppThemeProvider'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('renders the Domus landing', () => {
    render(
      <AppThemeProvider>
        <HomePage />
      </AppThemeProvider>,
    )

    expect(
      screen.getByRole('heading', { level: 1, name: 'A alma digital da sua casa.' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: 'Começar' })).toHaveLength(2)
    expect(screen.getByRole('heading', { name: 'Organização Compartilhada' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Calma. Ordem. Conexão.' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Criar minha Domus' })).toBeInTheDocument()

    const mark = document.querySelector('header svg')
    expect(mark).toBeInTheDocument()
    expect(mark).toHaveAttribute('aria-label', 'DOMUS')
    expect(mark?.querySelector('path[fill-rule="evenodd"]')).toBeInTheDocument()
  })
})
