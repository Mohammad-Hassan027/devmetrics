import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import type { DevStats } from "../../types";
import { useChartSize } from "../../hooks/useChartSize";

interface DistributionPieChartProps {
  stats: DevStats;
}

interface PieDatum {
  name: string;
  value: number;
  color: string;
}

const RADIAN = Math.PI / 180;

// ── Custom label on slice ──────────────────────────────────────────────────────

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}

function CustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: CustomLabelProps) {
  if (percent < 0.05) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={700}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

// ── Custom tooltip ─────────────────────────────────────────────────────────────

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; payload: PieDatum }[];
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-surface-700 border border-white/10 rounded-xl px-4 py-2.5 shadow-xl text-sm">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="w-2.5 h-2.5 rounded-full"
          style={{ backgroundColor: d.payload.color }}
        />
        <p className="text-slate-300 font-medium">{d.name}</p>
      </div>
      <p className="text-white font-bold text-base pl-4">{d.value} problems</p>
    </div>
  );
}

// ── Skeleton ring ──────────────────────────────────────────────────────────────

function SkeletonRing() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 rounded-full border-8 border-surface-500/40 animate-pulse" />
        <div
          className="absolute inset-4 rounded-full border-8 border-surface-600/30 animate-pulse"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="absolute inset-8 rounded-full bg-surface-700/20 animate-pulse"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

const CHART_HEIGHT = 208; // px — h-52 equivalent

export default function DistributionPieChart({
  stats,
}: DistributionPieChartProps) {
  const lcData = stats.leetcode.data;
  const gfgData = stats.gfg.data;
  const isLoading =
    stats.leetcode.status === "loading" || stats.gfg.status === "loading";

  const { ref, width } = useChartSize();

  // Aggregate totals per difficulty across both platforms
  const easy =
    (lcData?.easySolved ?? 0) +
    (gfgData?.solvedStats.easy?.count ?? 0) +
    (gfgData?.solvedStats.school?.count ?? 0) +
    (gfgData?.solvedStats.basic?.count ?? 0);
  const medium =
    (lcData?.mediumSolved ?? 0) + (gfgData?.solvedStats.medium?.count ?? 0);
  const hard =
    (lcData?.hardSolved ?? 0) + (gfgData?.solvedStats.hard?.count ?? 0);
  const total = easy + medium + hard;

  const pieData: PieDatum[] = [
    { name: "Easy", value: easy, color: "#34d399" },
    { name: "Medium", value: medium, color: "#f59e0b" },
    { name: "Hard", value: hard, color: "#f87171" },
  ].filter((d) => d.value > 0);

  const hasData = total > 0;

  return (
    <div className="glass-card p-6 flex flex-col gap-5" id="chart-pie">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-white">
            Difficulty Distribution
          </h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Combined across all platforms
          </p>
        </div>
        <span className="badge bg-purple-900/40 text-purple-300 border border-purple-700/30 text-[10px]">
          Pie Chart
        </span>
      </div>

      {/* Chart — only mounts PieChart once px width is known */}
      <div
        ref={ref}
        style={{ width: "100%", height: CHART_HEIGHT, minWidth: 0 }}
      >
        {isLoading ? (
          <SkeletonRing />
        ) : !hasData ? (
          <EmptyPie />
        ) : width > 0 ? (
          <PieChart width={width} height={CHART_HEIGHT}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              labelLine={false}
              label={CustomLabel as never}
              animationBegin={0}
              animationDuration={800}
            >
              {pieData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.color}
                  fillOpacity={0.85}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, color: "#94a3b8" }}
            />
          </PieChart>
        ) : null}
      </div>

      {/* Totals row */}
      {hasData && !isLoading && (
        <div className="flex justify-center gap-6 text-center">
          <div>
            <p className="text-2xl font-extrabold text-white">{total}</p>
            <p className="text-slate-500 text-xs">Total Solved</p>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <p className="text-2xl font-extrabold text-green-400">{easy}</p>
            <p className="text-slate-500 text-xs">Easy</p>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <p className="text-2xl font-extrabold text-amber-400">{medium}</p>
            <p className="text-slate-500 text-xs">Medium</p>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <p className="text-2xl font-extrabold text-red-400">{hard}</p>
            <p className="text-slate-500 text-xs">Hard</p>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyPie() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-600">
      <svg
        className="w-8 h-8 opacity-40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v9l5.4 5.4" />
      </svg>
      <p className="text-xs">Solve problems to see distribution</p>
    </div>
  );
}
