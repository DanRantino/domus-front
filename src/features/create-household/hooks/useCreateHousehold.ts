import { useState } from 'react'

import { isNotProvisionedError } from '#/api/baseQuery'
import { useProvisionMeMutation } from '#/api/me'
import { useAppDispatch } from '#/app/hooks'

import { useCreateHouseMutation } from '../api/housesApi'
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

      await provision().unwrap()
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
