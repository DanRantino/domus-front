import { useAppDispatch, useAppSelector } from '#/app/hooks'

import { selectHousehold, skipCreate } from '../slice/householdSessionSlice'

export function useHouseholdSession() {
  const dispatch = useAppDispatch()
  const session = useAppSelector((state) => state.householdSession)

  return {
    selectedId: session.selectedId,
    skippedCreate: session.skippedCreate,
    selectHousehold: (id: string) => {
      dispatch(selectHousehold(id))
    },
    skipCreate: () => {
      dispatch(skipCreate())
    },
  }
}
