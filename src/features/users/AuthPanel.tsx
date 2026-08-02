import { useLogto } from '@logto/react'

import { isDomusApiConfigured, isLogtoConfigured } from '#/config/env'
import {
  absoluteAppUrl,
  callbackPath,
  postLogoutRedirectPath,
} from '#/integrations/logto/config'

import { useMeResolution } from './me-query'

export function AuthPanel() {
  if (!isLogtoConfigured()) {
    return (
      <section>
        <h1>Domus</h1>
        <p>
          Configure <code>VITE_LOGTO_APP_ID</code> (and endpoint) in{' '}
          <code>.env.local</code> to enable Logto sign-in. See{' '}
          <code>.env.example</code>.
        </p>
      </section>
    )
  }

  return <AuthenticatedPanel />
}

function AuthenticatedPanel() {
  const { isAuthenticated, isLoading, signIn, signOut } = useLogto()
  const meQuery = useMeResolution(isAuthenticated)

  if (isLoading) {
    return (
      <section>
        <h1>Domus</h1>
        <p>Checking identity session…</p>
      </section>
    )
  }

  if (!isAuthenticated) {
    return (
      <section>
        <h1>Domus</h1>
        <p>Sign in with Logto to continue.</p>
        <button type="button" onClick={() => void signIn(absoluteAppUrl(callbackPath))}>
          Sign in
        </button>
      </section>
    )
  }

  return (
    <section>
      <h1>Domus</h1>
      <p>
        <strong>Identity:</strong> authenticated at the IdP
      </p>
      <button
        type="button"
        onClick={() => void signOut(absoluteAppUrl(postLogoutRedirectPath))}
      >
        Sign out
      </button>

      {!isDomusApiConfigured() ? (
        <IdpOnlyNotice />
      ) : meQuery.isLoading || meQuery.isFetching ? (
        <p>Setting up your Domus User…</p>
      ) : (
        <MeStatusView resolution={meQuery.data} errorMessage={meQuery.error?.message} />
      )}
    </section>
  )
}

function IdpOnlyNotice() {
  return (
    <div>
      <h2>IdP session only</h2>
      <p>
        You are signed in at Logto. Set <code>VITE_DOMUS_API_BASE_URL</code> when the
        Domus API is available to resolve a Domus User via <code>GET /me</code>.
      </p>
      <p>
        Logto login alone does not create a Domus User; the app provisions via{' '}
        <code>POST /me</code> once the API is configured.
      </p>
    </div>
  )
}

function MeStatusView({
  resolution,
  errorMessage,
}: {
  resolution: ReturnType<typeof useMeResolution>['data']
  errorMessage?: string
}) {
  if (!resolution) {
    return <p>{errorMessage ?? 'Unable to resolve Domus User.'}</p>
  }

  switch (resolution.status) {
    case 'api_unconfigured':
      return <IdpOnlyNotice />
    case 'unauthenticated':
      return (
        <div>
          <h2>Unauthenticated for Domus API</h2>
          <p>
            The API returned <code>401</code>. Sign in again to refresh your access token.
          </p>
        </div>
      )
    case 'not_provisioned':
      return (
        <div>
          <h2>Could not finish Domus setup</h2>
          <p>
            Your identity is valid, but Domus User provisioning did not complete. Try signing
            out and back in, or refresh the page.
          </p>
        </div>
      )
    case 'provisioned':
      return (
        <div>
          <h2>Domus User</h2>
          <p>Provisioned Domus caller resolved successfully.</p>
          <dl>
            <div>
              <dt>id</dt>
              <dd>
                <code>{resolution.user.id}</code>
              </dd>
            </div>
            <div>
              <dt>identity_id</dt>
              <dd>
                <code>{resolution.user.identity_id}</code>
              </dd>
            </div>
          </dl>
        </div>
      )
    case 'error':
      return (
        <div>
          <h2>Could not resolve Domus User</h2>
          <p>{resolution.message}</p>
        </div>
      )
  }
}
