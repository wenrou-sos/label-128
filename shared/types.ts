export interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  district: string;
  openTime: string;
  closeTime: string;
  status: 'active' | 'inactive';
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description: string;
  icon: string;
}

export interface Doctor {
  id: number;
  name: string;
  title: string;
  avatar: string;
  specialties: string[];
  departmentId: number;
  clinicId: number;
  roomNumber: string;
  status: 'active' | 'inactive';
}

export interface TimeSlot {
  id: number;
  doctorId: number;
  date: string;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
  status: 'available' | 'full' | 'closed';
}

export interface PetOwner {
  id: number;
  name: string;
  phone: string;
}

export interface Pet {
  id: number;
  ownerId: number;
  ownerPhone: string;
  name: string;
  species: string;
  breed: string;
  age: number;
  gender: 'male' | 'female';
  weight: number;
  isNeutered: boolean;
  vaccineStatus: string;
  avatar: string;
}

export interface Appointment {
  id: number;
  appointmentNo: string;
  petId: number;
  ownerPhone: string;
  ownerName: string;
  clinicId: number;
  departmentId: number;
  doctorId: number;
  timeSlotId: number;
  appointmentDate: string;
  chiefComplaint: string;
  symptoms: string[];
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

export interface Registration {
  id: number;
  registrationNo: string;
  appointmentId: number;
  petId: number;
  clinicId: number;
  departmentId: number;
  doctorId: number;
  roomNumber: string;
  queueNumber: number;
  isEmergency: boolean;
  estimatedWaitTime: number;
  status: 'waiting' | 'visiting' | 'completed' | 'skipped';
  checkedInAt: string;
  calledAt?: string;
  completedAt?: string;
}
