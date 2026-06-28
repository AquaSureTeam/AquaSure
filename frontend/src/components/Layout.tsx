import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { useState } from 'react';

export function ProtectedLayout() {
  const { user, loading } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F0F4FF' }}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F4F8] relative font-sans">
      {/* Decorative background glassmorphism elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-tr from-white via-transparent to-blue-50/30 pointer-events-none z-0" />
      <div
        className={`fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onNavigate={() => setIsMobileMenuOpen(false)}
        />
      </div>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
