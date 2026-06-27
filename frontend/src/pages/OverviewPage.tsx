import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { StatusBadge } from '../utils/status.jsx';
import {
  Droplets,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Activity,
} from 'lucide-react';
import { motion } from 'framer-motion';

export function OverviewPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    try {
      const data = await api.getDashboardSummary();
      setSummary(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(fetchSummary, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700">
        Failed to load dashboard: {error}
      </div>
    );
  }

  const bannerStyles = {
    Safe: 'from-emerald-500 to-emerald-600',
    Warning: 'from-amber-500 to-amber-600',
    Critical: 'from-red-500 to-red-600',
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Real-time water quality monitoring dashboard</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl p-8 text-white bg-gradient-to-r ${bannerStyles[summary.overallStatus] || bannerStyles.Safe} shadow-xl`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] opacity-80">
              Overall Water Safety Status
            </p>
            <h2 className="text-4xl font-black mt-2">{summary.overallStatus}</h2>
          </div>
          <StatusBadge status={summary.overallStatus} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Devices',
            value: summary.totalDevices,
            icon: Activity,
            color: 'blue',
          },
          {
            label: 'Active Alerts',
            value: summary.alertCounts.total,
            icon: AlertTriangle,
            color: 'amber',
          },
          {
            label: 'Parameters In Range',
            value: `${summary.parametersInRange}/${summary.totalParameters || 0}`,
            icon: CheckCircle,
            color: 'emerald',
          },
          {
            label: 'Last Update',
            value: summary.lastUpdate
              ? new Date(summary.lastUpdate).toLocaleTimeString()
              : 'N/A',
            icon: Clock,
            color: 'gray',
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <card.icon size={22} className="text-blue-600" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              {card.label}
            </p>
            <p className="text-2xl font-black text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-amber-500" />
            Latest Unresolved Alerts
          </h3>
          <div className="space-y-3">
            {(summary.recentAlerts || []).length === 0 ? (
              <p className="text-sm text-gray-400">No active alerts</p>
            ) : (
              summary.recentAlerts.map((alert) => (
                <div
                  key={alert._id}
                  className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100"
                >
                  <div>
                    <p className="text-sm font-bold text-gray-900 capitalize">
                      {alert.parameter} — {alert.locationName || alert.locationId}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Value: {alert.measuredValue} | {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <StatusBadge status={alert.severity} />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-blue-600" />
            Monitoring Points
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(summary.monitoringPoints || []).map((point) => {
              const statusColor =
                point.waterStatus === 'Critical'
                  ? 'border-red-300 bg-red-50'
                  : point.waterStatus === 'Warning'
                    ? 'border-amber-300 bg-amber-50'
                    : 'border-emerald-300 bg-emerald-50';

              return (
                <div
                  key={point.deviceId}
                  className={`p-4 rounded-2xl border-2 ${statusColor}`}
                >
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
                    {point.type}
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{point.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge status={point.waterStatus} />
                    <StatusBadge status={point.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
