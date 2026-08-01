const toDb = {
  name: 'name', area_ha: 'area_hectares', lat: 'latitude', lon: 'longitude',
  plantingDate: 'plant_date', soilType: 'soil_type', crop_type: 'crop_type',
  variety: 'variety', polygonPoints: 'polygon_points', temp: 'temp',
  humidity: 'humidity', windSpeed: 'wind_speed', rainfall_mm: 'rainfall_mm',
  elevation: 'elevation', description: 'description', rainfall30d: 'rainfall30d',
}

const fromDb = {
  id: 'id', name: 'name', area_hectares: 'area_ha', latitude: 'lat', longitude: 'lon',
  plant_date: 'plantingDate', soil_type: 'soilType', crop_type: 'crop_type',
  variety: 'variety', polygon_points: 'polygonPoints', temp: 'temp',
  humidity: 'humidity', wind_speed: 'windSpeed', rainfall_mm: 'rainfall_mm',
  elevation: 'elevation', description: 'description', rainfall30d: 'rainfall30d',
  created_at: 'createdAt',
}

function mapToDb(f) {
  return Object.fromEntries(
    Object.entries(toDb).map(([k, v]) => [v, k === 'rainfall30d' && f[k] ? JSON.stringify(f[k]) : f[k]])
  )
}

function mapFromDb(f) {
  if (!f) return null
  const mapped = Object.fromEntries(Object.entries(fromDb).map(([k, v]) => [v, f[k]]))
  if (mapped.rainfall30d && typeof mapped.rainfall30d === 'string') {
    mapped.rainfall30d = JSON.parse(mapped.rainfall30d)
  }
  return mapped
}

function applyElNino(f, elNino = 0) {
  const avgRain = f.forecast?.[0]?.precipMm ?? f.rainfall30d?.avg_mm ?? f.rainfall_mm ?? 0
  return {
    ...f,
    rainfallMm: Math.max(0, avgRain * (1 - elNino * 0.08)),
    tempMax: (f.temp ?? 30) * (1 + elNino * 0.02),
  }
}

export { mapToDb, mapFromDb, applyElNino }
