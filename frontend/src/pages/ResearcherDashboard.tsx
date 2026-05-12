import { FileSpreadsheet, Filter, TrendingUp, Calendar, Database, Search, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export function ResearcherDashboard() {
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState("30days");
  const [selectedParameter, setSelectedParameter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate long-term historical data fetch
    const fetchResearcherData = async () => {
      setLoading(true);
      setTimeout(() => {
        const dataPoints = dateRange === "30days" ? 30 : dateRange === "90days" ? 90 : 365;
        const hData = Array.from({ length: dataPoints }, (_, i) => ({
          date: new Date(Date.now() - (dataPoints - i) * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          pH: 7.2 + Math.random() * 0.8 - 0.4,
          turbidity: 3.5 + Math.random() * 2,
          temperature: 22 + Math.random() * 4,
          conductivity: 450 + Math.random() * 100,
        }));
        setHistoricalData(hData);

        setTableData([
          { date: "2025-03-02", time: "14:30", pH: 7.4, turbidity: 3.8, temp: 24.2, conductivity: 478 },
          { date: "2025-03-02", time: "14:00", pH: 7.3, turbidity: 3.9, temp: 24.1, conductivity: 482 },
          { date: "2025-03-02", time: "13:30", pH: 7.5, turbidity: 3.7, temp: 24.3, conductivity: 475 },
          { date: "2025-03-02", time: "13:00", pH: 7.2, turbidity: 4.1, temp: 23.9, conductivity: 485 },
          { date: "2025-03-02", time: "12:30", pH: 7.4, turbidity: 3.6, temp: 24.0, conductivity: 479 },
        ]);
        setLoading(false);
      }, 1400);
    };

    fetchResearcherData();
  }, [dateRange]);

  const handleExportCSV = () => {
    const csvContent = [
      ["Date", "Time", "pH", "Turbidity (NTU)", "Temperature (°C)", "Conductivity (μS/cm)"],
      ...tableData.map(row => [row.date, row.time, row.pH, row.turbidity, row.temp, row.conductivity])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `water_quality_data_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 md:p-8 space-y-6 md:space-y-10 relative"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px]" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Data <span className="text-blue-600">Researcher</span></h1>
          <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-[0.2em]">Scientific Analysis Interface</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all"
        >
          <FileSpreadsheet size={18} />
          Export Dataset
        </button>
      </div>

      {/* Data Filtering Tools */}
      <div className="glass rounded-[2.5rem] p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
            <Filter size={24} />
          </div>
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Scientific Filters</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Date Range */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Time Period</label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-5 py-4 bg-white/60 border border-gray-100 rounded-2xl text-gray-900 font-bold focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all appearance-none cursor-pointer"
            >
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="365days">Last Year</option>
            </select>
          </div>

          {/* Parameter Selection */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Metric Parameter</label>
            <select
              value={selectedParameter}
              onChange={(e) => setSelectedParameter(e.target.value)}
              className="w-full px-5 py-4 bg-white/60 border border-gray-100 rounded-2xl text-gray-900 font-bold focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Parameters</option>
              <option value="pH">pH Level</option>
              <option value="turbidity">Turbidity</option>
              <option value="temperature">Temperature</option>
              <option value="conductivity">Electrical Conductivity</option>
            </select>
          </div>

          {/* Station Filter */}
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Telemetry Node</label>
            <select
              className="w-full px-5 py-4 bg-white/60 border border-gray-100 rounded-2xl text-gray-900 font-bold focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Stations</option>
              <option value="station-a">Station A</option>
              <option value="station-b">Station B</option>
              <option value="station-c">Station C</option>
              <option value="station-d">Station D</option>
            </select>
          </div>
        </div>
      </div>

      {/* Long-Term Trend Analysis */}
      <div className="glass rounded-[2.5rem] p-10">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <TrendingUp size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Trend Analysis</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Multi-parameter telemetry visualization</p>
            </div>
          </div>
        </div>

        {/* Multi-Parameter Chart */}
        <div className="mb-12">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Aggregate Parameter Feed</h3>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={historicalData}>
              <defs>
                <linearGradient id="colorPH" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#94a3b8" style={{ fontSize: 10, fontWeight: "bold" }} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" style={{ fontSize: 10, fontWeight: "bold" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                  border: "none",
                  borderRadius: "20px",
                  boxShadow: "0 20px 50px -10px rgba(0,0,0,0.1)",
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "25px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }} />
              <Area type="monotone" dataKey="pH" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorPH)" name="pH Index" />
              <Area type="monotone" dataKey="turbidity" stroke="#60a5fa" strokeWidth={2} fillOpacity={0.1} fill="#60a5fa" name="Turbidity NTU" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Individual Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">pH Stability Trend</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" hide />
                <YAxis hide domain={[6, 9]} />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }} />
                <Line type="monotone" dataKey="pH" stroke="#2563eb" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Conductivity Index (μS/cm)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }} />
                <Line type="monotone" dataKey="conductivity" stroke="#60a5fa" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Records Table */}
      <div className="glass rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <Database size={24} />
            </div>
            <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">Telemetry Records</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-gray-50 rounded-xl border border-gray-100 flex items-center gap-2">
              <Search size={14} className="text-gray-400" />
              <input type="text" placeholder="Search logs..." className="bg-transparent text-[10px] font-bold text-gray-900 focus:outline-none w-32" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">pH Index</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Turbidity</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Temp (°C)</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Conductivity</th>
                <th className="px-8 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tableData.map((row, index) => (
                <tr key={index} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-5 text-sm font-bold text-gray-900">{row.date} <span className="text-[10px] text-gray-400 ml-2">{row.time}</span></td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-600">{row.pH}</td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-600">{row.turbidity}</td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-600">{row.temp}</td>
                  <td className="px-8 py-5 text-sm font-bold text-gray-600">{row.conductivity}</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest">Verified</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Page 1 of 124</p>
          <div className="flex gap-2">
            <button className="px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-all">Prev</button>
            <button className="px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-gray-900 uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Next</button>
          </div>
        </div>
      </div>

      {/* Read-Only Notice */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="glass border-blue-200 bg-blue-50/30 rounded-3xl p-6"
      >
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-200">
            <Database size={28} />
          </div>
          <div>
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-tight">Scientific Archive Access</h3>
            <p className="text-xs font-bold text-blue-700/70 mt-1">You are currently in scientific research mode. Data is read-only and verified by national environmental standards.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
