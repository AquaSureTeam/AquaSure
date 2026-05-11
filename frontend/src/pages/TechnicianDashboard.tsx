import { Wrench, Activity, Power, RotateCcw, Settings, FileText, CheckCircle2, AlertTriangle, Battery, Calendar } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function TechnicianDashboard() {
  const [sensors, setSensors] = useState([
    { id: 1, name: "pH Sensor", status: "operational", battery: 85, lastCalibration: "2 days ago", nextCalibration: "28 days" },
    { id: 2, name: "Turbidity Sensor", status: "warning", battery: 45, lastCalibration: "15 days ago", nextCalibration: "15 days" },
    { id: 3, name: "Temperature Sensor", status: "operational", battery: 92, lastCalibration: "5 days ago", nextCalibration: "25 days" },
    { id: 4, name: "Conductivity Sensor", status: "operational", battery: 78, lastCalibration: "1 day ago", nextCalibration: "29 days" },
  ]);

  const [valveOverride, setValveOverride] = useState(false);

  const maintenanceLogs = [
    { id: 1, action: "Calibrated pH sensor", technician: "John Smith", time: "2 days ago", status: "completed" },
    { id: 2, action: "Replaced turbidity sensor filter", technician: "Sarah Johnson", time: "1 week ago", status: "completed" },
    { id: 3, action: "System diagnostics performed", technician: "Mike Chen", time: "2 weeks ago", status: "completed" },
    { id: 4, action: "Valve maintenance scheduled", technician: "John Smith", time: "Pending", status: "scheduled" },
  ];

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

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 space-y-8 relative"
    >
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px]" />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">System <span className="text-blue-600">Technician</span></h1>
          <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-[0.2em]">Industrial Maintenance Control</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Main Controller</span>
            <span className="text-sm font-black text-green-600 uppercase">Online</span>
          </div>
        </div>
      </div>

      {/* System Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Manual Valve Override */}
        <motion.div whileHover={{ y: -5 }} className="glass rounded-[2.5rem] p-8 flex flex-col items-center text-center">
          <div className="mb-6 p-4 bg-blue-50 rounded-3xl">
            <Power size={32} className="text-blue-600" />
          </div>
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6">Valve Override</h2>
          <motion.div
            animate={{ 
              rotate: valveOverride ? [0, 10, -10, 0] : 0,
              scale: valveOverride ? [1, 1.1, 1] : 1
            }}
            transition={{ duration: 0.5, repeat: valveOverride ? Infinity : 0 }}
            className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
              valveOverride ? "bg-amber-500 text-white shadow-lg shadow-amber-200" : "bg-gray-100 text-gray-400"
            }`}
          >
            <Power size={36} />
          </motion.div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">
            {valveOverride ? "Manual Mode Active" : "Automated System"}
          </p>
          <button
            onClick={() => setValveOverride(!valveOverride)}
            className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
              valveOverride ? "bg-gray-900 text-white" : "bg-blue-600 text-white shadow-lg shadow-blue-200"
            }`}
          >
            {valveOverride ? "Release Control" : "Take Control"}
          </button>
        </motion.div>

        {/* System Reset */}
        <motion.div whileHover={{ y: -5 }} className="glass rounded-[2.5rem] p-8 flex flex-col items-center text-center">
          <div className="mb-6 p-4 bg-red-50 rounded-3xl">
            <RotateCcw size={32} className="text-red-500" />
          </div>
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight mb-6">Global Reset</h2>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-red-500 text-white shadow-lg shadow-red-200">
            <RotateCcw size={36} />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Full Controller Restart</p>
          <button
            onClick={handleSystemReset}
            className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-200 hover:bg-red-600 transition-all"
          >
            Initiate Reset
          </button>
        </motion.div>

        {/* Device Summary */}
        <motion.div whileHover={{ y: -5 }} className="glass rounded-[2.5rem] p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <Activity size={24} />
            </div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight">Summary</h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Nodes</span>
              <span className="text-xl font-black text-blue-600">04/04</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Errors</span>
              <span className="text-xl font-black text-amber-500">01</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Health</span>
              <span className="text-xl font-black text-green-500">92%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Sensor Health Status Cards */}
      <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Wrench size={20} className="text-[#1F7A8C]" />
          <h2 className="text-lg font-semibold text-[#0A2A2F]">Sensor Health & Calibration</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sensors.map((sensor) => (
            <div
              key={sensor.id}
              className="backdrop-blur-sm bg-white/60 border border-white/40 rounded-xl p-5 hover:shadow-lg transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-[#0A2A2F] mb-1">{sensor.name}</h3>
                  <div className="flex items-center gap-2">
                    {sensor.status === "operational" ? (
                      <CheckCircle2 size={16} className="text-[#2ECC71]" />
                    ) : (
                      <AlertTriangle size={16} className="text-[#F39C12]" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        sensor.status === "operational" ? "text-[#2ECC71]" : "text-[#F39C12]"
                      }`}
                    >
                      {sensor.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleCalibrate(sensor.id)}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                >
                  Calibrate
                </button>
              </div>

              <div className="space-y-3">
                {/* Battery Status */}
                <div>
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Battery Level</span>
                    <span className="font-semibold">{sensor.battery}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        sensor.battery > 70
                          ? "bg-[#2ECC71]"
                          : sensor.battery > 40
                          ? "bg-[#F39C12]"
                          : "bg-[#E74C3C]"
                      }`}
                      style={{ width: `${sensor.battery}%` }}
                    />
                  </div>
                </div>

                {/* Calibration Info */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white/50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Last Calibration</p>
                    <p className="text-sm font-semibold text-[#0A2A2F] mt-1">{sensor.lastCalibration}</p>
                  </div>
                  <div className="bg-white/50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Next Due</p>
                    <p className="text-sm font-semibold text-[#0A2A2F] mt-1">{sensor.nextCalibration}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance Logs */}
      <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <FileText size={20} className="text-[#1F7A8C]" />
          <h2 className="text-lg font-semibold text-[#0A2A2F]">Maintenance Logs</h2>
        </div>
        <div className="space-y-3">
          {maintenanceLogs.map((log) => (
            <div
              key={log.id}
              className="backdrop-blur-sm bg-white/60 border border-white/30 rounded-xl p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-[#0A2A2F] mb-1">{log.action}</p>
                  <p className="text-sm text-gray-600">Technician: {log.technician}</p>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-block px-3 py-1 rounded-lg text-xs font-medium mb-2 ${
                      log.status === "completed"
                        ? "bg-green-100 text-[#2ECC71]"
                        : "bg-blue-100 text-[#1F7A8C]"
                    }`}
                  >
                    {log.status.toUpperCase()}
                  </div>
                  <p className="text-xs text-gray-500">{log.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
