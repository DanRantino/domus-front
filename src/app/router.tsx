import { createBrowserRouter } from 'react-router'

import { ProtectedRoute } from '#/auth/ProtectedRoute'
import { HouseholdGate } from '#/features/create-household/components/HouseholdGate'
import { CreateHouseholdPage } from '#/features/create-household/pages/CreateHouseholdPage'
import { DashboardPage } from '#/pages/DashboardPage'
import { HomePage } from '#/pages/HomePage'
import { HouseReadyPage } from '#/features/house-invitations/pages/HouseReadyPage'
import { JoinHouseholdPage } from '#/features/house-invitations/pages/JoinHouseholdPage'
import { StartPage } from '#/pages/StartPage'

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute publicPaths={['/', '/start', '/start/invite']} />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/start', element: <StartPage /> },
      { path: '/start/invite', element: <JoinHouseholdPage /> },
      { path: '/start/ready', element: <HouseReadyPage /> },
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
