import { Link } from '@tanstack/react-router'

import { DomusMark, DomusWordmark } from '#/components/brand/DomusMark'
import { Button, buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

function NavLink({
  to,
  label,
  className,
}: {
  to: '/' | '/settings'
  label: string
  className?: string
}) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      className={className}
      inactiveProps={{
        className: cn(
          buttonVariants({ variant: 'ghost', size: 'default' }),
          'justify-start text-muted-foreground',
        ),
      }}
      activeProps={{
        className: cn(
          buttonVariants({ variant: 'secondary', size: 'default' }),
          'justify-start font-semibold text-foreground',
        ),
        'aria-current': 'page',
      }}
    >
      {label}
    </Link>
  )
}

export function Sidebar({ onSignOut }: { onSignOut: () => void }) {
  return (
    <aside className="flex w-full flex-row items-center justify-between gap-4 border-b border-border bg-card/70 px-5 py-4 md:w-64 md:flex-col md:items-stretch md:justify-start md:border-r md:border-b-0 md:px-6 md:py-8">
      <div className="flex min-w-0 flex-1 items-center gap-3 md:flex-col md:items-stretch">
        <div className="flex items-center gap-3 rounded-lg bg-background px-3 py-2.5 md:w-full">
          <DomusMark size="sm" />
          <div className="min-w-0">
            <DomusWordmark className="text-xl leading-none" />
            <p className="mt-1 text-xs text-muted-foreground">Family Management</p>
          </div>
        </div>

        <nav aria-label="Primary" className="flex items-center gap-1 md:block md:w-full">
          <Separator className="my-6 hidden md:block" />
          <div className="flex items-center gap-1 md:flex-col md:items-stretch md:gap-1">
            <NavLink to="/" label="Home" className="w-auto md:w-full" />
            <NavLink to="/settings" label="Settings" className="w-auto md:w-full" />
          </div>
        </nav>
      </div>

      <div className="shrink-0 md:mt-auto md:w-full">
        <Button type="button" variant="outline" className="w-full" onClick={onSignOut}>
          Sign out
        </Button>
      </div>
    </aside>
  )
}
