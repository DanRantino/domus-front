import { createFileRoute } from '@tanstack/react-router'

import { AuthPanel } from '#/features/users/AuthPanel'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main>
      <AuthPanel />
    </main>
  )
}
