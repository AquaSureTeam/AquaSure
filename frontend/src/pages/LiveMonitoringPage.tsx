import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { getParameterStatus, ParameterStatus } from '../utils/status.jsx';
import { Droplets, Waves, Thermometer, Gauge } from 'lucide-react';

const PARAMETERS = [
  { key: 'ph', label: 'pH Level', unit: '', icon: Droplets, min: 0, max: 14 },
  { key: 'turbidity', label: 'Turbidity', unit: ' NTU', icon: Waves, min: 0, max: 20 },
  { key: 'temperature', label: 'Temperature', unit: '°C', icon: Thermometer, min: 0, max: 50 },
  { key: 'tds', label: 'TDS', unit: ' mg/L', icon: Gauge, min: 0, max: 2000 },
];

function GaugeDisplay({ value, min, max, status }) {
  const pct = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
  const barColor =
    status === 'critical' ? 'bg-red-500' : status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="mt-4">
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function LiveMonitoringPage() {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [reading, setReading] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDevices().then((data) => {
      setDevices(data.devices || []);
      if (data.devices?.length) setSelectedDevice(data.devices[0].deviceId);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedDevice) return;

    const fetchLatest = async () => {
      try {
        const data = await api.getDeviceReadings(selectedDevice, { limit: 1 });
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
    return <div className="flex justify-center h-64 items-center">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Live Monitoring</h1>
          <p className="text-sm text-gray-500 mt-1">Auto-refreshes every 10 seconds</p>
        </div>
        <select
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
          className="bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm font-bold text-gray-700 outline-none focus:border-blue-500"
        >
          {devices.map((d) => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.name} ({d.deviceId})
            </option>
          ))}
        </select>
      </div>

      {!reading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
          <p className="text-gray-400">No readings available for this device yet.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-400">
            Last reading: {new Date(reading.timestamp).toLocaleString()}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PARAMETERS.map(({ key, label, unit, icon: Icon, min, max }) => {
              const value = reading[key];
              const status = getParameterStatus(value, key);

              return (
                <div
                  key={key}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                        <Icon size={20} className="text-blue-600" />
                      </div>
                      <p className="text-sm font-black text-gray-900 uppercase tracking-widest">
                        {label}
                      </p>
                    </div>
                    <ParameterStatus status={status} />
                  </div>
                  <p className="text-4xl font-black text-gray-900 mt-4">
                    {value}
                    <span className="text-lg text-gray-400 font-bold">{unit}</span>
                  </p>
                  <GaugeDisplay value={value} min={min} max={max} status={status} />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
