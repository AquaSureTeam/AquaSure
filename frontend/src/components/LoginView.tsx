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
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="fixed -top-48 -left-48 w-[40rem] h-[40rem] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          rotate: [0, -45, 0],
          x: [0, -100, 0],
          y: [0, 80, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
        className="fixed -bottom-48 -right-48 w-[50rem] h-[50rem] bg-blue-400/10 rounded-full blur-[150px] pointer-events-none" 
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[1100px] min-h-[700px] grid lg:grid-cols-2 bg-white/80 backdrop-blur-2xl rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-white/40 relative z-10"
      >
        {/* Left Side - Brand Identity */}
        <div className="relative flex flex-col justify-between p-16 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800">
          {/* Animated Glass Spheres */}
          <motion.div 
            animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-20 top-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" 
          />
          <motion.div 
            animate={{ y: [0, 50, 0], x: [0, -30, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-24 bottom-24 w-80 h-80 bg-blue-400/20 rounded-full border border-white/10" 
          />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
               <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20">
                 <Waves size={32} className="text-white" />
               </div>
               <h1 className="text-3xl font-black text-white tracking-tighter">IsokoSense</h1>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-6xl font-black text-white leading-none tracking-tighter">
                CLEAN WATER <br />
                <span className="text-blue-200">FOR ALL.</span>
              </h2>
              <p className="text-lg font-bold text-blue-100/70 max-w-sm leading-relaxed">
                Access the world's most advanced water quality monitoring ecosystem. 
                Real-time telemetry, historical analysis, and smart response tools.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 text-white/50">
              <ShieldCheck size={20} />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">AES-256 SECURED CHANNEL</p>
            </div>
          </div>
        </div>

        {/* Right Side - Intelligence Access */}
        <div className="p-16 lg:p-24 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-12">
              <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-3 uppercase">Sign In</h2>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Identify yourself to the core system</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div className="relative group">
                  <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Full Access Name"
                    className="w-full bg-gray-50 border border-transparent rounded-3xl py-5 pl-16 pr-6 outline-none focus:bg-white focus:border-blue-600 focus:ring-8 focus:ring-blue-600/5 transition-all placeholder:text-gray-300 font-bold text-sm"
                    required
                  />
                </div>

                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Corporate Email"
                    className="w-full bg-gray-50 border border-transparent rounded-3xl py-5 pl-16 pr-6 outline-none focus:bg-white focus:border-blue-600 focus:ring-8 focus:ring-blue-600/5 transition-all placeholder:text-gray-300 font-bold text-sm"
                    required
                  />
                </div>

                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Security Credential"
                    className="w-full bg-gray-50 border border-transparent rounded-3xl py-5 pl-16 pr-20 outline-none focus:bg-white focus:border-blue-600 focus:ring-8 focus:ring-blue-600/5 transition-all placeholder:text-gray-300 font-bold text-sm"
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
                  <Shield className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                    className="w-full bg-gray-50 border border-transparent rounded-3xl py-5 pl-16 pr-10 outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none cursor-pointer text-sm font-bold text-gray-700"
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
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Keep Authenticated</span>
                </label>
                <button type="button" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                  Key Recovery?
                </button>
              </div>

              <div className="space-y-4 pt-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white font-black py-6 rounded-3xl shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-[0.98] text-xs uppercase tracking-[0.3em]"
                >
                  Authorize Entry
                </button>
                <div className="flex items-center gap-6 py-4">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[10px] font-black text-gray-200 uppercase tracking-widest">Or</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="w-full bg-white border-2 border-gray-100 hover:border-blue-600 hover:text-blue-600 text-gray-400 font-black py-6 rounded-3xl transition-all active:scale-[0.98] text-[10px] uppercase tracking-[0.3em]"
                >
                  Create New Identity
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
