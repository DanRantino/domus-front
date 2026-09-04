import { useState } from 'react'

import { getDomusErrorCode, isNotProvisionedError } from '#/api/baseQuery'
import { meApi, useProvisionMeMutation } from '#/api/me'
import { useAppDispatch } from '#/app/hooks'

import { housesApi, useCreateHouseMutation } from '../api/housesApi'
import { selectHousehold } from '../slice/householdSessionSlice'

export function useCreateHousehold() {
  const dispatch = useAppDispatch()
  const [create, result] = useCreateHouseMutation()
  const [provision, provisionResult] = useProvisionMeMutation()
  const [submitFailed, setSubmitFailed] = useState(false)

  async function createHousehold(name: string) {
    setSubmitFailed(false)
    try {
      const household = await createAfterProvisioning(name)
      dispatch(selectHousehold(household.id))
      dispatch(
        housesApi.util.updateQueryData('getHouses', undefined, (draft) => {
          if (!draft.some((item) => item.id === household.id)) {
            draft.push(household)
          }
        }),
      )
      dispatch(
        meApi.util.updateQueryData('getMe', undefined, (draft) => {
          if (!draft.houses.some((item) => item.id === household.id)) {
            draft.houses.push(household)
          }
        }),
      )
      return household
    } catch (error) {
      setSubmitFailed(true)
      throw error
    }
  }

  async function createAfterProvisioning(name: string) {
    try {
      return await create({ name }).unwrap()
    } catch (error) {
      if (!isNotProvisionedError(error)) {
        throw error
      }

      try {
        await provision().unwrap()
      } catch (provisionError) {
        if (getDomusErrorCode(provisionError) !== 'already_exists') {
          throw provisionError
        }
      }

      return await create({ name }).unwrap()
    }
  }

  return {
    createHousehold,
    isSubmitting: result.isLoading || provisionResult.isLoading,
    isError: submitFailed,
    reset() {
      setSubmitFailed(false)
      result.reset()
      provisionResult.reset()
    },
  }
}
