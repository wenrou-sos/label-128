import { Router, type Request, type Response } from 'express';
import { store } from '../data/store.js';

interface MedicalRecord {
  date: string;
  departmentName: string;
  doctorName: string;
  doctorTitle: string;
  chiefComplaint: string;
  symptoms: string[];
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'waiting' | 'visiting' | 'skipped';
  isEmergency: boolean;
  registrationNo?: string;
  appointmentNo?: string;
}

interface PetHealthProfile {
  pet: import('../../shared/types.js').Pet;
  medicalRecords: MedicalRecord[];
}

const router = Router();

router.get('/:phone', async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.params;

    if (!phone) {
      res.status(400).json({
        success: false,
        error: '缺少手机号',
      });
      return;
    }

    const pets = store.getPets({ ownerPhone: phone });
    if (pets.length === 0) {
      res.json({
        success: true,
        data: [],
      });
      return;
    }

    const doctors = store.getDoctors({});
    const departments = store.getDepartments();

    const doctorMap = doctors.reduce<Record<number, typeof doctors[0]>>((acc, d) => {
      acc[d.id] = d;
      return acc;
    }, {});

    const deptMap = departments.reduce<Record<number, typeof departments[0]>>((acc, d) => {
      acc[d.id] = d;
      return acc;
    }, {});

    const result: PetHealthProfile[] = pets.map((pet) => {
      const appointments = store.getAppointments({ petId: pet.id });
      const registrations = store.getRegistrations({ petId: pet.id });

      const records: MedicalRecord[] = [];

      for (const apt of appointments) {
        const doctor = doctorMap[apt.doctorId];
        const dept = deptMap[apt.departmentId];
        const reg = registrations.find((r) => r.appointmentId === apt.id);

        records.push({
          date: apt.appointmentDate,
          departmentName: dept?.name || '未知科室',
          doctorName: doctor?.name || '未知医生',
          doctorTitle: doctor?.title || '',
          chiefComplaint: apt.chiefComplaint || '',
          symptoms: apt.symptoms || [],
          status: reg ? (reg.status as MedicalRecord['status']) : apt.status,
          isEmergency: reg?.isEmergency || false,
          registrationNo: reg?.registrationNo,
          appointmentNo: apt.appointmentNo,
        });
      }

      for (const reg of registrations) {
        const hasApt = appointments.some((a) => a.id === reg.appointmentId);
        if (hasApt) continue;

        const doctor = doctorMap[reg.doctorId];
        const dept = deptMap[reg.departmentId];

        records.push({
          date: reg.checkedInAt.split('T')[0],
          departmentName: dept?.name || '未知科室',
          doctorName: doctor?.name || '未知医生',
          doctorTitle: doctor?.title || '',
          chiefComplaint: '',
          symptoms: [],
          status: reg.status as MedicalRecord['status'],
          isEmergency: reg.isEmergency,
          registrationNo: reg.registrationNo,
        });
      }

      records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return {
        pet,
        medicalRecords: records,
      };
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取健康档案失败',
    });
  }
});

export default router;
