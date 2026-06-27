import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { StatusBadge } from '../utils/status.jsx';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export function AlertsPage() {
  const { isAdmin } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [filters, setFilters] = useState({
    severity: '',
    resolved: '',
    startDate: '',
    endDate: '',
  });

  const fetchAlerts = async () => {
    try {
      const params = {};
      if (filters.severity) params.severity = filters.severity;
      if (filters.resolved !== '') params.resolved = filters.resolved;
      if (filters.startDate) params.startDate = new Date(filters.startDate).toISOString();
      if (filters.endDate) params.endDate = new Date(`${filters.endDate}T23:59:59`).toISOString();

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

  const handleResolve = async (id) => {
    try {
      await api.resolveAlert(id);
      fetchAlerts();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Alerts</h1>
        <p className="text-sm text-gray-500 mt-1">Contamination events and remediation guidance</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-gray-100 flex flex-wrap gap-4">
        <select
          value={filters.severity}
          onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold"
        >
          <option value="">All Severities</option>
          <option value="warning">Warning</option>
          <option value="critical">Critical</option>
        </select>
        <select
          value={filters.resolved}
          onChange={(e) => setFilters({ ...filters, resolved: e.target.value })}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold"
        >
          <option value="">All Status</option>
          <option value="false">Unresolved</option>
          <option value="true">Resolved</option>
        </select>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm"
        />
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading alerts...</div>
        ) : alerts.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No alerts found</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {alerts.map((alert) => {
              const isExpanded = expandedId === alert._id;
              return (
                <div key={alert._id} className="p-4 md:p-6">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : alert._id)}
                    className="w-full flex flex-col md:flex-row md:items-center justify-between gap-3 text-left"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 flex-1">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Location</p>
                        <p className="text-sm font-bold text-gray-900">
                          {alert.locationName || alert.locationId}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Parameter</p>
                        <p className="text-sm font-bold text-gray-900 capitalize">{alert.parameter}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Value</p>
                        <p className="text-sm font-bold text-gray-900">{alert.measuredValue}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Severity</p>
                        <StatusBadge status={alert.severity} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Time</p>
                        <p className="text-sm font-bold text-gray-900">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={alert.resolved ? 'Resolved' : 'Unresolved'} />
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="mt-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
                            Triggering Reading
                          </p>
                          <p className="text-sm text-gray-700">
                            pH: {alert.reading?.ph} | Turbidity: {alert.reading?.turbidity} NTU |
                            Temp: {alert.reading?.temperature}°C | TDS: {alert.reading?.tds} mg/L
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {alert.reading?.timestamp &&
                              new Date(alert.reading.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
                            Safe Threshold
                          </p>
                          <p className="text-sm font-bold text-gray-900">{alert.safeRange}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2 flex items-center gap-2">
                          <ShieldCheck size={14} />
                          Recommended Remediation
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed bg-white p-4 rounded-xl border border-gray-100">
                          {alert.remediation}
                        </p>
                      </div>

                      {isAdmin && !alert.resolved && (
                        <button
                          onClick={() => handleResolve(alert._id)}
                          className="bg-emerald-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700"
                        >
                          Mark as Resolved
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
