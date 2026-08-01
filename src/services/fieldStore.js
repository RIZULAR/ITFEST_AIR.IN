const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const API = `${BASE_URL}/api/fields`
const RISK_API = `${BASE_URL}/api/calculate-risk`
const RISK_BATCH_API = `${BASE_URL}/api/risks/batch`
const RISK_HISTORY_API = `${BASE_URL}/api/risks/history`

// Default mock initial agricultural fields for Surabaya/Sidoarjo/Jawa Timur
const INITIAL_MOCK_FIELDS = [
  {
    id: 'f-1',
    name: 'Lahan Padi Sidoarjo A',
    owner: 'Pak Sukirman',
    crop_type: 'Padi',
    soilType: 'Lempung',
    area_ha: 2.5,
    lat: -7.4478,
    lng: 112.7183,
    lon: 112.7183,
    plantingDate: '2026-06-01',
    sand_pct: 35,
    temp: 31,
    humidity: 68,
    windSpeed: 8,
    rainfall30d: { total_mm: 45, avg_mm: 1.5 },
    polygonPoints: [
      { lat: -7.4450, lng: 112.7150 },
      { lat: -7.4450, lng: 112.7210 },
      { lat: -7.4500, lng: 112.7210 },
      { lat: -7.4500, lng: 112.7150 }
    ]
  },
  {
    id: 'f-2',
    name: 'Lahan Jagung Mojokerto B',
    owner: 'Bu Hartini',
    crop_type: 'Jagung',
    soilType: 'Pasir',
    area_ha: 1.8,
    lat: -7.4722,
    lng: 112.4338,
    lon: 112.4338,
    plantingDate: '2026-05-15',
    sand_pct: 60,
    temp: 33,
    humidity: 62,
    windSpeed: 12,
    rainfall30d: { total_mm: 20, avg_mm: 0.6 },
    polygonPoints: [
      { lat: -7.4700, lng: 112.4310 },
      { lat: -7.4700, lng: 112.4360 },
      { lat: -7.4740, lng: 112.4360 },
      { lat: -7.4740, lng: 112.4310 }
    ]
  },
  {
    id: 'f-3',
    name: 'Lahan Tebu Lamongan C',
    owner: 'Pak Bambang',
    crop_type: 'Tebu',
    soilType: 'Liat',
    area_ha: 3.2,
    lat: -7.1186,
    lng: 112.4158,
    lon: 112.4158,
    plantingDate: '2026-04-10',
    sand_pct: 20,
    temp: 30,
    humidity: 75,
    windSpeed: 6,
    rainfall30d: { total_mm: 85, avg_mm: 2.8 },
    polygonPoints: [
      { lat: -7.1160, lng: 112.4130 },
      { lat: -7.1160, lng: 112.4180 },
      { lat: -7.1210, lng: 112.4180 },
      { lat: -7.1210, lng: 112.4130 }
    ]
  }
]

function getLocalFields() {
  try {
    const data = localStorage.getItem('harvey_fields')
    if (data) {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(f => ({
          ...f,
          lat: f.lat ?? f.latitude ?? -7.4478,
          lng: f.lng ?? f.lon ?? f.longitude ?? 112.7183,
          lon: f.lon ?? f.lng ?? f.longitude ?? 112.7183,
        }))
      }
    }
    localStorage.setItem('harvey_fields', JSON.stringify(INITIAL_MOCK_FIELDS))
    return INITIAL_MOCK_FIELDS
  } catch {
    return INITIAL_MOCK_FIELDS
  }
}

function saveLocalFields(fields) {
  try {
    localStorage.setItem('harvey_fields', JSON.stringify(fields))
  } catch {
    // ignore
  }
}

export async function storeField(field) {
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(field)
    })
    if (res.ok) return await res.json()
  } catch (err) {
    console.warn('Backend offline, saving field to LocalStorage fallback:', err)
  }

  const local = getLocalFields()
  const newField = {
    ...field,
    id: field.id || `f-${Date.now()}`,
    lat: field.lat ?? field.latitude ?? -7.4478,
    lng: field.lng ?? field.lon ?? field.longitude ?? 112.7183,
    lon: field.lon ?? field.lng ?? field.longitude ?? 112.7183,
    plantingDate: field.plantingDate || new Date().toISOString().split('T')[0]
  }
  local.unshift(newField)
  saveLocalFields(local)
  return newField
}

export async function getFields() {
  try {
    const res = await fetch(API)
    if (res.ok) return await res.json()
  } catch (err) {
    console.warn('Backend offline, loading fields from LocalStorage fallback:', err)
  }

  return getLocalFields()
}

export async function deleteField(id) {
  try {
    const res = await fetch(`${API}/${id}`, { method: 'DELETE' })
    if (res.ok) return
  } catch (err) {
    console.warn('Backend offline, deleting field from LocalStorage fallback:', err)
  }

  const local = getLocalFields().filter(f => f.id !== id)
  saveLocalFields(local)
}

export async function updateField(id, field) {
  try {
    const res = await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(field)
    })
    if (res.ok) return await res.json()
  } catch (err) {
    console.warn('Backend offline, updating field in LocalStorage fallback:', err)
  }

  const local = getLocalFields().map(f => f.id === id ? { ...f, ...field } : f)
  saveLocalFields(local)
  return { ...field, id }
}

export async function calculateRisk(field) {
  try {
    const res = await fetch(RISK_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        soilType: field.soilType,
        cropType: field.crop_type,
        plantDate: field.plantingDate,
        logDate: new Date().toISOString().split('T')[0],
        latitude: field.lat,
        tempMax: field.temp ?? 30,
        tempMin: (field.temp ?? 30) - 5,
        rainfallMm: field.rainfall30d?.avg_mm ?? field.rainfall_mm ?? 0,
        irrigationMm: 0,
      }),
    })
    if (res.ok) return await res.json()
  } catch {
    // fallback score logic
  }

  const temp = field.temp ?? 30
  const rainfall = field.rainfall30d?.total_mm ?? 30
  const scarcity = Math.min(1, Math.max(0, (1 - rainfall / 120) * (temp / 40)))
  const soilRisk = (field.sand_pct ?? 30) / 100
  const riskScore = Math.round((scarcity * 0.4 + soilRisk * 0.3 + 0.3) * 100) / 100

  return { riskScore, riskLevel: riskScore > 0.7 ? 'Kritis' : riskScore > 0.5 ? 'Tinggi' : 'Sedang' }
}

export async function calculateRiskBatch(fields, elNino = 0) {
  try {
    const payload = fields.map((f) => ({ ...f, elNino }))
    const res = await fetch(RISK_BATCH_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: payload }),
    })
    if (res.ok) return await res.json()
  } catch {
    // fallback
  }

  return fields.map((f, index) => {
    const temp = f.temp ?? 30
    const rainfall = f.rainfall30d?.total_mm ?? 30
    const scarcity = Math.min(1, Math.max(0, (1 - rainfall / 120) * (temp / 40))) * (1 + elNino * 0.08)
    const soilRisk = (f.sand_pct ?? 30) / 100
    const riskScore = Math.min(1, Math.max(0, scarcity * 0.4 + soilRisk * 0.3 + 0.3))
    return { index, riskScore }
  })
}

export async function getRiskHistory(fieldId, days = 30, elNino = 0) {
  try {
    const res = await fetch(`${RISK_HISTORY_API}/${fieldId}?days=${days}&elNino=${elNino}`)
    if (res.ok) return await res.json()
  } catch {
    // fallback
  }

  const history = []
  const today = new Date()
  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const baseScore = 0.45 + (Math.sin(i / 3) * 0.15) + (elNino * 0.04)
    history.push({
      date: date.toISOString().split('T')[0],
      riskScore: Math.min(1, Math.max(0.1, baseScore))
    })
  }
  return history
}
