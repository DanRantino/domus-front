import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router'

import { router } from '#/app/router'
import { store } from '#/app/store'
import { AuthProvider } from '#/auth/AuthProvider'
import { ToastProvider } from '#/components/toast/ToastProvider'
import { AppThemeProvider } from '#/theme/AppThemeProvider'

export function App() {
  return (
    <AppThemeProvider>
      <AuthProvider>
        <Provider store={store}>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </Provider>
      </AuthProvider>
    </AppThemeProvider>
  )
}
