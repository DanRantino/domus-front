import type { ReactNode } from 'react'
import { Navigate } from 'react-router'

import { useHouseholdSession } from '../hooks/useHouseholdSession'
import { useMyHouseholds } from '../hooks/useMyHouseholds'
import { HouseholdFeedback } from './HouseholdFeedback'
import { HouseholdGateSkeleton } from './HouseholdGateSkeleton'

type HouseholdGateProps = {
  children: ReactNode
}

export function HouseholdGate({ children }: HouseholdGateProps) {
  const { households, isLoading, isError, isNotProvisioned, refetch } = useMyHouseholds()
  const { skippedCreate } = useHouseholdSession()

  if (isLoading) {
    return <HouseholdGateSkeleton />
  }

  if (isError && !isNotProvisioned) {
    return <HouseholdFeedback onRetry={() => void refetch()} />
  }

  if (isNotProvisioned) {
    return <Navigate to="/houses/new" replace />
  }

  if (households.length === 0 && !skippedCreate) {
    return <Navigate to="/houses/new" replace />
  }

  return children
}
