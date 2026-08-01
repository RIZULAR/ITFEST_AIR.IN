import { SoilType } from '../types'

/**
 * Mendapatkan nilai risiko daya simpan air berdasarkan jenis tanah.
 * Tanah berpasir = 1.0 (daya simpan air rendah -> risiko tinggi)
 * Tanah liat = 0.3 (daya simpan air tinggi -> risiko rendah)
 */
export function getSoilRiskScore(soilType: SoilType): number {
  switch (soilType) {
    case 'Berpasir':
      return 1.0
    case 'Lempung Berpasir':
      return 0.8
    case 'Lempung':
      return 0.5
    case 'Organik':
      return 0.4
    case 'Liat':
      return 0.3
    default:
      return 0.5
  }
}
