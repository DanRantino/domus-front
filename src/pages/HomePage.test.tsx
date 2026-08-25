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
    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Começar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Criar seu espaço' })).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Uma casa, um lugar para tudo.' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Organização compartilhada' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Sua casa continua sendo sua.' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Criar minha Domus' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'DOMUS' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Nossa visão' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Crie sua Domus' })).toBeInTheDocument()
    expect(screen.getByText('Boa tarde, família.')).toBeInTheDocument()
    expect(screen.getByText('© 2026 Domus Household. Feito para durar.')).toBeInTheDocument()
  })
})
