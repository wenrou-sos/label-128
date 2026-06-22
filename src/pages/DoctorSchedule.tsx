import { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Stethoscope,
  MapPin,
  Building2,
  Clock,
  Sun,
  Sunset,
  Coffee,
  CalendarDays,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import type { Doctor, TimeSlot, Clinic, Department } from '../../shared/types';

type ShiftStatus = 'available' | 'full' | 'rest';

interface DaySchedule {
  date: string;
  dayName: string;
  isToday: boolean;
  morning: ShiftStatus;
  afternoon: ShiftStatus;
  morningSlots: TimeSlot[];
  afternoonSlots: TimeSlot[];
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function getDayName(date: Date): string {
  const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  return days[date.getDay()];
}

function getDateLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

function aggregateShift(slots: TimeSlot[]): ShiftStatus {
  if (slots.length === 0) return 'rest';
  const hasAvailable = slots.some((s) => s.status === 'available');
  const hasFull = slots.some((s) => s.status === 'full');
  if (hasAvailable) return 'available';
  if (hasFull) return 'full';
  return 'rest';
}

function getShiftLabel(status: ShiftStatus): string {
  switch (status) {
    case 'available':
      return '出诊';
    case 'full':
      return '约满';
    case 'rest':
      return '休息';
  }
}

function getShiftIcon(status: ShiftStatus, period: 'morning' | 'afternoon') {
  if (status === 'rest') return Coffee;
  return period === 'morning' ? Sun : Sunset;
}

export default function DoctorSchedule() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [department, setDepartment] = useState<Department | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const weekDays = useMemo<Date[]>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }, (_, i) => addDays(today, i));
  }, []);

  useEffect(() => {
    if (!id) return;
    const doctorId = Number(id);
    if (isNaN(doctorId)) return;

    (async () => {
      try {
        setLoading(true);
        const [doctorData, clinics, depts, allSlots] = await Promise.all([
          api.getDoctors({}).then((list) => list.find((d) => d.id === doctorId) || null),
          api.getClinics(),
          api.getDepartments(),
          api.getDoctorTimeSlots(doctorId),
        ]);

        if (!doctorData) {
          setError('医生不存在');
          return;
        }

        setDoctor(doctorData);
        setClinic(clinics.find((c) => c.id === doctorData.clinicId) || null);
        setDepartment(depts.find((d) => d.id === doctorData.departmentId) || null);
        setTimeSlots(allSlots);
      } catch (e) {
        setError(e instanceof Error ? e.message : '加载失败');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const schedule = useMemo<DaySchedule[]>(() => {
    return weekDays.map((date) => {
      const dateStr = formatDate(date);
      const daySlots = timeSlots.filter((s) => s.date === dateStr);
      const morningSlots = daySlots.filter((s) => s.startTime < '12:00');
      const afternoonSlots = daySlots.filter((s) => s.startTime >= '12:00');

      return {
        date: dateStr,
        dayName: getDayName(date),
        isToday: dateStr === formatDate(new Date()),
        morning: aggregateShift(morningSlots),
        afternoon: aggregateShift(afternoonSlots),
        morningSlots,
        afternoonSlots,
      };
    });
  }, [weekDays, timeSlots]);

  const stats = useMemo(() => {
    let workingDays = 0;
    let totalAvailable = 0;
    let totalFull = 0;
    schedule.forEach((day) => {
      if (day.morning !== 'rest') workingDays++;
      if (day.afternoon !== 'rest') workingDays++;
      day.morningSlots.forEach((s) => {
        if (s.status === 'available') totalAvailable += s.capacity - s.booked;
        if (s.status === 'full') totalFull += s.capacity;
      });
      day.afternoonSlots.forEach((s) => {
        if (s.status === 'available') totalAvailable += s.capacity - s.booked;
        if (s.status === 'full') totalFull += s.capacity;
      });
    });
    return { workingDays: Math.ceil(workingDays / 2), totalAvailable, totalFull };
  }, [schedule]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <span className="ml-3 text-zinc-500">加载中...</span>
        </div>
      </Layout>
    );
  }

  if (error || !doctor) {
    return (
      <Layout>
        <div className="card py-16 text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-zinc-600 mb-4">{error || '医生不存在'}</p>
          <button
            onClick={() => navigate('/doctors')}
            className="btn btn-primary"
          >
            返回医生列表
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/doctors')}
            className="p-2 -ml-2 text-zinc-500 hover:text-primary-600 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">医生排班详情</h1>
            <p className="mt-1 text-sm text-zinc-500">
              查看医生未来 7 天出诊安排
            </p>
          </div>
        </div>

        <div className="card !p-6">
          <div className="flex gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-zinc-900">{doctor.name}</h2>
                <span className="px-2.5 py-0.5 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
                  {doctor.title}
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-500">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-zinc-400" />
                  <span>{clinic?.name || '-'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-zinc-400" />
                  <span>{department?.name || '-'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-zinc-400" />
                  <span>{doctor.roomNumber} 诊室</span>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-zinc-500 mb-1.5">专长</p>
                <div className="flex flex-wrap gap-1.5">
                  {doctor.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-zinc-100 text-zinc-600 text-xs rounded-full"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-100 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">{stats.workingDays}</p>
              <p className="text-xs text-zinc-500 mt-1">本周出诊天数</p>
            </div>
            <div className="text-center border-x border-zinc-100">
              <p className="text-2xl font-bold text-green-600">{stats.totalAvailable}</p>
              <p className="text-xs text-zinc-500 mt-1">剩余可预约号</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{stats.totalFull}</p>
              <p className="text-xs text-zinc-500 mt-1">已约满号源</p>
            </div>
          </div>
        </div>

        <div className="card !p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary-500" />
              <span className="font-semibold text-zinc-900">未来 7 天排班</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-zinc-500">可预约</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                <span className="text-zinc-500">约满</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
                <span className="text-zinc-500">休息</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7">
            {schedule.map((day) => (
              <div
                key={day.date}
                className={cn(
                  'border-r border-zinc-100 last:border-r-0 p-3',
                  day.isToday && 'bg-primary-50/30'
                )}
              >
                <div className="text-center mb-3">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      day.isToday ? 'text-primary-600' : 'text-zinc-900'
                    )}
                  >
                    {getDateLabel(day.date)}
                  </p>
                  <p
                    className={cn(
                      'text-xs mt-0.5',
                      day.isToday ? 'text-primary-500 font-medium' : 'text-zinc-500'
                    )}
                  >
                    {day.dayName}
                    {day.isToday && ' 今天'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div
                    className={cn(
                      'p-2.5 rounded-lg text-center transition-colors',
                      day.morning === 'available' && 'bg-green-50',
                      day.morning === 'full' && 'bg-orange-50',
                      day.morning === 'rest' && 'bg-zinc-50'
                    )}
                  >
                    {(() => {
                      const Icon = getShiftIcon(day.morning, 'morning');
                      return (
                        <Icon
                          className={cn(
                            'w-5 h-5 mx-auto mb-1',
                            day.morning === 'available' && 'text-green-600',
                            day.morning === 'full' && 'text-orange-500',
                            day.morning === 'rest' && 'text-zinc-400'
                          )}
                        />
                      );
                    })()}
                    <p
                      className={cn(
                        'text-xs font-medium',
                        day.morning === 'available' && 'text-green-700',
                        day.morning === 'full' && 'text-orange-600',
                        day.morning === 'rest' && 'text-zinc-400'
                      )}
                    >
                      {getShiftLabel(day.morning)}
                    </p>
                    {day.morning !== 'rest' && (
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {day.morningSlots.filter((s) => s.status === 'available').length} 个时段
                      </p>
                    )}
                  </div>

                  <div
                    className={cn(
                      'p-2.5 rounded-lg text-center transition-colors',
                      day.afternoon === 'available' && 'bg-green-50',
                      day.afternoon === 'full' && 'bg-orange-50',
                      day.afternoon === 'rest' && 'bg-zinc-50'
                    )}
                  >
                    {(() => {
                      const Icon = getShiftIcon(day.afternoon, 'afternoon');
                      return (
                        <Icon
                          className={cn(
                            'w-5 h-5 mx-auto mb-1',
                            day.afternoon === 'available' && 'text-green-600',
                            day.afternoon === 'full' && 'text-orange-500',
                            day.afternoon === 'rest' && 'text-zinc-400'
                          )}
                        />
                      );
                    })()}
                    <p
                      className={cn(
                        'text-xs font-medium',
                        day.afternoon === 'available' && 'text-green-700',
                        day.afternoon === 'full' && 'text-orange-600',
                        day.afternoon === 'rest' && 'text-zinc-400'
                      )}
                    >
                      {getShiftLabel(day.afternoon)}
                    </p>
                    {day.afternoon !== 'rest' && (
                      <p className="text-xs text-zinc-400 mt-0.5">
                        {day.afternoonSlots.filter((s) => s.status === 'available').length} 个时段
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card !p-6">
          <h3 className="font-semibold text-zinc-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-500" />
            今日时段详情
          </h3>
          <div className="space-y-4">
            {schedule[0] && (
              <>
                <div>
                  <p className="text-sm font-medium text-zinc-700 mb-2 flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-500" />
                    上午
                    {schedule[0].morning !== 'rest' && (
                      <span className="text-xs text-zinc-400 font-normal">
                        09:00 - 12:00
                      </span>
                    )}
                  </p>
                  {schedule[0].morning === 'rest' ? (
                    <p className="text-sm text-zinc-400 pl-6">上午休息</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pl-6">
                      {schedule[0].morningSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={cn(
                            'px-2 py-1.5 rounded-lg text-center text-xs',
                            slot.status === 'available' &&
                              'bg-green-50 text-green-700 border border-green-200',
                            slot.status === 'full' &&
                              'bg-orange-50 text-orange-600 border border-orange-200',
                            slot.status === 'closed' &&
                              'bg-zinc-100 text-zinc-400 border border-zinc-200 line-through'
                          )}
                        >
                          {slot.startTime}
                          <span className="block text-[10px] opacity-70 mt-0.5">
                            {slot.status === 'available'
                              ? `剩${slot.capacity - slot.booked}号`
                              : slot.status === 'full'
                              ? '已满'
                              : '停诊'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-zinc-700 mb-2 flex items-center gap-2">
                    <Sunset className="w-4 h-4 text-orange-500" />
                    下午
                    {schedule[0].afternoon !== 'rest' && (
                      <span className="text-xs text-zinc-400 font-normal">
                        14:00 - 18:00
                      </span>
                    )}
                  </p>
                  {schedule[0].afternoon === 'rest' ? (
                    <p className="text-sm text-zinc-400 pl-6">下午休息</p>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pl-6">
                      {schedule[0].afternoonSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className={cn(
                            'px-2 py-1.5 rounded-lg text-center text-xs',
                            slot.status === 'available' &&
                              'bg-green-50 text-green-700 border border-green-200',
                            slot.status === 'full' &&
                              'bg-orange-50 text-orange-600 border border-orange-200',
                            slot.status === 'closed' &&
                              'bg-zinc-100 text-zinc-400 border border-zinc-200 line-through'
                          )}
                        >
                          {slot.startTime}
                          <span className="block text-[10px] opacity-70 mt-0.5">
                            {slot.status === 'available'
                              ? `剩${slot.capacity - slot.booked}号`
                              : slot.status === 'full'
                              ? '已满'
                              : '停诊'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
