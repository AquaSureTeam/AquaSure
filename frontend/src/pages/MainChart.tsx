import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface MainChartProps {
  timePeriod: "24H" | "7D" | "30D";
  onTimePeriodChange: (period: "24H" | "7D" | "30D") => void;
}

const generate24HData = () => [
  { time: "00:00", ph: 7.2, temp: 22, turbidity: 1.8, conductivity: 450 },
  { time: "04:00", ph: 7.3, temp: 21.5, turbidity: 1.9, conductivity: 455 },
  { time: "08:00", ph: 7.1, temp: 23, turbidity: 2.1, conductivity: 460 },
  { time: "12:00", ph: 7.4, temp: 24, turbidity: 2.3, conductivity: 470 },
  { time: "16:00", ph: 7.2, temp: 25, turbidity: 2.8, conductivity: 465 },
  { time: "20:00", ph: 7.3, temp: 23.5, turbidity: 2.5, conductivity: 458 },
  { time: "24:00", ph: 7.2, temp: 22, turbidity: 2.0, conductivity: 452 },
];

const generate7DData = () => [
  { time: "Mon", ph: 7.2, temp: 22.5, turbidity: 2.0, conductivity: 455 },
  { time: "Tue", ph: 7.3, temp: 23.0, turbidity: 2.2, conductivity: 460 },
  { time: "Wed", ph: 7.1, temp: 23.5, turbidity: 2.4, conductivity: 465 },
  { time: "Thu", ph: 7.4, temp: 24.0, turbidity: 2.6, conductivity: 470 },
  { time: "Fri", ph: 7.2, temp: 24.5, turbidity: 2.8, conductivity: 468 },
  { time: "Sat", ph: 7.3, temp: 23.5, turbidity: 2.5, conductivity: 462 },
  { time: "Sun", ph: 7.2, temp: 22.8, turbidity: 2.1, conductivity: 456 },
];

const generate30DData = () => [
  { time: "Week 1", ph: 7.2, temp: 22.0, turbidity: 2.0, conductivity: 450 },
  { time: "Week 2", ph: 7.3, temp: 23.5, turbidity: 2.3, conductivity: 460 },
  { time: "Week 3", ph: 7.1, temp: 24.0, turbidity: 2.5, conductivity: 468 },
  { time: "Week 4", ph: 7.4, temp: 23.0, turbidity: 2.2, conductivity: 455 },
];

export function MainChart({ timePeriod, onTimePeriodChange }: MainChartProps) {
  const getData = () => {
    switch (timePeriod) {
      case "24H":
        return generate24HData();
      case "7D":
        return generate7DData();
      case "30D":
        return generate30DData();
      default:
        return generate24HData();
    }
  };

  const waterQualityData = getData();

  return (
    <div className="glass rounded-[2.5rem] p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            {timePeriod === "24H" ? "24-Hour" : timePeriod === "7D" ? "7-Day" : "30-Day"} <span className="text-blue-600">Water Quality Trends</span>
          </h2>
          <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Real-time monitoring telemetry</p>
        </div>
        <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
          {(["24H", "7D", "30D"] as const).map((period) => (
            <button 
              key={period}
              onClick={() => onTimePeriodChange(period)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${
                timePeriod === period 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                  : "text-gray-400 hover:text-gray-600 hover:bg-white"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={waterQualityData}>
            <defs>
              <linearGradient id="colorPh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="time" stroke="#94a3b8" style={{ fontSize: 10, fontWeight: "bold" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" stroke="#94a3b8" style={{ fontSize: 10, fontWeight: "bold" }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" style={{ fontSize: 10, fontWeight: "bold" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: "none",
                borderRadius: "16px",
                boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                padding: "12px",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "11px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }} />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="ph"
              stroke="#2563eb"
              strokeWidth={4}
              fill="url(#colorPh)"
              name="pH Level"
            />
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="temp"
              stroke="#60a5fa"
              strokeWidth={3}
              fill="url(#colorTemp)"
              name="Temperature (°C)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}