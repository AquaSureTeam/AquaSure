import { CheckCircle, AlertCircle, XCircle, Gauge, Power, History, Activity, Waves, Droplets } from "lucide-react";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export function OperatorDashboard() {
  const [valveStatus, setValveStatus] = useState<"open" | "closed">("open");
  const [chartData, setChartData] = useState<any[]>([]);
  const [sensorData, setSensorData] = useState<any[]>([]);
  const [alertHistory, setAlertHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate complex data fetch for Operator
    const fetchOperatorData = async () => {
      setLoading(true);
      setTimeout(() => {
        // Trend data
        const tData = Array.from({ length: 12 }, (_, i) => ({
          time: `${i * 2}:00`,
          value: 7.2 + Math.random() * 0.6 - 0.3,
        }));
        setChartData(tData);

        // Sensor matrix
        setSensorData([
          { name: "pH", value: 7.8, unit: "pH", status: "warning", min: 6.5, max: 8.5, current: 7.8 },
          { name: "Turbidity", value: 4.2, unit: "NTU", status: "safe", min: 0, max: 5, current: 4.2 },
          { name: "Temperature", value: 24.5, unit: "°C", status: "safe", min: 20, max: 30, current: 24.5 },
          { name: "Electrical Conductivity", value: 485, unit: "μS/cm", status: "safe", min: 200, max: 800, current: 485 },
        ]);

        // Alerts
        setAlertHistory([
          { id: 1, message: "pH approaching upper threshold", time: "30 min ago", severity: "warning" },
          { id: 2, message: "Turbidity spike detected", time: "2 hours ago", severity: "warning" },
          { id: 3, message: "Normal operation resumed", time: "4 hours ago", severity: "info" },
          { id: 4, message: "Temperature within safe range", time: "6 hours ago", severity: "info" },
        ]);

        setLoading(false);
      }, 1200);
    };

    fetchOperatorData();
  }, []);

  const complianceStatus: "safe" | "warning" | "violation" = "warning";

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-8 space-y-6 md:space-y-10 relative"
    >
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-400/5 rounded-full blur-[100px] animate-pulse" />
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <motion.h1 
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="text-4xl font-black text-gray-900 tracking-tight"
          >
            Industry Operator <span className="text-blue-600">Dashboard</span>
          </motion.h1>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Station B - Manufacturing Plant Outlet</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="glass px-6 py-3 rounded-2xl flex items-center gap-4 shadow-blue-100/50 border-blue-100/50">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Activity size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-none">Station ID</p>
              <p className="text-sm font-black text-gray-900 leading-tight">STN-B-001</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Status & Valve Control */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Compliance Status Panel */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass rounded-[2.5rem] p-10 flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-blue-600" />
          <div className="mb-6 p-4 bg-blue-50 rounded-3xl">
            <Gauge size={32} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Compliance Status</h2>
          <div className="flex flex-col items-center justify-center py-6">
            {complianceStatus === "safe" && (
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                <CheckCircle size={80} className="text-green-500 mb-4" />
                <p className="text-4xl font-black text-green-500 tracking-tighter">SAFE</p>
              </motion.div>
            )}
            {complianceStatus === "warning" && (
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>
                <AlertCircle size={80} className="text-amber-500 mb-4" />
                <p className="text-4xl font-black text-amber-500 tracking-tighter">WARNING</p>
              </motion.div>
            )}
            <p className="text-sm font-bold text-gray-400 mt-4 max-w-[200px]">Current operational parameters are within safe limits.</p>
          </div>
        </motion.div>

        {/* Valve Status Panel */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass rounded-[2.5rem] p-10 flex flex-col items-center text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-blue-800" />
          <div className="mb-6 p-4 bg-blue-50 rounded-3xl">
            <Power size={32} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tight">Discharge Control</h2>
          <div className="flex flex-col items-center justify-center py-6">
            <motion.div
              animate={{ 
                boxShadow: valveStatus === "open" ? ["0 0 0px rgba(34, 197, 94, 0)", "0 0 40px rgba(34, 197, 94, 0.4)", "0 0 0px rgba(34, 197, 94, 0)"] : "none"
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${
                valveStatus === "open"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              <Power size={48} />
            </motion.div>
            <p className="text-sm font-black text-gray-900 mb-6 tracking-widest uppercase">
              Valve is <span className={valveStatus === "open" ? "text-green-500" : "text-gray-400"}>{valveStatus}</span>
            </p>
            <button
              onClick={() => setValveStatus(valveStatus === "open" ? "closed" : "open")}
              className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                valveStatus === "open"
                  ? "bg-gray-900 text-white hover:bg-black"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200"
              }`}
            >
              {valveStatus === "open" ? "Shutdown Valve" : "Activate Valve"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sensorData.map((sensor, index) => (
          <motion.div
            key={sensor.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass p-6 rounded-[2rem] hover:border-blue-300 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl group-hover:bg-blue-600 transition-colors group-hover:text-white text-blue-600">
                {sensor.name === "pH" ? <Droplets size={20} /> : <Waves size={20} />}
              </div>
              <div
                className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  sensor.status === "safe"
                    ? "bg-green-50 text-green-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {sensor.status}
              </div>
            </div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{sensor.name}</h3>
            <p className="text-3xl font-black text-gray-900 tracking-tighter">
              {sensor.value}
              <span className="text-sm text-gray-400 ml-1 font-bold uppercase">{sensor.unit}</span>
            </p>
            <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((sensor.current - sensor.min) / (sensor.max - sensor.min)) * 100}%` }}
                className={`h-full rounded-full ${
                  sensor.status === "safe" ? "bg-blue-600" : "bg-amber-500"
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Station Graph & Alert History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trend Graph */}
        <div className="lg:col-span-2 glass rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-2">
              <Activity size={20} className="text-blue-600" />
              pH Trend Monitoring
            </h2>
            <div className="flex gap-2">
              {["1H", "24H", "7D"].map(t => (
                <button key={t} className={`px-4 py-1.5 rounded-xl text-[10px] font-black transition-all ${t === "24H" ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: 10, fontWeight: "bold" }} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" style={{ fontSize: 10, fontWeight: "bold" }} axisLine={false} tickLine={false} domain={[6, 9]} />
              <Tooltip 
                contentStyle={{ background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
              />
              <Area type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Alert History */}
        <div className="glass rounded-[2.5rem] p-8">
          <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2 uppercase tracking-tight">
            <History size={20} className="text-blue-600" />
            Alert History
          </h2>
          <div className="space-y-4">
            {alertHistory.map((alert) => (
              <div key={alert.id} className="group cursor-pointer">
                <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-blue-50 transition-colors">
                  <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${
                    alert.severity === "warning" ? "bg-amber-500" : "bg-blue-500"
                  }`} />
                  <div>
                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{alert.message}</p>
                    <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-widest">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-4 rounded-2xl border-2 border-dashed border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-blue-200 hover:text-blue-600 transition-all">
            View All Logs
          </button>
        </div>
      </div>
    </motion.div>
  );
}
