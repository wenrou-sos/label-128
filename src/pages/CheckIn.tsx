import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Phone,
  User,
  Dog,
  Cat,
  Bird,
  Rabbit,
  Clock,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Stethoscope,
  QrCode,
  CalendarDays,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import type {
  Clinic,
  Department,
  Doctor,
  Pet,
  Appointment,
  Registration,
} from '../../shared/types';

function getSpeciesIcon(species: string, className = 'w-4 h-4') {
  switch (species) {
    case '犬':
      return <Dog className={className} />;
    case '猫':
      return <Cat className={className} />;
    case '鸟':
      return <Bird className={className} />;
    case '兔':
      return <Rabbit className={className} />;
    default:
      return <Dog className={className} />;
  }
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDateOnly(value: string) {
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

interface CheckInResult {
  registration: Registration;
  appointment: Appointment;
  pet?: Pet;
  doctor: Doctor;
  timeSlotDisplay: string;
}

interface AppointmentCardProps {
  appointment: Appointment;
  pet?: Pet;
  doctor?: Doctor;
  department?: Department;
  clinic?: Clinic;
  onCheckIn: (apt: Appointment) => void;
  checkingId?: number | null;
}

function AppointmentCard({
  appointment,
  pet,
  doctor,
  department,
  clinic,
  onCheckIn,
  checkingId,
}: AppointmentCardProps) {
  const statusMap: Record<Appointment['status'], { label: string; className: string }> = {
    pending: { label: '待确认', className: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    confirmed: { label: '已确认', className: 'bg-primary-50 text-primary-700 border-primary-200' },
    cancelled: { label: '已取消', className: 'bg-zinc-100 text-zinc-500 border-zinc-200' },
    completed: { label: '已完成', className: 'bg-green-50 text-green-700 border-green-200' },
  };
  const status = statusMap[appointment.status];
  const canCheckIn = appointment.status === 'pending' || appointment.status === 'confirmed';
  const isChecking = checkingId === appointment.id;

  return (
    <div className="card p-4 hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-mono text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded-md truncate">
            {appointment.appointmentNo}
          </span>
          <span className={cn('chip border', status.className)}>{status.label}</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-zinc-500 flex-shrink-0">
          <CalendarDays className="w-3 h-3" />
          {formatDateOnly(appointment.appointmentDate)}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-400 flex-shrink-0">
          {pet ? getSpeciesIcon(pet.species, 'w-6 h-6') : <Dog className="w-6 h-6" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-zinc-900 truncate">{pet?.name ?? '未关联宠物'}</span>
            {pet && <span className="text-zinc-500">{getSpeciesIcon(pet.species, 'w-4 h-4')}</span>}
            <span className="text-xs text-zinc-400 truncate">{pet?.breed}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-500">
            <span className="inline-flex items-center gap-1">
              <Stethoscope className="w-3.5 h-3.5" />
              {department?.name ?? '—'}
            </span>
            <span className="inline-flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {doctor?.name ?? '—'}
            </span>
            {clinic && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {clinic.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {appointment.chiefComplaint && (
        <div className="mt-3 pt-3 border-t border-zinc-100 text-sm text-zinc-500">
          <span className="text-zinc-400">主诉：</span>
          {appointment.chiefComplaint}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => canCheckIn && onCheckIn(appointment)}
          disabled={!canCheckIn || isChecking}
          className={cn('btn-primary text-sm', (!canCheckIn || isChecking) && 'opacity-50 cursor-not-allowed')}
        >
          {isChecking ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          {isChecking ? '确认中...' : '确认到店'}
        </button>
      </div>
    </div>
  );
}

interface TicketProps {
  result: CheckInResult;
  clinic?: Clinic;
  department?: Department;
}

function Ticket({ result, clinic, department }: TicketProps) {
  const { registration, appointment, pet, doctor, timeSlotDisplay } = result;

  return (
    <div className="ticket rounded-2xl p-6 md:p-8 shadow-card">
      <div className="text-center pb-5 border-b border-dashed border-zinc-200">
        <div className="text-xs tracking-widest text-zinc-400 mb-2">挂号凭证</div>
        <div className="font-serif text-2xl md:text-3xl font-bold text-zinc-900 tracking-wide">
          {registration.registrationNo}
        </div>
        {registration.isEmergency && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200 text-sm font-medium">
            <AlertTriangle className="w-4 h-4" />
            急诊
          </div>
        )}
      </div>

      <div className="py-5 border-b border-dashed border-zinc-200 space-y-3.5">
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-zinc-400">分院</div>
            <div className="text-sm font-medium text-zinc-900">{clinic?.name ?? '—'}</div>
            <div className="text-xs text-zinc-500 truncate">{clinic?.address}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Stethoscope className="w-4 h-4 text-primary-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-zinc-400">科室 / 医生</div>
            <div className="text-sm font-medium text-zinc-900">
              {department?.name ?? '—'} · {doctor?.name}
              <span className="ml-1.5 text-xs font-normal text-zinc-500">{doctor?.title}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <User className="w-4 h-4 text-primary-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-xs text-zinc-400">诊室</div>
            <div className="text-sm font-medium text-zinc-900">{doctor?.roomNumber} 诊室</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {pet ? getSpeciesIcon(pet.species, 'w-4 h-4 text-primary-500 flex-shrink-0') : <Dog className="w-4 h-4 text-primary-500 flex-shrink-0" />}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-zinc-400">宠物</div>
            <div className="text-sm font-medium text-zinc-900 flex items-center gap-1.5">
              {pet?.name ?? '—'}
              <span className="text-xs font-normal text-zinc-500">{pet?.breed}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="py-5 border-b border-dashed border-zinc-200 flex items-center justify-around">
        <div className="text-center">
          <div className="text-xs text-zinc-400">排队序号</div>
          <div className="mt-1 text-4xl font-bold text-primary-600 font-serif">
            {String(registration.queueNumber).padStart(2, '0')}
          </div>
          <div className="mt-1 text-xs text-zinc-400">
            {registration.estimatedWaitTime > 0
              ? `预计等待约 ${registration.estimatedWaitTime} 分钟`
              : '即将就诊'}
          </div>
        </div>
        <div className="w-px h-16 bg-zinc-200" />
        <div className="text-center">
          <div className="text-xs text-zinc-400">预约时段</div>
          <div className="mt-2 text-lg font-semibold text-zinc-900">{timeSlotDisplay}</div>
          <div className="mt-1 text-xs text-zinc-400 flex items-center justify-center gap-1">
            <CalendarDays className="w-3 h-3" />
            {formatDateOnly(appointment.appointmentDate)}
          </div>
        </div>
      </div>

      <div className="pt-5 space-y-2">
        <div className="flex items-center gap-3 text-sm">
          <Clock className="w-4 h-4 text-zinc-400" />
          <span className="text-zinc-500">到店时间</span>
          <span className="ml-auto font-medium text-zinc-900 font-mono text-xs">
            {formatDateTime(registration.checkedInAt)}
          </span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <User className="w-4 h-4 text-zinc-400" />
          <span className="text-zinc-500">预约人</span>
          <span className="ml-auto font-medium text-zinc-900">{appointment.ownerName || '—'}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Phone className="w-4 h-4 text-zinc-400" />
          <span className="text-zinc-500">联系电话</span>
          <span className="ml-auto font-medium text-zinc-900 font-mono text-xs">
            {appointment.ownerPhone}
          </span>
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-dashed border-zinc-200 flex flex-col items-center">
        <div className="w-40 h-40 rounded-xl bg-zinc-50 border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center">
          <QrCode className="w-14 h-14 text-zinc-300" />
          <div className="mt-2 text-xs text-zinc-400">扫码查看详情</div>
        </div>
        <div className="mt-4 text-xs text-zinc-400 text-center leading-relaxed">
          请妥善保管此凭证，就诊时出示<br />
          叫号后请及时前往诊室
        </div>
      </div>
    </div>
  );
}

export default function CheckIn() {
  const [phone, setPhone] = useState('');
  const [searchedPhone, setSearchedPhone] = useState('');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [petsMap, setPetsMap] = useState<Map<number, Pet>>(new Map());
  const [loading, setLoading] = useState(false);
  const [checkingId, setCheckingId] = useState<number | null>(null);
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [error, setError] = useState('');

  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    api.getClinics().then(setClinics).catch(() => {});
    api.getDepartments().then(setDepartments).catch(() => {});
    api.getDoctors().then(setDoctors).catch(() => {});
  }, []);

  const clinicMap = useMemo(() => new Map(clinics.map((c) => [c.id, c])), [clinics]);
  const deptMap = useMemo(() => new Map(departments.map((d) => [d.id, d])), [departments]);
  const doctorMap = useMemo(() => new Map(doctors.map((d) => [d.id, d])), [doctors]);

  const handleSearch = useCallback(async () => {
    const trimmed = phone.trim();
    if (!trimmed) {
      setError('请输入手机号');
      return;
    }
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const [aptList, petList] = await Promise.all([
        api.getAppointments(trimmed),
        api.getPets(trimmed),
      ]);
      setAppointments(aptList);
      setPetsMap(new Map(petList.map((p) => [p.id, p])));
      setSearchedPhone(trimmed);
    } catch (e) {
      setError(e instanceof Error ? e.message : '查询失败');
      setAppointments([]);
      setPetsMap(new Map());
    } finally {
      setLoading(false);
    }
  }, [phone]);

  const handleCheckIn = useCallback(
    async (apt: Appointment) => {
      setError('');
      setCheckingId(apt.id);
      try {
        const res = await api.checkIn({ appointmentId: apt.id });
        let timeSlotDisplay = '当日就诊';
        try {
          if (res.doctor) {
            const slots = await api.getDoctorTimeSlots(res.doctor.id, apt.appointmentDate);
            const matched = slots.find((s) => s.id === apt.timeSlotId);
            if (matched) {
              timeSlotDisplay = `${matched.startTime}-${matched.endTime}`;
            }
          }
        } catch {
          // 时段查询失败时降级展示，不影响签到结果
        }
        setResult({
          registration: res.registration,
          appointment: res.appointment,
          pet: res.pet,
          doctor: res.doctor,
          timeSlotDisplay,
        });
        setAppointments((prev) =>
          prev.map((a) => (a.id === apt.id ? { ...a, status: 'confirmed' as const } : a)),
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : '签到失败');
      } finally {
        setCheckingId(null);
      }
    },
    [],
  );

  return (
    <Layout>
      <div className="container py-6 md:py-8">
        <div className="mb-6">
          <h1 className="section-title">挂号确认</h1>
          <p className="subtitle">查询预约并完成到店确认，签到后自动加入候诊队列</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-5">
              <label className="label">查询手机号</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="请输入预约手机号"
                    maxLength={11}
                    className="input pl-10"
                  />
                </div>
                <button onClick={handleSearch} disabled={loading} className="btn-primary">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  查询
                </button>
              </div>
              {error && (
                <div className="mt-3 text-sm text-red-600 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {error}
                </div>
              )}
            </div>

            {searchedPhone && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-zinc-800">预约记录</h3>
                  <span className="text-sm text-zinc-400">共 {appointments.length} 条</span>
                </div>
                {loading ? (
                  <div className="card p-12 text-center text-zinc-400">
                    <Loader2 className="w-6 h-6 mx-auto mb-3 animate-spin" />
                    查询中...
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="card p-12 text-center">
                    <div className="text-5xl mb-3">📅</div>
                    <div className="text-lg font-medium text-zinc-700">暂无预约记录</div>
                    <div className="text-sm text-zinc-400 mt-1">请检查手机号是否正确</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {appointments.map((apt) => (
                      <AppointmentCard
                        key={apt.id}
                        appointment={apt}
                        pet={petsMap.get(apt.petId)}
                        doctor={doctorMap.get(apt.doctorId)}
                        department={deptMap.get(apt.departmentId)}
                        clinic={clinicMap.get(apt.clinicId)}
                        onCheckIn={handleCheckIn}
                        checkingId={checkingId}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-6">
              {result ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-4 py-3 rounded-xl border border-green-200">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span>到店确认成功！已生成挂号凭证并加入候诊队列</span>
                  </div>
                  <Ticket
                    result={result}
                    clinic={clinicMap.get(result.appointment.clinicId)}
                    department={deptMap.get(result.appointment.departmentId)}
                  />
                </div>
              ) : (
                <div className="card p-12 md:p-16 text-center min-h-[500px] flex flex-col items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-zinc-100 flex items-center justify-center mb-5">
                    <QrCode className="w-12 h-12 text-zinc-300" />
                  </div>
                  <div className="text-lg font-medium text-zinc-700">挂号单</div>
                  <div className="text-sm text-zinc-400 mt-1.5 max-w-xs">
                    请在左侧输入手机号查询预约，确认到店后将显示挂号凭证
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
