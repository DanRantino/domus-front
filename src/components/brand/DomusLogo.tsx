import type { SVGProps } from 'react'

import { cn } from '@/lib/utils'

const CHARCOAL = '#2D2D2D'
const FOREST = '#4A6741'

export function DomusLogo({
  className,
  title,
  ...props
}: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg
      viewBox="0 0 1254 1254"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      className={cn('shrink-0', className)}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path
        d="M 682 318
       L 770 364
       C 932 364 1014 470 1014 620
       C 1014 772 923 874 824 884
       L 824 609
       L 750 545
       L 750 886
       L 316 886
       L 316 541
       L 239 608
       L 239 921
       C 239 948 260 969 287 969
       L 786 969
       C 971 969 1099 823 1099 620
       C 1099 418 971 277 790 277
       L 681 277
       C 672 277 667 288 674 294
       Z"
        fill={CHARCOAL}
      />
      <path
        d="M 191 548 L 529 244 L 867 548"
        stroke={FOREST}
        strokeWidth={69}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="450" y="601" width="72" height="71" rx="7" fill={CHARCOAL} />
      <rect x="540" y="601" width="72" height="71" rx="7" fill={CHARCOAL} />
      <rect x="450" y="691" width="72" height="71" rx="7" fill={CHARCOAL} />
      <rect x="540" y="691" width="72" height="71" rx="7" fill={CHARCOAL} />
    </svg>
  )
}
