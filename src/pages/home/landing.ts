import { fonts, palette } from '#/theme/tokens'

export const landing = {
  canvas: palette.neutral[900],
  surface: palette.neutral[800],
  cream: palette.secondary[200],
  muted: palette.neutral[400],
  forest: palette.primary[600],
  forestHover: palette.primary[700],
  line: 'rgba(239, 235, 227, 0.12)',
  gutter: { px: { xs: '24px', md: '80px' } },
} as const

export const landingCtaSx = {
  borderRadius: '4px',
  px: 2.5,
  py: 1.25,
  bgcolor: landing.forest,
  color: landing.cream,
  fontWeight: 600,
  letterSpacing: '0.04em',
  boxShadow: 'none',
  '&:hover': {
    bgcolor: landing.forestHover,
    boxShadow: 'none',
  },
} as const

export const landingCardSx = {
  bgcolor: landing.surface,
  border: '1px solid',
  borderColor: landing.line,
  borderRadius: '12px',
  p: { xs: 3, md: 4 },
} as const

export const landingEyebrowSx = {
  color: landing.muted,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  mb: 2,
} as const

export const landingStatSx = {
  fontFamily: fonts.headline,
  fontSize: { xs: 40, md: 48 },
  lineHeight: 1.1,
  color: landing.cream,
} as const
