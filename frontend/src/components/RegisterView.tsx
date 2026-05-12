import { Droplets, Mail, Lock, User as UserIcon, Building, Eye, EyeOff, ShieldCheck, ArrowRight, Waves, Shield } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { UserRole } from "./LoginView";

interface SignupViewProps {
  onSignup: (data: { name: string; email: string; password: string; organization: string; role: UserRole }) => void;
  onSwitchToLogin: () => void;
}

export function RegisterView({ onSignup, onSwitchToLogin }: SignupViewProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    password: "",
    confirmPassword: "",
    role: "operator" as UserRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (!agreedToTerms) {
      alert("Please agree to the protocol terms.");
      return;
    }
    onSignup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      organization: formData.organization,
      role: formData.role,
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4 md:p-10 relative overflow-hidden font-sans">
      {/* Premium Background Architecture */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[1100px] relative z-10 flex flex-col lg:flex-row bg-white/70 backdrop-blur-3xl rounded-[3rem] border border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] overflow-hidden"
      >
        {/* Visual Brand Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-20 flex-col justify-between relative overflow-hidden">
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
                Advanced telemetry for a sustainable future. Access real‑time insights and manage your water quality with ease.
              </p>
            </div>
            <div className="flex items-center gap-4 py-3 px-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 w-fit mt-8">
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
              <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Create Account</h2>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Deploy your monitoring profile</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group">
                  <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={20} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full bg-white/80 border border-gray-100 rounded-2xl py-5 pl-16 pr-6 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-900 font-bold placeholder:text-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div className="relative group">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={20} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email Address"
                    className="w-full bg-white/80 border border-gray-100 rounded-2xl py-5 pl-16 pr-6 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-900 font-bold placeholder:text-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div className="relative group">
                  <Building className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={20} />
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="Organization / Entity"
                    className="w-full bg-white/80 border border-gray-100 rounded-2xl py-5 pl-16 pr-6 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-900 font-bold placeholder:text-gray-300 shadow-sm"
                    required
                  />
                </div>
                <div className="relative group">
                  <ShieldCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={20} />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
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
              {/* Password and Confirm */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Password"
                    className="w-full bg-white/80 border border-gray-100 rounded-2xl py-5 pl-16 pr-20 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-900 font-bold placeholder:text-gray-300 shadow-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-blue-600 uppercase hover:text-blue-800"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm Password"
                    className="w-full bg-white/80 border border-gray-100 rounded-2xl py-5 pl-16 pr-6 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-gray-900 font-bold placeholder:text-gray-300 shadow-sm"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-white/10 bg-transparent text-blue-600 accent-blue-600 cursor-pointer"
                />
                <label htmlFor="terms" className="text-[9px] text-gray-500 font-black leading-relaxed uppercase tracking-widest cursor-pointer">
                  I ACKNOWLEDGE THE <span className="text-blue-400">DATA PRIVACY PROTOCOL</span> AND REGULATORY GUIDELINES.
                </label>
              </div>

              <div className="space-y-6 pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-black py-5 rounded-2xl shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] transition-all text-xs uppercase tracking-[0.4em]"
                >
                  DEPLOY IDENTITY
                </button>
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="w-full text-[10px] font-black text-gray-600 hover:text-blue-400 uppercase tracking-[0.3em] transition-colors"
                >
                  ALREADY REGISTERED? ACCESS CORE
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function CheckCircle({ size, className }: { size: number; className: string }) {
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
