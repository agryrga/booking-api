import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import bookingRoutes from './routes/booking.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('API is running 🚀')
})

app.use('/api/auth', authRoutes)
app.use('/api/booking', bookingRoutes)

export default app
