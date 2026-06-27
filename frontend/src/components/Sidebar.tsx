import { NavLink } from 'react-router-dom';
import {
  Home,
  Activity,
  BarChart3,
  AlertTriangle,
  Cpu,
  LogOut,
  Droplets,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const adminLinks = [
  { to: '/', icon: Home, label: 'Overview' },
  { to: '/live', icon: Activity, label: 'Live Monitoring' },
  { to: '/history', icon: BarChart3, label: 'Historical Data' },
  { to: '/alerts', icon: AlertTriangle, label: 'Alerts' },
  { to: '/devices', icon: Cpu, label: 'Devices' },
];

const viewerLinks = [
  { to: '/', icon: Home, label: 'Overview' },
  { to: '/live', icon: Activity, label: 'Live Monitoring' },
  { to: '/history', icon: BarChart3, label: 'Historical Data' },
  { to: '/alerts', icon: AlertTriangle, label: 'Alerts' },
];

export function Sidebar({ isCollapsed, onToggleCollapse, onNavigate }) {
  const { user, logout, isAdmin } = useAuth();
  const links = isAdmin ? adminLinks : viewerLinks;

  return (
    <motion.div
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="h-screen bg-white/80 backdrop-blur-xl border-r border-white/40 flex flex-col shadow-xl"
    >
      <div
        onClick={onToggleCollapse}
        className={`p-6 cursor-pointer ${isCollapsed ? 'flex justify-center' : ''}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Droplets size={24} className="text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h1 className="font-black text-xl text-gray-900 tracking-tight">IsokoSense</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                Water Quality IoT
              </p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                isCollapsed ? 'justify-center' : ''
              } ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
              }`
            }
          >
            <Icon size={20} />
            {!isCollapsed && (
              <span className="text-xs font-black uppercase tracking-widest">{label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
        {!isCollapsed && user && (
          <div className="mb-3 px-2">
            <p className="text-sm font-bold text-gray-900 truncate">{user.fullName}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              {user.role}
            </p>
          </div>
        )}
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 transition-all ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={18} />
          {!isCollapsed && (
            <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
          )}
        </button>
      </div>
    </motion.div>
  );
}
