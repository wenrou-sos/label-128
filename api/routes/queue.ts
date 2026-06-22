import { Router, type Request, type Response } from 'express'
import { store } from '../data/store.js'

const router = Router()

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const doctorId = req.query.doctorId ? Number(req.query.doctorId) : undefined
    const clinicId = req.query.clinicId ? Number(req.query.clinicId) : undefined
    const registrations = store.getRegistrations({ doctorId, clinicId })

    const enriched = await Promise.all(
      registrations.map(async (reg) => {
        const pet = store.getPetById(reg.petId)
        const doctor = store.getDoctorById(reg.doctorId)
        const appointment = reg.appointmentId ? store.getAppointmentById(reg.appointmentId) : undefined
        return {
          ...reg,
          pet,
          doctor,
          appointment,
        }
      }),
    )

    res.json({
      success: true,
      data: enriched,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取队列失败',
    })
  }
})

router.post('/:registrationNo/call', async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationNo } = req.params
    const reg = store.callRegistration(registrationNo)
    if (!reg) {
      res.status(404).json({
        success: false,
        error: '挂号单不存在',
      })
      return
    }
    res.json({
      success: true,
      data: reg,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '叫号失败',
    })
  }
})

router.post('/:registrationNo/complete', async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationNo } = req.params
    const reg = store.completeRegistration(registrationNo)
    if (!reg) {
      res.status(404).json({
        success: false,
        error: '挂号单不存在',
      })
      return
    }
    res.json({
      success: true,
      data: reg,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '完成就诊失败',
    })
  }
})

router.post('/:registrationNo/skip', async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationNo } = req.params
    const reg = store.skipRegistration(registrationNo)
    if (!reg) {
      res.status(404).json({
        success: false,
        error: '挂号单不存在',
      })
      return
    }
    res.json({
      success: true,
      data: reg,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '过号操作失败',
    })
  }
})

router.post('/:registrationNo/emergency', async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationNo } = req.params
    const reg = store.markEmergency(registrationNo)
    if (!reg) {
      res.status(404).json({
        success: false,
        error: '挂号单不存在',
      })
      return
    }
    res.json({
      success: true,
      data: reg,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '标记急诊失败',
    })
  }
})

export default router
