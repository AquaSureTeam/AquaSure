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
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="fixed -top-24 -right-24 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" 
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], x: [0, -50, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
        className="fixed -bottom-24 -left-24 w-[30rem] h-[30rem] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" 
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[1100px] min-h-[750px] grid lg:grid-cols-2 bg-white/80 backdrop-blur-2xl rounded-[3.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-white/40 relative z-10"
      >
        {/* Left Side - Brand Story */}
        <div className="relative flex flex-col justify-between p-16 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-800">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
               <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20">
                 <Waves size={32} className="text-white" />
               </div>
               <h1 className="text-3xl font-black text-white tracking-tighter">IsokoSense</h1>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-6xl font-black text-white leading-none tracking-tighter">
                FUTURE <br />
                <span className="text-blue-200">READY.</span>
              </h2>
              <p className="text-lg font-bold text-blue-100/70 max-w-sm leading-relaxed">
                Join the global network of environmental guardians. 
                Securing water sustainability through data-driven intelligence.
              </p>
            </div>
          </div>

          <div className="relative z-10">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-blue-600 bg-gray-200 flex items-center justify-center text-[10px] font-black text-blue-600 shadow-xl overflow-hidden">
                   <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full border-4 border-blue-600 bg-blue-500 flex items-center justify-center text-[10px] font-black text-white shadow-xl">
                 +2K
              </div>
            </div>
            <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mt-4">Trusted by researchers worldwide</p>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="p-16 flex flex-col justify-center bg-white/50 backdrop-blur-xl overflow-y-auto max-h-[85vh] custom-scrollbar">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-10 text-center">
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter mb-2 uppercase">Create Account</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Deploy your monitoring profile</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <UserIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 pl-14 pr-4 outline-none focus:bg-white focus:border-blue-600 transition-all placeholder:text-gray-300 text-sm font-bold"
                    required
                  />
                </div>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email"
                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 pl-14 pr-4 outline-none focus:bg-white focus:border-blue-600 transition-all placeholder:text-gray-300 text-sm font-bold"
                    required
                  />
                </div>
              </div>

              <div className="relative group">
                <Building className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Organization / Entity"
                  className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 pl-14 pr-4 outline-none focus:bg-white focus:border-blue-600 transition-all placeholder:text-gray-300 text-sm font-bold"
                  required
                />
              </div>

              <div className="relative group">
                <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 pl-14 pr-4 outline-none focus:bg-white focus:border-blue-600 transition-all appearance-none cursor-pointer text-sm font-bold text-gray-700"
                  required
                >
                  <option value="officer">Environmental Officer</option>
                  <option value="operator">Industry Operator</option>
                  <option value="technician">Systems Technician</option>
                  <option value="researcher">Scientific Researcher</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Password"
                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 outline-none focus:bg-white focus:border-blue-600 transition-all placeholder:text-gray-300 text-sm font-bold"
                    required
                  />
                </div>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm"
                    className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-6 outline-none focus:bg-white focus:border-blue-600 transition-all placeholder:text-gray-300 text-sm font-bold"
                    required
                  />
                </div>
              </div>

              <div className="flex items-start gap-4 p-2 bg-blue-50/50 rounded-2xl border border-blue-100">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded-lg border-2 border-blue-200 text-blue-600 accent-blue-600 cursor-pointer"
                />
                <label htmlFor="terms" className="text-[10px] text-gray-500 font-black leading-relaxed uppercase tracking-widest cursor-pointer">
                  I accept the <button type="button" className="text-blue-600">Protocol Terms</button> and <button type="button" className="text-blue-600">Privacy Guidelines</button>.
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-900 text-white font-black py-6 rounded-3xl shadow-xl hover:bg-black hover:-translate-y-1 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-xs uppercase tracking-[0.3em]"
              >
                Register Identity <ArrowRight size={18} />
              </button>

              <p className="text-center text-gray-400 text-[10px] font-black uppercase tracking-widest">
                Existing Identity?{" "}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-blue-600 hover:underline"
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
