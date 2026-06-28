import { Bell, Search, Menu, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import { api } from '../api/client';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.getNotifications();
        setNotifications(res.notifications || []);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const firstName = (user as any)?.fullName?.split(' ')[0] || 'there';

  return (
    <header className="bg-white/60 backdrop-blur-3xl border-b border-white/50 px-6 py-3 flex items-center justify-between relative z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-white/80"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-lg font-black text-gray-900">
            {greeting}, {firstName} 👋
          </h2>
          <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">{today}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2 bg-white/50 border border-white/80 rounded-xl px-4 py-2 w-52 shadow-[0_2px_10px_rgba(0,0,0,0.02)] focus-within:bg-white focus-within:shadow-[0_4px_15px_rgba(37,99,235,0.08)] transition-all">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input
            className="bg-transparent text-sm text-gray-600 outline-none w-full placeholder:text-gray-400 font-medium"
            placeholder="Search..."
            readOnly
          />
        </div>

        {/* Notification bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative p-2.5 bg-white/50 border border-white/80 rounded-xl text-gray-500 hover:text-blue-600 hover:bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all"
            aria-label="View alerts"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center font-bold text-white bg-red-500 rounded-full border-2 border-white shadow-sm">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white z-50 overflow-hidden flex flex-col max-h-96">
              <div className="p-4 border-b border-gray-100/50 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Notifications</h3>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {notifications.length} new
                </span>
              </div>
              <div className="overflow-y-auto flex-1 p-2 space-y-1">
                {notifications.length === 0 ? (
                  <p className="text-sm font-medium text-gray-500 text-center py-6">No new notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif._id} className="p-3 hover:bg-white/80 rounded-xl cursor-pointer transition-all border border-transparent hover:border-gray-100 shadow-sm">
                      <div className="flex gap-3">
                        <div className="mt-0.5">
                          {notif.type === 'CONTAMINATION_WARNING' ? (
                            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
                              <Bell size={14} />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                              <CheckCircle2 size={14} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800 line-clamp-3 leading-relaxed">{notif.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-bold">
                            {new Date(notif.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-gray-100/50">
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/alerts');
                  }}
                  className="w-full py-2.5 text-xs uppercase tracking-widest text-blue-600 hover:bg-blue-50 rounded-xl font-bold transition-colors"
                >
                  View All Alerts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-black text-sm cursor-pointer select-none shadow-sm border border-white">
          {(user as any)?.fullName?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}
