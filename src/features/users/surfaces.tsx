import { AlertCircle, ShieldX } from 'lucide-react'
import type { ReactNode } from 'react'

import { DomusLockup } from '#/components/brand/DomusMark'
import { AppShell } from '#/components/layout/AppShell'
import type { DomusUser, MeResolution } from '#/lib/domus-api/types'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

function CenteredStage({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh items-center justify-center px-5 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,103,65,0.08),transparent_55%)]"
      />
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  )
}

export function WelcomeSurface({ onSignIn }: { onSignIn: () => void }) {
  return (
    <CenteredStage>
      <div className="flex flex-col items-center text-center">
        <DomusLockup as="h1" size="lg" className="mb-6" />
        <p className="max-w-sm text-base text-muted-foreground">
          A calm place to organize your household — sign in to continue.
        </p>
        <Button type="button" size="lg" className="mt-8 w-full max-w-xs" onClick={onSignIn}>
          Sign in
        </Button>
      </div>
    </CenteredStage>
  )
}

export function BootstrapSurface({ message }: { message: string }) {
  return (
    <CenteredStage>
      <div className="flex flex-col items-center text-center">
        <DomusLockup as="h1" size="lg" className="mb-6" />
        <p className="text-sm text-muted-foreground">{message}</p>
        <Progress value={35} className="mt-8 w-48" aria-label={message} />
      </div>
    </CenteredStage>
  )
}

export function ConfigMissingSurface() {
  return (
    <CenteredStage>
      <Card className="shadow-[0_4px_20px_rgba(74,103,65,0.08)]">
        <CardHeader className="items-center text-center">
          <DomusLockup size="md" className="mb-2 justify-center" />
          <CardDescription>
            Configure <code>VITE_LOGTO_APP_ID</code> (and endpoint) in{' '}
            <code>.env.local</code> to enable Logto sign-in. See <code>.env.example</code>.
          </CardDescription>
        </CardHeader>
      </Card>
    </CenteredStage>
  )
}

export function FailureSurface({
  title,
  description,
  primaryLabel,
  onPrimary,
  secondaryLabel,
  onSecondary,
}: {
  title: string
  description: ReactNode
  primaryLabel?: string
  onPrimary?: () => void
  secondaryLabel?: string
  onSecondary?: () => void
}) {
  return (
    <CenteredStage>
      <div className="mb-8 flex justify-center">
        <DomusLockup size="sm" />
      </div>
      <Card className="shadow-[0_4px_20px_rgba(74,103,65,0.08)]">
        <CardHeader className="items-center text-center">
          <span className="mb-2 inline-flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <ShieldX className="size-5" aria-hidden />
          </span>
          <CardTitle className="font-serif text-2xl font-medium text-primary">{title}</CardTitle>
          <CardDescription className="text-base">{description}</CardDescription>
        </CardHeader>
        {(primaryLabel && onPrimary) || (secondaryLabel && onSecondary) ? (
          <CardFooter className="flex flex-col gap-3">
            {primaryLabel && onPrimary ? (
              <Button type="button" className="w-full" onClick={onPrimary}>
                {primaryLabel}
              </Button>
            ) : null}
            {secondaryLabel && onSecondary ? (
              <Button type="button" variant="ghost" className="w-full" onClick={onSecondary}>
                {secondaryLabel}
              </Button>
            ) : null}
          </CardFooter>
        ) : null}
      </Card>
    </CenteredStage>
  )
}

export function IdpOnlySurface({ onSignOut }: { onSignOut: () => void }) {
  return (
    <AppShell onSignOut={onSignOut}>
      <Alert>
        <AlertCircle />
        <AlertTitle>IdP session only</AlertTitle>
        <AlertDescription>
          <p>
            You are signed in at Logto. Set <code>VITE_DOMUS_API_BASE_URL</code> when the Domus
            API is available to resolve a Domus User via <code>GET /me</code>.
          </p>
          <p className="mt-2">
            Logto login alone does not create a Domus User; the app provisions via{' '}
            <code>POST /me</code> once the API is configured.
          </p>
        </AlertDescription>
      </Alert>
    </AppShell>
  )
}

export function ProvisionedProfileSurface({
  user,
  onSignOut,
}: {
  user: DomusUser
  onSignOut: () => void
}) {
  const initials = user.identity_id.slice(0, 2).toUpperCase()

  return (
    <AppShell onSignOut={onSignOut}>
      <Card className="shadow-[0_4px_20px_rgba(74,103,65,0.08)]">
        <CardHeader className="gap-4">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarFallback className="bg-primary/10 font-serif text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-serif text-3xl font-medium">Domus User</CardTitle>
              <CardDescription>Provisioned Domus caller resolved successfully.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-muted/70 px-4 py-3">
              <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                id
              </dt>
              <dd className="mt-1 break-all font-mono text-sm">{user.id}</dd>
            </div>
            <div className="rounded-lg bg-muted/70 px-4 py-3">
              <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                identity_id
              </dt>
              <dd className="mt-1 break-all font-mono text-sm">{user.identity_id}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </AppShell>
  )
}

export function MeResolutionSurface({
  resolution,
  errorMessage,
  onSignOut,
  onRetrySignIn,
}: {
  resolution: MeResolution | undefined
  errorMessage?: string
  onSignOut: () => void
  onRetrySignIn: () => void
}) {
  if (!resolution) {
    return (
      <FailureSurface
        title="Could not resolve Domus User"
        description={errorMessage ?? 'Unable to resolve Domus User.'}
        primaryLabel="Sign out"
        onPrimary={onSignOut}
      />
    )
  }

  switch (resolution.status) {
    case 'api_unconfigured':
      return <IdpOnlySurface onSignOut={onSignOut} />
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
          onPrimary={onRetrySignIn}
          secondaryLabel="Sign out"
          onSecondary={onSignOut}
        />
      )
    case 'not_provisioned':
      return (
        <FailureSurface
          title="Could not finish Domus setup"
          description="Your identity is valid, but Domus User provisioning did not complete. Try signing out and back in, or refresh the page."
          primaryLabel="Sign out"
          onPrimary={onSignOut}
        />
      )
    case 'provisioned':
      return <ProvisionedProfileSurface user={resolution.user} onSignOut={onSignOut} />
    case 'error':
      return (
        <FailureSurface
          title="Could not resolve Domus User"
          description={resolution.message}
          primaryLabel="Sign out"
          onPrimary={onSignOut}
        />
      )
  }
}
