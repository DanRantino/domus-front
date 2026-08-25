import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'

import { router } from '#/app/router'
import { store } from '#/app/store'
import { AppThemeProvider } from '#/theme/AppThemeProvider'

export function App() {
  return (
    <AppThemeProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </AppThemeProvider>
  )
}
