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
  admin: 'bg-indigo-100 text-indigo-700',
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
      className="h-screen bg-white border-r border-gray-100 flex flex-col shadow-sm flex-shrink-0"
    >
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-gray-50">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
          <Droplets size={18} className="text-white" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <p className="font-bold text-indigo-950 text-sm leading-tight">IsokoSense</p>
            <p className="text-xs text-indigo-400">Water Monitoring</p>
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
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isCollapsed ? 'justify-center' : ''
              } ${isActive
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                : 'text-gray-500 hover:bg-indigo-50 hover:text-indigo-600'
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
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-gray-400 hover:bg-gray-50 hover:text-gray-600 text-xs transition-colors"
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
      <div className="p-3 border-t border-gray-50">
        {!isCollapsed && user ? (
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-default mb-1">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm flex-shrink-0">
              {(user as any).fullName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 truncate">{(user as any).fullName}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleColor}`}>
                {role}
              </span>
            </div>
          </div>
        ) : null}
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-500 text-sm transition-all ${isCollapsed ? 'justify-center' : ''
            }`}
        >
          <LogOut size={17} />
          {!isCollapsed && <span className="font-medium">Sign out</span>}
        </button>
      </div>
    </div>
  );
}
