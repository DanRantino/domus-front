import type { DomusUser } from '#/lib/domus-api/types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

function initialsFor(user: DomusUser): string {
  if (user.full_name?.trim()) {
    return user.full_name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('')
  }
  return user.identity_id.slice(0, 2).toUpperCase()
}

export function HomeSummary({ user }: { user: DomusUser }) {
  const displayName = user.full_name?.trim() || null

  return (
    <div className="space-y-6">
      <Card className="shadow-[0_4px_20px_rgba(74,103,65,0.08)]">
        <CardHeader className="gap-4">
          <div className="flex items-center gap-4">
            <Avatar size="lg">
              <AvatarFallback className="bg-primary/10 font-serif text-primary">
                {initialsFor(user)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-serif text-3xl font-medium">
                {displayName ?? 'Name not set'}
              </CardTitle>
              <CardDescription>
                {displayName
                  ? 'Your Domus profile summary.'
                  : 'Add your name in Settings when you are ready.'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-[0_4px_20px_rgba(74,103,65,0.08)]">
        <CardHeader>
          <CardTitle className="font-serif text-2xl font-medium">Houses</CardTitle>
          <CardDescription>Households you belong to.</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          {user.houses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You are not a member of any House yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {user.houses.map((house) => (
                <li
                  key={house.id}
                  className="flex items-center justify-between gap-4 rounded-lg bg-muted/70 px-4 py-3"
                >
                  <span className="font-medium text-foreground">{house.name}</span>
                  <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    {house.role}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
