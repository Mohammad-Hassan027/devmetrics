import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { DevStats } from "../../types";
import { useChartSize } from "../../hooks/useChartSize";

interface DifficultyBreakdownChartProps {
  stats: DevStats;
}

// ── Custom tooltip ────────────────────────────────────────────────────────────

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-700 border border-white/10 rounded-xl px-4 py-3 shadow-xl text-sm min-w-[150px]">
      <p className="text-slate-400 font-semibold mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-sm inline-block"
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

// ── Skeleton bars ─────────────────────────────────────────────────────────────

function SkeletonBars() {
  const heights = [55, 80, 40, 65, 50, 75];
  return (
    <div className="flex items-end justify-around h-full gap-3 px-4">
      {heights.map((h, i) => (
        <div
          key={i}
          style={{ height: `${h}%` }}
          className="flex-1 rounded-t-lg bg-surface-500/40 animate-pulse"
        />
      ))}
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

const CHART_HEIGHT = 256;

const DIFFICULTY_COLORS = {
  Easy: "#34d399",
  Medium: "#f59e0b",
  Hard: "#f87171",
};

export default function DifficultyBreakdownChart({
  stats,
}: DifficultyBreakdownChartProps) {
  const { ref, width } = useChartSize();
  const lcData = stats.leetcode.data;
  const gfgData = stats.gfg.data;
  const gfgSolved = gfgData?.solvedStats;

  const isLoading =
    stats.leetcode.status === "loading" || stats.gfg.status === "loading";
  const hasAny = lcData || gfgData;

  // Build one row per platform that has data
  const chartData: { platform: string; Easy: number; Medium: number; Hard: number }[] = [];

  if (lcData) {
    chartData.push({
      platform: "LeetCode",
      Easy: lcData.easySolved,
      Medium: lcData.mediumSolved,
      Hard: lcData.hardSolved,
    });
  }

  if (gfgData && gfgSolved) {
    chartData.push({
      platform: "GeeksforGeeks",
      Easy: (gfgSolved.easy?.count ?? 0) + (gfgSolved.basic?.count ?? 0) + (gfgSolved.school?.count ?? 0),
      Medium: gfgSolved.medium?.count ?? 0,
      Hard: gfgSolved.hard?.count ?? 0,
    });
  }

  return (
    <div className="glass-card p-6 flex flex-col gap-5 col-span-full" id="chart-difficulty">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base font-bold text-white">
            Difficulty Breakdown by Platform
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Easy / Medium / Hard problems solved across LeetCode & GFG
          </p>
        </div>
        <span className="badge bg-purple-900/30 text-purple-300 border border-purple-700/30 text-[10px]">
          Grouped Bar
        </span>
      </div>

      {/* Chart area */}
      <div ref={ref} style={{ width: "100%", height: CHART_HEIGHT, minWidth: 0 }}>
        {isLoading ? (
          <SkeletonBars />
        ) : !hasAny ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-600">
            <p className="text-xs">Connect LeetCode or GFG to see your difficulty breakdown</p>
          </div>
        ) : width > 0 ? (
          <BarChart
            width={width}
            height={CHART_HEIGHT}
            data={chartData}
            barCategoryGap="35%"
            barGap={4}
            margin={{ top: 16, right: 8, left: -20, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="platform"
              tick={{ fill: "#64748b", fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(255,255,255,0.03)" }}
            />
            <Bar
              dataKey="Easy"
              fill={DIFFICULTY_COLORS.Easy}
              fillOpacity={0.85}
              radius={[5, 5, 0, 0]}
              maxBarSize={52}
            />
            <Bar
              dataKey="Medium"
              fill={DIFFICULTY_COLORS.Medium}
              fillOpacity={0.85}
              radius={[5, 5, 0, 0]}
              maxBarSize={52}
            />
            <Bar
              dataKey="Hard"
              fill={DIFFICULTY_COLORS.Hard}
              fillOpacity={0.85}
              radius={[5, 5, 0, 0]}
              maxBarSize={52}
            />
          </BarChart>
        ) : null}
      </div>

      {/* Legend */}
      {hasAny && !isLoading && (
        <div className="flex flex-wrap gap-3 pt-1 border-t border-white/5">
          {Object.entries(DIFFICULTY_COLORS).map(([label, color]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-sm inline-block"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
