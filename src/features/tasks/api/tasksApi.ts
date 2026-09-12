import { api } from '#/api/api'
import type { HouseTask, HouseTaskMember } from '#/api/me'

type RestHouseTaskMember = {
  user_id: string
  display_name: string | null
}

type RestHouseTask = {
  id: string
  house_id: string
  title: string
  description: string | null
  status: string
  due_at: string | null
  completed_at: string | null
  assignee: RestHouseTaskMember | null
  created_by: RestHouseTaskMember
}

function memberFromRest(member: RestHouseTaskMember): HouseTaskMember {
  return {
    userId: member.user_id,
    displayName: member.display_name,
  }
}

export function houseTaskFromRest(task: RestHouseTask): HouseTask {
  return {
    id: task.id,
    houseId: task.house_id,
    title: task.title,
    description: task.description,
    status: task.status,
    dueAt: task.due_at,
    completedAt: task.completed_at,
    assignee: task.assignee ? memberFromRest(task.assignee) : null,
    createdBy: memberFromRest(task.created_by),
  }
}

export const tasksApi = api.injectEndpoints({
  endpoints: (build) => ({
    completeHouseTask: build.mutation<HouseTask, { houseId: string; taskId: string }>({
      query: ({ houseId, taskId }) => ({
        url: `/houses/${houseId}/tasks/${taskId}/complete`,
        method: 'POST',
      }),
      transformResponse: (response: RestHouseTask) => houseTaskFromRest(response),
      invalidatesTags: ['Me', 'Tasks'],
    }),
  }),
})

export const { useCompleteHouseTaskMutation } = tasksApi
