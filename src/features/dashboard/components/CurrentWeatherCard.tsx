import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

import { landing } from '#/pages/home/landing'
import { fonts } from '#/theme/tokens'

import type { BrowserLocationState } from '../hooks/useBrowserLocation'
import type { CurrentWeather } from '../types'
import { weatherConditionFromCode } from '../weatherCondition'

type CurrentWeatherCardProps = {
  location: BrowserLocationState
  weather?: CurrentWeather
  isLoading: boolean
  isError: boolean
}

export function CurrentWeatherCard({
  location,
  weather,
  isLoading,
  isError,
}: CurrentWeatherCardProps) {
  const { t } = useTranslation()

  let body: string
  if (location.status === 'denied') {
    body = t('dashboard.weather.denied')
  } else if (location.status === 'unavailable') {
    body = t('dashboard.weather.unavailable')
  } else if (isError) {
    body = t('dashboard.weather.error')
  } else if (location.status === 'loading' || isLoading || !weather) {
    body = t('dashboard.weather.loading')
  } else {
    body = t(`dashboard.weather.${weatherConditionFromCode(weather.weatherCode)}`)
  }

  const temperature =
    location.status === 'ready' && weather && !isError
      ? t('dashboard.weather.temperature', { value: Math.round(weather.temperatureC) })
      : null
  const wind =
    location.status === 'ready' && weather && !isError
      ? t('dashboard.weather.wind', { value: Math.round(weather.windSpeedKmh) })
      : null

  return (
    <Box
      sx={{
        bgcolor: landing.surface,
        border: '1px solid',
        borderColor: landing.line,
        borderRadius: '12px',
        p: { xs: 3, md: 4 },
        maxWidth: 420,
      }}
    >
      <Typography
        sx={{
          color: landing.muted,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          mb: 2,
        }}
      >
        {t('dashboard.weather.title')}
      </Typography>
      {temperature ? (
        <Typography
          component="p"
          sx={{
            fontFamily: fonts.headline,
            fontSize: { xs: 40, md: 48 },
            lineHeight: 1.1,
            color: landing.cream,
            mb: 1,
          }}
        >
          {temperature}
        </Typography>
      ) : null}
      <Typography sx={{ color: temperature ? landing.muted : landing.cream, fontSize: 15 }}>
        {body}
      </Typography>
      {wind ? (
        <Typography sx={{ color: landing.muted, fontSize: 14, mt: 1 }}>{wind}</Typography>
      ) : null}
    </Box>
  )
}
