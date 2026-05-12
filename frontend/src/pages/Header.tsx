import { Bell, Search, User, Wifi, Calendar, Clock, ChevronDown, LogOut, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserRole } from "../components/LoginView";

interface HeaderProps {
  onNotificationClick: () => void;
  notificationCount: number;
  onLogout: () => void;
  onMenuClick: () => void;
  userName?: string;
  userRole: UserRole;
}

export function Header({ onNotificationClick, notificationCount, onLogout, onMenuClick, userName = "Admin", userRole }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const getRoleLabel = (role: UserRole): string => {
    const roleLabels: Record<UserRole, string> = {
      admin: "System Manager",
      officer: "Env. Officer",
      operator: "Operator",
      technician: "Technician",
      researcher: "Researcher",
    };
    return roleLabels[role];
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      alert(`Searching for: ${searchQuery}`);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <header className="px-4 md:px-8 py-4 md:py-6 bg-transparent relative z-20">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-3 bg-white/40 backdrop-blur-xl border border-white/20 rounded-2xl text-gray-400 hover:text-blue-600 transition-all"
        >
          <Menu size={24} />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl hidden sm:block">
          <form onSubmit={handleSearch}>
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search metrics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-3.5 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-sm focus:outline-none focus:ring-8 focus:ring-blue-600/5 focus:border-blue-500/50 transition-all placeholder:text-gray-400 font-bold text-sm"
              />
            </div>
          </form>
        </div>

        {/* Right Side Tools */}
        <div className="flex items-center gap-6">
          {/* Time Display */}
          <div className="hidden xl:flex items-center gap-4 bg-white/40 backdrop-blur-xl border border-white/20 px-6 py-3.5 rounded-[2rem] shadow-sm">
            <div className="flex items-center gap-2.5 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
              <Calendar size={14} className="text-blue-600" />
              <span>{formatDate(currentTime)}</span>
            </div>
            <div className="w-px h-4 bg-gray-200/50" />
            <div className="flex items-center gap-2.5 text-[10px] font-black text-gray-900 uppercase tracking-[0.15em]">
              <Clock size={14} className="text-blue-600" />
              <span>{formatTime(currentTime)}</span>
            </div>
          </div>

          {/* System Status */}
          <div className="hidden md:flex items-center gap-3 bg-blue-50 border border-blue-100/50 px-5 py-3.5 rounded-[2rem] text-blue-600">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shadow-lg shadow-blue-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Data Live</span>
          </div>

          {/* Notifications */}
          <button 
            onClick={onNotificationClick}
            className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-white/40 backdrop-blur-xl border border-white/20 rounded-[1.2rem] md:rounded-[1.5rem] text-gray-400 hover:text-blue-600 transition-all group shadow-sm"
          >
            <Bell size={20} className="md:size-[22px] group-hover:scale-110 transition-transform" />
            {notificationCount > 0 && (
              <span className="absolute top-2.5 right-2.5 w-3.5 h-3.5 bg-blue-600 text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Profile & Logout */}
          <div className="flex items-center gap-2 md:gap-4 bg-white/40 backdrop-blur-xl border border-white/20 p-1.5 md:p-2 pr-4 md:pr-6 rounded-[2rem] shadow-sm">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 text-white rounded-xl md:rounded-[1.2rem] flex items-center justify-center font-black text-xs md:text-sm shadow-lg shadow-blue-200">
              {userName.charAt(0)}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-[10px] md:text-xs font-black text-gray-900 leading-tight truncate max-w-[80px]">{userName}</p>
              <p className="text-[8px] md:text-[9px] font-black text-blue-500 uppercase tracking-widest">{getRoleLabel(userRole)}</p>
            </div>
            <div className="hidden sm:block w-px h-5 bg-gray-200 mx-1 md:mx-2" />
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
            >
              <LogOut size={12} className="md:size-3.5" />
              <span className="hidden xs:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
