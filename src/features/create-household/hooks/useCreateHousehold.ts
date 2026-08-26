import { useAppDispatch } from '#/app/hooks'

import { useCreateHouseholdMutation } from '../api/householdsApi'
import { selectHousehold } from '../slice/householdSessionSlice'

export function useCreateHousehold() {
  const dispatch = useAppDispatch()
  const [create, result] = useCreateHouseholdMutation()

  async function createHousehold(name: string) {
    const household = await create({ name }).unwrap()
    dispatch(selectHousehold(household.id))
    return household
  }

  return {
    createHousehold,
    isSubmitting: result.isLoading,
    isError: result.isError,
    reset: result.reset,
  }
}
