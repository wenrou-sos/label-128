import type {
  Clinic,
  Department,
  Doctor,
  TimeSlot,
  Appointment,
  Registration,
  Pet,
} from '../../shared/types'

interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

const BASE_URL = '/api'

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${path}`
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}))
    throw new Error((errData as { error?: string }).error || `请求失败: ${response.status}`)
  }

  const result = (await response.json()) as ApiResponse<T>

  if (!result.success) {
    throw new Error(result.error || '请求失败')
  }

  return result.data
}

export interface GetDoctorsParams {
  departmentId?: number
  clinicId?: number
}

export interface GetDoctorTimeSlotsParams {
  date?: string
}

export interface GetAppointmentsParams {
  phone: string
}

export interface CreateAppointmentData {
  petId?: number
  ownerPhone: string
  ownerName?: string
  clinicId: number
  departmentId: number
  doctorId: number
  timeSlotId?: number
  appointmentDate: string
  chiefComplaint?: string
  symptoms?: string[]
  petName?: string
  petSpecies?: string
  petBreed?: string
  petAge?: number
  petGender?: 'male' | 'female'
  petWeight?: number
  petIsNeutered?: boolean
  petVaccineStatus?: string
}

export interface CheckInData {
  appointmentId?: number
  phone?: string
  isEmergency?: boolean
}

export interface GetQueueParams {
  doctorId?: number
  clinicId?: number
  departmentId?: number
}

export interface CreatePetData {
  ownerPhone: string
  ownerName?: string
  name: string
  species?: string
  breed?: string
  age?: number
  gender?: 'male' | 'female'
  weight?: number
  isNeutered?: boolean
  vaccineStatus?: string
  avatar?: string
}

export interface EnrichedRegistration extends Registration {
  pet: Pet | undefined
  doctor: Doctor | undefined
  appointment: Appointment | undefined
}

export const api = {
  getClinics: (): Promise<Clinic[]> => {
    return request<Clinic[]>('/clinics')
  },

  getDepartments: (): Promise<Department[]> => {
    return request<Department[]>('/departments')
  },

  getDoctors: (params: GetDoctorsParams = {}): Promise<Doctor[]> => {
    const searchParams = new URLSearchParams()
    if (params.departmentId !== undefined) {
      searchParams.append('departmentId', String(params.departmentId))
    }
    if (params.clinicId !== undefined) {
      searchParams.append('clinicId', String(params.clinicId))
    }
    const query = searchParams.toString()
    return request<Doctor[]>(`/doctors${query ? `?${query}` : ''}`)
  },

  getDoctorTimeSlots: (
    doctorId: number,
    date?: string
  ): Promise<TimeSlot[]> => {
    const searchParams = new URLSearchParams()
    if (date) {
      searchParams.append('date', date)
    }
    const query = searchParams.toString()
    return request<TimeSlot[]>(
      `/doctors/${doctorId}/timeslots${query ? `?${query}` : ''}`
    )
  },

  getAppointments: (phone: string): Promise<Appointment[]> => {
    const searchParams = new URLSearchParams()
    searchParams.append('phone', phone)
    return request<Appointment[]>(`/appointments?${searchParams.toString()}`)
  },

  createAppointment: (data: CreateAppointmentData): Promise<Appointment> => {
    return request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  checkIn: (data: CheckInData): Promise<{
    registration: Registration
    appointment: Appointment
    pet: Pet
    doctor: Doctor
  }> => {
    return request('/checkin', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  getQueue: (params: GetQueueParams = {}): Promise<EnrichedRegistration[]> => {
    const searchParams = new URLSearchParams()
    if (params.doctorId !== undefined) {
      searchParams.append('doctorId', String(params.doctorId))
    }
    if (params.clinicId !== undefined) {
      searchParams.append('clinicId', String(params.clinicId))
    }
    if (params.departmentId !== undefined) {
      searchParams.append('departmentId', String(params.departmentId))
    }
    const query = searchParams.toString()
    return request<EnrichedRegistration[]>(`/queue${query ? `?${query}` : ''}`)
  },

  callRegistration: (no: string): Promise<Registration> => {
    return request<Registration>(`/queue/${no}/call`, {
      method: 'POST',
    })
  },

  completeRegistration: (no: string): Promise<Registration> => {
    return request<Registration>(`/queue/${no}/complete`, {
      method: 'POST',
    })
  },

  skipRegistration: (no: string): Promise<Registration> => {
    return request<Registration>(`/queue/${no}/skip`, {
      method: 'POST',
    })
  },

  markEmergency: (no: string): Promise<Registration> => {
    return request<Registration>(`/queue/${no}/emergency`, {
      method: 'POST',
    })
  },

  getPets: (ownerPhone: string): Promise<Pet[]> => {
    const searchParams = new URLSearchParams()
    searchParams.append('ownerPhone', ownerPhone)
    return request<Pet[]>(`/pets?${searchParams.toString()}`)
  },

  createPet: (data: CreatePetData): Promise<Pet> => {
    return request<Pet>('/pets', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}

export default api
