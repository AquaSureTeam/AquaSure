import { LucideIcon } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

interface SensorCardProps {
  title: string;
  value: string | number;
  unit: string;
  status: "normal" | "warning" | "critical";
  icon: LucideIcon;
  data: Array<{ value: number }>;
  min: number;
  max: number;
  optimal: string;
}

export function SensorCard({ title, value, unit, status, icon: Icon, data, min, max, optimal }: SensorCardProps) {
  const statusColors = {
    normal: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100", accent: "bg-blue-600" },
    warning: { bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100", accent: "bg-amber-600" },
    critical: { bg: "bg-red-50", text: "text-red-600", border: "border-red-100", accent: "bg-red-600" },
  };

  const statusLabels = {
    normal: "Optimal",
    warning: "Warning",
    critical: "Critical",
  };

  const colors = statusColors[status];

  return (
    <div className="glass rounded-[2rem] p-6 group hover:border-blue-400 transition-all duration-500 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 ${colors.bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
            <Icon size={28} className={colors.text} />
          </div>
          <div>
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">{title}</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black text-gray-900 tracking-tighter leading-none">{value}</span>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{unit}</span>
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${colors.border} ${colors.bg} ${colors.text} shadow-sm`}>
          {statusLabels[status]}
        </div>
      </div>

      {/* Mini Chart */}
      <div className="h-16 mb-6 w-full opacity-60 group-hover:opacity-100 transition-opacity">
        <ResponsiveContainer width="100%" height={64}>
          <LineChart data={data}>
            <YAxis domain={[min, max]} hide />
            <Line
              type="monotone"
              dataKey="value"
              stroke={status === "normal" ? "#2563eb" : status === "warning" ? "#d97706" : "#dc2626"}
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Bar */}
      <div className="space-y-3">
        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-1000 ${colors.accent}`}
            style={{ width: `${((Number(value) - min) / (max - min)) * 100}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Threshold</span>
            <span className="text-xs font-bold text-gray-500">{min} - {max}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">Recommended</span>
            <span className="text-xs font-bold text-blue-600">{optimal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}