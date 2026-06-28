import { MapPin, Wifi, Battery, Calendar, Cpu, Settings, ExternalLink, Activity, Radio } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SensorsView() {
  const [sensors, setSensors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch for sensors
    const fetchSensors = async () => {
      setLoading(true);
      // In production: const response = await fetch('/api/sensors');
      setTimeout(() => {
        setSensors([
          { id: "A-01", name: "pH Sensor Alpha", location: "Tank 1 - North", status: "online",    battery: 92,  lastMaintenance: "2 days ago", type: "pH Monitor" },
          { id: "A-02", name: "Temperature Probe A", location: "Tank 1 - Center", status: "online", battery: 88, lastMaintenance: "5 days ago", type: "Temperature" },
          { id: "A-03", name: "Turbidity Sensor T1", location: "Tank 1 - South", status: "online", battery: 76,  lastMaintenance: "1 week ago", type: "Turbidity" },
          { id: "A-04", name: "Conductivity Meter C1", location: "Tank 1 - East", status: "online", battery: 95, lastMaintenance: "3 days ago", type: "Conductivity" },
          { id: "B-01", name: "pH Sensor Beta", location: "Tank 2 - North", status: "online",       battery: 84, lastMaintenance: "4 days ago", type: "pH Monitor" },
          { id: "B-02", name: "Temperature Probe B", location: "Tank 2 - Center", status: "online", battery: 91, lastMaintenance: "2 days ago", type: "Temperature" },
          { id: "B-03", name: "Turbidity Sensor T2", location: "Tank 2 - South", status: "warning", battery: 45, lastMaintenance: "2 weeks ago", type: "Turbidity" },
          { id: "B-04", name: "Conductivity Meter C2", location: "Tank 2 - East", status: "online", battery: 89, lastMaintenance: "6 days ago", type: "Conductivity" },
        ]);
        setLoading(false);
      }, 1000);
    };
    fetchSensors();
  }, []);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-10 relative"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
            <Cpu className="text-blue-600" size={36} />
            Hardware <span className="text-blue-600">Assets</span>
          </h1>
          <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-[0.2em]">Telemetry Node Inventory & Signal Integrity</p>
        </div>
        <div className="flex items-center gap-3 bg-white/40 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-[2rem] shadow-sm">
          <Radio className="text-blue-600 animate-pulse" size={20} />
          <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest">{sensors.length} Active Sensors</span>
        </div>
      </div>

      {/* Sensor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence>
          {sensors.map((sensor) => (
            <motion.div
              key={sensor.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              className="glass rounded-[2.5rem] p-8 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-colors" />
              
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest rounded-lg">{sensor.id}</span>
                    <div className={`w-2 h-2 rounded-full ${sensor.status === "online" ? "bg-blue-600 shadow-lg shadow-blue-300" : "bg-amber-500 animate-pulse"}`} />
                  </div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">{sensor.name}</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{sensor.type}</p>
                </div>
                <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                  sensor.status === "online" ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                }`}>
                  {sensor.status}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-blue-600" />
                  </div>
                  <span>{sensor.location}</span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Battery size={14} className="text-blue-600" />
                      <span>Power Reserve</span>
                    </div>
                    <span className="text-gray-900">{sensor.battery}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${sensor.battery}%` }}
                      className={`h-full ${
                        sensor.battery > 70 ? "bg-blue-600" : sensor.battery > 40 ? "bg-amber-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold text-gray-600">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar size={18} className="text-blue-600" />
                  </div>
                  <span>Service: {sensor.lastMaintenance}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
                <button className="flex-1 py-4 bg-white/60 backdrop-blur-xl border border-white/50 border border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest rounded-[1.25rem] hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                  <Settings size={14} />
                  Calibrate
                </button>
                <button className="flex-1 py-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-[1.25rem] shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group">
                  <Activity size={14} />
                  Telemetry
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
