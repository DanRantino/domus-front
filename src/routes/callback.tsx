import { useHandleSignInCallback } from '@logto/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { isLogtoConfigured } from '#/config/env'
import {
  BootstrapSurface,
  ConfigMissingSurface,
  FailureSurface,
} from '#/features/users/components/surfaces'

export const Route = createFileRoute('/callback')({
  component: CallbackPage,
})

function CallbackPage() {
  const navigate = useNavigate()

  if (!isLogtoConfigured()) {
    return <ConfigMissingSurface />
  }

  return <CallbackHandler onDone={() => void navigate({ to: '/' })} />
}

function CallbackHandler({ onDone }: { onDone: () => void }) {
  const { isLoading, error } = useHandleSignInCallback(onDone)
  const navigate = useNavigate()

  if (error) {
    return (
      <FailureSurface
        title="Something went wrong"
        description={
          error.message ||
          "We couldn't securely sign you in. Please try again or contact support if the problem persists."
        }
        primaryLabel="Try again"
        onPrimary={() => void navigate({ to: '/' })}
      />
    )
  }

  if (isLoading) {
    return <BootstrapSurface message="Completing sign-in…" />
  }

  return <BootstrapSurface message="Redirecting…" />
}
