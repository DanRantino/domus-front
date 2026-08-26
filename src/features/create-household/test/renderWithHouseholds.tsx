import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import type { ReactElement, ReactNode } from 'react'

import { setupStore, type AppStore, type RootState } from '#/app/store'
import { AppThemeProvider } from '#/theme/AppThemeProvider'

export function createHouseholdsWrapper(options?: {
  store?: AppStore
  preloadedState?: Partial<RootState>
  route?: string
}): { store: AppStore; wrapper: (props: { children: ReactNode }) => ReactElement } {
  const store = options?.store ?? setupStore(options?.preloadedState)
  const route = options?.route ?? '/'

  function wrapper({ children }: { children: ReactNode }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <AppThemeProvider>
          <Provider store={store}>{children}</Provider>
        </AppThemeProvider>
      </MemoryRouter>
    )
  }

  return { store, wrapper }
}
