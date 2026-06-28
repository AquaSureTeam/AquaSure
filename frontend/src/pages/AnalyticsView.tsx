import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, Activity, AlertCircle, Calendar, Download, Filter, Waves } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function AnalyticsView() {
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch for analytics
    const fetchAnalytics = async () => {
      setLoading(true);
      setTimeout(() => {
        setAnalyticsData([
          { month: "Jan", alerts: 12, uptime: 99.8, avgPh: 7.2 },
          { month: "Feb", alerts: 8, uptime: 99.9, avgPh: 7.3 },
          { month: "Mar", alerts: 15, uptime: 99.5, avgPh: 7.1 },
          { month: "Apr", alerts: 6, uptime: 99.9, avgPh: 7.2 },
          { month: "May", alerts: 10, uptime: 99.7, avgPh: 7.4 },
          { month: "Jun", alerts: 9, uptime: 99.8, avgPh: 7.2 },
        ]);
        setLoading(false);
      }, 1000);
    };
    fetchAnalytics();
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
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] -mr-48 -mt-48" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
            <Waves className="text-blue-600" size={36} />
            Data <span className="text-blue-600">Intelligence</span>
          </h1>
          <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-[0.2em]">Long-term performance trends & system health</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-xl border border-white/50 border border-gray-100 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-all">
             <Filter size={16} />
             Filters
           </button>
           <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all">
             <Download size={16} />
             Export BI Report
           </button>
        </div>
      </div>

      {/* KPI Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "System Uptime", value: "99.98%", change: "+0.02%", icon: TrendingUp, color: "blue" },
          { label: "Data Throughput", value: "2.4M", change: "Last 30d", icon: Activity, color: "blue" },
          { label: "Alert Density", value: "14.2", change: "-4.1%", icon: AlertCircle, color: "blue" }
        ].map((kpi, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="glass rounded-[2.5rem] p-8 group"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                <kpi.icon size={28} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{kpi.label}</p>
                <p className="text-3xl font-black text-gray-900 tracking-tighter">{kpi.value}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase mt-1">{kpi.change}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Bar Chart */}
        <div className="glass rounded-[3rem] p-10 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Anomalous Activity</h2>
            <Calendar className="text-gray-300" size={20} />
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: 10, fontWeight: "bold" }} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" style={{ fontSize: 10, fontWeight: "bold" }} axisLine={false} tickLine={false} />
                <Tooltip 
                   cursor={{fill: '#f8fafc'}}
                   contentStyle={{
                     background: "rgba(255,255,255,0.95)",
                     backdropFilter: "blur(10px)",
                     border: "none",
                     borderRadius: "20px",
                     boxShadow: "0 20px 50px -10px rgba(0,0,0,0.1)",
                   }}
                />
                <Bar dataKey="alerts" fill="#2563eb" radius={[10, 10, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Area Chart */}
        <div className="glass rounded-[3rem] p-10 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Stability Index</h2>
            <TrendingUp className="text-blue-600" size={20} />
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: 10, fontWeight: "bold" }} axisLine={false} tickLine={false} />
                <YAxis domain={[99, 100]} stroke="#94a3b8" style={{ fontSize: 10, fontWeight: "bold" }} axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{
                     background: "rgba(255,255,255,0.95)",
                     backdropFilter: "blur(10px)",
                     border: "none",
                     borderRadius: "20px",
                     boxShadow: "0 20px 50px -10px rgba(0,0,0,0.1)",
                   }}
                />
                <Area type="monotone" dataKey="uptime" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorUptime)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
