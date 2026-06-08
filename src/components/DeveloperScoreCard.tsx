import { useMemo, useRef, useEffect, useCallback } from "react";
import { useDevMetrics } from "../context/DevMetricsContext";
import { computeScore } from "../utils/scoreEngine";
import { Skeleton } from "./Skeleton";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { cn } from "../utils/cn";

export default function DeveloperScoreCard() {
  const { stats, hasData, isLoading } = useDevMetrics();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const spotlightRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0, opacity: 0 });

  const score = useMemo(
    () => computeScore(stats.github.data, stats.leetcode.data, stats.gfg.data),
    [stats.github.data, stats.leetcode.data, stats.gfg.data],
  );

  const { badge, total, progressToNext, nextTier, pointsToNext } = score;

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    pointerRef.current.x = e.clientX - rect.left;
    pointerRef.current.y = e.clientY - rect.top;
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(() => {
        const sp = spotlightRef.current;
        if (sp) {
          sp.style.opacity = String(pointerRef.current.opacity);
          sp.style.background = `radial-gradient(1000px circle at ${pointerRef.current.x}px ${pointerRef.current.y}px, rgba(255,255,255,0.03), transparent 40%)`;
        }
        rafRef.current = null;
      });
    }
  }, []);

  const onEnter = useCallback(() => {
    pointerRef.current.opacity = 1;
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(() => {
        if (spotlightRef.current) spotlightRef.current.style.opacity = "1";
        rafRef.current = null;
      });
    }
  }, []);

  const onLeave = useCallback(() => {
    pointerRef.current.opacity = 0;
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(() => {
        if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
        rafRef.current = null;
      });
    }
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  if (isLoading) return <ScoreSkeleton />;
  if (!hasData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={cn("relative overflow-hidden rounded-[2.5rem] p-12", "bg-surface-800 border border-white/[0.03] ring-1 ring-white/5")}
    >
      <div ref={spotlightRef} className="pointer-events-none absolute -inset-px transition duration-500 rounded-[2.5rem]" style={{ opacity: 0 }} />

      <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-12">
        <div className="space-y-8 flex-1">
          <div className="flex items-center gap-6">
            <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center", badge.border)} role="img">
              <Trophy className={cn("w-8 h-8", badge.color)} />
            </div>
            <div>
              <span className={cn("text-[10px] font-bold uppercase tracking-[0.3em] mb-1 block", badge.color)}>{badge.tier}</span>
              <h3 className="text-2xl font-bold text-white tracking-tight">Global Standing</h3>
            </div>
          </div>

          <div className="flex items-baseline gap-4 group relative">
            <span className={cn("text-7xl md:text-8xl font-medium tracking-tighter leading-none", badge.color)}>{total.toLocaleString()}</span>
            <div className="flex flex-col items-start pb-3">
              <span className="text-slate-500 text-xs font-bold tracking-[0.25em] uppercase cursor-help">Impact Score</span>
              <div className="hidden group-hover:block absolute bottom-full mb-3 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-xs z-50 text-slate-300 w-max">
                <p className="font-semibold mb-1">Formula:</p>
                <p>GitHub Output + LeetCode Proficiency + GFG Contribution</p>
              </div>
            </div>
          </div>

          <p className="text-slate-400 text-lg leading-relaxed max-w-xl font-medium">{badge.description}</p>
        </div>

        <div className="w-full lg:w-96 space-y-10">
          {nextTier && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em]">
                <span className="text-slate-500">Target: <span className={badge.color}>{nextTier}</span></span>
                <span className="text-slate-400">{pointsToNext !== null && `${pointsToNext.toLocaleString()} points remaining`}</span>
              </div>
              <div className="h-1.5 bg-surface-900/60 shadow-inner rounded-full overflow-hidden border border-white/[0.03]">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progressToNext}%` }} transition={{ duration: 2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }} className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {score.github > 0 && <SubScore label="GitHub Output" pts={score.github} />}
            {score.leetcode > 0 && <SubScore label="LeetCode Proficiency" pts={score.leetcode} />}
            {score.gfg > 0 && <SubScore label="GFG Contribution" pts={score.gfg} />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const SubScore = ({ label, pts }: { label: string; pts: number }) => {
  return (
    <div className="flex items-center justify-between px-5 py-4 rounded-2xl bg-surface-900/50 border border-white/[0.02]">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">{label}</span>
      <span className="text-sm font-medium text-white tracking-tight">{pts.toLocaleString()}</span>
    </div>
  );
};

function ScoreSkeleton() {
  return (
    <div className="bg-surface-800 border border-white/5 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
      <Skeleton className="w-24 h-24 rounded-3xl shrink-0" />
      <div className="flex-1 space-y-4 w-full">
        <Skeleton className="h-14 w-40" />
        <Skeleton className="h-4 w-3/4 max-w-2xl" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-2.5 w-full max-w-md rounded-full" />
        </div>
      </div>
    </div>
  );
}
