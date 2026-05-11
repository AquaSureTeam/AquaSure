import { Droplets, Mail, Lock, User as UserIcon, Building, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!agreedToTerms) {
      alert("Please agree to the terms and conditions.");
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
    <div className="min-h-screen bg-[#F0F7FF] flex items-center justify-center p-4 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[1000px] grid lg:grid-cols-5 bg-white rounded-[2rem] overflow-hidden shadow-2xl border border-blue-100"
      >
        {/* Left Side - Welcome & Spheres */}
        <div className="lg:col-span-2 relative flex flex-col justify-center p-12 overflow-hidden bg-gradient-to-br from-[#1E40AF] to-[#3B82F6]">
          {/* Animated 3D Spheres */}
          <motion.div 
            animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-10 top-10 w-56 h-56 bg-white/10 rounded-full blur-xl" 
          />
          <motion.div 
            animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -left-20 bottom-20 w-48 h-48 bg-blue-300/20 rounded-full shadow-[inset_0_0_40px_rgba(255,255,255,0.2)]" 
          />

          <div className="relative z-10 text-white">
            <h1 className="text-4xl font-black tracking-tighter mb-2">JOIN US</h1>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-100/70">Create Account</p>
            <div className="mt-8 space-y-4">
              <p className="text-blue-100/60 text-xs leading-relaxed max-w-[200px]">
                Start your journey into high-precision environmental data.
              </p>
              <div className="w-12 h-1 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:col-span-3 p-8 lg:p-12 bg-white overflow-y-auto max-h-[90vh] custom-scrollbar">
          <div className="max-w-md mx-auto">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-4xl font-black text-gray-900 mb-2">Sign up</h2>
              <p className="text-xs text-gray-400">Fill in your details to create an account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-100 rounded-lg group-focus-within:bg-brand-light transition-colors">
                    <UserIcon className="text-gray-400 group-focus-within:text-brand" size={16} />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full bg-gray-50/50 border border-transparent rounded-2xl py-3.5 pl-14 pr-4 outline-none focus:bg-white focus:border-brand/20 transition-all placeholder:text-gray-400 text-sm font-medium"
                    required
                  />
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-100 rounded-lg group-focus-within:bg-brand-light transition-colors">
                    <Mail className="text-gray-400 group-focus-within:text-brand" size={16} />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email"
                    className="w-full bg-gray-50/50 border border-transparent rounded-2xl py-3.5 pl-14 pr-4 outline-none focus:bg-white focus:border-brand/20 transition-all placeholder:text-gray-400 text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-100 rounded-lg group-focus-within:bg-brand-light transition-colors">
                  <Building className="text-gray-400 group-focus-within:text-brand" size={16} />
                </div>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Organization"
                  className="w-full bg-gray-50/50 border border-transparent rounded-2xl py-3.5 pl-14 pr-4 outline-none focus:bg-white focus:border-brand/20 transition-all placeholder:text-gray-400 text-sm font-medium"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-100 rounded-lg group-focus-within:bg-brand-light transition-colors">
                  <ShieldCheck className="text-gray-400 group-focus-within:text-brand" size={16} />
                </div>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full bg-gray-50/50 border border-transparent rounded-2xl py-3.5 pl-14 pr-4 outline-none focus:bg-white focus:border-brand/20 transition-all appearance-none cursor-pointer text-sm font-medium text-gray-700"
                  required
                >
                  <option value="officer">Environmental Officer</option>
                  <option value="operator">Industry Operator</option>
                  <option value="technician">Technician</option>
                  <option value="researcher">Researcher</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-100 rounded-lg group-focus-within:bg-brand-light transition-colors">
                    <Lock className="text-gray-400 group-focus-within:text-brand" size={16} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Password"
                    className="w-full bg-gray-50/50 border border-transparent rounded-2xl py-3.5 pl-14 pr-10 outline-none focus:bg-white focus:border-brand/20 transition-all placeholder:text-gray-400 text-sm font-medium"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors">
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-100 rounded-lg group-focus-within:bg-brand-light transition-colors">
                    <Lock className="text-gray-400 group-focus-within:text-brand" size={16} />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm"
                    className="w-full bg-gray-50/50 border border-transparent rounded-2xl py-3.5 pl-14 pr-10 outline-none focus:bg-white focus:border-brand/20 transition-all placeholder:text-gray-400 text-sm font-medium"
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors">
                    {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 p-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-brand focus:ring-brand accent-brand"
                />
                <label htmlFor="terms" className="text-[10px] text-gray-500 font-bold leading-relaxed uppercase tracking-wider">
                  I agree to the <button type="button" className="text-brand font-black">Terms</button> and <button type="button" className="text-brand font-black">Privacy Policy</button>.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-[#1E3A8A] hover:bg-[#1E40AF] text-white font-black py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2 text-sm"
              >
                Create Account <ArrowRight size={18} />
              </button>

              <p className="text-center text-gray-400 text-[11px] font-bold">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-brand hover:underline"
                >
                  Sign In
                </button>
              </p>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

