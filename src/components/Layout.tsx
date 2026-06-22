import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  PawPrint,
  Home,
  CalendarPlus,
  Users,
  ClipboardCheck,
  Menu,
  X,
  Stethoscope,
  Clock,
  HeartPulse,
  FileText,
  Settings,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: '首页', icon: Home },
  { to: '/appointment', label: '预约挂号', icon: CalendarPlus },
  { to: '/queue', label: '候诊队列', icon: Users },
  { to: '/checkin', label: '挂号确认', icon: ClipboardCheck },
]

const sidebarItems = [
  { to: '/', label: '首页', icon: Home },
  { to: '/appointment', label: '预约挂号', icon: CalendarPlus },
  { to: '/queue', label: '候诊队列', icon: Users },
  { to: '/checkin', label: '挂号确认', icon: ClipboardCheck },
  { to: '/doctors', label: '医生管理', icon: Stethoscope },
  { to: '/appointments', label: '预约记录', icon: FileText },
  { to: '/waiting', label: '叫号管理', icon: Clock },
  { to: '/health', label: '健康档案', icon: HeartPulse },
  { to: '/settings', label: '系统设置', icon: Settings },
]

const bottomNavItems = [
  { to: '/', label: '首页', icon: Home },
  { to: '/appointment', label: '挂号', icon: CalendarPlus },
  { to: '/queue', label: '队列', icon: Users },
  { to: '/checkin', label: '确认', icon: ClipboardCheck },
]

export default function Layout({ children }: { children?: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 -ml-2 text-zinc-600 hover:text-primary-600 hover:bg-zinc-100 rounded-lg"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-md group-hover:shadow-glow transition-shadow">
                <PawPrint size={20} className="text-white" />
              </div>
              <span className="font-serif text-xl font-bold text-zinc-900 tracking-wide">
                悦宠医疗
              </span>
            </NavLink>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-zinc-600 hover:text-primary-600 hover:bg-zinc-100'
                    )
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-100 text-xs text-zinc-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              正常营业中
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <aside
          className={cn(
            'fixed inset-y-16 left-0 z-30 w-64 bg-white border-r border-zinc-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:h-auto',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <nav className="p-4 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-primary-50 to-primary-50/50 text-primary-700 shadow-sm'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                    )
                  }
                >
                  <Icon
                    size={18}
                    className={cn(
                      location.pathname === item.to
                        ? 'text-primary-600'
                        : 'text-zinc-400'
                    )}
                  />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="flex-1 min-w-0 pb-20 md:pb-8">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            {children ?? <Outlet />}
          </div>
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-zinc-200 md:hidden">
        <div className="grid grid-cols-4 h-16">
          {bottomNavItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center justify-center gap-0.5 text-xs font-medium transition-colors',
                    isActive ? 'text-primary-600' : 'text-zinc-500'
                  )
                }
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
