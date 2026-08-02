import type { ReactNode } from 'react'

import { DomusMark, DomusWordmark } from '#/components/brand/DomusMark'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export function AppShell({
  children,
  onSignOut,
}: {
  children: ReactNode
  onSignOut: () => void
}) {
  return (
    <div className="flex min-h-svh flex-col md:flex-row">
      <aside className="flex w-full flex-row items-center justify-between gap-4 border-b border-border bg-card/70 px-5 py-4 md:w-64 md:flex-col md:items-stretch md:justify-start md:border-r md:border-b-0 md:px-6 md:py-8">
        <div className="flex items-center gap-3">
          <DomusMark size="sm" />
          <div>
            <DomusWordmark className="text-xl leading-none" />
            <p className="mt-1 text-xs text-muted-foreground">Household operating system</p>
          </div>
        </div>

        <div className="hidden md:block">
          <Separator className="my-6" />
        </div>

        <div className="md:mt-auto">
          <Button type="button" variant="outline" className="w-full" onClick={onSignOut}>
            Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 px-5 py-8 md:px-10 md:py-10">
        <div className="mx-auto w-full max-w-3xl">{children}</div>
      </main>
    </div>
  )
}
