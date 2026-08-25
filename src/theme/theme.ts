import { createTheme } from '@mui/material/styles'

import { elevation, fonts, paletteKeys } from './tokens'

export const appTheme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: paletteKeys.forestDeep,
          dark: paletteKeys.forest,
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
          default: paletteKeys.cream,
          paper: paletteKeys.white,
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
    h1: {
      fontFamily: fonts.newsreader,
      fontWeight: 500,
      fontSize: 28,
      lineHeight: '36px',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: fonts.newsreader,
      fontWeight: 500,
      fontSize: 28,
      lineHeight: '36px',
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: fonts.newsreader,
      fontWeight: 500,
      fontSize: 24,
      lineHeight: '32px',
    },
    h4: { fontFamily: fonts.newsreader, fontWeight: 500 },
    h5: { fontFamily: fonts.newsreader, fontWeight: 500 },
    h6: { fontFamily: fonts.newsreader, fontWeight: 500 },
    subtitle1: {
      fontFamily: fonts.manrope,
      fontSize: 18,
      lineHeight: '28px',
      fontWeight: 400,
    },
    body1: {
      fontFamily: fonts.manrope,
      fontSize: 16,
      lineHeight: '24px',
      fontWeight: 400,
    },
    button: {
      fontFamily: fonts.manrope,
      fontWeight: 600,
      fontSize: 14,
      lineHeight: '20px',
      letterSpacing: '0.01em',
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        containedPrimary: {
          boxShadow: elevation.forest,
          '&:hover': {
            boxShadow: elevation.forest,
          },
        },
      },
    },
  },
})

appTheme.typography.h1 = {
  ...appTheme.typography.h1,
  [appTheme.breakpoints.up('md')]: {
    fontSize: 48,
    lineHeight: '56px',
  },
}

appTheme.typography.h2 = {
  ...appTheme.typography.h2,
  [appTheme.breakpoints.up('md')]: {
    fontSize: 48,
    lineHeight: '56px',
  },
}
