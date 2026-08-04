import type { ReactNode } from 'react'

import { Sidebar } from '#/components/layout/Sidebar'

export function AppShell({
  children,
  onSignOut,
}: {
  children: ReactNode
  onSignOut: () => void
}) {
  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <Sidebar onSignOut={onSignOut} />

      <main className="flex-1 px-5 py-8 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-3xl">{children}</div>
      </main>
    </div>
  )
}
