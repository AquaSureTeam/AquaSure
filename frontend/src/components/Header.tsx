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
    <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-50"
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-lg font-bold text-indigo-950">
            {greeting}, {firstName} 👋
          </h2>
          <p className="text-xs text-gray-400">{today}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-52">
          <Search size={15} className="text-gray-400 flex-shrink-0" />
          <input
            className="bg-transparent text-sm text-gray-500 outline-none w-full placeholder:text-gray-400"
            placeholder="Search..."
            readOnly
          />
        </div>

        {/* Notification bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
            aria-label="View alerts"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] flex items-center justify-center font-bold text-white bg-red-500 rounded-full border-2 border-white">
                {notifications.length > 9 ? '9+' : notifications.length}
              </span>
            )}
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden flex flex-col max-h-96">
              <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-medium">
                  {notifications.length} new
                </span>
              </div>
              <div className="overflow-y-auto flex-1 p-2 space-y-1">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No new notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif._id} className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-gray-100">
                      <div className="flex gap-3">
                        <div className="mt-0.5">
                          {notif.type === 'CONTAMINATION_WARNING' ? (
                            <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 flex-shrink-0">
                              <Bell size={14} />
                            </div>
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 flex-shrink-0">
                              <CheckCircle2 size={14} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-800 line-clamp-3 leading-relaxed">{notif.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">
                            {new Date(notif.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 border-t border-gray-50">
                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate('/alerts');
                  }}
                  className="w-full py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-xl font-medium transition-colors"
                >
                  View All Alerts
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm cursor-pointer select-none">
          {(user as any)?.fullName?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}
