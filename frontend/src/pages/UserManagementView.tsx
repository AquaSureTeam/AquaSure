import { UserPlus, Phone, Mail, Building, MapPin, Key, Send, Shield, Search, Trash2, Edit2, ShieldCheck, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { UserRole } from "../components/LoginView"
import { motion, AnimatePresence } from "framer-motion";

export function UserManagementView() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "operator" as Exclude<UserRole, "admin">,
    organization: "",
    monitoringStation: "",
    temporaryPassword: "",
    sendSMS: false,
  });

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch for users
    const fetchUsers = async () => {
      setLoading(true);
      // In production: const response = await fetch('/api/users');
      setTimeout(() => {
        setUsers([
          { id: 1, name: "John Doe", email: "john@industry.rw", role: "operator", station: "Station B", status: "active" },
          { id: 2, name: "Sarah Johnson", email: "sarah@nema.gov.rw", role: "officer", station: "All Stations", status: "active" },
          { id: 3, name: "Mike Chen", email: "mike@tech.rw", role: "technician", station: "Station C", status: "active" },
        ]);
        setLoading(false);
      }, 1000);
    };
    fetchUsers();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phone || !formData.organization || !formData.monitoringStation || !formData.temporaryPassword) {
      return;
    }

    const newUser = {
      id: Date.now(),
      name: formData.fullName,
      email: formData.email,
      role: formData.role,
      station: formData.monitoringStation,
      status: "active",
    };

    setUsers([newUser, ...users]);

    // Reset form
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      role: "operator",
      organization: "",
      monitoringStation: "",
      temporaryPassword: "",
      sendSMS: false,
    });
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, temporaryPassword: password });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-10 relative"
    >
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">User <span className="text-blue-600">Access</span> Management</h1>
          <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-[0.2em]">Administrative Control & Identity Services</p>
        </div>
        <div className="flex items-center gap-4 bg-blue-600 text-white px-8 py-4 rounded-[2rem] shadow-xl shadow-blue-200">
          <ShieldCheck size={20} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Restricted Administrator Access</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* User Registration Panel */}
        <div className="xl:col-span-2 space-y-8">
          <div className="glass rounded-[3rem] p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            
            <div className="flex items-center gap-4 mb-10">
              <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                <UserPlus size={24} />
              </div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Deploy New Agent</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Legal Full Name</label>
                  <div className="relative group">
                    <Users className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="e.g. Johnathan Smith"
                      className="w-full pl-16 pr-8 py-5 bg-white/60 border border-gray-100 rounded-[2rem] text-gray-900 font-bold focus:outline-none focus:border-blue-600 focus:ring-8 focus:ring-blue-600/5 transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Corporate Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="jsmith@aqua-sure.rw"
                      className="w-full pl-16 pr-8 py-5 bg-white/60 border border-gray-100 rounded-[2rem] text-gray-900 font-bold focus:outline-none focus:border-blue-600 focus:ring-8 focus:ring-blue-600/5 transition-all"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Emergency Contact</label>
                  <div className="relative group">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+250 788 000 000"
                      className="w-full pl-16 pr-8 py-5 bg-white/60 border border-gray-100 rounded-[2rem] text-gray-900 font-bold focus:outline-none focus:border-blue-600 focus:ring-8 focus:ring-blue-600/5 transition-all"
                    />
                  </div>
                </div>

                {/* Organization */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Assigned Organization</label>
                  <div className="relative group">
                    <Building className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                    <input
                      type="text"
                      value={formData.organization}
                      onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. NEMA Central"
                      className="w-full pl-16 pr-8 py-5 bg-white/60 border border-gray-100 rounded-[2rem] text-gray-900 font-bold focus:outline-none focus:border-blue-600 focus:ring-8 focus:ring-blue-600/5 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Advanced Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Strategic Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-8 py-5 bg-white/60 border border-gray-100 rounded-[2rem] text-gray-900 font-bold focus:outline-none focus:border-blue-600 transition-all appearance-none cursor-pointer"
                  >
                    <option value="officer">Environmental Officer</option>
                    <option value="operator">Industry Operator</option>
                    <option value="technician">Systems Technician</option>
                    <option value="researcher">Data Researcher</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Node Assignment</label>
                  <select
                    value={formData.monitoringStation}
                    onChange={(e) => setFormData({ ...formData, monitoringStation: e.target.value })}
                    className="w-full px-8 py-5 bg-white/60 border border-gray-100 rounded-[2rem] text-gray-900 font-bold focus:outline-none focus:border-blue-600 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Telemetry Node</option>
                    <option value="All Stations">Global Access</option>
                    <option value="Station A">Station A - Industrial</option>
                    <option value="Station B">Station B - Residential</option>
                  </select>
                </div>
              </div>

              {/* Password Section */}
              <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100/50 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em]">Secure Credentials</h3>
                  <button 
                    type="button"
                    onClick={generatePassword}
                    className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest"
                  >
                    Generate Strong Entropy
                  </button>
                </div>
                <div className="relative group">
                  <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600" size={18} />
                  <input
                    type="text"
                    value={formData.temporaryPassword}
                    onChange={(e) => setFormData({ ...formData, temporaryPassword: e.target.value })}
                    placeholder="Temporary Authorization Key"
                    className="w-full pl-16 pr-8 py-5 bg-white border border-blue-100 rounded-[2rem] text-gray-900 font-mono font-bold focus:outline-none focus:ring-8 focus:ring-blue-600/5 transition-all"
                  />
                </div>
                <div className="flex items-center gap-4 px-4 py-2">
                  <input
                    type="checkbox"
                    id="sendSMS"
                    checked={formData.sendSMS}
                    onChange={(e) => setFormData({ ...formData, sendSMS: e.target.checked })}
                    className="w-5 h-5 rounded-lg border-2 border-blue-200 accent-blue-600"
                  />
                  <label htmlFor="sendSMS" className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Send size={14} />
                    Notify agent via encrypted SMS
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-6 bg-blue-600 text-white font-black uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl shadow-blue-300 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-[0.98]"
              >
                Execute Identity Creation
              </button>
            </form>
          </div>
        </div>

        {/* Directory Panel */}
        <div className="space-y-8">
          <div className="glass rounded-[3rem] p-10 min-h-[600px] flex flex-col relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-3xl" />
             
             <div className="flex items-center justify-between mb-10">
               <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-4">
                 <Shield className="text-blue-600" />
                 Active Directory
               </h2>
               <div className="px-4 py-2 bg-blue-50 rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-widest">
                 {users.length} Records
               </div>
             </div>

             <div className="relative mb-8 group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600" size={16} />
               <input 
                 type="text" 
                 placeholder="Search Directory..." 
                 className="w-full pl-14 pr-6 py-4 bg-white/60 border border-gray-100 rounded-2xl text-xs font-bold text-gray-900 focus:outline-none focus:border-blue-600 transition-all"
               />
             </div>

             <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-2">
               <AnimatePresence>
                 {users.map((user) => (
                   <motion.div
                     key={user.id}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     whileHover={{ x: -5 }}
                     className="p-5 bg-white/40 backdrop-blur-md border border-white/20 rounded-3xl group hover:border-blue-500/30 transition-all"
                   >
                     <div className="flex items-start justify-between mb-3">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-black text-sm">
                           {user.name.charAt(0)}
                         </div>
                         <div>
                           <p className="text-sm font-black text-gray-900 leading-tight">{user.name}</p>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">{user.role}</p>
                         </div>
                       </div>
                       <div className="flex gap-1">
                         <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={14} /></button>
                         <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                       </div>
                     </div>
                     <div className="flex items-center justify-between pt-3 border-t border-gray-100/50">
                        <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                          <MapPin size={10} className="text-blue-600" />
                          {user.station}
                        </div>
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-[8px] font-black uppercase tracking-widest rounded-lg">Active</span>
                     </div>
                   </motion.div>
                 ))}
               </AnimatePresence>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
