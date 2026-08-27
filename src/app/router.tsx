import { createBrowserRouter } from 'react-router'

import { ProtectedRoute } from '#/auth/ProtectedRoute'
import { HouseholdGate } from '#/features/create-household/components/HouseholdGate'
import { CreateHouseholdPage } from '#/features/create-household/pages/CreateHouseholdPage'
import { DashboardPage } from '#/pages/DashboardPage'
import { HomePage } from '#/pages/HomePage'

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute publicPaths={['/']} />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/houses/new', element: <CreateHouseholdPage /> },
      {
        path: '/dashboard',
        element: (
          <HouseholdGate>
            <DashboardPage />
          </HouseholdGate>
        ),
      },
    ],
  },
])
