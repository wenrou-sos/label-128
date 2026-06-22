import type {
  Clinic,
  Department,
  Doctor,
  TimeSlot,
  PetOwner,
  Pet,
  Appointment,
  Registration,
} from '../../shared/types.js'
import {
  clinics as initialClinics,
  departments as initialDepartments,
  doctors as initialDoctors,
  timeSlots as initialTimeSlots,
  petOwners as initialPetOwners,
  pets as initialPets,
  appointments as initialAppointments,
  registrations as initialRegistrations,
} from '../../shared/mockData.js'

const AVG_CONSULT_MINUTES = 20

class DataStore {
  private clinics: Clinic[] = [...initialClinics]
  private departments: Department[] = [...initialDepartments]
  private doctors: Doctor[] = [...initialDoctors]
  private timeSlots: TimeSlot[] = [...initialTimeSlots]
  private petOwners: PetOwner[] = [...initialPetOwners]
  private pets: Pet[] = [...initialPets]
  private appointments: Appointment[] = [...initialAppointments]
  private registrations: Registration[] = [...initialRegistrations]

  private nextClinicId = this.clinics.length + 1
  private nextDepartmentId = this.departments.length + 1
  private nextDoctorId = this.doctors.length + 1
  private nextTimeSlotId = this.timeSlots.length + 1
  private nextPetOwnerId = this.petOwners.length + 1
  private nextPetId = this.pets.length + 1
  private nextAppointmentId = this.appointments.length + 1
  private nextRegistrationId = this.registrations.length + 1

  private dailyAppointmentCounter = new Map<string, number>()
  private dailyRegistrationCounter = new Map<string, number>()

  private getDateStr(date?: Date): string {
    const d = date ?? new Date()
    return d.toISOString().split('T')[0].replace(/-/g, '')
  }

  generateAppointmentNo(): string {
    const dateStr = this.getDateStr()
    const current = this.dailyAppointmentCounter.get(dateStr) ?? 0
    const next = current + 1
    this.dailyAppointmentCounter.set(dateStr, next)
    return `YY${dateStr}-${String(next).padStart(4, '0')}`
  }

  generateRegistrationNo(): string {
    const dateStr = this.getDateStr()
    const current = this.dailyRegistrationCounter.get(dateStr) ?? 0
    const next = current + 1
    this.dailyRegistrationCounter.set(dateStr, next)
    return `GH${dateStr}-${String(next).padStart(4, '0')}`
  }

  calculateEstimatedWaitTime(doctorId: number, isEmergency: boolean): number {
    if (isEmergency) return 0
    const ahead = this.registrations.filter(
      (r) =>
        r.doctorId === doctorId &&
        (r.status === 'waiting' || r.status === 'visiting') &&
        r.isEmergency,
    ).length
    const normalAhead = this.registrations.filter(
      (r) =>
        r.doctorId === doctorId &&
        (r.status === 'waiting' || r.status === 'visiting') &&
        !r.isEmergency,
    ).length
    return (ahead + normalAhead) * AVG_CONSULT_MINUTES
  }

  getNextQueueNumber(doctorId: number): number {
    const today = this.getDateStr()
    const todayRegistrations = this.registrations.filter(
      (r) =>
        r.doctorId === doctorId &&
        this.getDateStr(new Date(r.checkedInAt)) === today,
    )
    return todayRegistrations.length + 1
  }

  getClinics(): Clinic[] {
    return [...this.clinics]
  }

  getDepartments(): Department[] {
    return [...this.departments]
  }

  getDoctors(params?: { departmentId?: number; clinicId?: number }): Doctor[] {
    return this.doctors.filter((d) => {
      if (params?.departmentId != null && d.departmentId !== params.departmentId) return false
      if (params?.clinicId != null && d.clinicId !== params.clinicId) return false
      return d.status === 'active'
    })
  }

  getDoctorById(id: number): Doctor | undefined {
    return this.doctors.find((d) => d.id === id)
  }

  getTimeSlots(params: { doctorId: number; date?: string }): TimeSlot[] {
    return this.timeSlots.filter((ts) => {
      if (ts.doctorId !== params.doctorId) return false
      if (params.date != null && ts.date !== params.date) return false
      return true
    })
  }

  getTimeSlotById(id: number): TimeSlot | undefined {
    return this.timeSlots.find((ts) => ts.id === id)
  }

  updateTimeSlotBooked(id: number, delta: number): TimeSlot | undefined {
    const ts = this.timeSlots.find((x) => x.id === id)
    if (!ts) return undefined
    ts.booked = Math.max(0, Math.min(ts.capacity, ts.booked + delta))
    ts.status = ts.booked >= ts.capacity ? 'full' : ts.status === 'closed' ? 'closed' : 'available'
    return ts
  }

  getPetOwners(): PetOwner[] {
    return [...this.petOwners]
  }

  getPetOwnerByPhone(phone: string): PetOwner | undefined {
    return this.petOwners.find((o) => o.phone === phone)
  }

  createPetOwner(data: Omit<PetOwner, 'id'>): PetOwner {
    const owner: PetOwner = { id: this.nextPetOwnerId++, ...data }
    this.petOwners.push(owner)
    return owner
  }

  getPets(params?: { ownerPhone?: string }): Pet[] {
    return this.pets.filter((p) => {
      if (params?.ownerPhone != null && p.ownerPhone !== params.ownerPhone) return false
      return true
    })
  }

  getPetById(id: number): Pet | undefined {
    return this.pets.find((p) => p.id === id)
  }

  createPet(data: Omit<Pet, 'id'>): Pet {
    const pet: Pet = { id: this.nextPetId++, ...data }
    this.pets.push(pet)
    return pet
  }

  getAppointments(params?: { phone?: string }): Appointment[] {
    return this.appointments.filter((a) => {
      if (params?.phone != null && a.ownerPhone !== params.phone) return false
      return true
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  getAppointmentById(id: number): Appointment | undefined {
    return this.appointments.find((a) => a.id === id)
  }

  createAppointment(data: Omit<Appointment, 'id' | 'appointmentNo' | 'status' | 'createdAt'>): Appointment {
    const apt: Appointment = {
      id: this.nextAppointmentId++,
      appointmentNo: this.generateAppointmentNo(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      ...data,
    }
    this.appointments.push(apt)
    if (apt.timeSlotId) {
      this.updateTimeSlotBooked(apt.timeSlotId, 1)
    }
    return apt
  }

  updateAppointmentStatus(id: number, status: Appointment['status']): Appointment | undefined {
    const apt = this.appointments.find((a) => a.id === id)
    if (!apt) return undefined
    apt.status = status
    return apt
  }

  getRegistrations(params?: { doctorId?: number; clinicId?: number; departmentId?: number }): Registration[] {
    const filtered = this.registrations.filter((r) => {
      if (params?.doctorId != null && r.doctorId !== params.doctorId) return false
      if (params?.clinicId != null && r.clinicId !== params.clinicId) return false
      if (params?.departmentId != null && r.departmentId !== params.departmentId) return false
      return true
    })
    return filtered.sort((a, b) => {
      if (a.isEmergency !== b.isEmergency) return a.isEmergency ? -1 : 1
      return new Date(a.checkedInAt).getTime() - new Date(b.checkedInAt).getTime()
    })
  }

  getRegistrationByNo(registrationNo: string): Registration | undefined {
    return this.registrations.find((r) => r.registrationNo === registrationNo)
  }

  createRegistration(data: Omit<Registration, 'id' | 'registrationNo' | 'queueNumber' | 'estimatedWaitTime' | 'status' | 'checkedInAt'> & { isEmergency?: boolean }): Registration {
    const isEmergency = data.isEmergency ?? false
    const reg: Registration = {
      id: this.nextRegistrationId++,
      registrationNo: this.generateRegistrationNo(),
      queueNumber: this.getNextQueueNumber(data.doctorId),
      estimatedWaitTime: this.calculateEstimatedWaitTime(data.doctorId, isEmergency),
      status: 'waiting',
      checkedInAt: new Date().toISOString(),
      isEmergency,
      ...data,
    }
    this.registrations.push(reg)
    this.recalculateQueue(reg.doctorId)
    return reg
  }

  callRegistration(registrationNo: string): Registration | undefined {
    const reg = this.registrations.find((r) => r.registrationNo === registrationNo)
    if (!reg) return undefined
    reg.status = 'visiting'
    reg.calledAt = new Date().toISOString()
    this.recalculateQueue(reg.doctorId)
    return reg
  }

  completeRegistration(registrationNo: string): Registration | undefined {
    const reg = this.registrations.find((r) => r.registrationNo === registrationNo)
    if (!reg) return undefined
    reg.status = 'completed'
    reg.completedAt = new Date().toISOString()
    this.recalculateQueue(reg.doctorId)
    return reg
  }

  skipRegistration(registrationNo: string): Registration | undefined {
    const reg = this.registrations.find((r) => r.registrationNo === registrationNo)
    if (!reg) return undefined
    reg.status = 'skipped'
    this.recalculateQueue(reg.doctorId)
    return reg
  }

  markEmergency(registrationNo: string): Registration | undefined {
    const reg = this.registrations.find((r) => r.registrationNo === registrationNo)
    if (!reg) return undefined
    reg.isEmergency = true
    reg.estimatedWaitTime = 0
    this.recalculateQueue(reg.doctorId)
    return reg
  }

  private recalculateQueue(doctorId: number): void {
    const today = this.getDateStr()
    const docRegs = this.registrations
      .filter(
        (r) =>
          r.doctorId === doctorId &&
          this.getDateStr(new Date(r.checkedInAt)) === today,
      )
      .sort((a, b) => {
        if (a.isEmergency !== b.isEmergency) return a.isEmergency ? -1 : 1
        return new Date(a.checkedInAt).getTime() - new Date(b.checkedInAt).getTime()
      })

    let emergencyCount = 0
    let normalCount = 0
    docRegs.forEach((r) => {
      if (r.isEmergency) {
        emergencyCount++
      } else {
        normalCount++
      }
      if (r.status === 'waiting') {
        const aheadEmergency = r.isEmergency ? 0 : emergencyCount - 1
        const aheadNormal = r.isEmergency ? 0 : normalCount - 1
        r.estimatedWaitTime = (aheadEmergency + aheadNormal) * AVG_CONSULT_MINUTES
      } else if (r.status === 'visiting') {
        r.estimatedWaitTime = 0
      }
    })
  }
}

export const store = new DataStore()
export default store
