import { useState, useEffect, useCallback } from 'react';
import {
  Stethoscope,
  MapPin,
  Building2,
  ChevronRight,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';
import type { Clinic, Department, Doctor } from '../../shared/types';

export default function Doctors() {
  const navigate = useNavigate();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<number | 'all'>('all');
  const [selectedDept, setSelectedDept] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [clinicsData, deptsData] = await Promise.all([
          api.getClinics(),
          api.getDepartments(),
        ]);
        setClinics(clinicsData);
        setDepartments(deptsData);
      } catch (e) {
        setError(e instanceof Error ? e.message : '加载失败');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loadDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const params: Parameters<typeof api.getDoctors>[0] = {};
      if (selectedClinic !== 'all') params.clinicId = selectedClinic;
      if (selectedDept !== 'all') params.departmentId = selectedDept;
      const data = await api.getDoctors(params);
      setDoctors(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : '加载失败');
    } finally {
      setLoading(false);
    }
  }, [selectedClinic, selectedDept]);

  useEffect(() => {
    if (clinics.length > 0 && departments.length > 0) {
      loadDoctors();
    }
  }, [selectedClinic, selectedDept, loadDoctors, clinics.length, departments.length]);

  const deptMap = departments.reduce<Record<number, Department>>((acc, d) => {
    acc[d.id] = d;
    return acc;
  }, {});

  const clinicMap = clinics.reduce<Record<number, Clinic>>((acc, c) => {
    acc[c.id] = c;
    return acc;
  }, {});

  if (loading && doctors.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <span className="ml-3 text-zinc-500">加载中...</span>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">医生排班管理</h1>
            <p className="mt-1 text-sm text-zinc-500">
              查看各分院医生出诊安排，点击医生查看详细排班
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Stethoscope className="w-4 h-4" />
            <span>共 {doctors.length} 位医生</span>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="card !p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Building2 className="w-4 h-4 text-zinc-400" />
            <span className="font-medium">分院筛选</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedClinic('all')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                selectedClinic === 'all'
                  ? 'bg-primary-500 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              )}
            >
              全部分院
            </button>
            {clinics.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedClinic(c.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  selectedClinic === c.id
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                )}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="card !p-4 space-y-4">
          <div className="flex items-center gap-2 text-sm text-zinc-600">
            <Stethoscope className="w-4 h-4 text-zinc-400" />
            <span className="font-medium">科室筛选</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDept('all')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                selectedDept === 'all'
                  ? 'bg-accent-500 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              )}
            >
              全部科室
            </button>
            {departments.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDept(d.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  selectedDept === d.id
                    ? 'bg-accent-500 text-white shadow-sm'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                )}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        {doctors.length === 0 ? (
          <div className="card py-16 text-center">
            <Stethoscope className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500">该筛选条件下暂无医生</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <button
                key={doctor.id}
                onClick={() => navigate(`/doctors/${doctor.id}`)}
                className="card text-left hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer group"
              >
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    <img
                      src={doctor.avatar}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <Stethoscope className="w-7 h-7 text-primary-600 absolute hidden" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-zinc-900 text-lg">
                        {doctor.name}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-primary-500 transition-colors" />
                    </div>
                    <p className="text-sm text-primary-600 font-medium mt-0.5">
                      {doctor.title}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">
                      {deptMap[doctor.departmentId]?.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-500">
                      <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                      <span>
                        {clinicMap[doctor.clinicId]?.name} ·{' '}
                        {doctor.roomNumber}诊室
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-100">
                  <p className="text-xs text-zinc-500 mb-2">专长</p>
                  <div className="flex flex-wrap gap-1.5">
                    {doctor.specialties.slice(0, 3).map((spec, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                    {doctor.specialties.length > 3 && (
                      <span className="px-2 py-0.5 bg-zinc-100 text-zinc-500 text-xs rounded-full">
                        +{doctor.specialties.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
