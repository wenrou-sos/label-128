import { create } from 'zustand'
import type { Clinic, Department, Doctor, TimeSlot, Appointment } from '../../shared/types'

interface PetForm {
  name: string
  species: string
  breed: string
  age: string
  gender: 'male' | 'female' | ''
  weight: string
  isNeutered: boolean
  vaccineStatus: string
}

interface OwnerForm {
  name: string
  phone: string
}

interface AppointmentState {
  currentStep: number
  selectedClinic: Clinic | null
  selectedDepartment: Department | null
  selectedDoctor: Doctor | null
  selectedDate: string
  selectedTimeSlot: TimeSlot | null
  pet: PetForm
  owner: OwnerForm
  symptoms: string[]
  chiefComplaint: string
  createdAppointment: Appointment | null

  setCurrentStep: (step: number) => void
  setSelectedClinic: (clinic: Clinic | null) => void
  setSelectedDepartment: (department: Department | null) => void
  setSelectedDoctor: (doctor: Doctor | null) => void
  setSelectedDate: (date: string) => void
  setSelectedTimeSlot: (timeSlot: TimeSlot | null) => void
  setPet: (form: Partial<PetForm>) => void
  setOwner: (form: Partial<OwnerForm>) => void
  setSymptoms: (symptoms: string[]) => void
  setChiefComplaint: (complaint: string) => void
  setCreatedAppointment: (apt: Appointment | null) => void
  reset: () => void
}

const initialPet: PetForm = {
  name: '',
  species: '',
  breed: '',
  age: '',
  gender: '',
  weight: '',
  isNeutered: false,
  vaccineStatus: '',
}

const initialOwner: OwnerForm = {
  name: '',
  phone: '',
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  currentStep: 1,
  selectedClinic: null,
  selectedDepartment: null,
  selectedDoctor: null,
  selectedDate: '',
  selectedTimeSlot: null,
  pet: initialPet,
  owner: initialOwner,
  symptoms: [],
  chiefComplaint: '',
  createdAppointment: null,

  setCurrentStep: (step) => set({ currentStep: step }),
  setSelectedClinic: (clinic) => set({ selectedClinic: clinic }),
  setSelectedDepartment: (department) =>
    set({ selectedDepartment: department, selectedDoctor: null, selectedTimeSlot: null }),
  setSelectedDoctor: (doctor) => set({ selectedDoctor: doctor, selectedTimeSlot: null }),
  setSelectedDate: (date) => set({ selectedDate: date, selectedTimeSlot: null }),
  setSelectedTimeSlot: (timeSlot) => set({ selectedTimeSlot: timeSlot }),
  setPet: (form) => set((state) => ({ pet: { ...state.pet, ...form } })),
  setOwner: (form) => set((state) => ({ owner: { ...state.owner, ...form } })),
  setSymptoms: (symptoms) => set({ symptoms }),
  setChiefComplaint: (complaint) => set({ chiefComplaint: complaint }),
  setCreatedAppointment: (apt) => set({ createdAppointment: apt }),

  reset: () =>
    set({
      currentStep: 1,
      selectedClinic: null,
      selectedDepartment: null,
      selectedDoctor: null,
      selectedDate: '',
      selectedTimeSlot: null,
      pet: initialPet,
      owner: initialOwner,
      symptoms: [],
      chiefComplaint: '',
      createdAppointment: null,
    }),
}))

export default useAppointmentStore
