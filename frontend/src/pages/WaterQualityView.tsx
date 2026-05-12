import { Droplets, TrendingUp, TrendingDown, Info, ShieldCheck, Waves } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function WaterQualityView() {
  const [qualityMetrics, setQualityMetrics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch from backend
    const fetchData = async () => {
      setLoading(true);
      // In production, replace this with: const response = await fetch('/api/water-quality');
      setTimeout(() => {
        const data = [
          { name: "pH Level", value: 7.2, status: "Optimal", trend: "stable", change: "+0.1", color: "blue" },
          { name: "Dissolved Oxygen", value: 8.5, unit: "mg/L", status: "Good", trend: "up", change: "+0.3", color: "blue" },
          { name: "Total Dissolved Solids", value: 340, unit: "ppm", status: "Acceptable", trend: "down", change: "-12", color: "blue" },
          { name: "Chlorine", value: 1.2, unit: "mg/L", status: "Optimal", trend: "stable", change: "0.0", color: "blue" },
          { name: "Alkalinity", value: 120, unit: "mg/L", status: "Good", trend: "up", change: "+5", color: "blue" },
          { name: "Hardness", value: 180, unit: "mg/L", status: "Moderate", trend: "stable", change: "+2", color: "blue" },
        ];
        setQualityMetrics(data);
        setLoading(false);
      }, 800);
    };

    fetchData();
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
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px]" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
            <Waves className="text-blue-600" size={36} />
            Water <span className="text-blue-600">Quality</span> Index
          </h1>
          <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-[0.2em]">Comprehensive Laboratory Telemetry</p>
        </div>
        <div className="flex items-center gap-4 bg-white/40 backdrop-blur-xl border border-white/20 px-6 py-4 rounded-[2rem] shadow-sm">
          <ShieldCheck className="text-blue-600" size={20} />
          <span className="text-xs font-black text-blue-900 uppercase tracking-widest">ISO 9001 Certified Monitoring</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {qualityMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              className="glass rounded-[2.5rem] p-8 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 group-hover:bg-blue-600/10 transition-colors" />
              
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <Droplets size={32} />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{metric.name}</h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-gray-900 tracking-tighter">{metric.value}</span>
                      {metric.unit && <span className="text-xs font-bold text-gray-400 uppercase">{metric.unit}</span>}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-blue-600 shadow-lg shadow-blue-300" />
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{metric.status}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl bg-gray-50 flex items-center gap-2 ${
                    metric.trend === "up" ? "text-blue-600" : metric.trend === "down" ? "text-red-500" : "text-gray-400"
                  }`}>
                    {metric.trend === "up" && <TrendingUp size={16} />}
                    {metric.trend === "down" && <TrendingDown size={16} />}
                    <span className="text-[10px] font-black uppercase tracking-tighter">
                      {metric.change}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Laboratory Summary Section */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="glass rounded-[3rem] p-10 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -mr-[250px] -mt-[250px]" />
        
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/3">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-blue-600 text-white rounded-[1.5rem] shadow-xl shadow-blue-200">
                <Info size={28} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">Quality <br />Analysis</h2>
            </div>
            <p className="text-sm font-bold text-gray-500 leading-relaxed mb-6">
              Overall system integrity is rated as <span className="text-blue-600 font-black px-3 py-1 bg-blue-50 rounded-lg">EXCELLENT</span>. 
              Real-time laboratory data indicates all parameters are strictly within national environmental standards.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Last Update</p>
                <p className="text-xs font-black text-gray-900 uppercase">2 mins ago</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Reliability</p>
                <p className="text-xs font-black text-blue-600 uppercase">99.98%</p>
              </div>
            </div>
          </div>

          <div className="lg:w-2/3">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Technical Observations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "pH stability verified via remote titration simulation",
                "Dissolved oxygen saturation optimal for river ecosystem",
                "Total dissolved solids show progressive decline trend",
                "Chlorine distribution uniform across monitored nodes",
                "Alkalinity buffering capacity remains high",
                "Hardness indices consistent with historic baselines"
              ].map((obs, i) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-white/40 backdrop-blur-md border border-white/20 rounded-2xl group hover:border-blue-500/30 transition-all">
                  <div className="w-2 h-2 rounded-full bg-blue-600 shrink-0 shadow-lg shadow-blue-400" />
                  <p className="text-xs font-bold text-gray-700 tracking-tight">{obs}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
