import { AlertTriangle, Download, TrendingUp, TrendingDown, MapPin, Activity, Waves } from "lucide-react";
import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { motion } from "framer-motion";

export function OfficerDashboard() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [monitoringStations, setMonitoringStations] = useState<any[]>([]);
  const [pollutionEvents, setPollutionEvents] = useState<any[]>([]);
  const [realtimeAlerts, setRealtimeAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate complex data fetch for Officer
    const fetchOfficerData = async () => {
      setLoading(true);
      setTimeout(() => {
        // Trend data
        const data = Array.from({ length: 24 }, (_, i) => ({
          time: `${i}:00`,
          pH: 7.2 + Math.random() * 0.8 - 0.4,
          turbidity: 3.5 + Math.random() * 2,
          temperature: 22 + Math.random() * 4,
          conductivity: 450 + Math.random() * 100,
        }));
        setChartData(data);

        // Stations
        setMonitoringStations([
          { id: 1, name: "Station A - Industrial Zone", status: "critical", alerts: 3, lat: "40.7128", lon: "-74.0060" },
          { id: 2, name: "Station B - Residential Area", status: "warning", alerts: 1, lat: "40.7589", lon: "-73.9851" },
          { id: 3, name: "Station C - Agricultural Zone", status: "safe", alerts: 0, lat: "40.6782", lon: "-73.9442" },
          { id: 4, name: "Station D - River Outlet", status: "safe", alerts: 0, lat: "40.7489", lon: "-73.9680" },
        ]);

        // Events
        setPollutionEvents([
          { id: 1, station: "Station A", event: "High Turbidity Detected", severity: "critical", time: "10 min ago" },
          { id: 2, station: "Station A", event: "pH Level Above Threshold", severity: "critical", time: "25 min ago" },
          { id: 3, station: "Station B", event: "Temperature Spike", severity: "warning", time: "1 hour ago" },
          { id: 4, station: "Station A", event: "Conductivity Anomaly", severity: "critical", time: "2 hours ago" },
        ]);

        // Real-time
        setRealtimeAlerts([
          { id: 1, message: "Critical pH violation at Station A", time: "2 min ago", priority: "high" },
          { id: 2, message: "Turbidity warning at Station B", time: "15 min ago", priority: "medium" },
          { id: 3, message: "Temperature spike at Station A", time: "32 min ago", priority: "high" },
        ]);

        setLoading(false);
      }, 1500);
    };

    fetchOfficerData();
  }, []);

  const handleDownloadReport = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Monitoring Stations\n";
    csvContent += "Name,Status,Active Alerts,Latitude,Longitude\n";
    monitoringStations.forEach(station => {
      csvContent += `${station.name},${station.status},${station.alerts},${station.lat},${station.lon}\n`;
    });
    csvContent += "\nPollution Events\n";
    csvContent += "Station,Event,Severity,Time\n";
    pollutionEvents.forEach(event => {
      csvContent += `${event.station},${event.event},${event.severity},${event.time}\n`;
    });
    csvContent += "\nReal-Time Alerts\n";
    csvContent += "Message,Priority,Time\n";
    realtimeAlerts.forEach(alert => {
      csvContent += `${alert.message},${alert.priority},${alert.time}\n`;
    });
    csvContent += "\nSensor Data (24 Hour Trend)\n";
    csvContent += "Time,pH,Turbidity,Temperature,Conductivity\n";
    chartData.forEach(data => {
      csvContent += `${data.time},${data.pH},${data.turbidity},${data.temperature},${data.conductivity}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Environmental_Report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      className="p-4 md:p-8 space-y-6 md:space-y-10 relative"
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -z-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px]" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Environmental <span className="text-blue-600">Officer</span></h1>
          <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-[0.2em]">National Monitoring Command Center</p>
        </div>
        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all"
        >
          <Download size={18} />
          Generate System Report
        </button>
      </div>

      {/* Monitoring Stations Grid */}
      <div className="glass rounded-[2.5rem] p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
            <MapPin size={24} className="text-blue-600" />
            Station Network
          </h2>
          <div className="px-4 py-1.5 bg-blue-50 rounded-xl text-[10px] font-black text-blue-600 uppercase tracking-widest">
            {monitoringStations.length} Active Nodes
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {monitoringStations.map((station, index) => (
            <motion.div
              key={station.id}
              whileHover={{ scale: 1.02 }}
              className="glass border-blue-50 bg-white/40 rounded-3xl p-6 transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-black text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{station.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${station.status === 'safe' ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`} />
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {station.lat}, {station.lon}
                    </p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${station.status === "safe" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"
                  }`}>
                  {station.status}
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className={station.alerts > 0 ? "text-amber-500" : "text-gray-300"} />
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {station.alerts} Active Alerts
                  </span>
                </div>
                <button className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">View Details</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Real-Time Alert Feed */}
        <div className="glass rounded-[2.5rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-tight flex items-center gap-3">
              <Activity size={20} className="text-red-500 animate-pulse" />
              Real-Time Alert Feed
            </h2>
            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View History</button>
          </div>
          <div className="space-y-4">
            {realtimeAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                whileHover={{ x: 5 }}
                className={`p-4 rounded-2xl border-l-4 transition-all bg-white/40 ${alert.priority === "high" ? "border-red-500" : "border-amber-500"
                  }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-sm font-bold text-gray-900 leading-relaxed">{alert.message}</p>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter shrink-0">{alert.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pollution Event Table */}
        <div className="glass rounded-[2.5rem] p-8">
          <h2 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-tight">Recent Pollution Events</h2>
          <div className="space-y-4">
            {pollutionEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/60 transition-all border border-transparent hover:border-blue-100"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${event.severity === "critical" ? "bg-red-500 shadow-lg shadow-red-200" : "bg-amber-500 shadow-lg shadow-amber-200"}`} />
                  <div>
                    <p className="text-sm font-bold text-gray-900">{event.event}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{event.station}</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{event.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trend Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-8 rounded-[2.5rem]">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3 uppercase tracking-tight">
            <TrendingUp size={24} className="text-blue-600" />
            pH Level Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: 10, fontWeight: "bold" }} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" style={{ fontSize: 10, fontWeight: "bold" }} axisLine={false} tickLine={false} domain={[6, 9]} />
              <Tooltip contentStyle={{ background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }} />
              <Line type="monotone" dataKey="pH" stroke="#2563eb" strokeWidth={4} dot={{ fill: "#2563eb", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass p-8 rounded-[2.5rem]">
          <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-3 uppercase tracking-tight">
            <Waves size={24} className="text-blue-600" />
            Turbidity Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: 10, fontWeight: "bold" }} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" style={{ fontSize: 10, fontWeight: "bold" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "rgba(255,255,255,0.9)", border: "none", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }} />
              <Line type="monotone" dataKey="turbidity" stroke="#3b82f6" strokeWidth={4} dot={{ fill: "#3b82f6", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
