import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { api } from '../api/client';
import { Download } from 'lucide-react';
import { motion } from 'framer-motion';

const PARAM_OPTIONS = [
  { key: 'ph', label: 'pH', color: '#6366F1' },
  { key: 'turbidity', label: 'Turbidity', color: '#8B5CF6' },
  { key: 'temperature', label: 'Temperature', color: '#F59E0B' },
  { key: 'tds', label: 'TDS', color: '#10B981' },
];

function defaultDateRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  };
}

export function HistoricalDataPage() {
  const [devices, setDevices] = useState<any[]>([]);
  const [deviceId, setDeviceId] = useState('');
  const [dateRange, setDateRange] = useState(defaultDateRange());
  const [readings, setReadings] = useState<any[]>([]);
  const [activeParams, setActiveParams] = useState(['ph', 'temperature']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getDevices().then((data: any) => {
      const devs = data.devices || [];
      setDevices(devs);
      if (devs.length) setDeviceId(devs[0].deviceId);
    });
  }, []);

  useEffect(() => {
    if (!deviceId) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data: any = await api.getDeviceHistory(deviceId, {
          startDate: new Date(dateRange.start).toISOString(),
          endDate: new Date(`${dateRange.end}T23:59:59`).toISOString(),
        });
        setReadings(
          (data.readings || []).map((r: any) => ({
            ...r,
            time: new Date(r.timestamp).toLocaleString([], {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [deviceId, dateRange]);

  const toggleParam = (key: string) => {
    setActiveParams((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const exportCsv = () => {
    if (!readings.length) return;
    const headers = ['timestamp', 'ph', 'turbidity', 'temperature', 'tds', 'overallStatus'];
    const rows = readings.map((r) =>
      [r.timestamp, r.ph, r.turbidity, r.temperature, r.tds, r.overallStatus].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deviceId}_history.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-950">Historical Data</h1>
          <p className="text-sm text-gray-500 mt-0.5">Trend analysis and data export</p>
        </div>
        <button
          onClick={exportCsv}
          disabled={!readings.length}
          className="flex items-center gap-2 btn-primary disabled:opacity-50 w-fit"
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5 flex flex-wrap gap-5 items-end"
      >
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Device</label>
          <select
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400"
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Start date</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">End date</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </div>
      </motion.div>

      {/* Parameter toggles */}
      <div className="flex flex-wrap gap-2">
        {PARAM_OPTIONS.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggleParam(key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${activeParams.includes(key)
                ? 'text-white border-transparent'
                : 'border-gray-200 text-gray-500 bg-white hover:border-indigo-300'
              }`}
            style={activeParams.includes(key) ? { backgroundColor: color, borderColor: color } : {}}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="card p-6 h-[420px]"
      >
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            Loading chart...
          </div>
        ) : readings.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            No data for the selected range
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={readings} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 11, fill: '#9CA3AF' }}
                interval="preserveStartEnd"
              />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.75rem',
                  fontSize: '0.8rem',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '0.8rem', paddingTop: '8px' }}
              />
              {PARAM_OPTIONS.filter((p) => activeParams.includes(p.key)).map(({ key, label, color }) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={label}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </motion.div>
    </div>
  );
}
