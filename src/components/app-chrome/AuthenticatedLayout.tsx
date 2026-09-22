import Box from '@mui/material/Box'
import { Outlet } from 'react-router'

import { landing } from '#/pages/home/landing'

import { AppNavbar } from './AppNavbar'

export function AuthenticatedLayout() {
  return (
    <Box sx={{ bgcolor: landing.canvas, color: landing.cream, minHeight: '100svh' }}>
      <AppNavbar />
      <Box component="main" sx={{ px: { xs: 3, md: 8 }, py: 6 }}>
        <Outlet />
      </Box>
    </Box>
  )
}
