import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import type { Preview } from '@storybook/react'
import { I18nextProvider } from 'react-i18next'

import i18n from '../src/i18n'
import { appTheme } from '../src/theme/theme'

const preview: Preview = {
  decorators: [
    (Story) => (
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={appTheme} defaultMode="system">
          <CssBaseline />
          <Story />
        </ThemeProvider>
      </I18nextProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
