export type Coordinates = {
  latitude: number
  longitude: number
}

export type CurrentWeather = {
  temperatureC: number
  weatherCode: number
  windSpeedKmh: number
  time: string
}

export type WeatherCondition = 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm'
