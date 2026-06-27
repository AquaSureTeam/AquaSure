import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Waves, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export function LoginPage() {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ fullName, email, password, organization, role: 'viewer' });
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-white shadow-2xl p-8 md:p-10"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Waves size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">IsokoSense</h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
              Water Quality IoT
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-black text-gray-900 mb-1">
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          {mode === 'login'
            ? 'Access the monitoring dashboard'
            : 'Register for viewer access'}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:border-blue-500 text-sm font-bold"
              />
              <input
                type="text"
                placeholder="Organization"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl py-4 px-5 outline-none focus:border-blue-500 text-sm font-bold"
              />
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-14 pr-5 outline-none focus:border-blue-500 text-sm font-bold"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-14 pr-14 outline-none focus:border-blue-500 text-sm font-bold"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-all text-xs uppercase tracking-[0.2em] disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          {mode === 'login' ? (
            <>
              Demo: admin@isokosense.com / admin123{' '}
              <button onClick={() => setMode('register')} className="text-blue-600 font-bold ml-1">
                or register
              </button>
            </>
          ) : (
            <button onClick={() => setMode('login')} className="text-blue-600 font-bold">
              Back to sign in
            </button>
          )}
        </p>
      </motion.div>
    </div>
  );
}
