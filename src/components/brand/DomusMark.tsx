import { DomusLogo } from '#/components/brand/DomusLogo'
import { cn } from '@/lib/utils'

const markSizeClass = {
  sm: 'h-8 w-auto',
  md: 'h-10 w-auto',
  lg: 'h-16 w-auto',
} as const

export function DomusMark({
  className,
  size = 'md',
  decorative = true,
}: {
  className?: string
  size?: keyof typeof markSizeClass
  /** When true, hides from assistive tech (pair with visible wordmark). */
  decorative?: boolean
}) {
  return (
    <DomusLogo
      className={cn(markSizeClass[size], className)}
      title={decorative ? undefined : 'Domus'}
    />
  )
}

export function DomusWordmark({
  className,
  as: Comp = 'span',
}: {
  className?: string
  as?: 'span' | 'h1' | 'p'
}) {
  return (
    <Comp
      className={cn(
        'font-sans text-3xl font-semibold tracking-tight text-foreground',
        className,
      )}
    >
      Domus
    </Comp>
  )
}

const lockupMarkSize = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
} as const satisfies Record<string, keyof typeof markSizeClass>

const lockupTextClass = {
  sm: 'text-xl',
  md: 'text-2xl',
  lg: 'text-4xl',
} as const

export function DomusLockup({
  className,
  size = 'md',
  as = 'span',
}: {
  className?: string
  size?: keyof typeof lockupMarkSize
  as?: 'span' | 'h1' | 'p'
}) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <DomusMark size={lockupMarkSize[size]} decorative />
      <DomusWordmark as={as} className={cn('leading-none', lockupTextClass[size])} />
    </span>
  )
}
