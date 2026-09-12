import { beforeEach, describe, expect, it } from 'vitest'

import { setupStore } from '#/app/store'
import { stubDomusApi } from '#/test/domusApi'

import { tasksApi } from './tasksApi'

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

describe('tasksApi', () => {
  beforeEach(() => {
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
  })

  it('completes a house task', async () => {
    const store = setupStore()
    const result = await store.dispatch(
      tasksApi.endpoints.completeHouseTask.initiate({
        houseId: 'h1',
        taskId: 'task-1',
      }),
    )

    expect('data' in result && result.data).toEqual({
      ...pendingTask,
      status: 'completed',
      completedAt: '2026-09-12T18:00:00Z',
    })
  })

  it('returns not_found when the task is missing', async () => {
    const store = setupStore()
    const result = await store.dispatch(
      tasksApi.endpoints.completeHouseTask.initiate({
        houseId: 'h1',
        taskId: 'missing',
      }),
    )

    expect('error' in result && result.error).toMatchObject({
      status: 404,
      data: { code: 'not_found' },
    })
  })
})
