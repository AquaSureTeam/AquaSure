import { Wrench, Activity, Power, RotateCcw, Settings, FileText, CheckCircle2, AlertTriangle, Battery, Calendar, Shield, Cpu } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function TechnicianDashboard() {
  const [sensors, setSensors] = useState<any[]>([]);
  const [maintenanceLogs, setMaintenanceLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [valveOverride, setValveOverride] = useState(false);

  useEffect(() => {
    // Simulate technician telemetry fetch
    const fetchTechnicianData = async () => {
      setLoading(true);
      setTimeout(() => {
        setSensors([
          { id: 1, name: "pH Sensor Node", status: "operational", battery: 85, lastCalibration: "2 days ago", nextCalibration: "28 days" },
          { id: 2, name: "Turbidity Sensor Node", status: "warning", battery: 45, lastCalibration: "15 days ago", nextCalibration: "15 days" },
          { id: 3, name: "Temperature Sensor Node", status: "operational", battery: 92, lastCalibration: "5 days ago", nextCalibration: "25 days" },
          { id: 4, name: "Conductivity Sensor Node", status: "operational", battery: 78, lastCalibration: "1 day ago", nextCalibration: "29 days" },
        ]);

        setMaintenanceLogs([
          { id: 1, action: "Calibrated pH sensor", technician: "John Smith", time: "2 days ago", status: "completed" },
          { id: 2, action: "Replaced turbidity sensor filter", technician: "Sarah Johnson", time: "1 week ago", status: "completed" },
          { id: 3, action: "System diagnostics performed", technician: "Mike Chen", time: "2 weeks ago", status: "completed" },
          { id: 4, action: "Valve maintenance scheduled", technician: "John Smith", time: "Pending", status: "scheduled" },
        ]);
        setLoading(false);
      }, 1600);
    };

    fetchTechnicianData();
  }, []);

  const handleCalibrate = (sensorId: number) => {
    setSensors(sensors.map(sensor => 
      sensor.id === sensorId 
        ? { ...sensor, lastCalibration: "Just now", nextCalibration: "30 days", status: "operational" }
        : sensor
    ));
  };

  const handleSystemReset = () => {
    if (confirm("Are you sure you want to reset the system? This will restart all sensors.")) {
      alert("System reset initiated. All sensors will restart in 5 seconds.");
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8 relative"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px]" />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
             <Wrench className="text-blue-600" size={36} />
             Systems <span className="text-blue-600">Technician</span>
          </h1>
          <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-[0.2em]">Hardware & Maintenance Command</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass px-8 py-4 rounded-[2rem] flex items-center gap-4 shadow-xl shadow-blue-50">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Main Logic Unit</p>
              <p className="text-sm font-black text-green-600 uppercase mt-1">Status: Stable</p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Override */}
        <motion.div whileHover={{ y: -5 }} className="glass rounded-[3rem] p-10 flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-all duration-700" />
          <div className="mb-8 p-5 bg-blue-50 rounded-[2rem]">
            <Power size={40} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">Valve Override</h2>
          <motion.div
            animate={{ 
              boxShadow: valveOverride ? ["0 0 0px rgba(245, 158, 11, 0)", "0 0 30px rgba(245, 158, 11, 0.4)", "0 0 0px rgba(245, 158, 11, 0)"] : "none"
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-6 transition-all duration-500 ${
              valveOverride ? "bg-amber-500 text-white shadow-2xl shadow-amber-200" : "bg-gray-100 text-gray-300"
            }`}
          >
            <Power size={48} />
          </motion.div>
          <button
            onClick={() => setValveOverride(!valveOverride)}
            className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
              valveOverride ? "bg-gray-900 text-white" : "bg-blue-600 text-white shadow-xl shadow-blue-100"
            }`}
          >
            {valveOverride ? "Deactivate Override" : "Acquire Manual Control"}
          </button>
        </motion.div>

        {/* System Reset */}
        <motion.div whileHover={{ y: -5 }} className="glass rounded-[3rem] p-10 flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-all duration-700" />
          <div className="mb-8 p-5 bg-red-50 rounded-[2rem]">
            <RotateCcw size={40} className="text-red-500" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">Logic Reset</h2>
          <div className="w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-6 bg-red-500 text-white shadow-2xl shadow-red-200">
            <Cpu size={48} />
          </div>
          <button
            onClick={handleSystemReset}
            className="w-full py-5 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-red-100 hover:bg-red-600 transition-all"
          >
            Reboot Infrastructure
          </button>
        </motion.div>

        {/* Health Summary */}
        <motion.div whileHover={{ y: -5 }} className="glass rounded-[3rem] p-10 flex flex-col justify-between">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-blue-50 rounded-[1.5rem] text-blue-600">
              <Shield size={32} />
            </div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Defense Index</h2>
          </div>
          <div className="space-y-8">
            {[
              { label: "Hardware Nodes", value: "04/04", color: "text-blue-600" },
              { label: "Active Faults", value: "01", color: "text-amber-500" },
              { label: "Global Efficiency", value: "92%", color: "text-green-500" }
            ].map((stat, i) => (
              <div key={i} className="flex items-center justify-between group cursor-default">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-600 transition-colors">{stat.label}</span>
                <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sensor Management */}
      <div className="glass rounded-[3rem] p-12">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-4 bg-blue-50 rounded-[1.5rem] text-blue-600">
            <Settings size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Hardware Provisioning</h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Individual node calibration & power metrics</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sensors.map((sensor) => (
            <div key={sensor.id} className="glass bg-white/40 border-blue-50 p-8 rounded-[2.5rem] group hover:border-blue-200 transition-all">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">{sensor.name}</h3>
                  <div className={`mt-2 px-3 py-1 inline-flex items-center gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                    sensor.status === 'operational' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${sensor.status === 'operational' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
                    {sensor.status}
                  </div>
                </div>
                <button
                  onClick={() => handleCalibrate(sensor.id)}
                  className="px-6 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                >
                  Calibrate Node
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    <span className="flex items-center gap-2"><Battery size={14} className="text-blue-600" /> Energy Reserves</span>
                    <span className="text-gray-900">{sensor.battery}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 p-0.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${sensor.battery}%` }}
                      className={`h-full rounded-full ${
                        sensor.battery > 70 ? "bg-blue-600" : sensor.battery > 40 ? "bg-amber-500" : "bg-red-500"
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Last Sync</p>
                    <p className="text-sm font-black text-blue-900 mt-1">{sensor.lastCalibration}</p>
                  </div>
                  <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Next Cycle</p>
                    <p className="text-sm font-black text-gray-600 mt-1">{sensor.nextCalibration}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Logs */}
      <div className="glass rounded-[3rem] p-12">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-4 bg-blue-50 rounded-[1.5rem] text-blue-600">
            <FileText size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Engineering Logs</h2>
        </div>
        <div className="space-y-4">
          {maintenanceLogs.map((log) => (
            <div key={log.id} className="p-6 bg-white/40 rounded-[2rem] border border-blue-50 hover:border-blue-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${log.status === 'completed' ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-600'}`}>
                   {log.status === 'completed' ? <CheckCircle2 size={28} /> : <Calendar size={28} />}
                </div>
                <div>
                  <p className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">{log.action}</p>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Assigned: {log.technician}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                  log.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {log.status}
                </span>
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
