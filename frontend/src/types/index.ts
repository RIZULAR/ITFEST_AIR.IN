export type SoilType = 'Berpasir' | 'Lempung' | 'Liat' | 'Organik' | 'Lempung Berpasir'

export type GrowthStage = 'Vegetatif' | 'Generatif' | 'Pra-Panen' | 'Panen'

export interface GeoPoint {
  lat: number
  lng: number
}

export interface Field {
  id: string
  name: string
  owner: string
  cropType: string
  soilType: SoilType
  growthStage: GrowthStage
  areaHa: number // luas hektar
  coordinates: GeoPoint[] // polygon coordinates
  center: GeoPoint
  lastIrrigated: string
  notes?: string
}

export interface WeatherData {
  temperature: number
  humidity: number
  rain: number
  windSpeed: number
  weatherCode: number
  weatherDesc: string
  forecast5Days: Array<{
    date: string
    maxTemp: number
    minTemp: number
    rainSum: number
    weatherDesc: string
  }>
  et0: number // Evapotranspiration approximation
}

export interface FieldRisk {
  fieldId: string
  fieldName: string
  owner: string
  cropType: string
  areaHa: number
  riskScore: number // 0 - 100
  scarcityScore: number
  soilRiskScore: number
  growthStageScore: number
  etScore: number
  riskLevel: 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis'
  recommendedWaterLiters: number
  allocatedPercent: number
}

export interface IrrigationSchedule {
  id: string
  fieldId: string
  fieldName: string
  scheduledDate: string
  waterVolumeLiters: number
  status: 'Dijadwalkan' | 'Selesai' | 'Dilewati'
  notes: string
}
