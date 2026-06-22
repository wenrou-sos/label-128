import { Router, type Request, type Response } from 'express'
import { store } from '../data/store.js'

const router = Router()

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { appointmentId, phone, isEmergency } = req.body

    if (!appointmentId && !phone) {
      res.status(400).json({
        success: false,
        error: '请提供预约ID或手机号',
      })
      return
    }

    let appointment
    if (appointmentId) {
      appointment = store.getAppointmentById(Number(appointmentId))
    } else if (phone) {
      const apts = store.getAppointments({ phone })
      if (apts.length > 0) {
        appointment = apts[0]
      }
    }

    if (!appointment) {
      res.status(404).json({
        success: false,
        error: '未找到对应预约',
      })
      return
    }

    const doctor = store.getDoctorById(appointment.doctorId)
    if (!doctor) {
      res.status(404).json({
        success: false,
        error: '医生信息不存在',
      })
      return
    }

    store.updateAppointmentStatus(appointment.id, 'confirmed')

    const registration = store.createRegistration({
      appointmentId: appointment.id,
      petId: appointment.petId,
      clinicId: appointment.clinicId,
      departmentId: appointment.departmentId,
      doctorId: appointment.doctorId,
      roomNumber: doctor.roomNumber,
      isEmergency: isEmergency ?? false,
    })

    const pet = store.getPetById(appointment.petId)

    res.json({
      success: true,
      data: {
        registration,
        appointment,
        pet,
        doctor,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '到店确认失败',
    })
  }
})

export default router
