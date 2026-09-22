import { createApi } from '@reduxjs/toolkit/query/react'
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query'

import type { Coordinates, CurrentWeather } from '../types'

const OPEN_METEO_BASE_URL = 'https://api.open-meteo.com'

type OpenMeteoForecast = {
  current: {
    time: string
    temperature_2m: number
    weather_code: number
    wind_speed_10m: number
  }
}

const openMeteoBaseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
) => {
  const request = typeof args === 'string' ? { url: args } : args
  const url = new URL(request.url, OPEN_METEO_BASE_URL)

  if (request.params) {
    for (const [key, value] of Object.entries(request.params)) {
      if (value === undefined || value === null) {
        continue
      }
      url.searchParams.set(key, String(value))
    }
  }

  try {
    const response = await fetch(url)
    const data: unknown = await response.json()
    if (!response.ok) {
      return { error: { status: response.status, data } }
    }
    return { data }
  } catch (error) {
    return {
      error: {
        status: 'FETCH_ERROR',
        error: error instanceof Error ? error.message : String(error),
      },
    }
  }
}

export const weatherApi = createApi({
  reducerPath: 'weatherApi',
  baseQuery: openMeteoBaseQuery,
  endpoints: (build) => ({
    getCurrentWeather: build.query<CurrentWeather, Coordinates>({
      query: ({ latitude, longitude }) => ({
        url: '/v1/forecast',
        params: {
          latitude,
          longitude,
          current: 'temperature_2m,weather_code,wind_speed_10m',
          timezone: 'auto',
        },
      }),
      transformResponse: (response: OpenMeteoForecast): CurrentWeather => ({
        temperatureC: response.current.temperature_2m,
        weatherCode: response.current.weather_code,
        windSpeedKmh: response.current.wind_speed_10m,
        time: response.current.time,
      }),
    }),
  }),
})

export const { useGetCurrentWeatherQuery } = weatherApi
