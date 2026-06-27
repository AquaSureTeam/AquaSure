import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Droplets, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export function LoginPage() {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [organization, setOrganization] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ fullName, email, password, organization, role: 'viewer' });
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-sm text-gray-800 outline-none focus:border-indigo-400 focus:bg-white transition-colors placeholder:text-gray-400';

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F0F4FF' }}>
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 bg-gradient-to-br from-indigo-600 to-violet-700 p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Droplets size={20} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-lg leading-tight">IsokoSense</p>
            <p className="text-xs text-indigo-200">Water Monitoring</p>
          </div>
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight mb-4">
            Clean water,<br />monitored in real time.
          </h1>
          <p className="text-indigo-200 text-base leading-relaxed mb-8">
            IsokoSense gives water authorities a live view of quality parameters
            across every monitoring point — from a single dashboard.
          </p>

          <div className="space-y-3">
            {[
              'Live sensor readings every 10 seconds',
              'Automated contamination alerts',
              'Historical trend analysis and CSV export',
              'Role-based access for your team',
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-3">
                <CheckCircle size={16} className="text-indigo-300 flex-shrink-0" />
                <span className="text-sm text-indigo-100">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-indigo-300">
          &copy; {new Date().getFullYear()} IsokoSense. Water quality IoT platform.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
              <Droplets size={18} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-indigo-950">IsokoSense</p>
              <p className="text-xs text-indigo-400">Water Monitoring</p>
            </div>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold text-indigo-950 mb-1">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </h2>
            <p className="text-sm text-gray-400 mb-6">
              {mode === 'login'
                ? 'Access your monitoring dashboard'
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
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className={inputClass}
                  />
                  <input
                    type="text"
                    placeholder="Organization (optional)"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className={inputClass}
                  />
                </>
              )}

              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`${inputClass} pl-10`}
                />
              </div>

              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${inputClass} pl-10 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors disabled:opacity-50 mt-2"
              >
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100">
              {mode === 'login' ? (
                <p className="text-center text-sm text-gray-500">
                  Demo credentials:{' '}
                  <span className="font-medium text-gray-700">admin@isokosense.com</span> /{' '}
                  <span className="font-medium text-gray-700">admin123</span>
                  <br />
                  <button
                    onClick={() => setMode('register')}
                    className="mt-2 text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Don't have an account? Register
                  </button>
                </p>
              ) : (
                <p className="text-center text-sm text-gray-500">
                  <button
                    onClick={() => setMode('login')}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Already have an account? Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
