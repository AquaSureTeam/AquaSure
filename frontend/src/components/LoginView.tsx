import { Droplets, Mail, Lock, Eye, EyeOff, ShieldCheck, User as UserIcon, ArrowRight } from "lucide-react";
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
    <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[1000px] grid lg:grid-cols-5 bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-blue-100"
      >
       
        <div className="lg:col-span-2 relative flex flex-col justify-center p-12 overflow-hidden bg-gradient-to-br from-[#1E40AF] to-[#3B82F6]">
          <motion.div 
            animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-10 top-20 w-48 h-48 bg-white/10 rounded-full blur-xl" 
          />
          <motion.div 
            animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-20 bottom-10 w-64 h-64 bg-blue-400/20 rounded-full shadow-[inset_0_0_50px_rgba(255,255,255,0.3)]" 
          />
          <motion.div 
            animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute left-20 bottom-20 w-32 h-32 bg-white/5 rounded-full backdrop-blur-sm border border-white/10 shadow-2xl" 
          />

          <div className="relative z-10 text-white">
            <h1 className="text-4xl font-black tracking-tighter mb-2">WELCOME</h1>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100/70">Environmental Monitor</p>
            <div className="mt-8 space-y-4">
              <p className="text-blue-100/60 text-xs leading-relaxed max-w-[200px]">
                Access the world's most advanced water quality monitoring platform.
              </p>
              <div className="w-12 h-1 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:col-span-3 p-8 lg:p-16 bg-white">
          <div className="max-w-md mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <h2 className="text-4xl font-black text-gray-900 mb-2">Sign in</h2>
              <p className="text-xs text-gray-400">Enter your credentials to access the dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-100 rounded-lg group-focus-within:bg-brand-light transition-colors">
                    <UserIcon className="text-gray-400 group-focus-within:text-brand" size={18} />
                  </div>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="User Name"
                    className="w-full bg-gray-50/50 border border-transparent rounded-2xl py-4 pl-16 pr-4 outline-none focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 transition-all placeholder:text-gray-400 font-medium text-sm"
                    required
                  />
                </div>

                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-100 rounded-lg group-focus-within:bg-brand-light transition-colors">
                    <Mail className="text-gray-400 group-focus-within:text-brand" size={18} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-gray-50/50 border border-transparent rounded-2xl py-4 pl-16 pr-4 outline-none focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 transition-all placeholder:text-gray-400 font-medium text-sm"
                    required
                  />
                </div>

                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-100 rounded-lg group-focus-within:bg-brand-light transition-colors">
                    <Lock className="text-gray-400 group-focus-within:text-brand" size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-gray-50/50 border border-transparent rounded-2xl py-4 pl-16 pr-20 outline-none focus:bg-white focus:border-brand/20 focus:ring-4 focus:ring-brand/5 transition-all placeholder:text-gray-400 font-medium text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-brand tracking-widest hover:text-brand-dark transition-colors"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-100 rounded-lg">
                      <ShieldCheck className="text-gray-400" size={18} />
                    </div>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                      className="w-full bg-gray-50/50 border border-transparent rounded-2xl py-4 pl-16 pr-10 outline-none focus:bg-white focus:border-brand/20 transition-all appearance-none cursor-pointer text-sm font-medium text-gray-700"
                      required
                    >
                      <option value="officer">Environmental Officer</option>
                      <option value="operator">Industry Operator</option>
                      <option value="technician">Technician</option>
                      <option value="researcher">Researcher</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${rememberMe ? 'bg-brand border-brand' : 'bg-white border-gray-200 group-hover:border-brand'}`}>
                    {rememberMe && <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                  </div>
                  <input type="checkbox" className="hidden" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <span className="text-xs font-bold text-gray-500">Remember me</span>
                </label>
                <button type="button" className="text-xs font-bold text-brand hover:underline">
                  Forgot Password?
                </button>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-black py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] text-sm tracking-wide"
                >
                  Sign in
                </button>
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-[10px] font-black text-gray-300 uppercase">Or</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <button
                  type="button"
                  className="w-full bg-white border-2 border-gray-200 hover:border-brand/20 hover:bg-gray-50 text-gray-700 font-bold py-4 rounded-xl transition-all active:scale-[0.98] text-sm"
                >
                  Sign in with other
                </button>
              </div>

              <p className="text-center text-gray-400 text-[11px] font-bold">
                Don't have an account?{" "}
                <button type="button" onClick={onSwitchToSignup} className="text-brand hover:underline">
                  Sign up
                </button>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
