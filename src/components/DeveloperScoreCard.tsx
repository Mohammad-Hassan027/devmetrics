import { useMemo } from "react";
import { useDevMetrics } from "../context/DevMetricsContext";
import { computeScore } from "../utils/scoreEngine";

export default function DeveloperScoreCard() {
  const { stats, hasData, isLoading } = useDevMetrics();

  const score = useMemo(
    () => computeScore(stats.github.data, stats.leetcode.data, stats.gfg.data),
    [stats.github.data, stats.leetcode.data, stats.gfg.data],
  );

  const { badge, total, progressToNext, nextTier, pointsToNext } = score;

  if (isLoading) return <ScoreSkeleton />;
  if (!hasData) return null;

  return (
    <div
      id="developer-score-card"
      className={`glass-card p-6 border ${badge.border} shadow-xl ${badge.glow} relative overflow-hidden`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${badge.bg} pointer-events-none`}
      />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl
                        bg-surface-800/80 border ${badge.border} shadow-inner`}
            role="img"
            aria-label={`${badge.tier} badge`}
          >
            {badge.emoji}
          </div>
          <span
            className={`text-xs font-bold uppercase tracking-widest ${badge.color}`}
          >
            {badge.tier}
          </span>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-end gap-3 flex-wrap">
            <span
              className={`text-5xl font-extrabold tracking-tight ${badge.color}`}
            >
              {total.toLocaleString()}
            </span>
            <span className="text-slate-500 text-sm pb-1.5">
              developer score
            </span>
          </div>

          <p className="text-slate-400 text-sm leading-relaxed">
            {badge.description}
          </p>

          {nextTier && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Progress to <span className={badge.color}>{nextTier}</span>
                </span>
                <span className="text-slate-500">
                  {pointsToNext !== null &&
                    `${pointsToNext.toLocaleString()} pts to go`}
                </span>
              </div>
              <div className="h-2 bg-surface-600/60 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ease-out`}
                  style={{
                    width: `${progressToNext}%`,
                    background: `linear-gradient(90deg, rgba(99,102,241,0.9), rgba(168,85,247,0.9))`,
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            {score.github > 0 && (
              <SubScore
                label="GitHub"
                pts={score.github}
                color="bg-slate-700/60  text-slate-300  border-slate-600/50"
              />
            )}
            {score.leetcode > 0 && (
              <SubScore
                label="LeetCode"
                pts={score.leetcode}
                color="bg-yellow-900/30 text-yellow-300 border-yellow-700/40"
              />
            )}
            {score.gfg > 0 && (
              <SubScore
                label="GFG"
                pts={score.gfg}
                color="bg-green-900/30  text-green-300  border-green-700/40"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SubScore({
  label,
  pts,
  color,
}: {
  label: string;
  pts: number;
  color: string;
}) {
  return (
    <div className={`badge border ${color} gap-1`}>
      <span className="font-semibold">{label}</span>
      <span className="opacity-60">·</span>
      <span className="font-bold">{pts.toLocaleString()} pts</span>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function ScoreSkeleton() {
  return (
    <div className="glass-card p-6 flex items-center gap-6">
      <div className="w-20 h-20 bg-surface-600/50 rounded-2xl animate-pulse shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-10 w-32 bg-surface-600/50 rounded-xl animate-pulse" />
        <div className="h-4 w-64 bg-surface-500/40 rounded animate-pulse" />
        <div className="h-2 w-full bg-surface-600/40 rounded-full animate-pulse" />
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-surface-600/40 rounded-lg animate-pulse" />
          <div className="h-6 w-24 bg-surface-600/40 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
