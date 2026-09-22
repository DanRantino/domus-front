import { useAuthSession } from '#/auth/useAuthSession'

import { useMyHouseholds } from '../hooks/useMyHouseholds'
import { CreateSpaceButton } from './CreateSpaceButton'
import { HouseholdCtaSkeleton } from './HouseholdCtaSkeleton'
import { HouseholdFeedback } from './HouseholdFeedback'
import { HouseholdSwitcher } from './HouseholdSwitcher'

type Variant = 'header' | 'drawer'

type HomeHouseholdCtaProps = {
  variant: Variant
  onNavigate?: () => void
}

export function HomeHouseholdCta({ variant, onNavigate }: HomeHouseholdCtaProps) {
  const { isAuthenticated, isLoading } = useAuthSession()

  if (isLoading) {
    return <HouseholdCtaSkeleton variant={variant} />
  }

  if (!isAuthenticated) {
    return <CreateSpaceButton variant={variant} onNavigate={onNavigate} />
  }

  return <AuthenticatedHouseholdCta variant={variant} onNavigate={onNavigate} />
}

function AuthenticatedHouseholdCta({ variant, onNavigate }: HomeHouseholdCtaProps) {
  const { households, isLoading, isError, isNotProvisioned, refetch } = useMyHouseholds()

  if (isLoading) {
    return <HouseholdCtaSkeleton variant={variant} />
  }

  if (isError && !isNotProvisioned) {
    return <HouseholdFeedback compact onRetry={() => void refetch()} />
  }

  if (isNotProvisioned || households.length === 0) {
    return <CreateSpaceButton variant={variant} onNavigate={onNavigate} />
  }

  return <HouseholdSwitcher households={households} variant={variant} onNavigate={onNavigate} />
}
