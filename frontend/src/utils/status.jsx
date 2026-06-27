export function StatusBadge({ status }) {
  const styles = {
    Safe: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    Critical: 'bg-red-50 text-red-700 border border-red-200',
    safe: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    critical: 'bg-red-50 text-red-700 border border-red-200',
    online: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    offline: 'bg-gray-50 text-gray-500 border border-gray-200',
    maintenance: 'bg-orange-50 text-orange-600 border border-orange-200',
    Resolved: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    Unresolved: 'bg-amber-50 text-amber-700 border border-amber-100',
  };

  const dotColor = ['Safe', 'safe', 'online', 'Resolved'].includes(status)
    ? 'bg-emerald-500'
    : ['Warning', 'warning', 'Unresolved'].includes(status)
      ? 'bg-amber-500'
      : ['Critical', 'critical'].includes(status)
        ? 'bg-red-500'
        : ['maintenance'].includes(status)
          ? 'bg-orange-500'
          : 'bg-gray-400';

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-gray-50 text-gray-600 border border-gray-200'
        }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
      {status}
    </span>
  );
}

export function ParameterStatus({ status }) {
  const colors = {
    safe: 'text-emerald-600 bg-emerald-50 border border-emerald-200',
    warning: 'text-amber-600 bg-amber-50 border border-amber-200',
    critical: 'text-red-600 bg-red-50 border border-red-200',
  };
  return (
    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${colors[status] || colors.safe}`}>
      {status}
    </span>
  );
}

export function getParameterStatus(value, parameter) {
  const checks = {
    ph: (v) => {
      if (v < 5 || v > 10) return 'critical';
      if (v < 6.5 || v > 8.5) return 'warning';
      return 'safe';
    },
    turbidity: (v) => {
      if (v > 10) return 'critical';
      if (v >= 4) return 'warning';
      return 'safe';
    },
    temperature: (v) => {
      if (v > 35 || v < 5) return 'critical';
      if (v > 25 || v < 10) return 'warning';
      return 'safe';
    },
    tds: (v) => {
      if (v > 1000) return 'critical';
      if (v > 500) return 'warning';
      return 'safe';
    },
  };
  return checks[parameter]?.(value) || 'safe';
}
