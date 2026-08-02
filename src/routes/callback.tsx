import { useHandleSignInCallback } from '@logto/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { isLogtoConfigured } from '#/config/env'

export const Route = createFileRoute('/callback')({
  component: CallbackPage,
})

function CallbackPage() {
  const navigate = useNavigate()

  if (!isLogtoConfigured()) {
    return (
      <main>
        <p>Logto is not configured. Set env vars from `.env.example`.</p>
      </main>
    )
  }

  return <CallbackHandler onDone={() => void navigate({ to: '/' })} />
}

function CallbackHandler({ onDone }: { onDone: () => void }) {
  const { isLoading, error } = useHandleSignInCallback(onDone)

  if (error) {
    return (
      <main>
        <h1>Sign-in failed</h1>
        <p>{error.message}</p>
      </main>
    )
  }

  if (isLoading) {
    return (
      <main>
        <p>Completing sign-in…</p>
      </main>
    )
  }

  return (
    <main>
      <p>Redirecting…</p>
    </main>
  )
}
