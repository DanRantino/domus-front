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

function renderTasksCard(householdId?: string) {
  const { wrapper } = createHouseholdsWrapper()
  return render(<TasksCard householdId={householdId} />, { wrapper })
}

describe('TasksCard', () => {
  it('shows a skeleton while household tasks are loading', () => {
    stubDomusApi({ authenticated: true, hangGet: true })
    renderTasksCard()

    expect(screen.getByLabelText('Carregando tarefas...')).toBeInTheDocument()
    expect(screen.queryByText(/Tasks for/)).not.toBeInTheDocument()
    expect(screen.queryByText(/undefined/)).not.toBeInTheDocument()
  })

  it('omits the card when the caller has no household', async () => {
    stubDomusApi({ authenticated: true, houses: [] })
    renderTasksCard()

    await waitFor(() => {
      expect(screen.queryByLabelText('Carregando tarefas...')).not.toBeInTheDocument()
    })
    expect(screen.queryByText(/Tarefas de/)).not.toBeInTheDocument()
    expect(screen.queryByText(/Tasks for/)).not.toBeInTheDocument()
  })

  it('renders localized copy for an incomplete unassigned task', async () => {
    stubDomusApi({
      authenticated: true,
      houses: [
        {
          id: 'h1',
          name: 'Casa Furst',
          role: 'admin',
          tasks: [{ ...pendingTask, assignee: null }],
        },
      ],
    })
    renderTasksCard('h1')

    expect(await screen.findByText('Tarefas de Casa Furst')).toBeInTheDocument()
    expect(screen.getByText('Não concluída')).toBeInTheDocument()
    expect(screen.getByText('Sem responsável')).toBeInTheDocument()
    expect(screen.queryByText('Tasks for Casa Furst')).not.toBeInTheDocument()
    expect(screen.queryByText('Not completed')).not.toBeInTheDocument()
    expect(screen.queryByText('Unassigned')).not.toBeInTheDocument()
  })

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
    renderTasksCard('h1')
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
    renderTasksCard('h1')

    const checkbox = await screen.findByRole('checkbox', { name: 'Comprar ração concluída' })
    expect(checkbox).toBeChecked()
    expect(checkbox).toBeDisabled()
  })

  it('shows a toast when completing a task fails', async () => {
    stubDomusApi({
      authenticated: true,
      failComplete: true,
      houses: [
        {
          id: 'h1',
          name: 'Casa Furst',
          role: 'admin',
          tasks: [{ ...pendingTask }],
        },
      ],
    })
    renderTasksCard('h1')
    const user = userEvent.setup()

    const checkbox = await screen.findByRole('checkbox', { name: 'Concluir Comprar ração' })
    await user.click(checkbox)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Não foi possível concluir a tarefa.',
    )
    expect(checkbox).toBeEnabled()
    expect(checkbox).not.toBeChecked()
  })
})
