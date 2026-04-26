import { useMemo, useRef, useState } from "react";
import { useDevMetrics } from "../context/DevMetricsContext";
import { computeScore } from "../utils/scoreEngine";
import { Skeleton } from "./Skeleton";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { cn } from "../utils/cn";

export default function DeveloperScoreCard() {
  const { stats, hasData, isLoading } = useDevMetrics();
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const score = useMemo(
    () => computeScore(stats.github.data, stats.leetcode.data, stats.gfg.data),
    [stats.github.data, stats.leetcode.data, stats.gfg.data],
  );

  const { badge, total, progressToNext, nextTier, pointsToNext } = score;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  if (isLoading) return <ScoreSkeleton />;
  if (!hasData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn(
        "relative overflow-hidden rounded-[2.5rem] p-12 transition-all duration-700",
        "bg-surface-800 border border-white/[0.03] ring-1 ring-white/5 shadow-2xl",
        "group hover:border-white/10 hover:ring-white/10",
      )}
    >
      {/* Dynamic Glow Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 rounded-[2.5rem]"
        style={{
          opacity,
          background: `radial-gradient(1000px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.03), transparent 40%)`,
        }}
      />

      {/* Static Subdued Gradient Background */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-30 pointer-events-none transition-opacity duration-700 group-hover:opacity-40",
          badge.bg,
        )}
      />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-12">
        {/* Left Section: Score & Identity */}
        <div className="space-y-8 flex-1">
          <div className="flex items-center gap-6">
            <div
              className={cn(
                "w-20 h-20 rounded-[2rem] flex items-center justify-center",
                "bg-surface-900 border shadow-2xl transition-all group-hover:scale-105 duration-700",
                badge.border,
              )}
              role="img"
            >
              <Trophy className={cn("w-8 h-8", badge.color)} />
            </div>
            <div>
              <span
                className={cn(
                  "text-[10px] font-bold uppercase tracking-[0.3em] mb-1 block",
                  badge.color,
                )}
              >
                {badge.tier}
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Global Standing
              </h3>
            </div>
          </div>

          <div className="flex items-baseline gap-4">
            <span
              className={cn(
                "text-7xl md:text-8xl font-medium tracking-tighter leading-none transition-all duration-700",
                "group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-500",
                badge.color,
              )}
            >
              {total.toLocaleString()}
            </span>
            <span className="text-slate-500 text-xs font-bold tracking-[0.25em] uppercase pb-3">
              Impact Score
            </span>
          </div>

          <p className="text-slate-400 text-lg leading-relaxed max-w-xl font-medium">
            {badge.description}
          </p>
        </div>

        {/* Right Section: Progress & Breakdown */}
        <div className="w-full lg:w-96 space-y-10">
          {nextTier && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em]">
                <span className="text-slate-500">
                  Target: <span className={badge.color}>{nextTier}</span>
                </span>
                <span className="text-slate-400">
                  {pointsToNext !== null &&
                    `${pointsToNext.toLocaleString()} points remaining`}
                </span>
              </div>
              <div className="h-1.5 bg-surface-900/60 shadow-inner rounded-full overflow-hidden border border-white/[0.03]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToNext}%` }}
                  transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                  className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 shadow-[0_0_15px_rgba(255,90,31,0.3)]"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {score.github > 0 && (
              <SubScore label="GitHub Output" pts={score.github} />
            )}
            {score.leetcode > 0 && (
              <SubScore label="LeetCode Proficiency" pts={score.leetcode} />
            )}
            {score.gfg > 0 && (
              <SubScore label="GFG Contribution" pts={score.gfg} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SubScore({ label, pts }: { label: string; pts: number }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-surface-900/50 border border-white/[0.02] hover:bg-surface-900 transition-colors duration-300">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
        {label}
      </span>
      <span className="text-sm font-medium text-white tracking-tight">
        {pts.toLocaleString()}
      </span>
    </div>
  );
}

function ScoreSkeleton() {
  return (
    <div className="bg-surface-800 border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-inner">
      <Skeleton className="w-24 h-24 rounded-3xl shrink-0" />
      <div className="flex-1 space-y-4 w-full">
        <Skeleton className="h-14 w-40" />
        <Skeleton className="h-4 w-3/4 max-w-2xl" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-2.5 w-full max-w-md rounded-full" />
        </div>
        <div className="flex gap-3 pt-3">
          <Skeleton className="h-8 w-24 rounded-xl" />
          <Skeleton className="h-8 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
