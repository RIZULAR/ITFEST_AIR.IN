import { Router } from 'express'
import { supabase } from '../supabase.js'

const router = Router()

router.get('/rankings', async (req, res) => {
  const { data, error } = await supabase.from('priority_rankings').select('*, fields(name, area_hectares, crop_type), risk_scores(score)').order('created_at', { ascending: false }).order('rank', { ascending: true })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.post('/observations', async (req, res) => {
  const { data, error } = await supabase.from('field_observations').insert([req.body]).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

router.get('/recommendations', async (req, res) => {
  const { data, error } = await supabase.from('recommendations').select('*, fields(name, crop_type)').order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.post('/weather', async (req, res) => {
  const { data, error } = await supabase.from('weather_data').insert([req.body]).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(data)
})

export default router
