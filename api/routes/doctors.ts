import { Router, type Request, type Response } from 'express'
import { store } from '../data/store.js'

const router = Router()

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const departmentId = req.query.departmentId ? Number(req.query.departmentId) : undefined
    const clinicId = req.query.clinicId ? Number(req.query.clinicId) : undefined
    const doctors = store.getDoctors({ departmentId, clinicId })
    res.json({
      success: true,
      data: doctors,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取医生列表失败',
    })
  }
})

router.get('/:id/timeslots', async (req: Request, res: Response): Promise<void> => {
  try {
    const doctorId = Number(req.params.id)
    const date = req.query.date as string | undefined
    const doctor = store.getDoctorById(doctorId)
    if (!doctor) {
      res.status(404).json({
        success: false,
        error: '医生不存在',
      })
      return
    }
    const slots = store.getTimeSlots({ doctorId, date })
    res.json({
      success: true,
      data: slots,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取出诊时段失败',
    })
  }
})

export default router
