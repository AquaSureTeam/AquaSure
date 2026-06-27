import { Bell, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Header({ onMenuClick }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white/60 backdrop-blur-xl border-b border-white/40 px-4 md:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl bg-white border border-gray-100 text-gray-600"
        >
          <Menu size={20} />
        </button>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            IsokoSense Platform
          </p>
          <h2 className="text-lg font-black text-gray-900">Water Quality Monitoring</h2>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/alerts')}
          className="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <Bell size={20} />
        </button>
        <div className="hidden sm:block text-right">
          <p className="text-sm font-bold text-gray-900">{user?.fullName}</p>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
            {user?.role}
          </p>
        </div>
      </div>
    </header>
  );
}
