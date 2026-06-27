import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { StatusBadge } from '../utils/status.jsx';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, ChevronUp, ShieldCheck, Bell, X, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotifyPanelProps {
  alert: any;
  onClose: () => void;
}

function NotifyPanel({ alert, onClose }: NotifyPanelProps) {
  const defaultMsg = `Water quality issue detected at ${alert.locationName || alert.locationId}: ${alert.parameter} reading of ${alert.measuredValue} exceeds safe threshold (${alert.safeRange}). ${alert.remediation || ''}`;
  const [message, setMessage] = useState(defaultMsg);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const handleSend = async () => {
    setSending(true);
    setResult(null);
    const payload = {
      message,
      linkedAlertId: alert._id,
      linkedParameter: alert.parameter,
      type: 'CONTAMINATION_WARNING',
      status: 'sent',
      zone: { zoneId: 'ZONE-GENERAL', name: 'All Zones' },
    };
    try {
      await api.sendNotification(payload);
      setResult({ ok: true, text: 'Notification sent successfully.' });
    } catch (err: any) {
      if (err.status === 404) {
        setResult({
          ok: false,
          text: 'Notification system coming soon — backend endpoint not yet configured.',
        });
      } else {
        setResult({ ok: false, text: err.message || 'Failed to send notification.' });
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative card w-full max-w-lg p-6 z-10"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Bell size={18} className="text-indigo-500" />
            Send Notification
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-2">Message to send to all zones</p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-indigo-400 resize-none"
        />

        {result && (
          <div
            className={`mt-3 p-3 rounded-xl text-sm flex items-start gap-2 ${result.ok
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
          >
            {result.ok ? <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0" /> : null}
            {result.text}
          </div>
        )}

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Bell size={15} />
            {sending ? 'Sending...' : 'Send Notification'}
          </button>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export function AlertsPage() {
  const { isAdmin } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [notifyAlert, setNotifyAlert] = useState<any | null>(null);
  const [filters, setFilters] = useState({
    severity: '',
    resolved: '',
    startDate: '',
    endDate: '',
  });

  const fetchAlerts = async () => {
    try {
      const params: Record<string, string> = {};
      if (filters.severity) params.severity = filters.severity;
      if (filters.resolved !== '') params.resolved = filters.resolved;
      if (filters.startDate) params.startDate = new Date(filters.startDate).toISOString();
      if (filters.endDate)
        params.endDate = new Date(`${filters.endDate}T23:59:59`).toISOString();

      const data = await api.getAlerts(params);
      setAlerts(data.alerts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [filters]);

  const handleResolve = async (id: string) => {
    try {
      await api.resolveAlert(id);
      fetchAlerts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-indigo-950">Alerts</h1>
        <p className="text-sm text-gray-500 mt-0.5">Contamination events and remediation guidance</p>
      </div>

      {/* Filter bar */}
      <div className="card p-4 flex flex-wrap gap-3 items-center">
        <select
          value={filters.severity}
          onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400"
        >
          <option value="">All severities</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
        <select
          value={filters.resolved}
          onChange={(e) => setFilters({ ...filters, resolved: e.target.value })}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-700 outline-none focus:border-indigo-400"
        >
          <option value="">All status</option>
          <option value="false">Unresolved</option>
          <option value="true">Resolved</option>
        </select>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-400"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-indigo-400"
        />
      </div>

      {/* Alert list */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No alerts found</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {alerts.map((alert) => {
              const isExpanded = expandedId === alert._id;
              return (
                <div key={alert._id} className="hover:bg-gray-50/50 transition-colors">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : alert._id)}
                    className="w-full px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-left"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-1">
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-0.5">Location</p>
                        <p className="text-sm font-semibold text-gray-800">
                          {alert.locationName || alert.locationId}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-0.5">Parameter</p>
                        <p className="text-sm font-semibold text-gray-800 capitalize">
                          {alert.parameter}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-0.5">Reading</p>
                        <p className="text-sm font-semibold text-gray-800">{alert.measuredValue}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-0.5">Severity</p>
                        <StatusBadge status={alert.severity} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-400 mb-0.5">Time</p>
                        <p className="text-sm text-gray-600">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <StatusBadge status={alert.resolved ? 'Resolved' : 'Unresolved'} />
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mx-5 mb-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Triggering reading</p>
                              <p className="text-sm text-gray-700">
                                pH: {alert.reading?.ph} &nbsp;|&nbsp; Turbidity:{' '}
                                {alert.reading?.turbidity} NTU &nbsp;|&nbsp; Temp:{' '}
                                {alert.reading?.temperature}°C &nbsp;|&nbsp; TDS:{' '}
                                {alert.reading?.tds} mg/L
                              </p>
                              {alert.reading?.timestamp && (
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(alert.reading.timestamp).toLocaleString()}
                                </p>
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 mb-1">Safe threshold</p>
                              <p className="text-sm font-semibold text-gray-800">{alert.safeRange}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-gray-500 mb-2 flex items-center gap-1.5">
                              <ShieldCheck size={13} />
                              Recommended remediation
                            </p>
                            <p className="text-sm text-gray-700 leading-relaxed bg-white p-4 rounded-xl border border-gray-100">
                              {alert.remediation || 'No remediation guidance available.'}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            {isAdmin && !alert.resolved && (
                              <button
                                onClick={() => handleResolve(alert._id)}
                                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                              >
                                Mark as resolved
                              </button>
                            )}
                            {isAdmin && (
                              <button
                                onClick={() => setNotifyAlert(alert)}
                                className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                              >
                                <Bell size={15} />
                                Notify users
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AnimatePresence>
        {notifyAlert && (
          <NotifyPanel alert={notifyAlert} onClose={() => setNotifyAlert(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
