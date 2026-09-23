import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

import { landing, landingCardSx, landingEyebrowSx, landingStatSx } from '#/pages/home/landing'

import type { BrowserLocationState } from '../hooks/useBrowserLocation'
import { dashboardCardSx } from '../layout'
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

  const showMetrics = location.status === 'ready' && weather != null && !isError
  const temperature = showMetrics
    ? t('dashboard.weather.temperature', { value: Math.round(weather.temperatureC) })
    : null
  const wind = showMetrics
    ? t('dashboard.weather.wind', { value: Math.round(weather.windSpeedKmh) })
    : null

  return (
    <Box sx={{ ...landingCardSx, ...dashboardCardSx }}>
      <Typography sx={landingEyebrowSx}>{t('dashboard.weather.title')}</Typography>
      {temperature ? (
        <Typography component="p" sx={{ ...landingStatSx, mb: 1 }}>
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
