import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useTranslation } from 'react-i18next'

import { useHouseholdSession } from '../hooks/useHouseholdSession'
import { useMyHouseholds } from '../hooks/useMyHouseholds'
import { HouseholdFeedback } from './HouseholdFeedback'
import { HouseholdGateSkeleton } from './HouseholdGateSkeleton'

type HouseholdGateProps = {
  children: ReactNode
}

export function HouseholdGate({ children }: HouseholdGateProps) {
  const { t } = useTranslation()
  const { households, isLoading, isError, isNotProvisioned, refetch } = useMyHouseholds()
  const { skippedCreate } = useHouseholdSession()

  if (isLoading) {
    return <HouseholdGateSkeleton />
  }

  if (isNotProvisioned) {
    return (
      <HouseholdFeedback
        title={t('createHousehold.notProvisionedTitle')}
        message={t('createHousehold.notProvisioned')}
      />
    )
  }

  if (isError) {
    return <HouseholdFeedback onRetry={() => void refetch()} />
  }

  if (households.length === 0 && !skippedCreate) {
    return <Navigate to="/houses/new" replace />
  }

  return children
}
