const BASE_URL = import.meta.env.VITE_API_URL || 'https://air-in-be.vercel.app'
const API = `${BASE_URL}/api/fields`
const RISK_API = `${BASE_URL}/api/calculate-risk`
const RISK_BATCH_API = `${BASE_URL}/api/risks/batch`
const RISK_HISTORY_API = `${BASE_URL}/api/risks/history`

const INITIAL_MOCK_FIELDS = []

function getLocalFields() {
  try {
    const data = localStorage.getItem('harvey_fields')
    if (data) {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed)) {
        return parsed.map(f => ({
          ...f,
          lat: f.lat ?? f.latitude ?? -7.4478,
          lng: f.lng ?? f.lon ?? f.longitude ?? 112.7183,
          lon: f.lon ?? f.lng ?? f.longitude ?? 112.7183,
        }))
      }
    }
    return []
  } catch {
    return []
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
