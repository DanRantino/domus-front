import { useAppDispatch } from '#/app/hooks'

import { housesApi, useCreateHouseMutation } from '../api/housesApi'
import { selectHousehold } from '../slice/householdSessionSlice'

export function useCreateHousehold() {
  const dispatch = useAppDispatch()
  const [create, result] = useCreateHouseMutation()

  async function createHousehold(name: string) {
    const household = await create({ name }).unwrap()
    dispatch(selectHousehold(household.id))
    dispatch(
      housesApi.util.updateQueryData('getHouses', undefined, (draft) => {
        if (!draft.some((item) => item.id === household.id)) {
          draft.push(household)
        }
      }),
    )
    return household
  }

  return {
    createHousehold,
    isSubmitting: result.isLoading,
    isError: result.isError,
    reset: result.reset,
  }
}
