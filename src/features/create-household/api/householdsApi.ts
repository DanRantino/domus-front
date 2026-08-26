import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react'

import { loadHouseholds, saveHouseholds } from '../persistence'
import { createHouseholdSchema } from '../schema'
import type { Household } from '../types'

export type HouseholdsApiMockConfig = {
  delayMs: number
  failNextGet: boolean
  failNextCreate: boolean
}

const defaultMockConfig = (): HouseholdsApiMockConfig => ({
  delayMs: 120,
  failNextGet: false,
  failNextCreate: false,
})

let mockConfig: HouseholdsApiMockConfig = defaultMockConfig()

export function configureHouseholdsApiMock(
  patch: Partial<HouseholdsApiMockConfig> = {},
): HouseholdsApiMockConfig {
  mockConfig = { ...mockConfig, ...patch }
  return mockConfig
}

export function resetHouseholdsApiMock(): HouseholdsApiMockConfig {
  mockConfig = defaultMockConfig()
  return mockConfig
}

export function getHouseholdsApiMock(): HouseholdsApiMockConfig {
  return mockConfig
}

async function wait(ms: number): Promise<void> {
  if (ms <= 0) {
    return
  }

  await new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const householdsApi = createApi({
  reducerPath: 'householdsApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Households'],
  endpoints: (build) => ({
    getMyHouseholds: build.query<Household[], void>({
      async queryFn() {
        await wait(mockConfig.delayMs)

        if (mockConfig.failNextGet) {
          mockConfig = { ...mockConfig, failNextGet: false }
          return { error: { status: 'CUSTOM_ERROR', error: 'Failed to load households' } }
        }

        return { data: loadHouseholds() }
      },
      providesTags: ['Households'],
    }),
    createHousehold: build.mutation<Household, { name: string }>({
      async queryFn({ name }) {
        await wait(mockConfig.delayMs)

        if (mockConfig.failNextCreate) {
          mockConfig = { ...mockConfig, failNextCreate: false }
          return { error: { status: 'CUSTOM_ERROR', error: 'Failed to create household' } }
        }

        const parsed = createHouseholdSchema.safeParse({ name })
        if (!parsed.success) {
          return { error: { status: 'CUSTOM_ERROR', error: 'validation_error' } }
        }

        const household: Household = {
          id: crypto.randomUUID(),
          name: parsed.data.name,
          role: 'admin',
        }

        saveHouseholds([...loadHouseholds(), household])
        return { data: household }
      },
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(
            householdsApi.util.updateQueryData('getMyHouseholds', undefined, (draft) => {
              if (!draft.some((item) => item.id === data.id)) {
                draft.push(data)
              }
            }),
          )
        } catch {
          // Mutation failed; cache stays unchanged.
        }
      },
    }),
  }),
})

export const { useGetMyHouseholdsQuery, useCreateHouseholdMutation } = householdsApi
