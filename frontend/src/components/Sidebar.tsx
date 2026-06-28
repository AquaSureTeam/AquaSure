import { NavLink } from 'react-router-dom';
import {
  Home,
  Activity,
  BarChart3,
  AlertTriangle,
  Cpu,
  LogOut,
  Droplets,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLE_LINKS = {
  admin: [
    { to: '/', icon: Home, label: 'Overview' },
    { to: '/live', icon: Activity, label: 'Live Monitoring' },
    { to: '/history', icon: BarChart3, label: 'Historical Data' },
    { to: '/alerts', icon: AlertTriangle, label: 'Alerts' },
    { to: '/devices', icon: Cpu, label: 'Devices' },
  ],
  viewer: [
    { to: '/', icon: Home, label: 'Overview' },
    { to: '/live', icon: Activity, label: 'Live Monitoring' },
    { to: '/history', icon: BarChart3, label: 'Historical Data' },
    { to: '/alerts', icon: AlertTriangle, label: 'Alerts' },
  ],
};

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-blue-100 text-blue-700',
  viewer: 'bg-gray-100 text-gray-600',
};

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse, onNavigate }: SidebarProps) {
  const { user, logout } = useAuth();
  const role = (user?.role as string) || 'viewer';
  const links = ROLE_LINKS[role] || ROLE_LINKS.viewer;
  const roleColor = ROLE_COLORS[role] || ROLE_COLORS.viewer;

  return (
    <div
      style={{ width: isCollapsed ? 72 : 256, transition: 'width 0.2s ease' }}
      className="h-screen bg-white/60 backdrop-blur-3xl border-r border-white/50 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] flex-shrink-0 relative z-20"
    >
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-white/50">
        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-200">
          <Droplets size={18} className="text-white" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <p className="font-bold text-gray-900 text-sm leading-tight">IsokoSense</p>
            <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Portal</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${isCollapsed ? 'justify-center' : ''
              } ${isActive
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                : 'text-gray-500 hover:bg-white/80 hover:text-blue-600'
              }`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            {!isCollapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 pb-2">
        <button
          onClick={onToggleCollapse}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-gray-400 hover:bg-white/80 hover:text-gray-600 text-xs transition-colors font-bold"
        >
          {isCollapsed ? (
            <ChevronRight size={16} />
          ) : (
            <>
              <ChevronLeft size={16} />
            </>
          )}
        </button>
      </div>

      {/* User footer */}
      <div className="p-3 border-t border-white/50">
        {!isCollapsed && user ? (
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/50 cursor-default mb-1 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0 shadow-sm">
              {(user as any).fullName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">{(user as any).fullName}</p>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${roleColor}`}>
                {role}
              </span>
            </div>
          </div>
        ) : null}
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 text-sm transition-all font-bold ${isCollapsed ? 'justify-center' : ''
            }`}
        >
          <LogOut size={17} />
          {!isCollapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  );
}
