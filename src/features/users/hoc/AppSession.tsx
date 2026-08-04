import { useLogto } from '@logto/react'
import type { ReactNode } from 'react'

import { AppShell } from '#/components/layout/AppShell'
import { isDomusApiConfigured, isLogtoConfigured } from '#/config/env'
import {
  absoluteAppUrl,
  callbackPath,
  postLogoutRedirectPath,
} from '#/integrations/logto/config'
import type { DomusUser } from '#/lib/domus-api/types'

import {
  BootstrapSurface,
  ConfigMissingSurface,
  FailureSurface,
  IdpOnlyContent,
  WelcomeSurface,
} from '../components/surfaces'
import { useMeResolution } from '../hooks/use-me-resolution'

export function AppSession({
  children,
}: {
  children: (ctx: { user: DomusUser; onSignOut: () => void }) => ReactNode
}) {
  if (!isLogtoConfigured()) {
    return <ConfigMissingSurface />
  }

  return <AuthenticatedSession>{children}</AuthenticatedSession>
}

function AuthenticatedSession({
  children,
}: {
  children: (ctx: { user: DomusUser; onSignOut: () => void }) => ReactNode
}) {
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
    return (
      <AppShell onSignOut={handleSignOut}>
        <IdpOnlyContent />
      </AppShell>
    )
  }

  if (meQuery.isLoading || meQuery.isFetching) {
    return <BootstrapSurface message="Preparing your home…" />
  }

  const resolution = meQuery.data

  if (!resolution) {
    return (
      <FailureSurface
        title="Could not resolve Domus User"
        description={meQuery.error?.message ?? 'Unable to resolve Domus User.'}
        primaryLabel="Sign out"
        onPrimary={handleSignOut}
      />
    )
  }

  switch (resolution.status) {
    case 'api_unconfigured':
      return (
        <AppShell onSignOut={handleSignOut}>
          <IdpOnlyContent />
        </AppShell>
      )
    case 'unauthenticated':
      return (
        <FailureSurface
          title="Unauthenticated for Domus API"
          description={
            <>
              The API returned <code>401</code>. Sign in again to refresh your access token.
            </>
          }
          primaryLabel="Try again"
          onPrimary={handleSignIn}
          secondaryLabel="Sign out"
          onSecondary={handleSignOut}
        />
      )
    case 'not_provisioned':
      return (
        <FailureSurface
          title="Could not finish Domus setup"
          description="Your identity is valid, but Domus User provisioning did not complete. Try signing out and back in, or refresh the page."
          primaryLabel="Sign out"
          onPrimary={handleSignOut}
        />
      )
    case 'error':
      return (
        <FailureSurface
          title="Could not resolve Domus User"
          description={resolution.message}
          primaryLabel="Sign out"
          onPrimary={handleSignOut}
        />
      )
    case 'provisioned':
      return (
        <AppShell onSignOut={handleSignOut}>
          {children({ user: resolution.user, onSignOut: handleSignOut })}
        </AppShell>
      )
  }
}
