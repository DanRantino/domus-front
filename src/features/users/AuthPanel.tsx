import { useLogto } from '@logto/react'

import { isDomusApiConfigured, isLogtoConfigured } from '#/config/env'
import {
  absoluteAppUrl,
  callbackPath,
  postLogoutRedirectPath,
} from '#/integrations/logto/config'

import { useMeResolution } from './me-query'
import {
  BootstrapSurface,
  ConfigMissingSurface,
  MeResolutionSurface,
  WelcomeSurface,
} from './surfaces'

export function AuthPanel() {
  if (!isLogtoConfigured()) {
    return <ConfigMissingSurface />
  }

  return <AuthenticatedPanel />
}

function AuthenticatedPanel() {
  const { isAuthenticated, isLoading, signIn, signOut } = useLogto()
  const meQuery = useMeResolution(isAuthenticated)

  const handleSignIn = () => {
    void signIn(absoluteAppUrl(callbackPath))
  }

  const handleSignOut = () => {
    void signOut(absoluteAppUrl(postLogoutRedirectPath))
  }

  if (isLoading) {
    return <BootstrapSurface message="Checking identity session…" />
  }

  if (!isAuthenticated) {
    return <WelcomeSurface onSignIn={handleSignIn} />
  }

  if (!isDomusApiConfigured()) {
    return <MeResolutionSurface resolution={{ status: 'api_unconfigured' }} onSignOut={handleSignOut} onRetrySignIn={handleSignIn} />
  }

  if (meQuery.isLoading || meQuery.isFetching) {
    return <BootstrapSurface message="Preparing your home…" />
  }

  return (
    <MeResolutionSurface
      resolution={meQuery.data}
      errorMessage={meQuery.error?.message}
      onSignOut={handleSignOut}
      onRetrySignIn={handleSignIn}
    />
  )
}
