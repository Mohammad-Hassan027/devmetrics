interface StatCardProps {
  label: string;
  value: number | string | null;
  icon: string;
  color: string;
  badge: string;
  loading?: boolean;
  index?: number;
}

export default function StatCard({
  label,
  value,
  icon,
  color,
  badge,
  loading = false,
  index = 0,
}: StatCardProps) {
  const isEmpty = value === null || value === undefined;
  const displayValue = isEmpty ? "—" : String(value);

  return (
    <div
      className="stat-card relative overflow-hidden animate-slide-up"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "both" }}
    >
      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} pointer-events-none rounded-2xl`}
      />

      <div className="relative">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <span
            aria-hidden="true"
            className="text-2xl leading-none select-none"
            role="img"
          >
            {icon}
          </span>
          <span className="badge bg-surface-500/60 text-slate-400 text-[10px]">
            {badge}
          </span>
        </div>

        {/* Value */}
        <div className="mt-4">
          {loading ? (
            /* Skeleton */
            <div className="space-y-2">
              <div className="h-8 w-20 bg-surface-500/50 rounded-lg animate-pulse" />
              <div className="h-3 w-28 bg-surface-500/30 rounded animate-pulse" />
            </div>
          ) : isEmpty ? (
            /* Empty / not requested */
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-surface-400 tracking-tight select-none">
                —
              </p>
              <p className="text-slate-600 text-xs">{label}</p>
            </div>
          ) : (
            /* Real data */
            <>
              <p className="text-3xl font-extrabold text-white tracking-tight">
                {displayValue}
              </p>
              <p className="text-slate-500 text-xs mt-1">{label}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
