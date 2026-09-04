import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

import { fonts } from '#/theme/tokens'

import { useGetCurrentWeatherQuery } from '../api/weatherApi'
import { CurrentWeatherCard } from '../components/CurrentWeatherCard'
import { useBrowserLocation } from '../hooks/useBrowserLocation'
import { useGetMeQuery } from '#/api/me'
import { useHouseholdSession } from '#/features/create-household/hooks/useHouseholdSession'
import { useMyHouseholds } from '#/features/create-household/hooks/useMyHouseholds'
import i18n from '#/i18n'

function Dashboard() {
  const { data: me } = useGetMeQuery()
  const { t } = useTranslation()
  const location = useBrowserLocation()
  const { selectedId } = useHouseholdSession()
  const selectedHousehold = useMyHouseholds().households.find(
    (household) => household.id === selectedId,
  )
  const weatherQuery = useGetCurrentWeatherQuery(
    location.coordinates ?? { latitude: 0, longitude: 0 },
    {
      skip: location.coordinates == null,
    },
  )

  return (
    <Stack spacing={4}>
      <Box>
        <Typography component="p" sx={{ fontFamily: fonts.body, fontSize: { xs: 16, md: 18 } }}>
          {selectedHousehold?.name} -{' '}
          {new Date().toLocaleDateString(i18n.language, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Typography>
        <Typography
          component="h1"
          sx={{ fontFamily: fonts.headline, fontSize: { xs: 32, md: 44 }, lineHeight: 1.2 }}
        >
          {t('dashboard.hello')}, {me?.full_name}.
        </Typography>
      </Box>
      <CurrentWeatherCard
        location={location}
        weather={weatherQuery.data}
        isLoading={weatherQuery.isLoading || weatherQuery.isFetching}
        isError={weatherQuery.isError}
      />
    </Stack>
  )
}

export default Dashboard
