import type { Household } from '#/features/create-household/types'

import { api } from './api'
import { isNotProvisionedError, provisionSelf } from './baseQuery'
import { executeGraphql } from './graphql'

export type HouseTaskMember = {
  userId: string
  displayName: string | null
}

export type HouseTask = {
  id: string
  houseId: string
  title: string
  description: string | null
  status: string
  dueAt: string | null
  completedAt: string | null
  assignee: HouseTaskMember | null
  createdBy: HouseTaskMember
}

export type MeHouse = Household & {
  tasks: HouseTask[]
}

export type Me = {
  id: string
  name: string | null
  profile: {
    theme: string
    notifyDailyTasks: boolean
    notifyExpenses: boolean
    notifyFamilyChat: boolean
  }
  houses: MeHouse[]
}

const meQuery = `
  query Me {
    me {
      id
      name
      profile {
        theme
        notifyDailyTasks
        notifyExpenses
        notifyFamilyChat
      }
      houses {
        id
        name
        role
        tasks {
          id
          houseId
          title
          description
          status
          dueAt
          completedAt
          assignee {
            userId
            displayName
          }
          createdBy {
            userId
            displayName
          }
        }
      }
    }
  }
`

async function loadMe() {
  const result = await executeGraphql<{ me: Me | null }>(meQuery)
  if ('error' in result) {
    return result
  }

  if (!result.data.me) {
    return {
      error: {
        status: 500,
        data: { code: 'internal_error' },
      },
    }
  }

  return { data: result.data.me }
}

async function fetchMe() {
  const result = await loadMe()
  if ('error' in result && isNotProvisionedError(result.error)) {
    const provisioned = await provisionSelf()
    if (provisioned.ok) {
      return await loadMe()
    }

    return { error: provisioned.error }
  }

  return result
}

export const meApi = api.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<Me, void>({
      queryFn: () => fetchMe(),
      providesTags: ['Me'],
    }),
    provisionMe: build.mutation<Me, void>({
      query: () => ({
        url: '/users/me',
        method: 'POST',
      }),
      transformResponse: (response: RestMe) => meFromRest(response),
      invalidatesTags: ['Me'],
    }),
  }),
})

export const { useGetMeQuery, useProvisionMeMutation } = meApi

type RestMe = {
  id: string
  full_name: string | null
  notify_daily_tasks: boolean
  notify_expenses: boolean
  notify_family_chat: boolean
  theme: string
  houses: Household[]
}

function meFromRest(data: RestMe): Me {
  return {
    id: data.id,
    name: data.full_name?.trim() ? data.full_name : null,
    profile: {
      theme: data.theme,
      notifyDailyTasks: data.notify_daily_tasks,
      notifyExpenses: data.notify_expenses,
      notifyFamilyChat: data.notify_family_chat,
    },
    houses: data.houses.map((house) => ({ ...house, tasks: [] })),
  }
}
