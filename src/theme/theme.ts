import { createTheme } from '@mui/material/styles'

import { elevation, fonts, palette, paletteKeys } from './tokens'

export const appTheme = createTheme({
  cssVariables: true,
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: palette.primary[600],
          dark: palette.primary[700],
          light: palette.primary[400],
          contrastText: palette.secondary[200],
        },
        secondary: {
          main: palette.tertiary[500],
          contrastText: palette.secondary[200],
        },
        error: {
          main: paletteKeys.danger,
          contrastText: paletteKeys.white,
        },
        background: {
          default: palette.secondary[200],
          paper: paletteKeys.white,
        },
        text: {
          primary: palette.neutral[700],
          secondary: palette.neutral[500],
        },
        divider: palette.secondary[300],
      },
    },
    dark: {
      palette: {
        primary: {
          main: palette.primary[600],
          light: palette.primary[400],
          contrastText: palette.secondary[200],
        },
        secondary: {
          main: palette.tertiary[400],
          contrastText: palette.neutral[900],
        },
        error: {
          main: paletteKeys.dangerBright,
          contrastText: palette.neutral[900],
        },
        background: {
          default: palette.neutral[700],
          paper: paletteKeys.inkElevated,
        },
        text: {
          primary: palette.secondary[200],
          secondary: palette.neutral[300],
        },
        divider: paletteKeys.borderDark,
      },
    },
  },
  typography: {
    fontFamily: fonts.body,
    h1: {
      fontFamily: fonts.headline,
      fontWeight: 500,
      fontSize: 28,
      lineHeight: '36px',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: fonts.headline,
      fontWeight: 500,
      fontSize: 28,
      lineHeight: '36px',
      letterSpacing: '-0.02em',
    },
    h3: {
      fontFamily: fonts.headline,
      fontWeight: 500,
      fontSize: 24,
      lineHeight: '32px',
    },
    h4: { fontFamily: fonts.headline, fontWeight: 500 },
    h5: { fontFamily: fonts.headline, fontWeight: 500 },
    h6: { fontFamily: fonts.headline, fontWeight: 500 },
    subtitle1: {
      fontFamily: fonts.body,
      fontSize: 18,
      lineHeight: '28px',
      fontWeight: 400,
    },
    body1: {
      fontFamily: fonts.body,
      fontSize: 16,
      lineHeight: '24px',
      fontWeight: 400,
    },
    button: {
      fontFamily: fonts.body,
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
        root: {
          borderRadius: 10,
        },
        containedPrimary: {
          boxShadow: elevation.forest,
          '&:hover': {
            boxShadow: elevation.forest,
          },
        },
        outlined: {
          borderWidth: 1.5,
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
