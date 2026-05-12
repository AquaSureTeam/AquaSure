import { Bell, Shield, Database, Wifi, Save, Sliders, Activity, Globe, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function SettingsView() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      critical: true,
      warning: true,
      info: false,
    },
    thresholds: {
      ph: { min: 6.5, max: 8.5 },
      turbidity: { max: 2.5 },
      temperature: { min: 20, max: 25 },
      conductivity: { min: 400, max: 500 },
    },
    monitoring: {
      updateInterval: 5,
      dataRetention: 90,
      autoBackup: true,
    }
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 md:p-8 space-y-6 md:space-y-10 relative"
    >
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -mr-48 -mt-48" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">System <span className="text-blue-600">Preferences</span></h1>
          <p className="text-xs md:text-sm font-bold text-gray-400 mt-2 uppercase tracking-[0.2em]">Global Configuration & Threshold Control</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs rounded-[2rem] shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 self-start lg:self-auto w-full lg:w-auto"
        >
          <Save size={18} />
          {saved ? "Synchronized" : "Commit Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Alerts & Notifications */}
        <div className="glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 space-y-8 md:space-y-10">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-inner">
              <Bell size={24} />
            </div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Signal Matrix</h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 bg-white/40 border border-white/20 rounded-[2rem] group hover:bg-white/60 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-[11px] font-black text-gray-700 uppercase tracking-widest">Email Protocols</span>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => setSettings({...settings, notifications: { ...settings.notifications, email: e.target.checked }})}
                className="w-12 h-6 rounded-full appearance-none bg-gray-200 checked:bg-blue-600 cursor-pointer transition-all relative before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 checked:before:left-7 before:transition-all"
              />
            </div>

            <div className="flex items-center justify-between p-6 bg-white/40 border border-white/20 rounded-[2rem] group hover:bg-white/60 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-[11px] font-black text-gray-700 uppercase tracking-widest">Mobile Push Streams</span>
              </div>
              <input
                type="checkbox"
                checked={settings.notifications.push}
                onChange={(e) => setSettings({...settings, notifications: { ...settings.notifications, push: e.target.checked }})}
                className="w-12 h-6 rounded-full appearance-none bg-gray-200 checked:bg-blue-600 cursor-pointer transition-all relative before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:top-1 before:left-1 checked:before:left-7 before:transition-all"
              />
            </div>

            <div className="h-px bg-gray-100" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => setSettings({...settings, notifications: {...settings.notifications, critical: !settings.notifications.critical}})}
                className={`p-6 rounded-[2rem] border transition-all ${settings.notifications.critical ? 'bg-blue-600 border-blue-600' : 'bg-gray-50 border-gray-100'}`}
              >
                <Shield className={`mx-auto mb-2 ${settings.notifications.critical ? 'text-white' : 'text-gray-400'}`} size={20} />
                <p className={`text-[9px] font-black uppercase tracking-widest ${settings.notifications.critical ? 'text-white' : 'text-gray-400'}`}>Critical</p>
              </button>
              <button 
                onClick={() => setSettings({...settings, notifications: {...settings.notifications, warning: !settings.notifications.warning}})}
                className={`p-6 rounded-[2rem] border transition-all ${settings.notifications.warning ? 'bg-blue-600 border-blue-600' : 'bg-gray-50 border-gray-100'}`}
              >
                <Activity className={`mx-auto mb-2 ${settings.notifications.warning ? 'text-white' : 'text-gray-400'}`} size={20} />
                <p className={`text-[9px] font-black uppercase tracking-widest ${settings.notifications.warning ? 'text-white' : 'text-gray-400'}`}>Warnings</p>
              </button>
              <button 
                onClick={() => setSettings({...settings, notifications: {...settings.notifications, info: !settings.notifications.info}})}
                className={`p-6 rounded-[2rem] border transition-all ${settings.notifications.info ? 'bg-blue-600 border-blue-600' : 'bg-gray-50 border-gray-100'}`}
              >
                <Globe className={`mx-auto mb-2 ${settings.notifications.info ? 'text-white' : 'text-gray-400'}`} size={20} />
                <p className={`text-[9px] font-black uppercase tracking-widest ${settings.notifications.info ? 'text-white' : 'text-gray-400'}`}>Insights</p>
              </button>
            </div>
          </div>
        </div>

        {/* Node Monitoring Configuration */}
        <div className="glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 space-y-8 md:space-y-10">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-inner">
              <Wifi size={24} />
            </div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Telemetry Config</h2>
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-6">Node Pulse Interval (s)</label>
              <input
                type="range"
                min="1"
                max="60"
                value={settings.monitoring.updateInterval}
                onChange={(e) => setSettings({...settings, monitoring: { ...settings.monitoring, updateInterval: parseInt(e.target.value) }})}
                className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-[10px] font-black text-blue-600 uppercase tracking-widest px-2">
                <span>Real-time</span>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full">{settings.monitoring.updateInterval}s</span>
                <span>Latency</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-6">Cold Storage Retention (days)</label>
              <input
                type="number"
                value={settings.monitoring.dataRetention}
                onChange={(e) => setSettings({...settings, monitoring: { ...settings.monitoring, dataRetention: parseInt(e.target.value) }})}
                className="w-full px-8 py-5 bg-white/40 border border-white/20 rounded-[2rem] text-sm font-black text-gray-900 focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>

            <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white flex items-center justify-between shadow-xl shadow-blue-200 overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              <div className="flex items-center gap-4 relative z-10">
                <Database size={24} />
                <span className="text-[11px] font-black uppercase tracking-widest">Automatic Cloud Vaulting</span>
              </div>
              <input
                type="checkbox"
                checked={settings.monitoring.autoBackup}
                onChange={(e) => setSettings({...settings, monitoring: { ...settings.monitoring, autoBackup: e.target.checked }})}
                className="w-12 h-6 rounded-full appearance-none bg-blue-400 checked:bg-white cursor-pointer transition-all relative before:absolute before:w-4 before:h-4 before:bg-white checked:before:bg-blue-600 before:rounded-full before:top-1 before:left-1 checked:before:left-7 before:transition-all"
              />
            </div>
          </div>
        </div>

        {/* Global Threshold Matrix */}
        <div className="xl:col-span-2 glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 overflow-hidden relative">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full -mr-48 -mb-48 blur-[100px]" />
          
          <div className="flex items-center gap-5 mb-12">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-inner">
              <Sliders size={24} />
            </div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Environmental Thresholds</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">pH Stability</h3>
              <div className="p-6 bg-white/40 rounded-[2rem] border border-white/20 space-y-4">
                <input type="number" step="0.1" value={settings.thresholds.ph.min} className="w-full text-center bg-transparent font-black text-xl text-gray-900 focus:outline-none" />
                <div className="h-px bg-gray-100" />
                <input type="number" step="0.1" value={settings.thresholds.ph.max} className="w-full text-center bg-transparent font-black text-xl text-gray-900 focus:outline-none" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Temp Matrix (°C)</h3>
              <div className="p-6 bg-white/40 rounded-[2rem] border border-white/20 space-y-4">
                <input type="number" value={settings.thresholds.temperature.min} className="w-full text-center bg-transparent font-black text-xl text-gray-900 focus:outline-none" />
                <div className="h-px bg-gray-100" />
                <input type="number" value={settings.thresholds.temperature.max} className="w-full text-center bg-transparent font-black text-xl text-gray-900 focus:outline-none" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Conductivity</h3>
              <div className="p-6 bg-white/40 rounded-[2rem] border border-white/20 space-y-4">
                <input type="number" value={settings.thresholds.conductivity.min} className="w-full text-center bg-transparent font-black text-xl text-gray-900 focus:outline-none" />
                <div className="h-px bg-gray-100" />
                <input type="number" value={settings.thresholds.conductivity.max} className="w-full text-center bg-transparent font-black text-xl text-gray-900 focus:outline-none" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Turbidity (NTU)</h3>
              <div className="p-6 bg-white/40 rounded-[2rem] border border-white/20 h-full flex flex-col justify-center">
                <input type="number" step="0.1" value={settings.thresholds.turbidity.max} className="w-full text-center bg-transparent font-black text-3xl text-blue-600 focus:outline-none" />
                <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest text-center mt-2">Maximum Safe Index</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Lock Notice */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-6 md:p-8 glass bg-gray-50/50 rounded-[2rem] md:rounded-[2.5rem]">
        <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-2xl">
          <Lock size={20} className="md:size-6" />
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-[9px] md:text-[10px] font-black text-gray-900 uppercase tracking-widest">Configuration Lock</h3>
          <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">Changes are protected by 256-bit AES encryption. Unauthorized modifications are prohibited by environmental regulation.</p>
        </div>
      </div>
    </motion.div>
  );
}
