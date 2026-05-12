import { Activity, Droplets, AlertTriangle, Settings, BarChart3, Home, LogOut, ShieldCheck, Users, MapPin, Wrench, Database, FileText, Gauge, TrendingUp, ChevronRight } from "lucide-react";
import { UserRole } from "./LoginView";
import { motion } from "framer-motion";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  userName?: string;
  userRole: UserRole;
}

export function Sidebar({ activeView, onViewChange, onLogout, userName = "Admin", userRole }: SidebarProps) {
  const getMenuItems = () => {
    const baseItems = [
      { icon: Home, label: "Dashboard", id: "dashboard" },
    ];

    if (userRole === "admin") {
      return [
        ...baseItems,
        { icon: Droplets, label: "Water Quality", id: "water-quality" },
        { icon: Activity, label: "Sensors", id: "sensors" },
        { icon: BarChart3, label: "Analytics", id: "analytics" },
        { icon: AlertTriangle, label: "Alerts", id: "alerts" },
        { icon: Users, label: "User Management", id: "user-management" },
        { icon: Settings, label: "Settings", id: "settings" },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  const getRoleLabel = (role: UserRole): string => {
    const roleLabels: Record<UserRole, string> = {
      admin: "Administrator",
      officer: "Env. Officer",
      operator: "Operator",
      technician: "Technician",
      researcher: "Researcher",
    };
    return roleLabels[role];
  };

  return (
    <div className="w-80 h-screen bg-white/40 backdrop-blur-3xl border-r border-white/20 flex flex-col relative z-20 shadow-2xl">
      {/* Logo Section */}
      <div className="p-10">
        <div className="flex items-center gap-5">
          <motion.div 
            whileHover={{ rotate: 90, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-14 h-14 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-400/30"
          >
            <Droplets size={28} className="text-white" />
          </motion.div>
          <div>
            <h1 className="font-black text-3xl tracking-tighter text-gray-900 leading-none">IsokoSense</h1>
            <div className="flex items-center gap-2 mt-1.5">
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse shadow-lg shadow-blue-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Secure Core</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="px-6 mb-10">
        <div className="glass bg-white/60 p-5 rounded-[2.5rem] border-white/40">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-xl shadow-blue-200">
              {userName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-black text-gray-900 truncate leading-none mb-1">{userName}</p>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest truncate">{getRoleLabel(userRole)}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full py-3 px-4 flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-white bg-white hover:bg-blue-600 rounded-2xl border border-gray-100 hover:border-blue-600 transition-all duration-300 shadow-sm"
          >
            <LogOut size={14} />
            Termination Session
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full group flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-500 relative ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-300/50"
                      : "text-gray-400 hover:text-blue-600 hover:bg-blue-50/50"
                  }`}
                >
                  <item.icon size={22} className={isActive ? "text-white" : "group-hover:scale-110 transition-transform"} />
                  <span className="text-[11px] font-black uppercase tracking-widest flex-1 text-left">{item.label}</span>
                  {isActive && (
                    <motion.div layoutId="active-pill" className="absolute right-3 w-1.5 h-6 bg-white/30 rounded-full" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Health Bar */}
      <div className="p-8">
        <div className="p-6 rounded-[2rem] bg-gray-50/50 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Network integrity</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600 shadow-lg shadow-blue-400" />
              <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">99.9%</span>
            </div>
          </div>
          <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "99.9%" }}
              className="h-full bg-blue-600" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}