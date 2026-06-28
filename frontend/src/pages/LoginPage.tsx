import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Building, Droplets } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Defined outside of the main component to prevent unmounting on every keystroke
const InputField = ({ 
  icon: Icon, type = 'text', placeholder, value, onChange, showToggle, onToggle 
}: any) => (
  <div className="relative w-full max-w-sm mb-5 bg-white/80 backdrop-blur-sm border border-white rounded-2xl flex items-center p-1.5 transition-all focus-within:bg-white focus-within:shadow-[0_8px_30px_rgba(37,99,235,0.1)] focus-within:border-blue-100 group shadow-sm">
    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-focus-within:bg-blue-600 group-focus-within:text-white transition-all duration-300">
      <Icon size={20} />
    </div>
    <input 
      type={type} 
      placeholder={placeholder} 
      value={value}
      onChange={onChange}
      required
      className="flex-1 bg-transparent px-4 py-2 text-sm text-gray-800 outline-none placeholder:text-gray-400 font-bold"
    />
    {showToggle && (
      <button
        type="button"
        onClick={onToggle}
        className="px-4 text-gray-400 hover:text-blue-600 transition-colors focus:outline-none"
      >
        {type === 'password' ? <Eye size={18} /> : <EyeOff size={18} />}
      </button>
    )}
  </div>
);

export function LoginPage() {
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Form State
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

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4 sm:p-8 overflow-hidden relative font-sans">
      
      {/* Decorative background glassmorphism elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[150px]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-white via-transparent to-blue-50/30" />

      {/* Main Glass Card Container */}
      <div className="relative z-10 w-full max-w-[1000px] min-h-[600px] flex bg-white/70 backdrop-blur-3xl rounded-[3rem] border border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden">
        
        <AnimatePresence mode="wait">
          {mode === 'login' ? (
            <motion.div 
              key="login-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full h-full flex flex-col md:flex-row"
            >
              {/* Left Side: Form */}
              <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 lg:p-16">
                <div className="w-full max-w-sm">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                      <Droplets size={24} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-gray-900 tracking-tight">IsokoSense</h2>
                      <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Portal</p>
                    </div>
                  </div>

                  <h1 className="text-3xl font-black text-gray-900 mb-2">Welcome Back</h1>
                  <p className="text-sm font-medium text-gray-500 mb-8">Sign in to your dashboard to continue</p>

                  {error && (
                    <div className="mb-6 w-full p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl text-red-600 text-sm font-bold shadow-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="w-full flex flex-col">
                    <InputField 
                      icon={Mail} 
                      type="email" 
                      placeholder="Email Address" 
                      value={email} 
                      onChange={(e: any) => setEmail(e.target.value)} 
                    />
                    
                    <InputField 
                      icon={Lock} 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Password" 
                      value={password} 
                      onChange={(e: any) => setPassword(e.target.value)} 
                      showToggle={true}
                      onToggle={() => setShowPassword(!showPassword)}
                    />

                    <div className="flex justify-between items-center w-full mb-8 px-2 text-xs font-bold text-gray-500">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className="w-5 h-5 rounded-md border-2 border-gray-200 flex items-center justify-center group-hover:border-blue-600 transition-colors">
                          <input type="checkbox" className="opacity-0 absolute" />
                          <div className="w-2.5 h-2.5 rounded-sm bg-blue-600 scale-0 transition-transform" />
                        </div>
                        Remember me
                      </label>
                      <button type="button" className="hover:text-blue-600 transition-colors">
                        Forgot password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-[0.98] text-xs uppercase tracking-[0.2em] disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {loading ? 'SIGNING IN...' : 'SIGN IN'}
                    </button>
                  </form>

                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">New here?</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  <button 
                    onClick={() => { setMode('register'); setError(''); }} 
                    className="mt-6 w-full bg-white/60 backdrop-blur-xl border border-white/50 border-2 border-gray-100 hover:border-blue-600 hover:text-blue-600 text-gray-400 font-black py-4 rounded-2xl transition-all active:scale-[0.98] text-[10px] uppercase tracking-[0.2em]"
                  >
                    Create an account
                  </button>
                </div>
              </div>

              {/* Right Side: Informational Branding */}
              <div className="hidden lg:flex w-1/2 bg-blue-600 p-16 flex-col justify-between relative overflow-hidden text-white">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)] opacity-20" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg mb-8">
                    <Droplets size={28} className="text-white" />
                  </div>
                  <h2 className="text-4xl font-black leading-tight mb-6">
                    Monitor Water Quality.<br />Protect Communities.
                  </h2>
                  <p className="text-blue-100 font-medium text-sm leading-relaxed max-w-sm">
                    IsokoSense provides real-time oversight and advanced analytics for national water infrastructure, ensuring safety across all monitored regions.
                  </p>
                </div>

                <div className="relative z-10 flex items-center gap-4 py-3 px-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-fit">
                   <div className="flex -space-x-3">
                     {[1,2,3].map(i => (
                       <div key={i} className="w-8 h-8 rounded-full border-2 border-blue-600 bg-blue-300" />
                     ))}
                   </div>
                   <div className="text-xs font-bold">Trusted by experts</div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="register-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full h-full flex flex-col md:flex-row-reverse"
            >
              {/* Left Side: Form (Reversed layout for register) */}
              <div className="flex-1 flex flex-col justify-center items-center p-8 md:p-12 lg:p-16">
                <div className="w-full max-w-sm">
                  <h1 className="text-3xl font-black text-gray-900 mb-2">Join Platform</h1>
                  <p className="text-sm font-medium text-gray-500 mb-8">Request access to the IsokoSense dashboard</p>

                  {error && (
                    <div className="mb-6 w-full p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl text-red-600 text-sm font-bold shadow-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="w-full flex flex-col">
                    <InputField 
                      icon={User} 
                      type="text" 
                      placeholder="Full Name" 
                      value={fullName} 
                      onChange={(e: any) => setFullName(e.target.value)} 
                    />
                    
                    <InputField 
                      icon={Mail} 
                      type="email" 
                      placeholder="Official E-mail" 
                      value={email} 
                      onChange={(e: any) => setEmail(e.target.value)} 
                    />

                    <InputField 
                      icon={Building} 
                      type="text" 
                      placeholder="Organization (optional)" 
                      value={organization} 
                      onChange={(e: any) => setOrganization(e.target.value)} 
                    />
                    
                    <InputField 
                      icon={Lock} 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Password" 
                      value={password} 
                      onChange={(e: any) => setPassword(e.target.value)} 
                      showToggle={true}
                      onToggle={() => setShowPassword(!showPassword)}
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-4 w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-[0.98] text-xs uppercase tracking-[0.2em] disabled:opacity-50 disabled:hover:translate-y-0"
                    >
                      {loading ? 'PROCESSING...' : 'CREATE ACCOUNT'}
                    </button>
                  </form>

                  <div className="mt-8 flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Or</span>
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>

                  <button 
                    onClick={() => { setMode('login'); setError(''); }} 
                    className="mt-6 w-full bg-white/60 backdrop-blur-xl border border-white/50 border-2 border-gray-100 hover:border-blue-600 hover:text-blue-600 text-gray-400 font-black py-4 rounded-2xl transition-all active:scale-[0.98] text-[10px] uppercase tracking-[0.2em]"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>

              {/* Right Side: Informational Branding (Reversed) */}
              <div className="hidden lg:flex w-1/2 bg-blue-600 p-16 flex-col justify-between relative overflow-hidden text-white">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)] opacity-20" />
                
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg mb-8">
                    <User size={28} className="text-white" />
                  </div>
                  <h2 className="text-4xl font-black leading-tight mb-6">
                    Empower Your Team.
                  </h2>
                  <p className="text-blue-100 font-medium text-sm leading-relaxed max-w-sm">
                    Gain full access to historical trends, live sensors, and critical contamination alerts. Ensure compliance across your organization.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
