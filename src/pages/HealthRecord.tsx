import { useState, useCallback } from 'react';
import {
  Search,
  Phone,
  Dog,
  Cat,
  Bird,
  Rabbit,
  CalendarDays,
  Stethoscope,
  Syringe,
  Scissors,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  FileText,
  HeartPulse,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import { api, type PetHealthProfile, type MedicalRecord } from '@/lib/api';
import type { Pet } from '../../shared/types';

function getSpeciesIcon(species: string, className = 'w-5 h-5') {
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

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function getStatusInfo(status: MedicalRecord['status']) {
  switch (status) {
    case 'completed':
      return { label: '已完成', className: 'bg-green-100 text-green-700', icon: CheckCircle2 };
    case 'confirmed':
      return { label: '待就诊', className: 'bg-blue-100 text-blue-700', icon: Clock };
    case 'pending':
      return { label: '待确认', className: 'bg-amber-100 text-amber-700', icon: Clock };
    case 'waiting':
      return { label: '候诊中', className: 'bg-purple-100 text-purple-700', icon: Clock };
    case 'visiting':
      return { label: '就诊中', className: 'bg-primary-100 text-primary-700', icon: Stethoscope };
    case 'skipped':
      return { label: '已过号', className: 'bg-orange-100 text-orange-700', icon: AlertTriangle };
    case 'cancelled':
      return { label: '已取消', className: 'bg-zinc-100 text-zinc-500', icon: XCircle };
    default:
      return { label: status, className: 'bg-zinc-100 text-zinc-500', icon: Clock };
  }
}

function getGenderLabel(gender: Pet['gender']): string {
  return gender === 'male' ? '公' : '母';
}

function getNeuteredLabel(isNeutered: boolean): string {
  return isNeutered ? '已绝育' : '未绝育';
}

function PetBasicInfo({ pet }: { pet: Pet }) {
  const infoItems = [
    { label: '品种', value: pet.breed || '-' },
    { label: '年龄', value: pet.age ? `${pet.age} 岁` : '-' },
    { label: '性别', value: getGenderLabel(pet.gender) },
    { label: '体重', value: pet.weight ? `${pet.weight} kg` : '-' },
    { label: '绝育', value: getNeuteredLabel(pet.isNeutered) },
    { label: '疫苗', value: pet.vaccineStatus || '-' },
  ];

  return (
    <div className="flex gap-5">
      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 flex items-center justify-center overflow-hidden flex-shrink-0">
        <img
          src={pet.avatar}
          alt={pet.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-bold text-zinc-900">{pet.name}</h3>
          {getSpeciesIcon(pet.species, 'w-5 h-5 text-primary-500')}
          <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-xs rounded-full">
            {pet.species}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5">
          {infoItems.map((item) => (
            <div key={item.label} className="text-sm">
              <span className="text-zinc-400">{item.label}：</span>
              <span className="text-zinc-700 font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MedicalRecordItem({ record }: { record: MedicalRecord }) {
  const statusInfo = getStatusInfo(record.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 hover:bg-zinc-100/50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-zinc-600">{formatDate(record.date)}</span>
            {record.isEmergency && (
              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                急诊
              </span>
            )}
            <span className={cn('px-2 py-0.5 text-xs font-medium rounded-full flex items-center gap-1', statusInfo.className)}>
              <StatusIcon className="w-3 h-3" />
              {statusInfo.label}
            </span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-primary-500" />
              <span className="text-sm font-medium text-zinc-800">
                {record.departmentName}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <HeartPulse className="w-3.5 h-3.5 text-accent-500" />
              <span className="text-sm text-zinc-600">
                {record.doctorName} {record.doctorTitle}
              </span>
            </div>
          </div>
          {record.chiefComplaint && (
            <div className="text-sm text-zinc-700 mb-1">
              <span className="text-zinc-400">主诉：</span>
              {record.chiefComplaint}
            </div>
          )}
          {record.symptoms.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {record.symptoms.map((sym, i) => (
                <span key={i} className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full">
                  {sym}
                </span>
              ))}
            </div>
          )}
          {(record.registrationNo || record.appointmentNo) && (
            <div className="flex items-center gap-4 mt-2 pt-2 border-t border-zinc-200 text-xs text-zinc-400">
              {record.registrationNo && (
                <span>挂号：{record.registrationNo}</span>
              )}
              {record.appointmentNo && (
                <span>预约：{record.appointmentNo}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PetProfileCard({ profile }: { profile: PetHealthProfile }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card !p-6">
      <PetBasicInfo pet={profile.pet} />

      {profile.medicalRecords.length > 0 ? (
        <>
          <div className="mt-5 pt-5 border-t border-zinc-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" />
                <h4 className="font-semibold text-zinc-900">
                  历史就诊记录
                </h4>
                <span className="px-2 py-0.5 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                  {profile.medicalRecords.length} 次
                </span>
              </div>
              {profile.medicalRecords.length > 3 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  {expanded ? '收起' : `查看全部 (${profile.medicalRecords.length})`}
                </button>
              )}
            </div>
            <div className="space-y-3">
              {(expanded ? profile.medicalRecords : profile.medicalRecords.slice(0, 3)).map(
                (record, i) => (
                  <MedicalRecordItem key={`${record.date}-${i}`} record={record} />
                )
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5 pt-5 border-t border-zinc-100 text-center py-8">
          <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-500 text-sm">暂无就诊记录</p>
        </div>
      )}
    </div>
  );
}

export default function HealthRecord() {
  const [phone, setPhone] = useState('');
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<PetHealthProfile[]>([]);
  const [searched, setSearched] = useState(false);

  const samplePhones = ['13800138001', '13800138002', '13800138003'];

  const handleSearch = useCallback(async () => {
    if (!phone.trim()) {
      setError('请输入手机号');
      return;
    }
    if (!/^1\d{10}$/.test(phone.trim())) {
      setError('请输入正确的手机号');
      return;
    }

    try {
      setSearching(true);
      setError(null);
      setSearched(true);
      const data = await api.getHealthRecords(phone.trim());
      setProfiles(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '查询失败');
      setProfiles([]);
    } finally {
      setSearching(false);
    }
  }, [phone]);

  const handleQuickSearch = useCallback((p: string) => {
    setPhone(p);
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">宠物健康档案</h1>
          <p className="mt-1 text-sm text-zinc-500">
            输入宠物主人手机号查询宠物健康档案及历史就诊记录
          </p>
        </div>

        <div className="card !p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Phone className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ''))}
                placeholder="请输入宠物主人手机号"
                maxLength={11}
                className="w-full pl-12 pr-4 py-3 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={searching}
              className="btn btn-primary px-8 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {searching ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Search className="w-5 h-5" />
              )}
              {searching ? '查询中...' : '查询档案'}
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-zinc-400">快速查询：</span>
            {samplePhones.map((p) => (
              <button
                key={p}
                onClick={() => handleQuickSearch(p)}
                className={cn(
                  'px-3 py-1 text-xs rounded-full transition-all',
                  phone === p
                    ? 'bg-primary-500 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                )}
              >
                {p}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}
        </div>

        {searched && !searching && (
          <>
            {profiles.length === 0 ? (
              <div className="card py-16 text-center">
                <HeartPulse className="w-16 h-16 text-zinc-300 mx-auto mb-4" />
                <p className="text-zinc-600 font-medium">未找到该手机号对应的宠物档案</p>
                <p className="text-zinc-400 text-sm mt-1">请确认手机号是否正确</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-sm text-zinc-500">
                  <Syringe className="w-4 h-4" />
                  <span>
                    共找到 <strong className="text-primary-600">{profiles.length}</strong> 只宠物的健康档案
                  </span>
                </div>
                <div className="space-y-6">
                  {profiles.map((profile) => (
                    <PetProfileCard key={profile.pet.id} profile={profile} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
