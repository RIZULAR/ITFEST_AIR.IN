import { Router } from 'express'
import { supabase } from '../supabase.js'
import { mapToDb, mapFromDb } from '../utils/mapping.js'

const router = Router()

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('fields').select('*').order('created_at', { ascending: false })
  if (error) return res.status(500).json({ error: error.message })
  res.json(data.map(mapFromDb))
})

router.post('/', async (req, res) => {
  const { data, error } = await supabase.from('fields').insert([mapToDb(req.body)]).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.status(201).json(mapFromDb(data))
})

router.put('/:id', async (req, res) => {
  const { data, error } = await supabase.from('fields').update({ ...mapToDb(req.body), updated_at: new Date().toISOString() }).eq('id', req.params.id).select().single()
  if (error) return res.status(500).json({ error: error.message })
  res.json(mapFromDb(data))
})

router.delete('/:id', async (req, res) => {
  const { error } = await supabase.from('fields').delete().eq('id', req.params.id)
  if (error) return res.status(500).json({ error: error.message })
  res.status(204).end()
})

router.get('/:id/weather', async (req, res) => {
  const { data, error } = await supabase.from('weather_data').select('*').eq('field_id', req.params.id).order('recorded_at', { ascending: false }).limit(30)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

router.get('/:id/risks', async (req, res) => {
  const { data, error } = await supabase.from('risk_scores').select('*').eq('field_id', req.params.id).order('calculated_at', { ascending: false }).limit(30)
  if (error) return res.status(500).json({ error: error.message })
  res.json(data)
})

export default router
