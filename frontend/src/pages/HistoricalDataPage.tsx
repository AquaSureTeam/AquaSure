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

const PARAM_OPTIONS = [
  { key: 'ph', label: 'pH', color: '#2563eb' },
  { key: 'turbidity', label: 'Turbidity', color: '#0891b2' },
  { key: 'temperature', label: 'Temperature', color: '#ea580c' },
  { key: 'tds', label: 'TDS', color: '#7c3aed' },
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
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState('');
  const [dateRange, setDateRange] = useState(defaultDateRange());
  const [readings, setReadings] = useState([]);
  const [activeParams, setActiveParams] = useState(['ph', 'temperature']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getDevices().then((data) => {
      setDevices(data.devices || []);
      if (data.devices?.length) setDeviceId(data.devices[0].deviceId);
    });
  }, []);

  useEffect(() => {
    if (!deviceId) return;

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await api.getDeviceHistory(deviceId, {
          startDate: new Date(dateRange.start).toISOString(),
          endDate: new Date(`${dateRange.end}T23:59:59`).toISOString(),
        });
        setReadings(
          (data.readings || []).map((r) => ({
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

  const toggleParam = (key) => {
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
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Historical Data</h1>
          <p className="text-sm text-gray-500 mt-1">Trend analysis and data export</p>
        </div>
        <button
          onClick={exportCsv}
          disabled={!readings.length}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50"
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 flex flex-wrap gap-4 items-end">
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Device
          </label>
          <select
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            className="block mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold"
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Start Date
          </label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="block mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
          />
        </div>
        <div>
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            End Date
          </label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="block mt-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {PARAM_OPTIONS.map(({ key, label, color }) => (
          <button
            key={key}
            onClick={() => toggleParam(key)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border-2 transition-all ${
              activeParams.includes(key)
                ? 'border-transparent text-white'
                : 'border-gray-200 text-gray-500 bg-white'
            }`}
            style={activeParams.includes(key) ? { backgroundColor: color } : {}}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 h-[420px]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">Loading chart...</div>
        ) : readings.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            No data for selected range
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={readings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" tick={{ fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend />
              {PARAM_OPTIONS.filter((p) => activeParams.includes(p.key)).map(({ key, label, color }) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={label}
                  stroke={color}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
