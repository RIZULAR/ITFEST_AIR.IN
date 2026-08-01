import { Router } from 'express'
import { supabase } from '../supabase.js'
import { calculateDailyRiskScore } from '../services/risk-engine.js'
import { applyElNino } from '../utils/mapping.js'

const router = Router()

router.post('/calculate-risk', (req, res) => {
  try {
    res.json(calculateDailyRiskScore(req.body))
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

router.post('/batch', (req, res) => {
  const { fields } = req.body
  if (!Array.isArray(fields)) return res.status(400).json({ error: 'fields must be an array' })
  const elNino = fields[0]?.elNino ?? 0
  const today = new Date().toISOString().split('T')[0]
  const results = fields.map((f, i) => {
    try {
      const adj = applyElNino(f, elNino)
      return { index: i, ...calculateDailyRiskScore({ soilType: f.soilType, cropType: f.crop_type ?? 'Padi', plantDate: f.plantingDate, logDate: today, latitude: f.lat, tempMax: adj.tempMax, tempMin: adj.tempMax - 5, rainfallMm: adj.rainfallMm, irrigationMm: f.irrigation_mm ?? 0 }) }
    } catch (e) {
      return { index: i, error: e.message }
    }
  })
  res.json(results)
})

router.get('/history/:fieldId', async (req, res) => {
  const { fieldId } = req.params
  const limit = Math.min(parseInt(req.query.days) || 30, 365)
  const elNino = parseFloat(req.query.elNino) || 0

  const { data: field, error: fieldError } = await supabase.from('fields').select('*').eq('id', fieldId).single()
  if (fieldError) return res.status(404).json({ error: 'field not found' })

  const { data: weatherRows } = await supabase.from('weather_data').select('*').eq('field_id', fieldId).order('recorded_at', { ascending: false }).limit(limit)
  const weatherMap = {}
  weatherRows?.forEach(w => { weatherMap[new Date(w.recorded_at).toISOString().split('T')[0]] = { rainfall_mm: w.rainfall_mm ?? 0, temp_max: w.temp_max ?? w.temp ?? 30 } })

  const history = []
  for (let i = limit - 1; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const w = weatherMap[dateStr] || {}
    const adj = applyElNino({ ...field, rainfall_mm: w.rainfall_mm ?? field.rainfall_mm, temp: w.temp_max ?? field.temp }, elNino)
    try {
      history.push({ date: dateStr, ...calculateDailyRiskScore({ soilType: field.soil_type, cropType: field.crop_type, plantDate: field.plant_date, logDate: dateStr, latitude: field.latitude, tempMax: adj.tempMax, tempMin: adj.tempMax - 5, rainfallMm: adj.rainfallMm, irrigationMm: 0 }) })
    } catch (e) {
      history.push({ date: dateStr, error: e.message })
    }
  }
  res.json(history)
})

export default router
