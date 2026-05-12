import { AlertTriangle, AlertCircle, Info, CheckCircle, X, Filter, Search, Bell, History,MapPin,Shield} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Alert {
  id: number;
  type: "warning" | "critical" | "info";
  message: string;
  timestamp: string;
  location: string;
  resolved: boolean;
  description: string;
}

export function AlertsView() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "warning" | "critical" | "info">("all");

  useEffect(() => {
    // Simulate API fetch for alerts
    const fetchAlerts = async () => {
      setLoading(true);
      setTimeout(() => {
        setAlerts([
          { id: 1, type: "critical", message: "Turbidity levels exceeding threshold", timestamp: "2026-02-27 14:23", location: "Sensor B-12", resolved: false, description: "Turbidity measured at 3.2 NTU, exceeding the safe threshold of 2.5 NTU." },
          { id: 2, type: "warning", message: "pH fluctuation detected", timestamp: "2026-02-27 13:45", location: "Sensor A-04", resolved: false, description: "pH levels fluctuating outside normal range of 6.5-8.5." },
          { id: 3, type: "info", message: "Scheduled maintenance due in 2 days", timestamp: "2026-02-27 09:00", location: "System", resolved: false, description: "Routine maintenance scheduled for all sensors." },
          { id: 4, type: "warning", message: "Low battery warning", timestamp: "2026-02-26 18:30", location: "Sensor B-03", resolved: false, description: "Battery level at 15%, replacement recommended." },
          { id: 5, type: "critical", message: "Temperature spike detected", timestamp: "2026-02-26 17:45", location: "Sensor A-02", resolved: false, description: "Temperature readings exceeded safe threshold of 35°C." },
        ]);
        setLoading(false);
      }, 1000);
    };
    fetchAlerts();
  }, []);

  const resolveAlert = (id: number) => {
    setAlerts(alerts.map(alert => alert.id === id ? { ...alert, resolved: true } : alert));
  };

  const deleteAlert = (id: number) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === "active" && alert.resolved) return false;
    if (filter === "resolved" && !alert.resolved) return false;
    if (typeFilter !== "all" && alert.type !== typeFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full" />
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
      <div className="absolute top-0 right-0 -z-10 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
            <Bell className="text-blue-600" size={36} />
            Alert <span className="text-blue-600">Response</span> Center
          </h1>
          <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-[0.2em]">Real-time system anomalies & security logs</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="px-6 py-4 bg-white/40 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-sm flex items-center gap-3">
             <History className="text-blue-600" size={18} />
             <span className="text-[10px] font-black text-blue-900 uppercase tracking-widest">{alerts.length} Total Incident Logs</span>
           </div>
        </div>
      </div>

      {/* Stats Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Active Threats", value: alerts.filter(a => !a.resolved).length, icon: AlertCircle, color: "blue" },
          { label: "Critical Priority", value: alerts.filter(a => a.type === 'critical').length, icon: AlertTriangle, color: "red" },
          { label: "Resolved Cycle", value: alerts.filter(a => a.resolved).length, icon: CheckCircle, color: "green" }
        ].map((stat, i) => (
          <div key={i} className="glass rounded-[2.5rem] p-8 group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full -mr-12 -mt-12 group-hover:bg-blue-600/10 transition-colors" />
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
              </div>
              <div className={`p-4 rounded-2xl ${stat.color === 'red' ? 'bg-red-50 text-red-500' : stat.color === 'green' ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-600'}`}>
                <stat.icon size={28} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Control Strip */}
      <div className="glass rounded-[2rem] p-4 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-center gap-4 flex-1 min-w-[300px]">
          <div className="flex items-center gap-2 px-6 py-3 bg-white/60 border border-gray-100 rounded-2xl flex-1 group">
            <Search size={16} className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            <input type="text" placeholder="Search Incident Database..." className="bg-transparent text-xs font-bold text-gray-900 focus:outline-none w-full" />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100">
            {(["all", "active", "resolved"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filter === f ? "bg-blue-600 text-white shadow-lg" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          
          <div className="flex bg-gray-50/50 p-1.5 rounded-2xl border border-gray-100">
            {(["all", "critical", "warning", "info"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  typeFilter === t ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-6">
        <AnimatePresence mode="popLayout">
          {filteredAlerts.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass rounded-[3rem] p-20 text-center space-y-4">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                <CheckCircle size={40} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No Security Incidents Detected</p>
            </motion.div>
          ) : (
            filteredAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`glass rounded-[2.5rem] p-8 border-l-8 transition-all group ${
                  alert.resolved ? "opacity-60 border-green-500" : 
                  alert.type === 'critical' ? 'border-red-600 shadow-xl shadow-red-500/5' : 
                  alert.type === 'warning' ? 'border-amber-500' : 'border-blue-600'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start gap-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${
                    alert.type === 'critical' ? 'bg-red-50 text-red-500' : 
                    alert.type === 'warning' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {alert.resolved ? <CheckCircle size={28} /> : 
                     alert.type === 'critical' ? <AlertTriangle size={28} /> : 
                     alert.type === 'warning' ? <AlertCircle size={28} /> : <Info size={28} />}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">{alert.message}</h3>
                        <p className="text-sm font-bold text-gray-500 leading-relaxed mt-2">{alert.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{alert.timestamp}</span>
                        {alert.resolved && (
                          <span className="px-4 py-1.5 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Incident Resolved</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-gray-50">
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <MapPin size={14} className="text-blue-600" />
                        {alert.location}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <Shield className="text-blue-600" size={14} />
                        Priority: {alert.type}
                      </div>
                      
                      {!alert.resolved && (
                        <div className="flex-1 flex justify-end gap-3">
                          <button
                            onClick={() => deleteAlert(alert.id)}
                            className="px-6 py-3 bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-widest rounded-xl hover:bg-red-50 hover:text-red-500 transition-all flex items-center gap-2"
                          >
                            <X size={14} />
                            Dismiss
                          </button>
                          <button
                            onClick={() => resolveAlert(alert.id)}
                            className="px-8 py-3 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                          >
                            Execute Remediation
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}