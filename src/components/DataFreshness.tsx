import { useEffect, useState } from "react";
import { formatTimeAgo, formatDateTime } from "../utils/formatTime";
import { useDevMetrics } from "../context/DevMetricsContext";

export default function DataFreshness() {
  const { stats, overallStatus } = useDevMetrics();
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    // Update timestamp when data successfully loads
    if (overallStatus === "success" || overallStatus === "partial") {
      setLastUpdated(new Date());
    }
  }, [overallStatus, stats]);

  if (!lastUpdated) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-400 transition-colors cursor-help group relative">
      <svg
        className="w-3.5 h-3.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span>Updated {formatTimeAgo(lastUpdated)}</span>

      {/* Tooltip */}
      <div className="hidden group-hover:block absolute bottom-full mb-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs whitespace-nowrap z-10">
        {formatDateTime(lastUpdated)}
      </div>
    </div>
  );
}
