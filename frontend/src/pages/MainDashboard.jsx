import { SensorCard } from "./SensorCard";
import { AlertPanel } from "./AlertPanel";
import { MainChart } from "./MainChart";
import { SystemHealth } from "./SystemHealth";
import { Droplets, Waves, Thermometer, Zap, Loader2, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";


export function DashboardView() {
  const [timePeriod, setTimePeriod] = useState("24H");
  const [loading, setLoading] = useState(true);
  const [sensorData, setSensorData] = useState(null);

  // This effect will be used to fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Placeholder for backend API call
        // const response = await fetch('/api/sensors');
        // const data = await response.json();

        // Simulating a delay for now, but not putting dummy data as requested
        // Once backend is ready, replace this with actual data fetch
        setTimeout(() => {
          setLoading(false);
          // setSensorData(data);
        }, 2000);
      } catch (error) {
        console.error("Failed to fetch sensor data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 size={48} className="text-brand" />
        </motion.div>
        <p className="mt-4 text-gray-500 font-bold animate-pulse">Initializing Secure Data Stream...</p>
      </div>
    );
  }

  if (!sensorData) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Environmental Dashboard</h1>
          <p className="text-gray-500 mt-2 font-medium text-lg">Waiting for secure data connection from backend...</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 opacity-50">
          <div className="h-48 glass rounded-[2rem] border-dashed border-2 flex items-center justify-center">
            <p className="text-sm font-bold text-gray-400 italic">No Data Available</p>
          </div>
          <div className="h-48 glass rounded-[2rem] border-dashed border-2 flex items-center justify-center">
            <p className="text-sm font-bold text-gray-400 italic">No Data Available</p>
          </div>
          <div className="h-48 glass rounded-[2rem] border-dashed border-2 flex items-center justify-center">
            <p className="text-sm font-bold text-gray-400 italic">No Data Available</p>
          </div>
          <div className="h-48 glass rounded-[2rem] border-dashed border-2 flex items-center justify-center">
            <p className="text-sm font-bold text-gray-400 italic">No Data Available</p>
          </div>
        </div>

        <div className="glass rounded-[2.5rem] p-12 flex items-center justify-center border-dashed border-2 opacity-50">
          <div className="text-center">
            <div className="w-20 h-20 bg-brand-light rounded-3xl flex items-center justify-center mx-auto mb-6 text-brand">
              <Activity size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Real-time Analytics Ready</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Connecting to the AquaSure backend. Analytics will appear here automatically once the data stream is active.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Page Title */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Environmental Dashboard</h1>
        <p className="text-gray-500 mt-2 font-medium text-lg italic">Verified real-time data from backend</p>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <SensorCard
          title="pH Level"
          value={sensorData.ph.value}
          unit={sensorData.ph.unit}
          status={sensorData.ph.status}
          icon={Droplets}
          data={sensorData.ph.data}
          min={sensorData.ph.min}
          max={sensorData.ph.max}
          optimal={sensorData.ph.optimal}
        />
        <SensorCard
          title="Turbidity"
          value={sensorData.turbidity.value}
          unit={sensorData.turbidity.unit}
          status={sensorData.turbidity.status}
          icon={Waves}
          data={sensorData.turbidity.data}
          min={sensorData.turbidity.min}
          max={sensorData.turbidity.max}
          optimal={sensorData.turbidity.optimal}
        />
        <SensorCard
          title="Temperature"
          value={sensorData.temperature.value}
          unit={sensorData.temperature.unit}
          status={sensorData.temperature.status}
          icon={Thermometer}
          data={sensorData.temperature.data}
          min={sensorData.temperature.min}
          max={sensorData.temperature.max}
          optimal={sensorData.temperature.optimal}
        />
        <SensorCard
          title="Electrical Conductivity"
          value={sensorData.conductivity.value}
          unit={sensorData.conductivity.unit}
          status={sensorData.conductivity.status}
          icon={Zap}
          data={sensorData.conductivity.data}
          min={sensorData.conductivity.min}
          max={sensorData.conductivity.max}
          optimal={sensorData.conductivity.optimal}
        />
      </div>

      {/* Main Chart */}
      <div className="mb-8">
        <MainChart timePeriod={timePeriod} onTimePeriodChange={setTimePeriod} />
      </div>

      {/* Bottom Grid - Alerts and System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AlertPanel />
        <SystemHealth />
      </div>
    </div>
  );
}
