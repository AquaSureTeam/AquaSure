import { Activity, Droplets, AlertTriangle, Settings, BarChart3, Home, LogOut, ShieldCheck, Users, MapPin, Wrench, Database, FileText, Gauge, TrendingUp, ChevronRight } from "lucide-react";
import { UserRole } from "./LoginView";
import { motion } from "framer-motion";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  userName?: string;
  userRole: UserRole;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ 
  activeView, 
  onViewChange, 
  onLogout, 
  userName = "Admin", 
  userRole,
  isCollapsed,
  onToggleCollapse 
}: SidebarProps) {
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
        { icon: Users, label: "Staff Members", id: "user-management" },
        { icon: Settings, label: "Settings", id: "settings" },
      ];
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  return (
    <motion.div 
      animate={{ width: isCollapsed ? 120 : 320 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="h-screen bg-white/40 backdrop-blur-3xl border-r border-white/20 flex flex-col relative z-20 shadow-2xl overflow-hidden"
    >
      {/* Logo Section - Click to Collapse */}
      <div 
        onClick={onToggleCollapse}
        className={`p-8 cursor-pointer group ${isCollapsed ? "flex flex-col items-center" : ""}`}
      >
        <div className="flex items-center gap-5">
          <motion.div 
            whileHover={{ rotate: 90, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-14 h-14 bg-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-blue-400/30 shrink-0 group-hover:bg-blue-700 transition-colors"
          >
            <Droplets size={28} className="text-white" />
          </motion.div>
          {!isCollapsed && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="overflow-hidden"
            >
              <h1 className="font-black text-3xl tracking-tighter text-gray-900 leading-none">IsokoSense</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Secure Core</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar mt-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => {
            const isActive = activeView === item.id;
            return (
              <li key={item.id}>
                <motion.button
                  initial={false}
                  animate={{ 
                    x: isCollapsed ? 0 : 0,
                    opacity: 1 
                  }}
                  whileHover={{ x: 5 }}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full group flex items-center gap-4 py-4 rounded-[1.5rem] transition-all duration-500 relative ${
                    isCollapsed ? "justify-center px-0" : "px-6"
                  } ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-300/50"
                      : "text-gray-400 hover:text-blue-600 hover:bg-blue-50/50"
                  }`}
                >
                  <item.icon size={22} className={isActive ? "text-white" : "group-hover:scale-110 transition-transform shrink-0"} />
                  {!isCollapsed && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="text-[11px] font-black uppercase tracking-widest flex-1 text-left"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {isActive && !isCollapsed && (
                    <motion.div layoutId="active-pill" className="absolute right-3 w-1.5 h-6 bg-white/30 rounded-full" />
                  )}
                </motion.button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Health Bar */}
      {!isCollapsed && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="p-8"
        >
          <div className="p-6 rounded-[2rem] bg-gray-50/50 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Network Health</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 shadow-lg shadow-blue-400" />
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Active</span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 w-[99%]" />
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}