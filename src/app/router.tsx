import { createBrowserRouter } from 'react-router'

import { ProtectedRoute } from '#/auth/ProtectedRoute'
import { HouseholdGate } from '#/features/create-household/components/HouseholdGate'
import { CreateHouseholdPage } from '#/features/create-household/pages/CreateHouseholdPage'
import { DashboardPage } from '#/pages/DashboardPage'
import { HomePage } from '#/pages/HomePage'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  {
    path: '/houses/new',
    element: (
      <ProtectedRoute>
        <CreateHouseholdPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <HouseholdGate>
          <DashboardPage />
        </HouseholdGate>
      </ProtectedRoute>
    ),
  },
])
