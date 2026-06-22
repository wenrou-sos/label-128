/**
 * This is a API server
 */

import express, {
  type Request,
  type Response,
  type NextFunction,
} from 'express'
import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import authRoutes from './routes/auth.js'
import clinicsRoutes from './routes/clinics.js'
import departmentsRoutes from './routes/departments.js'
import doctorsRoutes from './routes/doctors.js'
import appointmentsRoutes from './routes/appointments.js'
import checkinRoutes from './routes/checkin.js'
import queueRoutes from './routes/queue.js'
import petsRoutes from './routes/pets.js'

// for esm mode
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// load env
dotenv.config()

const app: express.Application = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/**
 * API Routes
 */
app.use('/api/auth', authRoutes)
app.use('/api/clinics', clinicsRoutes)
app.use('/api/departments', departmentsRoutes)
app.use('/api/doctors', doctorsRoutes)
app.use('/api/appointments', appointmentsRoutes)
app.use('/api/checkin', checkinRoutes)
app.use('/api/queue', queueRoutes)
app.use('/api/pets', petsRoutes)

/**
 * health
 */
app.use(
  '/api/health',
  (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({
      success: true,
      message: 'ok',
    })
  },
)

/**
 * error handler middleware
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({
    success: false,
    error: 'Server internal error',
  })
})

/**
 * 404 handler
 */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'API not found',
  })
})

export default app
