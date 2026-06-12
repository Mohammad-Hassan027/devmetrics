import type { DevStats } from "../../types";
import ProblemsBarChart from "./ProblemsBarChart";
import DistributionPieChart from "./DistributionPieChart";
import DifficultyBreakdownChart from "./DifficultyBreakdownChart";
import TechStackChart from "./TechStackChart";

interface ChartsSectionProps {
  stats: DevStats;
}

export default function ChartsSection({ stats }: ChartsSectionProps) {
  return (
    <section id="section-charts" className="space-y-4 animate-slide-up">
      {/* Section heading */}
      <div className="flex items-center gap-3 pl-4 border-l-2 border-l-purple-500">
        <div className="p-1.5 rounded-lg bg-surface-600/50">
          <svg
            className="w-5 h-5 text-purple-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-bold text-white leading-tight">
            Analytics
          </h3>
          <p className="text-slate-500 text-xs">
            Visual breakdown of your coding activity
          </p>
        </div>
      </div>

      {/* Top row: bar + pie side by side on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="min-w-0">
          <ProblemsBarChart stats={stats} />
        </div>
        <div className="min-w-0">
          <DistributionPieChart stats={stats} />
        </div>
      </div>

      {/* Bottom row: difficulty breakdown (full-width grouped bar) + tech stack donut */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="min-w-0 md:col-span-1">
          <DifficultyBreakdownChart stats={stats} />
        </div>
        <div className="min-w-0">
          <TechStackChart stats={stats} />
        </div>
      </div>
    </section>
  );
}
