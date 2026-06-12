import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import type { DevStats } from "../../types";
import { useChartSize } from "../../hooks/useChartSize";

interface TechStackChartProps {
  stats: DevStats;
}

// ── Colour palette ─────────────────────────────────────────────────────────────
// Hand-picked to match real language brand colours where possible

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3776ab",
  Java: "#f89820",
  "C++": "#004482",
  C: "#a8b9cc",
  "C#": "#512bd4",
  Go: "#00add8",
  Rust: "#ce422b",
  Kotlin: "#7f52ff",
  Swift: "#f05138",
  Ruby: "#cc342d",
  PHP: "#777bb4",
  Dart: "#00b4ab",
  Shell: "#4eaa25",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Scala: "#dc322f",
  Elixir: "#6e4a7e",
  Haskell: "#5e5086",
  R: "#198ce7",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Jupyter: "#f37726",
};

const FALLBACK_COLORS = [
  "#60a5fa", "#a78bfa", "#34d399", "#f59e0b", "#f87171",
  "#38bdf8", "#fb923c", "#e879f9", "#4ade80", "#facc15",
];

function getColor(lang: string, index: number): string {
  return LANGUAGE_COLORS[lang] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

// ── Custom tooltip ─────────────────────────────────────────────────────────────

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
  payload: { percent: number };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const { name, value, payload: entry } = payload[0];
  return (
    <div className="bg-surface-700 border border-white/10 rounded-xl px-4 py-3 shadow-xl text-sm">
      <p className="font-semibold text-white mb-1">{name}</p>
      <p className="text-slate-400 text-xs">
        {value} repo{value !== 1 ? "s" : ""}
        <span className="text-slate-500 ml-2">
          ({(entry.percent * 100).toFixed(1)}%)
        </span>
      </p>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-40 h-40 rounded-full border-[16px] border-surface-600/60 animate-pulse" />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

const MAX_LANGUAGES = 8; // show at most 8 slices; group the rest as "Other"
const CHART_HEIGHT = 240;

export default function TechStackChart({ stats }: TechStackChartProps) {
  const { ref, width } = useChartSize();
  const ghData = stats.github.data;
  const isLoading = stats.github.status === "loading";

  // Sort languages by repo count and take top MAX_LANGUAGES
  const chartData = useMemo(() => {
    if (!ghData?.languages) return [];

    const sorted = Object.entries(ghData.languages)
      .sort(([, a], [, b]) => b - a);

    if (sorted.length <= MAX_LANGUAGES) {
      return sorted.map(([name, value], i) => ({ name, value, color: getColor(name, i) }));
    }

    const top = sorted.slice(0, MAX_LANGUAGES);
    const otherCount = sorted
      .slice(MAX_LANGUAGES)
      .reduce((sum, [, v]) => sum + v, 0);

    return [
      ...top.map(([name, value], i) => ({ name, value, color: getColor(name, i) })),
      { name: "Other", value: otherCount, color: "#475569" },
    ];
  }, [ghData?.languages]);

  const hasData = chartData.length > 0;

  return (
    <div className="glass-card p-6 flex flex-col gap-5" id="chart-tech-stack">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h3 className="text-base font-bold text-white">Tech Stack</h3>
          <p className="text-slate-500 text-xs mt-0.5">
            Language breakdown from your GitHub repos
          </p>
        </div>
        <span className="badge bg-cyan-900/30 text-cyan-300 border border-cyan-700/30 text-[10px]">
          From Repos
        </span>
      </div>

      {/* Donut chart */}
      <div ref={ref} style={{ width: "100%", height: CHART_HEIGHT, minWidth: 0 }}>
        {isLoading ? (
          <Skeleton />
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-600">
            <p className="text-xs text-center">
              {stats.github.data
                ? "No language data found in your repos"
                : "Connect GitHub to see your tech stack"}
            </p>
          </div>
        ) : width > 0 ? (
          <PieChart width={width} height={CHART_HEIGHT}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={105}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
              animationBegin={100}
              animationDuration={900}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} fillOpacity={0.88} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        ) : null}
      </div>

      {/* Legend */}
      {hasData && !isLoading && (
        <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1 border-t border-white/5">
          {chartData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-sm inline-block flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs text-slate-400 font-medium">
                {entry.name}
              </span>
              <span className="text-xs text-slate-600">{entry.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
