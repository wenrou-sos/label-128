import { useState, useEffect, useMemo } from 'react';
import {
  RefreshCw,
  AlertTriangle,
  Clock,
  User,
  Dog,
  Cat,
  Bird,
  Rabbit,
  CheckCircle,
  XCircle,
  ChevronDown,
  Stethoscope,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import {
  clinics,
  departments,
  doctors,
  pets,
  registrations as mockRegistrations,
  type Registration,
  type Pet,
} from '../../shared/mockData';

type QueueStatus = 'all' | 'waiting' | 'visiting' | 'completed' | 'skipped';

const statusMap: Record<Registration['status'], { label: string; className: string }> = {
  waiting: { label: '候诊', className: 'bg-blue-50 text-blue-700 border-blue-200' },
  visiting: { label: '就诊中', className: 'bg-primary-50 text-primary-700 border-primary-200' },
  completed: { label: '已完成', className: 'bg-green-50 text-green-700 border-green-200' },
  skipped: { label: '过号', className: 'bg-zinc-100 text-zinc-600 border-zinc-200' },
};

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

function getPetById(petId: number): Pet | undefined {
  return pets.find((p) => p.id === petId);
}

function formatWaitTime(minutes: number) {
  if (minutes <= 0) return '即将就诊';
  if (minutes < 60) return `约${minutes}分钟`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `约${h}小时${m}分钟` : `约${h}小时`;
}

interface QueueItemProps {
  reg: Registration;
  pet?: Pet;
  onCall: (id: number) => void;
  onComplete: (id: number) => void;
  onSkip: (id: number) => void;
  onToggleEmergency: (id: number) => void;
}

function QueueItem({ reg, pet, onCall, onComplete, onSkip, onToggleEmergency }: QueueItemProps) {
  const status = statusMap[reg.status];
  const visiting = reg.status === 'visiting';

  return (
    <div
      className={cn(
        'relative group flex items-center gap-4 p-4 rounded-xl border transition-all duration-200',
        visiting
          ? 'bg-primary-50/50 border-primary-200 shadow-sm'
          : 'bg-white border-zinc-100 hover:border-zinc-200 hover:shadow-sm'
      )}
    >
      {reg.isEmergency && (
        <div className="absolute -top-2 -left-2 z-10">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-60" />
            <span className="relative inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-semibold shadow-md">
              <AlertTriangle className="w-3 h-3" />
              急诊
            </span>
          </div>
        </div>
      )}

      <div
        className={cn(
          'flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center font-bold',
          visiting
            ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md'
            : reg.isEmergency
            ? 'bg-red-100 text-red-600'
            : 'bg-zinc-100 text-zinc-700'
        )}
      >
        <span className="text-xs opacity-80">序号</span>
        <span className="text-2xl leading-none">{String(reg.queueNumber).padStart(2, '0')}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-zinc-900 text-base truncate">{pet?.name ?? '未知'}</span>
          <span className="text-zinc-500">{getSpeciesIcon(pet?.species ?? '')}</span>
          <span className="text-xs text-zinc-500 font-mono">{reg.registrationNo}</span>
          <span
            className={cn(
              'chip border',
              status.className
            )}
          >
            {status.label}
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-3 text-sm text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {reg.status === 'waiting' ? formatWaitTime(reg.estimatedWaitTime) : '—'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-shrink-0">
        {reg.status === 'waiting' && (
          <>
            <button
              onClick={() => onCall(reg.id)}
              className="p-2 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
              title="叫号"
            >
              <Stethoscope className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSkip(reg.id)}
              className="p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 transition-colors"
              title="过号"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </>
        )}
        {reg.status === 'visiting' && (
          <button
            onClick={() => onComplete(reg.id)}
            className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
            title="完成"
          >
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onToggleEmergency(reg.id)}
          className={cn(
            'p-2 rounded-lg transition-colors',
            reg.isEmergency
              ? 'text-red-600 bg-red-50'
              : 'text-zinc-400 hover:text-red-500 hover:bg-red-50'
          )}
          title={reg.isEmergency ? '取消急诊' : '标记急诊'}
        >
          <AlertTriangle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface DoctorCardProps {
  doctorId: number;
  registrations: Registration[];
  onCall: (id: number) => void;
  onComplete: (id: number) => void;
  onSkip: (id: number) => void;
  onToggleEmergency: (id: number) => void;
}

function DoctorCard({
  doctorId,
  registrations,
  onCall,
  onComplete,
  onSkip,
  onToggleEmergency,
}: DoctorCardProps) {
  const doctor = doctors.find((d) => d.id === doctorId);
  if (!doctor) return null;

  const visiting = registrations.find((r) => r.status === 'visiting');
  const visitingPet = visiting ? getPetById(visiting.petId) : undefined;

  return (
    <div className="card overflow-hidden">
      <div className="p-5 border-b border-zinc-100 bg-gradient-to-r from-zinc-50 to-white">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
            />
            {visiting && (
              <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary-500 border-2 border-white flex items-center justify-center">
                <Stethoscope className="w-2.5 h-2.5 text-white" />
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-zinc-900 text-lg">{doctor.name}</h3>
              <span className="text-xs text-zinc-500">{doctor.title}</span>
            </div>
            <div className="mt-1 flex items-center gap-3 text-sm text-zinc-500">
              <span className="inline-flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                诊室 {doctor.roomNumber}
              </span>
              <span className="text-zinc-300">·</span>
              <span className="text-zinc-500">
                候诊 <span className="font-semibold text-zinc-800">{registrations.filter((r) => r.status === 'waiting').length}</span> 位
              </span>
            </div>
          </div>
        </div>
        {visiting && (
          <div className="mt-4 p-3 rounded-xl bg-primary-50/70 border border-primary-100">
            <div className="text-xs font-medium text-primary-600 mb-1">当前就诊</div>
            <div className="flex items-center gap-2">
              {visitingPet?.avatar && (
                <img
                  src={visitingPet.avatar}
                  alt={visitingPet.name}
                  className="w-9 h-9 rounded-lg object-cover bg-white"
                />
              )}
              <div className="flex-1">
                <div className="font-medium text-zinc-900 text-sm flex items-center gap-1.5">
                  {visitingPet?.name}
                  {visitingPet && getSpeciesIcon(visitingPet.species, 'w-3.5 h-3.5 text-primary-600')}
                </div>
                <div className="text-xs text-zinc-500 font-mono">{visiting.registrationNo}</div>
              </div>
              {visiting.isEmergency && (
                <span className="chip bg-red-50 text-red-600 border border-red-200">
                  <AlertTriangle className="w-3 h-3" />
                  急诊
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="p-4 space-y-3">
        {registrations.length === 0 ? (
          <div className="py-8 text-center text-sm text-zinc-400">暂无候诊</div>
        ) : (
          registrations
            .sort((a, b) => {
              const order = { visiting: 0, waiting: 1, skipped: 2, completed: 3 } as const;
              const sa = order[a.status];
              const sb = order[b.status];
              if (sa !== sb) return sa - sb;
              if (a.isEmergency !== b.isEmergency) return a.isEmergency ? -1 : 1;
              return a.queueNumber - b.queueNumber;
            })
            .map((reg) => (
              <QueueItem
                key={reg.id}
                reg={reg}
                pet={getPetById(reg.petId)}
                onCall={onCall}
                onComplete={onComplete}
                onSkip={onSkip}
                onToggleEmergency={onToggleEmergency}
              />
            ))
        )}
      </div>
    </div>
  );
}

export default function Queue() {
  const [selectedClinic, setSelectedClinic] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'all' | number>('all');
  const [queueData, setQueueData] = useState<Registration[]>(mockRegistrations);
  const [statusFilter, setStatusFilter] = useState<QueueStatus>('all');
  const [refreshing, setRefreshing] = useState(false);
  const [clinicOpen, setClinicOpen] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setQueueData([...mockRegistrations]);
      setRefreshing(false);
    }, 600);
  };

  useEffect(() => {
    const timer = setInterval(handleRefresh, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleCall = (id: number) => {
    setQueueData((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: 'visiting', calledAt: new Date().toISOString(), estimatedWaitTime: 0 }
          : r
      )
    );
  };

  const handleComplete = (id: number) => {
    setQueueData((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: 'completed', completedAt: new Date().toISOString() }
          : r
      )
    );
  };

  const handleSkip = (id: number) => {
    setQueueData((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'skipped' } : r)));
  };

  const handleToggleEmergency = (id: number) => {
    setQueueData((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isEmergency: !r.isEmergency } : r))
    );
  };

  const clinicDoctors = useMemo(
    () => doctors.filter((d) => d.clinicId === selectedClinic && d.status === 'active'),
    [selectedClinic]
  );

  const filteredRegistrations = useMemo(() => {
    return queueData.filter((r) => {
      if (r.clinicId !== selectedClinic) return false;
      if (activeTab !== 'all' && r.doctorId !== activeTab) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      return true;
    });
  }, [queueData, selectedClinic, activeTab, statusFilter]);

  const groupedByDoctor = useMemo(() => {
    const map = new Map<number, Registration[]>();
    for (const reg of filteredRegistrations) {
      if (!map.has(reg.doctorId)) map.set(reg.doctorId, []);
      map.get(reg.doctorId)!.push(reg);
    }
    return map;
  }, [filteredRegistrations]);

  const stats = useMemo(() => {
    const today = queueData.filter((r) => r.clinicId === selectedClinic);
    const total = today.length;
    const visiting = today.filter((r) => r.status === 'visiting').length;
    const completed = today.filter((r) => r.status === 'completed').length;
    const waiting = today.filter((r) => r.status === 'waiting');
    const avgWait = waiting.length > 0
      ? Math.round(waiting.reduce((s, r) => s + r.estimatedWaitTime, 0) / waiting.length)
      : 0;
    return { total, visiting, completed, avgWait };
  }, [queueData, selectedClinic]);

  const currentClinic = clinics.find((c) => c.id === selectedClinic);

  return (
    <Layout>
      <div className="container py-6 md:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-title">候诊队列</h1>
            <p className="subtitle">实时查看各诊室候诊情况</p>
          </div>
          <button
            onClick={handleRefresh}
            className={cn(
              'btn-secondary',
              refreshing && 'pointer-events-none'
            )}
          >
            <RefreshCw className={cn('w-4 h-4', refreshing && 'animate-spin')} />
            刷新
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="card p-4">
            <div className="text-sm text-zinc-500">今日候诊</div>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-bold text-zinc-900">{stats.total}</span>
              <span className="text-sm text-zinc-400 mb-1">位</span>
            </div>
          </div>
          <div className="card p-4">
            <div className="text-sm text-zinc-500">就诊中</div>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-bold text-primary-600">{stats.visiting}</span>
              <span className="text-sm text-zinc-400 mb-1">位</span>
            </div>
          </div>
          <div className="card p-4">
            <div className="text-sm text-zinc-500">已完成</div>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-bold text-green-600">{stats.completed}</span>
              <span className="text-sm text-zinc-400 mb-1">位</span>
            </div>
          </div>
          <div className="card p-4">
            <div className="text-sm text-zinc-500">平均等待</div>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-3xl font-bold text-accent-600">{stats.avgWait}</span>
              <span className="text-sm text-zinc-400 mb-1">分钟</span>
            </div>
          </div>
        </div>

        <div className="card p-4 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setClinicOpen(!clinicOpen)}
                className="btn-secondary min-w-[180px] justify-between"
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {currentClinic?.name ?? '选择分院'}
                </span>
                <ChevronDown className={cn('w-4 h-4 transition-transform', clinicOpen && 'rotate-180')} />
              </button>
              {clinicOpen && (
                <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl border border-zinc-200 shadow-lg z-20 overflow-hidden animate-slide-down">
                  {clinics.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedClinic(c.id);
                        setClinicOpen(false);
                      }}
                      className={cn(
                        'w-full px-4 py-3 text-left text-sm transition-colors hover:bg-zinc-50 border-b border-zinc-50 last:border-0',
                        selectedClinic === c.id && 'text-primary-600 bg-primary-50/50'
                      )}
                    >
                      <div className="font-medium">{c.name}</div>
                      <div className="text-xs text-zinc-500 mt-0.5">{c.address}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-wrap items-center gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab('all')}
                className={cn(
                  'px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                  activeTab === 'all'
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                )}
              >
                全部
              </button>
              {departments.map((dept) => {
                const hasDoc = clinicDoctors.some((d) => d.departmentId === dept.id);
                if (!hasDoc) return null;
                return (
                  <button
                    key={dept.id}
                    onClick={() => setActiveTab('all')}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors whitespace-nowrap"
                  >
                    {dept.name}
                  </button>
                );
              })}
              {clinicDoctors.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setActiveTab(doc.id)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap',
                    activeTab === doc.id
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  )}
                >
                  {doc.name}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {(['all', 'waiting', 'visiting', 'completed', 'skipped'] as QueueStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    statusFilter === s
                      ? 'bg-zinc-900 text-white'
                      : 'text-zinc-500 hover:bg-zinc-100'
                  )}
                >
                  {s === 'all' ? '全部' : statusMap[s].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {activeTab === 'all'
            ? Array.from(groupedByDoctor.keys()).map((doctorId) => (
                <DoctorCard
                  key={doctorId}
                  doctorId={doctorId}
                  registrations={groupedByDoctor.get(doctorId) ?? []}
                  onCall={handleCall}
                  onComplete={handleComplete}
                  onSkip={handleSkip}
                  onToggleEmergency={handleToggleEmergency}
                />
              ))
            : Array.from(groupedByDoctor.keys()).map((doctorId) => (
                <DoctorCard
                  key={doctorId}
                  doctorId={doctorId}
                  registrations={groupedByDoctor.get(doctorId) ?? []}
                  onCall={handleCall}
                  onComplete={handleComplete}
                  onSkip={handleSkip}
                  onToggleEmergency={handleToggleEmergency}
                />
              ))}
          {groupedByDoctor.size === 0 && (
            <div className="lg:col-span-2 card p-12 text-center">
              <div className="text-zinc-400 text-5xl mb-4">🐾</div>
              <div className="text-lg font-medium text-zinc-700">暂无候诊数据</div>
              <div className="text-sm text-zinc-400 mt-1">请尝试切换筛选条件</div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
