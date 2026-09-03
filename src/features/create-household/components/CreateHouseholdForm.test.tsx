import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import '#/i18n'
import { AppThemeProvider } from '#/theme/AppThemeProvider'

import { CreateHouseholdForm } from './CreateHouseholdForm'

function renderForm(props?: Partial<Parameters<typeof CreateHouseholdForm>[0]>) {
  const onSubmit = props?.onSubmit ?? vi.fn(async () => undefined)
  const onSkip = props?.onSkip ?? vi.fn()
  render(
    <AppThemeProvider>
      <CreateHouseholdForm
        isSubmitting={false}
        isSubmitError={false}
        onSubmit={onSubmit}
        onSkip={onSkip}
        {...props}
      />
    </AppThemeProvider>,
  )
  return { onSubmit, onSkip }
}

describe('CreateHouseholdForm', () => {
  it('validates an empty name', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.click(screen.getByRole('button', { name: 'Criar minha Domus →' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Informe o nome da Domus.')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('rejects a name that is too long', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByLabelText('Nome da Domus'), 'a'.repeat(81))
    await user.click(screen.getByRole('button', { name: 'Criar minha Domus →' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Use no máximo 80 caracteres.')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits a valid name', async () => {
    const user = userEvent.setup()
    const { onSubmit } = renderForm()

    await user.type(screen.getByLabelText('Nome da Domus'), 'Casa Furst')
    await user.click(screen.getByRole('button', { name: 'Criar minha Domus →' }))
    expect(onSubmit).toHaveBeenCalledWith('Casa Furst')
  })

  it('skips creation', async () => {
    const user = userEvent.setup()
    const { onSkip } = renderForm()
    await user.click(screen.getByRole('button', { name: 'Decidir mais tarde' }))
    expect(onSkip).toHaveBeenCalled()
  })

  it('shows a submit error and retries', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn(async () => undefined)
    const onRetry = vi.fn()
    render(
      <AppThemeProvider>
        <CreateHouseholdForm
          isSubmitting={false}
          isSubmitError
          onSubmit={onSubmit}
          onSkip={vi.fn()}
          onRetry={onRetry}
        />
      </AppThemeProvider>,
    )

    expect(screen.getByText('Não foi possível criar sua Domus.')).toBeInTheDocument()
    await user.type(screen.getByLabelText('Nome da Domus'), 'Casa Furst')
    await user.click(screen.getByRole('button', { name: 'Tentar de novo' }))
    expect(onRetry).toHaveBeenCalled()
    expect(onSubmit).toHaveBeenCalledWith('Casa Furst')
  })

  it('disables actions while submitting', () => {
    render(
      <AppThemeProvider>
        <CreateHouseholdForm
          isSubmitting
          isSubmitError={false}
          onSubmit={vi.fn(async () => undefined)}
          onSkip={vi.fn()}
        />
      </AppThemeProvider>,
    )

    expect(screen.getByLabelText('Nome da Domus')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Decidir mais tarde' })).toBeDisabled()
  })
})
