import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { getParameterStatus, ParameterStatus } from '../utils/status.jsx';
import { Droplets, Waves, Thermometer, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';

const PARAMETERS = [
  { key: 'ph', label: 'pH Level', unit: '', icon: Droplets, min: 0, max: 14, safeMin: 6.5, safeMax: 8.5 },
  { key: 'turbidity', label: 'Turbidity', unit: 'NTU', icon: Waves, min: 0, max: 20, safeMin: 0, safeMax: 4 },
  { key: 'temperature', label: 'Temperature', unit: '°C', icon: Thermometer, min: 0, max: 50, safeMin: 10, safeMax: 25 },
  { key: 'tds', label: 'TDS', unit: 'mg/L', icon: Gauge, min: 0, max: 2000, safeMin: 0, safeMax: 500 },
];

interface ProgressBarProps {
  value: number;
  min: number;
  max: number;
  status: string;
}

function ProgressBar({ value, min, max, status }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const barColor =
    status === 'critical'
      ? 'bg-red-500'
      : status === 'warning'
        ? 'bg-amber-500'
        : 'bg-indigo-500';

  return (
    <div className="mt-4">
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function LiveMonitoringPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [reading, setReading] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDevices().then((data: any) => {
      const devs = data.devices || [];
      setDevices(devs);
      if (devs.length) setSelectedDevice(devs[0].deviceId);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedDevice) return;

    const fetchLatest = async () => {
      try {
        const data: any = await api.getDeviceReadings(selectedDevice, { limit: 1 });
        setReading(data.readings?.[0] || null);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLatest();
    const interval = setInterval(fetchLatest, 10000);
    return () => clearInterval(interval);
  }, [selectedDevice]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-950">Live Monitoring</h1>
          <p className="text-sm text-gray-500 mt-0.5">Auto-refreshes every 10 seconds</p>
        </div>

        {/* Device selector */}
        <div className="card px-4 py-2.5 flex items-center gap-3 w-fit">
          <label className="text-xs font-medium text-gray-500 whitespace-nowrap">Device</label>
          <select
            value={selectedDevice}
            onChange={(e) => setSelectedDevice(e.target.value)}
            className="bg-transparent text-sm font-semibold text-gray-800 outline-none cursor-pointer"
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.name} ({d.deviceId})
              </option>
            ))}
          </select>
        </div>
      </div>

      {!reading ? (
        <div className="card p-12 text-center border-dashed">
          <p className="text-gray-400">No readings available for this device yet.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400">
            Last reading: {new Date(reading.timestamp).toLocaleString()}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PARAMETERS.map(({ key, label, unit, icon: Icon, min, max }, i) => {
              const value = reading[key];
              const status = getParameterStatus(value, key);
              const iconBg =
                status === 'critical'
                  ? 'bg-red-100'
                  : status === 'warning'
                    ? 'bg-amber-100'
                    : 'bg-indigo-100';
              const iconColor =
                status === 'critical'
                  ? 'text-red-500'
                  : status === 'warning'
                    ? 'text-amber-500'
                    : 'text-indigo-600';

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card p-6"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
                        <Icon size={20} className={iconColor} />
                      </div>
                      <p className="text-sm font-semibold text-gray-700">{label}</p>
                    </div>
                    <ParameterStatus status={status} />
                  </div>

                  <div className="mt-4 flex items-end gap-2">
                    <p className="text-4xl font-bold text-indigo-950">{value}</p>
                    {unit && <p className="text-base text-gray-400 mb-1">{unit}</p>}
                  </div>

                  <ProgressBar value={value} min={min} max={max} status={status} />
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
