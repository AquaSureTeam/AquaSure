import { Droplets, Mail, Lock, Eye, EyeOff, ShieldCheck, User as UserIcon, ArrowRight, Waves, Shield } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type UserRole = "officer" | "operator" | "technician" | "researcher" | "admin";

interface LoginViewProps {
  onLogin: (userName: string, email: string, password: string, role?: UserRole) => void;
  onSwitchToSignup: () => void;
}

export function LoginView({ onLogin, onSwitchToSignup }: LoginViewProps) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("admin");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName && email && password) {
      onLogin(userName, email, password, selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4 md:p-10 relative overflow-hidden font-sans">
      {/* Pristine Background Architecture */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-white via-transparent to-blue-50/30" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[1100px] relative z-10 flex flex-col lg:flex-row bg-white/70 backdrop-blur-3xl rounded-[3rem] border border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden"
      >
        {/* Visual Brand Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-20 flex-col justify-between relative overflow-hidden">
          {/* Animated Water Ripples */}
          <div className="absolute inset-0">
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_white_0%,_transparent_70%)] opacity-20"
            />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-16">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg">
                <Waves size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tighter">IsokoSense</h1>
            </div>
            
            <div className="space-y-8">
              <h2 className="text-6xl font-black text-white leading-[1.1] tracking-tighter">
                Smart Water <br />
                <span className="text-blue-200">Monitoring.</span>
              </h2>
              <p className="text-blue-50/80 font-medium text-lg leading-relaxed max-w-sm">
                Advanced telemetry for a sustainable future. Access real-time insights and manage your water quality with ease.
              </p>
            </div>
          </div>

          <div className="relative z-10">
             <div className="flex items-center gap-4 py-3 px-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-fit">
               <ShieldCheck size={20} className="text-blue-200" />
               <p className="text-[10px] font-black text-white uppercase tracking-widest">Secured Connection Active</p>
             </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 p-8 md:p-16 lg:p-20 bg-white/40">
          <div className="max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Waves size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tighter">IsokoSense</h1>
            </div>

            <div className="mb-12">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Welcome Back</h2>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Please sign in to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-white/80 border border-gray-100 rounded-2xl py-5 pl-16 pr-6 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-900 font-bold placeholder:text-gray-300 shadow-sm"
                    required
                  />
                </div>

                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-white/80 border border-gray-100 rounded-2xl py-5 pl-16 pr-6 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-900 font-bold placeholder:text-gray-300 shadow-sm"
                    required
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-white/80 border border-gray-100 rounded-2xl py-5 pl-16 pr-20 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-900 font-bold placeholder:text-gray-300 shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-600 tracking-widest uppercase hover:text-blue-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <div className="relative group">
                  <Shield className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full bg-white/80 border border-gray-100 rounded-2xl py-5 pl-16 pr-10 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer text-sm font-bold text-gray-700 shadow-sm"
                    required
                  >
                    <option value="officer">Environmental Officer</option>
                    <option value="operator">Industry Operator</option>
                    <option value="technician">Systems Technician</option>
                    <option value="researcher">Scientific Researcher</option>
                    <option value="admin">System Administrator</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-6 h-6 rounded-lg border-2 transition-all flex items-center justify-center ${rememberMe ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-200 group-hover:border-blue-600'}`}>
                    {rememberMe && <CheckCircle size={14} className="text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Remember Me</span>
                </label>
                <button type="button" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                  Forgot Password?
                </button>
              </div>

              <div className="space-y-6 pt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-black py-6 rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-[0.98] text-xs uppercase tracking-[0.3em]"
                >
                  Sign In
                </button>
                
                <div className="flex items-center gap-6">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">OR</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="w-full bg-white border-2 border-gray-100 hover:border-blue-600 hover:text-blue-600 text-gray-400 font-black py-6 rounded-2xl transition-all active:scale-[0.98] text-[10px] uppercase tracking-[0.3em]"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CheckCircle({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
