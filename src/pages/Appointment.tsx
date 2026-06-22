import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Stethoscope,
  Scissors,
  Bone,
  Eye,
  Sparkles,
  SmilePlus,
  Cat,
  Bird,
  UserRound,
  CalendarDays,
  Clock,
  PawPrint,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  MapPin,
  Phone,
  Activity,
  Syringe,
} from 'lucide-react';
import Layout from '@/components/Layout';
import Stepper from '@/components/Stepper';
import SymptomTags, { DEFAULT_SYMPTOMS } from '@/components/SymptomTags';
import { useAppointmentStore } from '@/stores/appointmentStore';
import { cn } from '@/lib/utils';
import type { Clinic, Department, Doctor, TimeSlot } from '../../shared/types';

const steps = [
  { title: '选择分院', icon: Building2 },
  { title: '选择科室', icon: Stethoscope },
  { title: '选择医生', icon: UserRound },
  { title: '选择时段', icon: CalendarDays },
  { title: '填写信息', icon: PawPrint },
];

const deptIconMap: Record<string, typeof Stethoscope> = {
  Stethoscope,
  Scissors,
  Bone,
  Eye,
  Sparkles,
  SmilePlus,
  Cat,
  Bird,
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const wd = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()];
  return `${d.getMonth() + 1}月${d.getDate()}日 ${wd}`;
}

function getNextDates(count: number) {
  const result: { key: string; label: string }[] = [];
  const today = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const key = d.toISOString().split('T')[0];
    const label = i === 0 ? '今日' : i === 1 ? '明日' : formatDate(key);
    result.push({ key, label });
  }
  return result;
}

export default function AppointmentPage() {
  const navigate = useNavigate();
  const store = useAppointmentStore();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const nextDates = getNextDates(3);

  useEffect(() => {
    fetch('/api/clinics')
      .then((r) => r.json())
      .then((res) => setClinics(res.data || []));
    fetch('/api/departments')
      .then((r) => r.json())
      .then((res) => setDepartments(res.data || []));
  }, []);

  useEffect(() => {
    if (store.selectedDepartment && store.selectedClinic) {
      fetch(
        `/api/doctors?departmentId=${store.selectedDepartment.id}&clinicId=${store.selectedClinic.id}`
      )
        .then((r) => r.json())
        .then((res) => setFilteredDoctors(res.data || []));
    } else if (store.selectedDepartment) {
      fetch(`/api/doctors?departmentId=${store.selectedDepartment.id}`)
        .then((r) => r.json())
        .then((res) => setFilteredDoctors(res.data || []));
    } else {
      setFilteredDoctors([]);
    }
    store.setSelectedDoctor(null);
    store.setSelectedTimeSlot(null);
  }, [store.selectedDepartment, store.selectedClinic]);

  useEffect(() => {
    if (store.selectedDoctor && store.selectedDate) {
      fetch(`/api/doctors/${store.selectedDoctor.id}/timeslots?date=${store.selectedDate}`)
        .then((r) => r.json())
        .then((res) => setTimeSlots(res.data || []));
    } else {
      setTimeSlots([]);
    }
    store.setSelectedTimeSlot(null);
  }, [store.selectedDoctor, store.selectedDate]);

  useEffect(() => {
    if (!store.selectedDate && nextDates[0]) {
      store.setSelectedDate(nextDates[0].key);
    }
  }, [nextDates]);

  const canGoNext = () => {
    switch (store.currentStep) {
      case 1: return !!store.selectedClinic;
      case 2: return !!store.selectedDepartment;
      case 3: return !!store.selectedDoctor;
      case 4: return !!store.selectedTimeSlot;
      case 5:
        return (
          !!store.pet.name &&
          !!store.pet.species &&
          !!store.owner.name &&
          /^1\d{10}$/.test(store.owner.phone)
        );
      default: return false;
    }
  };

  const handleNext = () => {
    if (store.currentStep < 5) {
      store.setCurrentStep(store.currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (store.currentStep > 1) {
      store.setCurrentStep(store.currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!canGoNext() || submitting) return;
    setSubmitting(true);
    try {
      const petResp = await fetch('/api/pets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerName: store.owner.name,
          ownerPhone: store.owner.phone,
          name: store.pet.name,
          species: store.pet.species,
          breed: store.pet.breed || '未知',
          age: Number(store.pet.age) || 0,
          gender: store.pet.gender || 'male',
          weight: Number(store.pet.weight) || 0,
          isNeutered: store.pet.isNeutered,
          vaccineStatus: store.pet.vaccineStatus || '未提供',
        }),
      });
      const petData = await petResp.json();

      const aptResp = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          petId: petData.data?.id || 1,
          ownerPhone: store.owner.phone,
          ownerName: store.owner.name,
          clinicId: store.selectedClinic!.id,
          departmentId: store.selectedDepartment!.id,
          doctorId: store.selectedDoctor!.id,
          timeSlotId: store.selectedTimeSlot!.id,
          appointmentDate: store.selectedDate,
          chiefComplaint: store.chiefComplaint,
          symptoms: store.symptoms,
        }),
      });
      const aptData = await aptResp.json();
      if (aptData.success && aptData.data) {
        store.setCreatedAppointment(aptData.data);
        navigate('/appointment/success');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-6 md:py-10">
        <div className="container max-w-5xl">
          <div className="text-center mb-8 animate-fade-in-up">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-zinc-900">预约挂号</h1>
            <p className="text-zinc-500 mt-1.5">为您的爱宠预约专业的医疗服务</p>
          </div>

          <div className="card p-6 md:p-8 mb-6 animate-fade-in-up">
            <Stepper steps={steps} currentStep={store.currentStep} />
          </div>

          <div className="card p-6 md:p-8 animate-fade-in-up">
            {store.currentStep === 1 && (
              <Step1Clinics
                clinics={clinics}
                selected={store.selectedClinic}
                onSelect={store.setSelectedClinic}
              />
            )}
            {store.currentStep === 2 && (
              <Step2Departments
                departments={departments}
                selected={store.selectedDepartment}
                onSelect={store.setSelectedDepartment}
              />
            )}
            {store.currentStep === 3 && (
              <Step3Doctors
                doctors={filteredDoctors}
                selected={store.selectedDoctor}
                onSelect={store.setSelectedDoctor}
                clinicName={store.selectedClinic?.name}
              />
            )}
            {store.currentStep === 4 && (
              <Step4TimeSlots
                doctor={store.selectedDoctor}
                dates={nextDates}
                selectedDate={store.selectedDate}
                onSelectDate={store.setSelectedDate}
                timeSlots={timeSlots}
                selected={store.selectedTimeSlot}
                onSelect={store.setSelectedTimeSlot}
              />
            )}
            {store.currentStep === 5 && (
              <Step5Info
                pet={store.pet}
                owner={store.owner}
                symptoms={store.symptoms as typeof DEFAULT_SYMPTOMS[number][]}
                chiefComplaint={store.chiefComplaint}
                onPetChange={store.setPet}
                onOwnerChange={store.setOwner}
                onSymptomsChange={(s) => store.setSymptoms(s as string[])}
                onComplaintChange={store.setChiefComplaint}
              />
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-zinc-100">
              <button
                onClick={handlePrev}
                disabled={store.currentStep === 1}
                className="btn-secondary"
              >
                <ChevronLeft className="w-4 h-4" />
                上一步
              </button>
              {store.currentStep < 5 ? (
                <button onClick={handleNext} disabled={!canGoNext()} className="btn-primary">
                  下一步
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={!canGoNext() || submitting} className="btn-primary">
                  {submitting ? '提交中...' : '提交预约'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

function Step1Clinics({
  clinics,
  selected,
  onSelect,
}: {
  clinics: Clinic[];
  selected: Clinic | null;
  onSelect: (c: Clinic) => void;
}) {
  return (
    <div>
      <h2 className="section-title">选择就诊分院</h2>
      <p className="subtitle">请选择您方便就诊的分院</p>
      <div className="grid gap-4 mt-6 md:grid-cols-3">
        {clinics.map((c) => {
          const isSel = selected?.id === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c)}
              className={cn(
                'relative text-left p-5 rounded-2xl border-2 transition-all duration-200',
                isSel
                  ? 'border-primary-500 bg-primary-50/50 shadow-card-hover'
                  : 'border-zinc-100 bg-white hover:border-primary-200 hover:shadow-card'
              )}
            >
              {isSel && (
                <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                </span>
              )}
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">{c.name}</h3>
                  <span className="text-xs text-zinc-500">{c.district}</span>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-zinc-600">
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 text-zinc-400 shrink-0" />
                  <span>{c.address}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>{c.phone}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <span>营业 {c.openTime} - {c.closeTime}</span>
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step2Departments({
  departments,
  selected,
  onSelect,
}: {
  departments: Department[];
  selected: Department | null;
  onSelect: (d: Department) => void;
}) {
  return (
    <div>
      <h2 className="section-title">选择就诊科室</h2>
      <p className="subtitle">请选择爱宠需要就诊的专科</p>
      <div className="grid gap-4 mt-6 grid-cols-2 md:grid-cols-4">
        {departments.map((d) => {
          const isSel = selected?.id === d.id;
          const Icon = deptIconMap[d.icon] || Stethoscope;
          return (
            <button
              key={d.id}
              type="button"
              onClick={() => onSelect(d)}
              className={cn(
                'relative flex flex-col items-center p-5 rounded-2xl border-2 transition-all duration-200 group',
                isSel
                  ? 'border-primary-500 bg-primary-50/50 shadow-card-hover'
                  : 'border-zinc-100 bg-white hover:border-primary-200 hover:shadow-card'
              )}
            >
              {isSel && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                  <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                </span>
              )}
              <div
                className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-all',
                  isSel
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-glow'
                    : 'bg-primary-50 text-primary-600 group-hover:bg-primary-100'
                )}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-zinc-900 mb-1">{d.name}</h3>
              <p className="text-xs text-zinc-500 text-center line-clamp-2">{d.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step3Doctors({
  doctors,
  selected,
  onSelect,
  clinicName,
}: {
  doctors: Doctor[];
  selected: Doctor | null;
  onSelect: (d: Doctor) => void;
  clinicName?: string;
}) {
  if (doctors.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-100 flex items-center justify-center">
          <Stethoscope className="w-8 h-8 text-zinc-400" />
        </div>
        <h3 className="font-medium text-zinc-700">暂无可选医生</h3>
        <p className="text-sm text-zinc-500 mt-1">请先选择分院和科室</p>
      </div>
    );
  }
  return (
    <div>
      <h2 className="section-title">选择接诊医生</h2>
      <p className="subtitle">{clinicName ? `${clinicName} · ` : ''}共 {doctors.length} 位医生可预约</p>
      <div className="space-y-3 mt-6">
        {doctors.map((doc) => {
          const isSel = selected?.id === doc.id;
          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => onSelect(doc)}
              className={cn(
                'relative w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left',
                isSel
                  ? 'border-primary-500 bg-primary-50/50 shadow-card-hover'
                  : 'border-zinc-100 bg-white hover:border-primary-200 hover:shadow-card'
              )}
            >
              {isSel && (
                <span className="absolute top-3 right-3 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                </span>
              )}
              <img
                src={doc.avatar}
                alt={doc.name}
                className="w-14 h-14 rounded-2xl object-cover bg-zinc-100 border border-zinc-100"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-zinc-900">{doc.name}</h3>
                  <span className="chip bg-primary-50 text-primary-700">{doc.title}</span>
                  <span className="chip bg-zinc-100 text-zinc-600">诊室 {doc.roomNumber}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {doc.specialties.map((sp) => (
                    <span key={sp} className="chip bg-accent-50 text-accent-700">
                      {sp}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Step4TimeSlots({
  doctor,
  dates,
  selectedDate,
  onSelectDate,
  timeSlots,
  selected,
  onSelect,
}: {
  doctor: Doctor | null;
  dates: { key: string; label: string }[];
  selectedDate: string;
  onSelectDate: (d: string) => void;
  timeSlots: TimeSlot[];
  selected: TimeSlot | null;
  onSelect: (ts: TimeSlot) => void;
}) {
  if (!doctor) {
    return (
      <div className="text-center py-16 text-zinc-500">请先选择医生</div>
    );
  }
  return (
    <div>
      <h2 className="section-title">选择就诊时段</h2>
      <p className="subtitle">{doctor.name} · {doctor.title}</p>

      <div className="flex gap-2 mt-6 p-1 bg-zinc-100 rounded-2xl w-fit">
        {dates.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => onSelectDate(d.key)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all',
              selectedDate === d.key
                ? 'bg-white text-primary-700 shadow'
                : 'text-zinc-600 hover:text-zinc-900'
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      {timeSlots.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 mt-6">
          <Clock className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
          该医生当日暂无出诊时段
        </div>
      ) : (
        <div className="grid gap-3 mt-6 grid-cols-2 md:grid-cols-3">
          {timeSlots.map((ts) => {
            const isFull = ts.status === 'full' || ts.booked >= ts.capacity;
            const isSel = selected?.id === ts.id;
            const remain = ts.capacity - ts.booked;
            return (
              <button
                key={ts.id}
                type="button"
                disabled={isFull}
                onClick={() => !isFull && onSelect(ts)}
                className={cn(
                  'relative p-4 rounded-2xl border-2 text-left transition-all duration-200',
                  isFull && 'opacity-60 cursor-not-allowed bg-zinc-50 border-zinc-100',
                  !isFull &&
                    isSel &&
                    'border-primary-500 bg-primary-50/50 shadow-card-hover',
                  !isFull &&
                    !isSel &&
                    'border-zinc-100 bg-white hover:border-primary-200 hover:shadow-card'
                )}
              >
                {isSel && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                    <CheckCircle2 className="w-3 h-3 text-white" strokeWidth={3} />
                  </span>
                )}
                <div className="font-mono font-semibold text-lg text-zinc-900">
                  {ts.startTime} - {ts.endTime}
                </div>
                <div className="text-sm mt-1">
                  {isFull ? (
                    <span className="text-zinc-400">已约满</span>
                  ) : (
                    <span className={cn(
                      remain <= 1 ? 'text-rose-600 font-medium' : 'text-primary-600 font-medium'
                    )}>
                      剩余 {remain} 位
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Step5Info({
  pet,
  owner,
  symptoms,
  chiefComplaint,
  onPetChange,
  onOwnerChange,
  onSymptomsChange,
  onComplaintChange,
}: {
  pet: ReturnType<typeof useAppointmentStore.getState>['pet'];
  owner: ReturnType<typeof useAppointmentStore.getState>['owner'];
  symptoms: typeof DEFAULT_SYMPTOMS[number][];
  chiefComplaint: string;
  onPetChange: (p: Partial<typeof pet>) => void;
  onOwnerChange: (o: Partial<typeof owner>) => void;
  onSymptomsChange: (s: typeof symptoms) => void;
  onComplaintChange: (t: string) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="section-title">主人信息</h2>
        <p className="subtitle">请填写您的联系方式</p>
        <div className="grid gap-4 mt-5 md:grid-cols-2">
          <div>
            <label className="label">
              <UserRound className="w-3.5 h-3.5 inline mr-1.5" />
              姓名
            </label>
            <input
              type="text"
              className="input"
              placeholder="请输入您的姓名"
              value={owner.name}
              onChange={(e) => onOwnerChange({ name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">
              <Phone className="w-3.5 h-3.5 inline mr-1.5" />
              手机号
            </label>
            <input
              type="tel"
              className="input"
              placeholder="请输入手机号"
              maxLength={11}
              value={owner.phone}
              onChange={(e) => onOwnerChange({ phone: e.target.value.replace(/\D/g, '') })}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="section-title">宠物信息</h2>
        <p className="subtitle">请填写爱宠的基本信息</p>
        <div className="grid gap-4 mt-5 md:grid-cols-2">
          <div>
            <label className="label">
              <PawPrint className="w-3.5 h-3.5 inline mr-1.5" />
              宠物昵称 *
            </label>
            <input
              type="text"
              className="input"
              placeholder="如：豆豆"
              value={pet.name}
              onChange={(e) => onPetChange({ name: e.target.value })}
            />
          </div>
          <div>
            <label className="label">物种 *</label>
            <select
              className="input"
              value={pet.species}
              onChange={(e) => onPetChange({ species: e.target.value as any })}
            >
              <option value="">请选择</option>
              <option value="犬">犬</option>
              <option value="猫">猫</option>
              <option value="兔">兔</option>
              <option value="鸟">鸟</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <div>
            <label className="label">品种</label>
            <input
              type="text"
              className="input"
              placeholder="如：金毛、英短"
              value={pet.breed}
              onChange={(e) => onPetChange({ breed: e.target.value })}
            />
          </div>
          <div>
            <label className="label">
              <Syringe className="w-3.5 h-3.5 inline mr-1.5" />
              年龄 (岁)
            </label>
            <input
              type="number"
              className="input"
              placeholder="如：3"
              min="0"
              max="50"
              step="0.1"
              value={pet.age}
              onChange={(e) => onPetChange({ age: e.target.value as any })}
            />
          </div>
          <div>
            <label className="label">性别</label>
            <div className="flex gap-2">
              {(['male', 'female'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => onPetChange({ gender: g })}
                  className={cn(
                    'flex-1 py-2.5 rounded-xl border text-sm font-medium transition-all',
                    pet.gender === g
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-zinc-200 text-zinc-600 hover:border-primary-200'
                  )}
                >
                  {g === 'male' ? '公' : '母'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">
              <Activity className="w-3.5 h-3.5 inline mr-1.5" />
              体重 (kg)
            </label>
            <input
              type="number"
              className="input"
              placeholder="如：5.5"
              min="0"
              max="200"
              step="0.1"
              value={pet.weight}
              onChange={(e) => onPetChange({ weight: e.target.value as any })}
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-4 p-4 bg-zinc-50 rounded-2xl">
            <label className="text-sm font-medium text-zinc-700">是否绝育</label>
            <button
              type="button"
              onClick={() => onPetChange({ isNeutered: !pet.isNeutered })}
              className={cn(
                'relative w-12 h-7 rounded-full transition-colors',
                pet.isNeutered ? 'bg-primary-500' : 'bg-zinc-300'
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all',
                  pet.isNeutered ? 'left-[22px]' : 'left-0.5'
                )}
              />
            </button>
            <span className="text-sm text-zinc-500">
              {pet.isNeutered ? '已绝育' : '未绝育'}
            </span>
          </div>
          <div className="md:col-span-2">
            <label className="label">疫苗状态</label>
            <input
              type="text"
              className="input"
              placeholder="如：已接种狂犬疫苗，四联疫苗已完成"
              value={pet.vaccineStatus}
              onChange={(e) => onPetChange({ vaccineStatus: e.target.value })}
            />
          </div>
        </div>
      </div>

      <div>
        <h2 className="section-title">症状描述</h2>
        <p className="subtitle">请选择爱宠当前的症状（可多选）</p>
        <div className="mt-5">
          <SymptomTags symptoms={symptoms} onSelect={onSymptomsChange} />
        </div>
        <div className="mt-5">
          <label className="label">详细描述（主诉）</label>
          <textarea
            rows={4}
            className="input resize-none"
            placeholder="请详细描述爱宠的不适症状、持续时间、饮食情况等..."
            value={chiefComplaint}
            onChange={(e) => onComplaintChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
