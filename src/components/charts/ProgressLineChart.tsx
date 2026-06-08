import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import { useChartSize } from "../../hooks/useChartSize";

// ── Placeholder data ───────────────────────────────────────────────────────────

const WEEKS = [
  "W1",
  "W2",
  "W3",
  "W4",
  "W5",
  "W6",
  "W7",
  "W8",
  "W9",
  "W10",
  "W11",
  "W12",
];

const PLACEHOLDER_DATA = WEEKS.map((week, i) => ({
  week,
  github: Math.round(20 + Math.sin(i * 0.6) * 8 + i * 2),
  leetcode: Math.round(5 + i * 1.5 + Math.sin(i * 1.2) * 2),
  gfg: Math.round(8 + i + Math.sin(i * 0.9) * 4),
}));

// ── Custom tooltip ─────────────────────────────────────────────────────────────

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-700 border border-white/10 rounded-xl px-4 py-3 shadow-xl text-sm min-w-[140px]">
      <p className="text-slate-400 font-semibold mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-slate-400 text-xs capitalize">{p.name}</span>
          </div>
          <span className="text-white font-bold text-xs">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

const CHART_HEIGHT = 256; // px — h-64 equivalent

interface ProgressLineChartProps {
  hasData?: boolean;
}

export default function ProgressLineChart({ hasData = true }: ProgressLineChartProps) {
  const { ref, width } = useChartSize();

  if (!hasData) {
    return (
      <div className="glass-card p-6 flex flex-col gap-5 col-span-full">
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-500 text-sm">Chart will appear once data is available</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass-card p-6 flex flex-col gap-5 col-span-full"
      id="chart-line"
    >
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base font-bold text-white">Progress Over Time</h3>
          <p className="text-slate-500 text-xs mt-0.5">
            12-week rolling activity — live data coming soon
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge bg-orange-900/30 text-orange-300 border border-orange-700/30 text-[10px]">
            Placeholder
          </span>
          <span className="badge bg-emerald-900/30 text-emerald-300 border border-emerald-700/30 text-[10px]">
            Area Chart
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {[
          { key: "github", label: "GitHub Commits", color: "#60a5fa" },
          { key: "leetcode", label: "LeetCode Solves", color: "#f59e0b" },
          { key: "gfg", label: "GFG Problems", color: "#34d399" },
        ].map(({ key, label, color }) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className="w-8 h-0.5 rounded-full inline-block"
              style={{ backgroundColor: color }}
            />
            <span className="text-slate-500 text-xs">{label}</span>
          </div>
        ))}
      </div>

      {/* Chart — only mounts AreaChart once px width is known */}
      <div
        ref={ref}
        style={{ width: "100%", height: CHART_HEIGHT, minWidth: 0 }}
      >
        {width > 0 && (
          <AreaChart
            width={width}
            height={CHART_HEIGHT}
            data={PLACEHOLDER_DATA}
            margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorGithub" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="colorLeetcode" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="colorGfg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0.01} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />

            <ReferenceLine
              x="W12"
              stroke="rgba(255,255,255,0.1)"
              strokeDasharray="4 4"
              label={{
                value: "Now",
                fill: "#475569",
                fontSize: 10,
                position: "insideTopRight",
              }}
            />

            <Area
              type="monotone"
              dataKey="github"
              stroke="#60a5fa"
              strokeWidth={2}
              fill="url(#colorGithub)"
              dot={false}
              activeDot={{ r: 4, fill: "#60a5fa", strokeWidth: 0 }}
              animationDuration={1000}
            />
            <Area
              type="monotone"
              dataKey="leetcode"
              stroke="#f59e0b"
              strokeWidth={2}
              fill="url(#colorLeetcode)"
              dot={false}
              activeDot={{ r: 4, fill: "#f59e0b", strokeWidth: 0 }}
              animationDuration={1200}
            />
            <Area
              type="monotone"
              dataKey="gfg"
              stroke="#34d399"
              strokeWidth={2}
              fill="url(#colorGfg)"
              dot={false}
              activeDot={{ r: 4, fill: "#34d399", strokeWidth: 0 }}
              animationDuration={1400}
            />
          </AreaChart>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 pt-1 border-t border-white/5">
        <svg
          className="w-3.5 h-3.5 text-slate-600 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 8v4l3 3" />
        </svg>
        <p className="text-slate-600 text-xs">
          Real time-series data will populate once GitHub commit history API is
          integrated.
        </p>
      </div>
    </div>
  );
}
