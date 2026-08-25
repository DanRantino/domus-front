import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { DomusLogo } from './DomusLogo'

const markSize = {
  sm: 32,
  md: 40,
  lg: 64,
} as const

export function DomusMark({
  size = 'md',
  decorative = true,
}: {
  size?: keyof typeof markSize
  decorative?: boolean
}) {
  return (
    <Box
      component={DomusLogo}
      title={decorative ? undefined : 'Domus'}
      sx={{ height: markSize[size], width: 'auto', flexShrink: 0 }}
    />
  )
}

export function DomusWordmark({
  as = 'span',
  variant = 'h5',
}: {
  as?: 'span' | 'h1' | 'p'
  variant?: 'h4' | 'h5' | 'h6'
}) {
  return (
    <Typography
      component={as}
      variant={variant}
      sx={{ fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}
    >
      Domus
    </Typography>
  )
}

const lockupTextVariant = {
  sm: 'h6',
  md: 'h5',
  lg: 'h4',
} as const satisfies Record<string, 'h4' | 'h5' | 'h6'>

export function DomusLockup({
  size = 'md',
  as = 'span',
}: {
  size?: keyof typeof lockupTextVariant
  as?: 'span' | 'h1' | 'p'
}) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5 }}>
      <DomusMark size={size} decorative />
      <DomusWordmark as={as} variant={lockupTextVariant[size]} />
    </Box>
  )
}
