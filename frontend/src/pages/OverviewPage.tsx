import { useEffect, useState, useCallback } from 'react';
import { api } from '../api/client';
import { StatusBadge } from '../utils/status.jsx';
import {
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Activity,
  MapPin,
  Wifi,
  WifiOff,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── helpers ────────────────────────────────────────────────────────────────

function timeAgo(ts: string | null | undefined): string {
  if (!ts) return 'N/A';
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// Static severity bar colors — avoid Tailwind dynamic class purging
const SEVERITY_STYLES: Record<string, { bar: string; bg: string; text: string; border: string }> = {
  critical: { bar: '#EF4444', bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
  warning: { bar: '#F59E0B', bg: '#FFFBEB', text: '#92400E', border: '#FDE68A' },
  safe: { bar: '#10B981', bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' },
};

const STATUS_ICON = {
  Safe: ShieldCheck,
  Warning: ShieldAlert,
  Critical: ShieldX,
};

const BANNER_STYLES: Record<string, { gradient: string; shadow: string }> = {
  Safe: { gradient: 'linear-gradient(135deg,#059669,#10B981)', shadow: '0 8px 32px rgba(16,185,129,0.25)' },
  Warning: { gradient: 'linear-gradient(135deg,#D97706,#F59E0B)', shadow: '0 8px 32px rgba(245,158,11,0.25)' },
  Critical: { gradient: 'linear-gradient(135deg,#DC2626,#EF4444)', shadow: '0 8px 32px rgba(239,68,68,0.25)' },
};

// ─── sub-components ──────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, iconBg, iconColor, delay = 0,
}: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; iconBg: string; iconColor: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
          <Icon size={20} style={{ color: iconColor }} />
        </div>
      </div>
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-indigo-950 mt-0.5 leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

function AlertRow({ alert }: { alert: any }) {
  const s = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.safe;
  return (
    <div
      className="flex items-start justify-between gap-3 p-3.5 rounded-xl"
      style={{ backgroundColor: s.bg, borderLeft: `3px solid ${s.bar}` }}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-800 capitalize leading-snug">
          {alert.parameter?.toUpperCase()} — {alert.locationName || alert.locationId}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          Reading: <span className="font-medium" style={{ color: s.bar }}>{alert.measuredValue}</span>
          &ensp;·&ensp;{timeAgo(alert.timestamp)}
        </p>
      </div>
      <span
        className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 mt-0.5"
        style={{ backgroundColor: s.border, color: s.text }}
      >
        {alert.severity}
      </span>
    </div>
  );
}

function MonitoringCard({ point }: { point: any }) {
  const ws: string = point.waterStatus || 'Unknown';
  const isOnline = point.status === 'online';
  const wsStyle = SEVERITY_STYLES[ws.toLowerCase()] || { bar: '#9CA3AF', bg: '#F9FAFB', text: '#6B7280', border: '#E5E7EB' };

  return (
    <div className="p-4 rounded-xl border" style={{ backgroundColor: wsStyle.bg, borderColor: wsStyle.border }}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          {isOnline
            ? <Wifi size={13} className="text-emerald-500 flex-shrink-0" />
            : <WifiOff size={13} className="text-gray-400 flex-shrink-0" />}
          <p className="text-xs text-gray-500 capitalize">{point.type}</p>
        </div>
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: wsStyle.border, color: wsStyle.text }}
        >
          {ws}
        </span>
      </div>
      <p className="text-sm font-semibold text-gray-800 leading-snug">{point.name}</p>
      {point.location?.district && (
        <p className="text-xs text-gray-400 mt-0.5">{point.location.district}</p>
      )}
    </div>
  );
}

// ─── main page ───────────────────────────────────────────────────────────────

export function OverviewPage() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchSummary = useCallback(async (manual = false) => {
    if (manual) setRefreshing(true);
    try {
      const data = await api.getDashboardSummary();
      setSummary(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      if (manual) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
    const interval = setInterval(() => fetchSummary(), 15000);
    return () => clearInterval(interval);
  }, [fetchSummary]);

  // ── loading state ──
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading dashboard…</p>
      </div>
    );
  }

  // ── error state ──
  if (error && !summary) {
    return (
      <div className="card p-8 flex flex-col items-center gap-4 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
          <ShieldX size={24} className="text-red-500" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-800">Could not load dashboard</h3>
          <p className="text-sm text-gray-400 mt-1">{error}</p>
        </div>
        <button
          onClick={() => fetchSummary(true)}
          className="btn-primary flex items-center gap-2"
        >
          <RefreshCw size={14} />
          Retry
        </button>
      </div>
    );
  }

  // ── safe destructure with fallbacks ──
  const status: string = summary?.overallStatus || 'Safe';
  const bannerStyle = BANNER_STYLES[status] || BANNER_STYLES.Safe;
  const BannerIcon = STATUS_ICON[status as keyof typeof STATUS_ICON] || ShieldCheck;

  const totalDevices: number = summary?.totalDevices ?? 0;
  const activeDevices: number = summary?.activeDevices ?? 0;
  const totalAlerts: number = summary?.alertCounts?.total ?? 0;
  const criticalAlerts: number = summary?.alertCounts?.critical ?? 0;
  const warningAlerts: number = summary?.alertCounts?.warning ?? 0;
  const paramsInRange: number = summary?.parametersInRange ?? 0;
  const totalParams: number = summary?.totalParameters ?? 0;
  const lastUpdate: string | null = summary?.lastUpdate ?? null;
  const recentAlerts: any[] = summary?.recentAlerts ?? [];
  const monitoringPoints: any[] = summary?.monitoringPoints ?? [];

  const paramsDisplay = totalParams > 0 ? `${paramsInRange} / ${totalParams}` : '—';
  const deviceDisplay = `${activeDevices} / ${totalDevices}`;

  return (
    <div className="space-y-6">
      {/* Page title row */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-indigo-950">Overview</h1>
          <p className="text-sm text-gray-500 mt-0.5">Real-time water quality monitoring</p>
        </div>
        <button
          onClick={() => fetchSummary(true)}
          disabled={refreshing}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-indigo-600 transition-colors disabled:opacity-50"
          title="Refresh now"
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* ── Status banner ── */}
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: bannerStyle.gradient, boxShadow: bannerStyle.shadow }}
      >
        {/* Decorative circle */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -right-2 bottom-2 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium opacity-80 mb-1">Overall water safety status</p>
            <h2 className="text-4xl font-bold leading-tight">{status}</h2>
            {criticalAlerts > 0 && (
              <p className="text-sm opacity-80 mt-1">
                {criticalAlerts} critical alert{criticalAlerts !== 1 ? 's' : ''} require attention
              </p>
            )}
            {criticalAlerts === 0 && warningAlerts > 0 && (
              <p className="text-sm opacity-80 mt-1">
                {warningAlerts} warning{warningAlerts !== 1 ? 's' : ''} detected
              </p>
            )}
            {criticalAlerts === 0 && warningAlerts === 0 && (
              <p className="text-sm opacity-80 mt-1">All parameters within safe range</p>
            )}
          </div>
          <BannerIcon size={56} className="opacity-20 flex-shrink-0" />
        </div>
      </motion.div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Devices"
          value={deviceDisplay}
          sub={`${activeDevices} online`}
          icon={Activity}
          iconBg="#EEF2FF"
          iconColor="#4F46E5"
          delay={0.04}
        />
        <StatCard
          label="Active alerts"
          value={totalAlerts}
          sub={criticalAlerts > 0 ? `${criticalAlerts} critical` : 'None critical'}
          icon={AlertTriangle}
          iconBg="#FFFBEB"
          iconColor="#D97706"
          delay={0.08}
        />
        <StatCard
          label="Parameters in range"
          value={paramsDisplay}
          sub={totalParams > 0 ? `${Math.round((paramsInRange / totalParams) * 100)}% healthy` : 'No readings yet'}
          icon={CheckCircle2}
          iconBg="#ECFDF5"
          iconColor="#059669"
          delay={0.12}
        />
        <StatCard
          label="Last reading"
          value={lastUpdate ? new Date(lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
          sub={timeAgo(lastUpdate)}
          icon={Clock}
          iconBg="#F9FAFB"
          iconColor="#9CA3AF"
          delay={0.16}
        />
      </div>

      {/* ── Alert breakdown mini-bar ── */}
      {totalAlerts > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card p-4 flex items-center gap-4 flex-wrap"
        >
          <div className="flex items-center gap-2">
            <TrendingUp size={15} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-600">Alert breakdown:</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {criticalAlerts > 0 && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' }}>
                {criticalAlerts} Critical
              </span>
            )}
            {warningAlerts > 0 && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A' }}>
                {warningAlerts} Warning
              </span>
            )}
          </div>
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden min-w-[120px]">
            {criticalAlerts > 0 && (
              <div
                className="h-full rounded-full"
                style={{ width: `${(criticalAlerts / totalAlerts) * 100}%`, backgroundColor: '#EF4444', float: 'left' }}
              />
            )}
            {warningAlerts > 0 && (
              <div
                className="h-full rounded-full"
                style={{ width: `${(warningAlerts / totalAlerts) * 100}%`, backgroundColor: '#F59E0B', float: 'left' }}
              />
            )}
          </div>
        </motion.div>
      )}

      {/* ── Lower two-column section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent alerts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="card p-5 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={17} className="text-amber-500" />
              <h3 className="text-base font-semibold text-gray-800">Recent Alerts</h3>
            </div>
            {recentAlerts.length > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                {recentAlerts.length} unresolved
              </span>
            )}
          </div>

          <div className="space-y-2.5 flex-1">
            <AnimatePresence mode="popLayout">
              {recentAlerts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-10 gap-3"
                >
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                    <CheckCircle2 size={22} className="text-emerald-500" />
                  </div>
                  <p className="text-sm text-gray-400 text-center">No active alerts — all clear</p>
                </motion.div>
              ) : (
                recentAlerts.map((alert: any, i: number) => (
                  <motion.div
                    key={alert._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <AlertRow alert={alert} />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Monitoring points */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.27 }}
          className="card p-5 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin size={17} className="text-indigo-500" />
              <h3 className="text-base font-semibold text-gray-800">Monitoring Points</h3>
            </div>
            {monitoringPoints.length > 0 && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                {monitoringPoints.filter((p: any) => p.status === 'online').length} online
              </span>
            )}
          </div>

          {monitoringPoints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                <Droplets size={22} className="text-gray-300" />
              </div>
              <p className="text-sm text-gray-400">No monitoring points registered</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {monitoringPoints.map((point: any, i: number) => (
                <motion.div
                  key={point.deviceId}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.27 + i * 0.05 }}
                >
                  <MonitoringCard point={point} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

      </div>

      {/* Error banner if data is stale */}
      {error && summary && (
        <div className="card p-3 flex items-center gap-3 border-amber-200 bg-amber-50">
          <AlertTriangle size={15} className="text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-700 flex-1">
            Dashboard data may be stale — last refresh failed: {error}
          </p>
          <button onClick={() => fetchSummary(true)} className="text-xs font-semibold text-amber-700 hover:underline flex-shrink-0">
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
