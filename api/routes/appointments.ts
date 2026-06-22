import { Router, type Request, type Response } from 'express'
import { store } from '../data/store.js'
import type { Appointment } from '../../shared/types.js'

const router = Router()

router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const phone = req.query.phone as string | undefined
    const appointments = store.getAppointments({ phone })
    res.json({
      success: true,
      data: appointments,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取预约列表失败',
    })
  }
})

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      petId,
      ownerPhone,
      ownerName,
      clinicId,
      departmentId,
      doctorId,
      timeSlotId,
      appointmentDate,
      chiefComplaint,
      symptoms,
    } = req.body

    if (!ownerPhone || !clinicId || !departmentId || !doctorId || !appointmentDate) {
      res.status(400).json({
        success: false,
        error: '缺少必要参数',
      })
      return
    }

    let finalPetId = petId
    if (!finalPetId) {
      const owner = store.getPetOwnerByPhone(ownerPhone)
      const ownerId = owner ? owner.id : store.createPetOwner({ name: ownerName ?? '未知', phone: ownerPhone }).id
      const userPets = store.getPets({ ownerPhone })
      if (userPets.length > 0) {
        finalPetId = userPets[0].id
      } else {
        const newPet = store.createPet({
          ownerId,
          ownerPhone,
          name: req.body.petName ?? '未知宠物',
          species: req.body.petSpecies ?? '犬',
          breed: req.body.petBreed ?? '',
          age: req.body.petAge ?? 0,
          gender: req.body.petGender ?? 'male',
          weight: req.body.petWeight ?? 0,
          isNeutered: req.body.petIsNeutered ?? false,
          vaccineStatus: req.body.petVaccineStatus ?? '未知',
          avatar: '',
        })
        finalPetId = newPet.id
      }
    }

    const appointment = store.createAppointment({
      petId: finalPetId,
      ownerPhone,
      ownerName: ownerName ?? '',
      clinicId: Number(clinicId),
      departmentId: Number(departmentId),
      doctorId: Number(doctorId),
      timeSlotId: timeSlotId ? Number(timeSlotId) : 0,
      appointmentDate,
      chiefComplaint: chiefComplaint ?? '',
      symptoms: symptoms ?? [],
    })

    res.json({
      success: true,
      data: appointment,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建预约失败',
    })
  }
})

export default router
