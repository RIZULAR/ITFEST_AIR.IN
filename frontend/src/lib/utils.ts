import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLiters(liters: number): string {
  if (liters >= 1000000) {
    return (liters / 1000000).toFixed(1) + ' Juta L'
  }
  if (liters >= 1000) {
    return (liters / 1000).toFixed(0) + ' Ribu L'
  }
  return liters.toLocaleString('id-ID') + ' L'
}

export function formatNumber(num: number, decimals: number = 1): string {
  return num.toLocaleString('id-ID', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
