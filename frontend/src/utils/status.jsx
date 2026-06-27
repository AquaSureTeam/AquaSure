export function StatusBadge({ status }) {
  const styles = {
    Safe: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Warning: 'bg-amber-100 text-amber-700 border-amber-200',
    Critical: 'bg-red-100 text-red-700 border-red-200',
    safe: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    critical: 'bg-red-100 text-red-700 border-red-200',
    online: 'bg-emerald-100 text-emerald-700',
    offline: 'bg-gray-100 text-gray-600',
    Resolved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Unresolved: 'bg-amber-100 text-amber-700 border-amber-200',
  };

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
        styles[status] || 'bg-gray-100 text-gray-600'
      }`}
    >
      {status}
    </span>
  );
}

export function ParameterStatus({ status }) {
  const colors = {
    safe: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    warning: 'text-amber-600 bg-amber-50 border-amber-200',
    critical: 'text-red-600 bg-red-50 border-red-200',
  };

  return (
    <span
      className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${
        colors[status] || colors.safe
      }`}
    >
      {status}
    </span>
  );
}

export function getParameterStatus(value, parameter) {
  const checks = {
    ph: (v) => {
      if (v < 5 || v > 10) return 'critical';
      if (v < 6 || v > 9 || v < 6.5 || v > 8.5) return 'warning';
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
