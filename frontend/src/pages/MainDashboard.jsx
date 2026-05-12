import { SensorCard } from "./SensorCard";
import { AlertPanel } from "./AlertPanel";
import { MainChart } from "./MainChart";
import { SystemHealth } from "./SystemHealth";
import { Droplets, Waves, Thermometer, Zap, Loader2, Activity, Database, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function DashboardView() {
  const [loading, setLoading] = useState(true);
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simulation of backend handshake
        // Replace with: const response = await fetch('/api/dashboard');
        setTimeout(() => {
          setLoading(false);
          // For now, keeping data null to show the "waiting" state as requested
          // unless you want some initial data. The user said "remove hardcoded data".
        }, 2500);
      } catch (error) {
        console.error("Critical: Telemetry handshake failed:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-8">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border-[6px] border-blue-600/10 border-t-blue-600 rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Database className="text-blue-600 animate-pulse" size={32} />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Loading Dashboard</h2>
          <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest">Synchronizing System Data...</p>
        </div>
      </div>
    );
  }

  if (!sensorData) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 md:p-8 space-y-6 md:space-y-10"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">System <span className="text-blue-600">Overview</span> Dashboard</h1>
            <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-[0.2em]">Management & Data Integration Center</p>
          </div>
          <div className="flex items-center gap-4 bg-white/40 backdrop-blur-xl border border-white/20 px-6 py-4 rounded-[2rem] shadow-sm">
            <ShieldCheck className="text-blue-600" size={20} />
            <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Awaiting Backend Payload</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 glass rounded-[3rem] border-dashed border-2 border-blue-100 flex flex-col items-center justify-center group hover:border-blue-300 transition-all">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-200 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                <Activity size={32} />
              </div>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Waiting for Signal {i}</p>
            </div>
          ))}
        </div>

        <div className="glass rounded-[2rem] md:rounded-[3rem] p-8 md:p-16 flex flex-col items-center justify-center border-dashed border-2 border-blue-100 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full -mr-48 -mt-48 blur-3xl" />
          <div className="relative z-10">
            <div className="w-24 h-24 bg-blue-600 text-white rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-200">
              <Database size={40} />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight uppercase">Database Ready</h3>
            <p className="text-sm font-bold text-gray-500 max-w-md mx-auto leading-relaxed">
              The IsokoSense frontend is correctly configured and awaiting the initial data packet from the REST API. 
              Real-time analytics and telemetry charts will render automatically upon connection.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Final rendering when data is present
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-8 space-y-6 md:space-y-10"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">System <span className="text-blue-600">Overview</span> Dashboard</h1>
          <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-[0.2em]">Live System Data Stream</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        <SensorCard title="pH Level" value={sensorData.ph.value} unit={sensorData.ph.unit} status={sensorData.ph.status} icon={Droplets} data={sensorData.ph.data} />
        <SensorCard title="Turbidity" value={sensorData.turbidity.value} unit={sensorData.turbidity.unit} status={sensorData.turbidity.status} icon={Waves} data={sensorData.turbidity.data} />
        <SensorCard title="Temperature" value={sensorData.temperature.value} unit={sensorData.temperature.unit} status={sensorData.temperature.status} icon={Thermometer} data={sensorData.temperature.data} />
        <SensorCard title="Conductivity" value={sensorData.conductivity.value} unit={sensorData.conductivity.unit} status={sensorData.conductivity.status} icon={Zap} data={sensorData.conductivity.data} />
      </div>

      <div className="glass rounded-[2rem] md:rounded-[3rem] p-1 md:p-2 overflow-hidden">
        <MainChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
        <AlertPanel />
        <SystemHealth />
      </div>
    </motion.div>
  );
}
