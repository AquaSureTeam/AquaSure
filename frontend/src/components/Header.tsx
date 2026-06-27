import { Bell, Search, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

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
        <button
          onClick={() => navigate('/alerts')}
          className="relative p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
          aria-label="View alerts"
        >
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm cursor-pointer select-none">
          {(user as any)?.fullName?.[0]?.toUpperCase() || 'U'}
        </div>
      </div>
    </header>
  );
}
