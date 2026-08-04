import { AlertCircle, ShieldX } from 'lucide-react'
import type { ReactNode } from 'react'

import { DomusLockup } from '#/components/brand/DomusMark'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

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

export function IdpOnlyContent() {
  return (
    <Alert>
      <AlertCircle />
      <AlertTitle>IdP session only</AlertTitle>
      <AlertDescription>
        <p>
          You are signed in at Logto. Set <code>VITE_DOMUS_API_BASE_URL</code> when the Domus API
          is available to resolve a Domus User via <code>GET /me</code>.
        </p>
        <p className="mt-2">
          Logto login alone does not create a Domus User; the app provisions via{' '}
          <code>POST /me</code> once the API is configured.
        </p>
      </AlertDescription>
    </Alert>
  )
}
