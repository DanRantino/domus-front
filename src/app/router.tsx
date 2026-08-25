import { createBrowserRouter } from 'react-router'

import { ProtectedRoute } from '#/auth/ProtectedRoute'
import { DashboardPage } from '#/pages/DashboardPage'
import { HomePage } from '#/pages/HomePage'

export const router = createBrowserRouter([
  { path: '/', element: <HomePage /> },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
])
