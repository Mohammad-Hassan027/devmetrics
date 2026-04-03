import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";
import type { DevStats } from "../../types";
import { useChartSize } from "../../hooks/useChartSize";

interface ProblemsBarChartProps {
  stats: DevStats;
}

interface BarDatum {
  platform: string;
  solved: number;
  fill: string;
}

// ── Custom tooltip ────────────────────────────────────────────────────────────

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: BarDatum; value: number }[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-surface-700 border border-white/10 rounded-xl px-4 py-2.5 shadow-xl text-sm">
      <p className="text-slate-400 font-medium mb-1">{d.payload.platform}</p>
      <p className="text-white font-bold text-base">{d.value} solved</p>
    </div>
  );
}

// ── Skeleton bars ─────────────────────────────────────────────────────────────

function SkeletonBars() {
  const heights = [60, 90, 45, 70, 55, 80];
  return (
    <div className="flex items-end justify-around h-full gap-3 px-4">
      {heights.map((h, i) => (
        <div
          key={i}
          style={{ height: `${h}%` }}
          className="flex-1 bg-surface-500/40 rounded-t-lg animate-pulse"
        />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

const CHART_HEIGHT = 224; // px — h-56 equivalent

export default function ProblemsBarChart({ stats }: ProblemsBarChartProps) {
  const lcData = stats.leetcode.data;
  const gfgData = stats.gfg.data;
  const isLoading =
    stats.leetcode.status === "loading" || stats.gfg.status === "loading";
  const hasAny = lcData || gfgData;

  // Measure the container — only render Recharts once px width is known
  const { ref, width } = useChartSize();

  const chartData: BarDatum[] = [
    ...(lcData
      ? [
          { platform: "LC Easy", solved: lcData.easySolved, fill: "#34d399" },
          {
            platform: "LC Medium",
            solved: lcData.mediumSolved,
            fill: "#f59e0b",
          },
          { platform: "LC Hard", solved: lcData.hardSolved, fill: "#f87171" },
        ]
      : []),
    ...(gfgData
      ? ([
          gfgData.solvedStats.school && {
            platform: "GFG School",
            solved: gfgData.solvedStats.school.count,
            fill: "#a78bfa",
          },
          gfgData.solvedStats.basic && {
            platform: "GFG Basic",
            solved: gfgData.solvedStats.basic.count,
            fill: "#60a5fa",
          },
          gfgData.solvedStats.easy && {
            platform: "GFG Easy",
            solved: gfgData.solvedStats.easy.count,
            fill: "#34d399",
          },
          gfgData.solvedStats.medium && {
            platform: "GFG Medium",
            solved: gfgData.solvedStats.medium.count,
            fill: "#f59e0b",
          },
          gfgData.solvedStats.hard && {
            platform: "GFG Hard",
            solved: gfgData.solvedStats.hard.count,
            fill: "#f87171",
          },
        ].filter(Boolean) as BarDatum[])
      : []),
  ];

  return (
    <div className="glass-card p-6 flex flex-col gap-5" id="chart-bar">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Problems Solved</h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Breakdown by difficulty across platforms
          </p>
        </div>
        <span className="badge bg-brand-900/40 text-brand-300 border border-brand-700/30 text-[10px]">
          Bar Chart
        </span>
      </div>

      {/* Chart area — ref measures px width; charts only mount once width > 0 */}
      <div
        ref={ref}
        style={{ width: "100%", height: CHART_HEIGHT, minWidth: 0 }}
      >
        {isLoading ? (
          <SkeletonBars />
        ) : !hasAny ? (
          <EmptyChart message="No problem data available yet" />
        ) : width > 0 ? (
          <BarChart
            width={width}
            height={CHART_HEIGHT}
            data={chartData}
            barCategoryGap="30%"
            margin={{ top: 16, right: 4, left: -20, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="platform"
              tick={{ fill: "#64748b", fontSize: 11 }}
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
            <Bar dataKey="solved" radius={[6, 6, 0, 0]} maxBarSize={52}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.fill} fillOpacity={0.85} />
              ))}
              <LabelList
                dataKey="solved"
                position="top"
                style={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        ) : null}
      </div>

      {/* Legend dots */}
      {hasAny && !isLoading && (
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Easy", color: "#34d399" },
            { label: "Medium", color: "#f59e0b" },
            { label: "Hard", color: "#f87171" },
            { label: "School/Basic", color: "#a78bfa" },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-sm inline-block"
                style={{ backgroundColor: color }}
              />
              <span className="text-slate-500 text-xs">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-600">
      <svg
        className="w-8 h-8 opacity-40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
      <p className="text-xs">{message}</p>
    </div>
  );
}
