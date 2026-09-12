import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import '#/i18n'
import { stubDomusApi } from '#/test/domusApi'
import { createHouseholdsWrapper } from '#/features/create-household/test/renderWithHouseholds'

import { TasksCard } from './TasksCard'

const pendingTask = {
  id: 'task-1',
  houseId: 'h1',
  title: 'Comprar ração',
  description: 'Ração do cachorro',
  status: 'pending',
  dueAt: '2026-09-04T00:00:00Z',
  completedAt: null,
  assignee: { userId: 'user-2', displayName: 'Bruno Member' },
  createdBy: { userId: 'user-1', displayName: 'Ana Admin' },
}

describe('TasksCard', () => {
  it('completes a pending task from the checkbox', async () => {
    stubDomusApi({
      authenticated: true,
      houses: [
        {
          id: 'h1',
          name: 'Casa Furst',
          role: 'admin',
          tasks: [{ ...pendingTask }],
        },
      ],
    })
    const { wrapper } = createHouseholdsWrapper()
    render(<TasksCard householdId="h1" />, { wrapper })
    const user = userEvent.setup()

    const checkbox = await screen.findByRole('checkbox', { name: 'Concluir Comprar ração' })
    expect(checkbox).not.toBeChecked()
    expect(checkbox).toBeEnabled()

    await user.click(checkbox)

    await waitFor(() => {
      const completed = screen.getByRole('checkbox', { name: 'Comprar ração concluída' })
      expect(completed).toBeChecked()
      expect(completed).toBeDisabled()
    })
  })

  it('keeps an already completed task checked and disabled', async () => {
    stubDomusApi({
      authenticated: true,
      houses: [
        {
          id: 'h1',
          name: 'Casa Furst',
          role: 'admin',
          tasks: [
            {
              ...pendingTask,
              status: 'completed',
              completedAt: '2026-09-12T18:00:00Z',
            },
          ],
        },
      ],
    })
    const { wrapper } = createHouseholdsWrapper()
    render(<TasksCard householdId="h1" />, { wrapper })

    const checkbox = await screen.findByRole('checkbox', { name: 'Comprar ração concluída' })
    expect(checkbox).toBeChecked()
    expect(checkbox).toBeDisabled()
  })
})
