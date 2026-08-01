import cors from 'cors'
import express from 'express'

import fieldsRouter from './routes/fields.js'
import miscRouter from './routes/misc.js'
import risksRouter from './routes/risks.js'

const app = express()
app.use(cors('*'))
app.use(express.json({ limit: '10mb' }))

app.get('/', (req, res) => {
  res.json({ message: 'AIR.IN / Harvey Express API Engine running!', version: '2.0.0' })
})

app.use('/api/fields', fieldsRouter)
app.use('/api/risks', risksRouter)
app.use('/api', miscRouter)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

export default app
