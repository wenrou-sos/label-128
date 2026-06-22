import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  MapPin,
  User,
  Clock,
  ArrowRight,
  Home,
} from 'lucide-react';
import { useAppointmentStore } from '@/stores/appointmentStore';

export default function AppointmentSuccess() {
  const navigate = useNavigate();
  const appointment = useAppointmentStore((s) => s.createdAppointment);
  const selectedClinic = useAppointmentStore((s) => s.selectedClinic);
  const selectedDoctor = useAppointmentStore((s) => s.selectedDoctor);
  const selectedDepartment = useAppointmentStore((s) => s.selectedDepartment);
  const selectedTimeSlot = useAppointmentStore((s) => s.selectedTimeSlot);
  const selectedDate = useAppointmentStore((s) => s.selectedDate);
  const reset = useAppointmentStore((s) => s.reset);

  useEffect(() => {
    if (!appointment) {
      navigate('/appointment');
    }
  }, [appointment, navigate]);

  if (!appointment) return null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const weekday = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日 ${weekday[d.getDay()]}`;
  };

  const handleBackHome = () => {
    reset();
    navigate('/');
  };

  const handleNewAppointment = () => {
    reset();
    navigate('/appointment');
  };

  return (
    <div className="min-h-screen py-8 px-4 md:py-12">
      <div className="max-w-lg mx-auto">
        <div className="text-center animate-fade-in-up">
          <div className="w-20 h-20 mx-auto rounded-full bg-primary-100 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-12 h-12 text-primary-500" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-zinc-900">
            预约成功
          </h1>
          <p className="text-zinc-500 mt-2">
            我们已为您成功预约，请按时前往就诊
          </p>
        </div>

        <div className="ticket mt-8 p-6 animate-fade-in-up">
          <div className="text-center mb-6 pb-6 border-b border-dashed border-zinc-200">
            <div className="text-xs text-zinc-500">预约编号</div>
            <div className="font-mono text-2xl font-bold text-primary-600 mt-1">
              {appointment.appointmentNo}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-primary-500" />
              </div>
              <div>
                <div className="text-xs text-zinc-500">就诊分院</div>
                <div className="font-medium text-zinc-900">
                  {selectedClinic?.name}
                </div>
                <div className="text-xs text-zinc-500">
                  {selectedDepartment?.name} · 诊室 {selectedDoctor?.roomNumber}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-primary-500" />
              </div>
              <div>
                <div className="text-xs text-zinc-500">接诊医生</div>
                <div className="font-medium text-zinc-900">
                  {selectedDoctor?.name} · {selectedDoctor?.title}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-primary-500" />
              </div>
              <div>
                <div className="text-xs text-zinc-500">就诊日期</div>
                <div className="font-medium text-zinc-900">
                  {formatDate(selectedDate)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-primary-500" />
              </div>
              <div>
                <div className="text-xs text-zinc-500">就诊时段</div>
                <div className="font-medium text-zinc-900">
                  {selectedTimeSlot?.startTime} - {selectedTimeSlot?.endTime}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-zinc-500 animate-fade-in-up">
          <p>请提前 15 分钟到达分院进行签到</p>
          <p className="mt-1">如需取消或改期，请联系分院前台</p>
        </div>

        <div className="flex gap-3 mt-8 animate-fade-in-up">
          <button
            onClick={handleBackHome}
            className="btn-secondary flex-1"
          >
            <Home className="w-4 h-4" />
            返回首页
          </button>
          <button
            onClick={handleNewAppointment}
            className="btn-primary flex-1"
          >
            继续预约
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
