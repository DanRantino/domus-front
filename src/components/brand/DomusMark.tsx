import Box from '@mui/material/Box'

import { paletteKeys } from '#/theme/tokens'

import { DomusLogo } from './DomusLogo'

const wordmarkHeight = {
  sm: 22,
  md: 28,
  lg: 40,
} as const

export function DomusMark({
  size = 'md',
  decorative = true,
}: {
  size?: keyof typeof wordmarkHeight
  decorative?: boolean
}) {
  return (
    <Box
      component={DomusLogo}
      title={decorative ? undefined : 'DOMUS'}
      sx={[
        {
          height: wordmarkHeight[size],
          width: 'auto',
          flexShrink: 0,
          color: paletteKeys.charcoal,
        },
        (theme) =>
          theme.applyStyles('dark', {
            color: paletteKeys.cream,
          }),
      ]}
    />
  )
}

export function DomusLockup({
  size = 'md',
}: {
  size?: keyof typeof wordmarkHeight
}) {
  return <DomusMark size={size} decorative={false} />
}
