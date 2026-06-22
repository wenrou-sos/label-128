import { Link } from "react-router-dom";
import {
  CalendarPlus,
  Users,
  ClipboardCheck,
  Building2,
  Clock,
  Dog,
  Stethoscope,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  HeartPulse,
  Shield,
  Sparkles,
  ChevronRight,
  PawPrint,
  Syringe,
} from "lucide-react";
import Layout from "@/components/Layout";
import { clinics, registrations, appointments } from "@/../shared/mockData";

const statsData = [
  {
    label: "今日预约总数",
    value: appointments.length,
    icon: CalendarPlus,
    trend: 12,
    trendUp: true,
    color: "primary",
    bgGradient: "from-primary-500 to-primary-600",
  },
  {
    label: "正在候诊数",
    value: registrations.filter((r) => r.status === "waiting").length,
    icon: Users,
    trend: 3,
    trendUp: true,
    color: "accent",
    bgGradient: "from-accent-500 to-accent-600",
  },
  {
    label: "已完成就诊数",
    value: registrations.filter((r) => r.status === "completed").length,
    icon: CheckCircle2,
    trend: 8,
    trendUp: true,
    color: "emerald",
    bgGradient: "from-emerald-500 to-emerald-600",
  },
  {
    label: "今日急诊数量",
    value: registrations.filter((r) => r.isEmergency).length,
    icon: AlertTriangle,
    trend: 1,
    trendUp: false,
    color: "rose",
    bgGradient: "from-rose-500 to-rose-600",
  },
];

const quickActions = [
  { label: "预约挂号", icon: CalendarPlus, path: "/appointment", color: "primary" },
  { label: "候诊队列", icon: Users, path: "/queue", color: "accent" },
  { label: "挂号确认", icon: ClipboardCheck, path: "/checkin", color: "emerald" },
  { label: "分院管理", icon: Building2, path: "#", color: "violet" },
  { label: "医生排班", icon: Clock, path: "/doctors", color: "blue" },
  { label: "宠物档案", icon: Dog, path: "#", color: "amber" },
];

const colorMap: Record<string, string> = {
  primary: "bg-primary-50 text-primary-600 group-hover:bg-primary-100",
  accent: "bg-accent-50 text-accent-600 group-hover:bg-accent-100",
  emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
  violet: "bg-violet-50 text-violet-600 group-hover:bg-violet-100",
  blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
  amber: "bg-amber-50 text-amber-600 group-hover:bg-amber-100",
};

function ClinicQueueCard({ clinic }: { clinic: (typeof clinics)[0] }) {
  const clinicRegistrations = registrations.filter((r) => r.clinicId === clinic.id);
  const waitingCount = clinicRegistrations.filter((r) => r.status === "waiting").length;
  const emergencyCount = clinicRegistrations.filter((r) => r.isEmergency && r.status !== "completed").length;

  return (
    <Link
      to="/queue"
      className="card p-5 group hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900 group-hover:text-primary-700 transition-colors">
              {clinic.name}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">{clinic.district} · {clinic.openTime}-{clinic.closeTime}</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-zinc-50 p-3">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-1">
            <Users className="w-3.5 h-3.5" />
            候诊中
          </div>
          <div className="text-2xl font-bold text-zinc-900">{waitingCount}</div>
        </div>
        <div className="rounded-xl bg-rose-50 p-3">
          <div className="flex items-center gap-1.5 text-xs text-rose-600 mb-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            急诊
          </div>
          <div className="text-2xl font-bold text-rose-600">{emergencyCount}</div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12 space-y-10 md:space-y-14">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 p-6 md:p-10 lg:p-12">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent-400 blur-3xl" />
            <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-primary-400 blur-3xl" />
          </div>

          <div className="relative grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-primary-100 text-sm">
                <Sparkles className="w-4 h-4 text-accent-300" />
                专业宠物医疗连锁机构
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
                悦宠医疗集团
                <br />
                <span className="text-accent-300">连锁管理平台</span>
              </h1>

              <p className="text-primary-100 text-base md:text-lg max-w-lg">
                专业·贴心·值得信赖的宠物医疗服务，
                <br className="hidden sm:block" />
                为您的爱宠提供全方位健康守护
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/appointment"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent-500 to-accent-400 text-white font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  <CalendarPlus className="w-5 h-5" />
                  立即预约挂号
                </Link>
                <Link
                  to="/queue"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/15 backdrop-blur-sm text-white font-medium border border-white/20 hover:bg-white/25 transition-all duration-200"
                >
                  <Users className="w-5 h-5" />
                  查看候诊队列
                </Link>
              </div>

              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2 text-primary-100">
                  <Shield className="w-5 h-5 text-accent-300" />
                  <span className="text-sm">3家连锁分院</span>
                </div>
                <div className="flex items-center gap-2 text-primary-100">
                  <HeartPulse className="w-5 h-5 text-accent-300" />
                  <span className="text-sm">20+专业医师</span>
                </div>
                <div className="flex items-center gap-2 text-primary-100">
                  <PawPrint className="w-5 h-5 text-accent-300" />
                  <span className="text-sm">8大诊疗科室</span>
                </div>
              </div>
            </div>

            <div className="relative h-64 md:h-80 lg:h-96 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-accent-400/30 to-primary-400/30 animate-pulse-slow" />
                <div className="absolute w-48 h-48 md:w-60 md:h-60 rounded-full bg-gradient-to-br from-accent-300/40 to-primary-300/40" />
                <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-2xl">
                  <div className="grid grid-cols-2 gap-3 p-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-accent-400/30 backdrop-blur flex items-center justify-center">
                      <HeartPulse className="w-6 h-6 md:w-7 md:h-7 text-accent-200" />
                    </div>
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-accent-400/30 backdrop-blur flex items-center justify-center">
                      <Syringe className="w-6 h-6 md:w-7 md:h-7 text-accent-200" />
                    </div>
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <PawPrint className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-8 md:top-8 md:right-16 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                <Activity className="w-7 h-7 md:w-8 md:h-8 text-accent-300" />
              </div>
              <div className="absolute bottom-8 left-4 md:bottom-12 md:left-8 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center animate-fade-in-up" style={{ animationDelay: "400ms" }}>
                <Shield className="w-6 h-6 md:w-7 md:h-7 text-primary-200" />
              </div>
              <div className="absolute top-1/2 -left-2 md:-left-4 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent-400/40 backdrop-blur-md border border-accent-300/30 flex items-center justify-center animate-fade-in-up" style={{ animationDelay: "500ms" }}>
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between animate-fade-in-up">
            <div>
              <h2 className="section-title">今日数据概览</h2>
              <p className="subtitle">实时统计，掌握全院运营动态</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {statsData.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="card p-5 hover:shadow-card-hover transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center shadow-md`}>
                      <Icon className="w-5.5 h-5.5 text-white" />
                    </div>
                    <div className={`flex items-center gap-0.5 text-xs font-medium ${stat.trendUp ? "text-emerald-600" : "text-rose-600"}`}>
                      {stat.trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                      {stat.trend}%
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-zinc-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-zinc-500">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between animate-fade-in-up">
            <div>
              <h2 className="section-title">快捷功能入口</h2>
              <p className="subtitle">常用功能，一键直达</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  to={action.path}
                  className="group card p-5 md:p-6 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in-up"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-all duration-300 ${colorMap[action.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-900 group-hover:text-primary-700 transition-colors">
                      {action.label}
                    </h3>
                    <ChevronRight className="w-5 h-5 text-zinc-400 group-hover:text-primary-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between animate-fade-in-up">
            <div>
              <h2 className="section-title">分院候诊快览</h2>
              <p className="subtitle">实时查看各分院候诊情况</p>
            </div>
            <Link
              to="/queue"
              className="hidden sm:inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              查看全部
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {clinics.map((clinic, index) => (
              <div key={clinic.id} style={{ animationDelay: `${index * 100}ms` }}>
                <ClinicQueueCard clinic={clinic} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
