import { WeatherData } from '../types'

const WEATHER_CODE_MAP: Record<number, string> = {
  0: 'Cerah',
  1: 'Cerah Berawan',
  2: 'Berawan',
  3: 'Mendung',
  45: 'Kabut',
  48: 'Kabut Teball',
  51: 'Gerimis Ringan',
  53: 'Gerimis Sedang',
  55: 'Gerimis Lebat',
  61: 'Hujan Ringan',
  63: 'Hujan Sedang',
  65: 'Hujan Lebat',
  80: 'Hujan Lokal',
  95: 'Hujan Badai',
}

/**
 * Fetch data cuaca dari Open-Meteo REST API (Free, No API Key needed)
 */
export async function fetchWeatherData(lat: number = -7.250445, lng: number = 112.768845): Promise<WeatherData> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,rain,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,rain_sum,et0_fao_evapotranspiration&timezone=auto`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch Open-Meteo data')
    
    const data = await res.json()
    const current = data.current || {}
    const daily = data.daily || {}

    const forecast5Days = (daily.time || []).slice(0, 5).map((timeStr: string, idx: number) => ({
      date: timeStr,
      maxTemp: daily.temperature_2m_max?.[idx] ?? 32,
      minTemp: daily.temperature_2m_min?.[idx] ?? 24,
      rainSum: daily.rain_sum?.[idx] ?? 0,
      weatherDesc: WEATHER_CODE_MAP[daily.weather_code?.[idx] ?? 0] || 'Cerah',
    }))

    const et0Sum = (daily.et0_fao_evapotranspiration || []).slice(0, 5).reduce((a: number, b: number) => a + b, 0) / 5 || 4.2

    return {
      temperature: current.temperature_2m ?? 31.5,
      humidity: current.relative_humidity_2m ?? 72,
      rain: current.rain ?? 0,
      windSpeed: current.wind_speed_10m ?? 12,
      weatherCode: current.weather_code ?? 0,
      weatherDesc: WEATHER_CODE_MAP[current.weather_code ?? 0] || 'Cerah Berawan',
      forecast5Days,
      et0: Number(et0Sum.toFixed(2)),
    }
  } catch (err) {
    console.warn('Using fallback weather data:', err)
    // Fallback data if offline or network error
    return {
      temperature: 32.4,
      humidity: 68,
      rain: 0,
      windSpeed: 14.2,
      weatherCode: 1,
      weatherDesc: 'Cerah Berawan',
      forecast5Days: [
        { date: 'Hari ini', maxTemp: 33, minTemp: 25, rainSum: 0, weatherDesc: 'Cerah Berawan' },
        { date: 'Besok', maxTemp: 34, minTemp: 25, rainSum: 0.2, weatherDesc: 'Cerah' },
        { date: 'Lusa', maxTemp: 32, minTemp: 24, rainSum: 1.5, weatherDesc: 'Berawan' },
        { date: 'Hari 4', maxTemp: 31, minTemp: 24, rainSum: 4.8, weatherDesc: 'Hujan Ringan' },
        { date: 'Hari 5', maxTemp: 33, minTemp: 25, rainSum: 0, weatherDesc: 'Cerah' },
      ],
      et0: 4.5,
    }
  }
}
