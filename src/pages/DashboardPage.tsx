import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

import { useHouseholdSession } from '#/features/create-household/hooks/useHouseholdSession'
import { useMyHouseholds } from '#/features/create-household/hooks/useMyHouseholds'
import { HouseInvitesPanel } from '#/features/house-invitations/components/HouseInvitesPanel'
import { landing } from '#/pages/home/landing'
import { fonts } from '#/theme/tokens'

export function DashboardPage() {
  const { t } = useTranslation()
  const { households } = useMyHouseholds()
  const { selectedId } = useHouseholdSession()
  const selected = households.find((household) => household.id === selectedId) ?? households[0]
  const isAdmin = selected?.role === 'admin'

  return (
    <Box
      sx={{
        bgcolor: landing.canvas,
        color: landing.cream,
        minHeight: '100svh',
        px: { xs: 3, md: 8 },
        py: 6,
      }}
    >
      <Typography
        component="h1"
        sx={{ fontFamily: fonts.headline, fontSize: { xs: 32, md: 44 } }}
      >
        {t('dashboard.hello')}
      </Typography>
      {selected ? (
        <Typography sx={{ color: landing.muted, mt: 1 }}>{selected.name}</Typography>
      ) : null}
      {isAdmin && selected ? <HouseInvitesPanel houseId={selected.id} /> : null}
    </Box>
  )
}
