import { createTheme } from '@mui/material/styles'

import { fonts, paletteKeys } from './tokens'

export const appTheme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: paletteKeys.forest,
          contrastText: paletteKeys.white,
        },
        secondary: {
          main: paletteKeys.terracotta,
          contrastText: paletteKeys.white,
        },
        error: {
          main: paletteKeys.danger,
          contrastText: paletteKeys.white,
        },
        background: {
          default: paletteKeys.warm,
          paper: paletteKeys.cream,
        },
        text: {
          primary: paletteKeys.charcoal,
          secondary: paletteKeys.mutedInk,
        },
        divider: paletteKeys.borderLight,
      },
    },
    dark: {
      palette: {
        primary: {
          main: paletteKeys.forestBright,
          contrastText: paletteKeys.ink,
        },
        secondary: {
          main: paletteKeys.terracottaBright,
          contrastText: paletteKeys.ink,
        },
        error: {
          main: paletteKeys.dangerBright,
          contrastText: paletteKeys.ink,
        },
        background: {
          default: paletteKeys.ink,
          paper: paletteKeys.inkElevated,
        },
        text: {
          primary: paletteKeys.mist,
          secondary: paletteKeys.mistMuted,
        },
        divider: paletteKeys.borderDark,
      },
    },
  },
  typography: {
    fontFamily: fonts.manrope,
    h1: { fontFamily: fonts.newsreader, fontWeight: 500 },
    h2: { fontFamily: fonts.newsreader, fontWeight: 500 },
    h3: { fontFamily: fonts.newsreader, fontWeight: 500 },
    h4: { fontFamily: fonts.newsreader, fontWeight: 500 },
    h5: { fontFamily: fonts.newsreader, fontWeight: 500 },
    h6: { fontFamily: fonts.newsreader, fontWeight: 500 },
    button: {
      fontFamily: fonts.manrope,
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
})
