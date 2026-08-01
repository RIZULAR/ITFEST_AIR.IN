import { Field, FieldRisk, WeatherData, GrowthStage } from '../types'
import { getSoilRiskScore } from './soilService'

/**
 * Nilai faktor fase pertumbuhan tanaman
 * Vegetatif / Generatif = 1.0 (kebutuhan air paling kritis)
 * Pra-Panen = 0.5
 * Panen = 0.1 (hampir tidak butuh irigasi)
 */
export function getGrowthStageScore(stage: GrowthStage): number {
  switch (stage) {
    case 'Vegetatif':
    case 'Generatif':
      return 1.0
    case 'Pra-Panen':
      return 0.5
    case 'Panen':
      return 0.1
    default:
      return 0.5
  }
}

/**
 * Menghitung skor kelangkaan air (Scarcity score) 0.0 - 1.0
 */
export function getScarcityScore(weather: WeatherData, elNinoSeverity: number = 1): number {
  // Rain deficit: jika hujan 0mm, scarcity tinggi.
  const rainDeficit = Math.max(0, 1 - weather.rain / 10)
  // Suhu tinggi meningkatkan kelangkaan
  const tempFactor = Math.min(1, Math.max(0, (weather.temperature - 25) / 15))
  // El nino factor (1 - 10 scale)
  const elNinoMultiplier = 1 + (elNinoSeverity - 1) * 0.08

  const baseScarcity = rainDeficit * 0.7 + tempFactor * 0.3
  return Math.min(1.0, baseScarcity * elNinoMultiplier)
}

/**
 * Menghitung Risk Score keseluruhan per Lahan berdasarkan formula Harvey.
 */
export function calculateFieldRisk(
  field: Field,
  weather: WeatherData,
  totalWaterSupplyLiters: number = 100000,
  elNinoSeverity: number = 1
): FieldRisk {
  const scarcity = getScarcityScore(weather, elNinoSeverity)
  const soilRisk = getSoilRiskScore(field.soilType)
  const growthScore = getGrowthStageScore(field.growthStage)
  const etScore = Math.min(1.0, weather.et0 / 8)

  // Formula Harvey: 40% scarcity + 20% soil + 25% growth + 15% ET
  const rawScore = scarcity * 0.40 + soilRisk * 0.20 + growthScore * 0.25 + etScore * 0.15
  const riskScore = Math.round(rawScore * 100)

  let riskLevel: FieldRisk['riskLevel'] = 'Rendah'
  if (riskScore >= 75) riskLevel = 'Kritis'
  else if (riskScore >= 55) riskLevel = 'Tinggi'
  else if (riskScore >= 35) riskLevel = 'Sedang'

  // Perhitungan kuota air yang direkomendasikan per hektar
  const baseWaterPerHa = 15000 // Liter per Ha untuk kebutuhan normal
  const rawRequirement = field.areaHa * baseWaterPerHa * (rawScore * 1.5)

  return {
    fieldId: field.id,
    fieldName: field.name,
    owner: field.owner,
    cropType: field.cropType,
    areaHa: field.areaHa,
    riskScore,
    scarcityScore: Math.round(scarcity * 100),
    soilRiskScore: Math.round(soilRisk * 100),
    growthStageScore: Math.round(growthScore * 100),
    etScore: Math.round(etScore * 100),
    riskLevel,
    recommendedWaterLiters: Math.round(rawRequirement),
    allocatedPercent: 0, // Akan dihitung proporsional pada total alokasi
  }
}

/**
 * Menghitung alokasi air proporsional untuk seluruh daftar lahan
 */
export function allocateWaterEquitably(
  fieldRisks: FieldRisk[],
  totalAvailableWaterLiters: number
): FieldRisk[] {
  const totalDemand = fieldRisks.reduce((acc, f) => acc + f.recommendedWaterLiters, 0)
  
  return fieldRisks.map((f) => {
    const allocated = totalDemand > 0
      ? Math.round((f.recommendedWaterLiters / totalDemand) * totalAvailableWaterLiters)
      : Math.round(totalAvailableWaterLiters / fieldRisks.length)

    const allocatedPercent = totalAvailableWaterLiters > 0
      ? Number(((allocated / totalAvailableWaterLiters) * 100).toFixed(1))
      : 0

    return {
      ...f,
      recommendedWaterLiters: allocated,
      allocatedPercent,
    }
  }).sort((a, b) => b.riskScore - a.riskScore) // Sisa sorted berdasarkan risk score tertinggi
}
