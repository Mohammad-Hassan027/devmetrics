import { motion } from "framer-motion";
import { TrendingUp, Zap } from "lucide-react";
import type { DevStats } from "../types";
import { calculatePortfolioScore } from "../utils/scoreCalculator";
import { cn } from "../utils/cn";

interface RecruiterReadinessProps {
  stats: DevStats;
  isLoading: boolean;
}

export default function RecruiterReadiness({
  stats,
  isLoading,
}: RecruiterReadinessProps) {
  if (isLoading) return <RecruiterReadinessSkeleton />;

  const hasData = stats.github.data || stats.leetcode.data || stats.gfg.data;
  if (!hasData) return null;

  const score = calculatePortfolioScore(stats);
  const percentage = Math.round(score.total);

  // Determine tier based on score
  let tier = "Beginner";
  let tierColor = "text-blue-400";
  let tierBg = "bg-blue-500/10";
  let tierBorder = "border-blue-500/30";

  if (percentage >= 80) {
    tier = "Expert";
    tierColor = "text-purple-400";
    tierBg = "bg-purple-500/10";
    tierBorder = "border-purple-500/30";
  } else if (percentage >= 60) {
    tier = "Intermediate";
    tierColor = "text-green-400";
    tierBg = "bg-green-500/10";
    tierBorder = "border-green-500/30";
  } else if (percentage >= 40) {
    tier = "Developing";
    tierColor = "text-yellow-400";
    tierBg = "bg-yellow-500/10";
    tierBorder = "border-yellow-500/30";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "rounded-2xl p-6 border backdrop-blur-sm",
        tierBg,
        tierBorder
      )}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "p-2.5 rounded-lg",
              tierBg,
              "border",
              tierBorder
            )}
          >
            <TrendingUp className={cn("w-5 h-5", tierColor)} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Recruiter Readiness
            </h3>
            <p className={cn("text-2xl font-bold", tierColor)}>{tier}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-white">{percentage}</div>
          <p className="text-xs text-slate-500 font-medium">out of 100</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="h-2 bg-surface-900/50 rounded-full overflow-hidden border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className={cn(
              "h-full rounded-full bg-gradient-to-r",
              percentage >= 80
                ? "from-purple-500 to-purple-400"
                : percentage >= 60
                  ? "from-green-500 to-green-400"
                  : percentage >= 40
                    ? "from-yellow-500 to-yellow-400"
                    : "from-blue-500 to-blue-400"
            )}
          />
        </div>
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {score.github > 0 && (
          <ScoreItem
            label="GitHub"
            value={Math.round(score.github)}
            color="text-blue-400"
          />
        )}
        {score.leetcode > 0 && (
          <ScoreItem
            label="LeetCode"
            value={Math.round(score.leetcode)}
            color="text-yellow-400"
          />
        )}
        {score.gfg > 0 && (
          <ScoreItem
            label="GFG"
            value={Math.round(score.gfg)}
            color="text-green-400"
          />
        )}
      </div>

      {/* Breakdown and tips */}
      <div className="pt-6 border-t border-white/5 space-y-4">
        {/* What's contributing */}
        <div>
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Score Breakdown
          </p>
          <div className="space-y-2">
            {score.github > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">GitHub Activity</span>
                <span className="text-blue-400 font-semibold">{Math.round(score.github)}%</span>
              </div>
            )}
            {score.leetcode > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">LeetCode Proficiency</span>
                <span className="text-yellow-400 font-semibold">{Math.round(score.leetcode)}%</span>
              </div>
            )}
            {score.gfg > 0 && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">GFG Contribution</span>
                <span className="text-green-400 font-semibold">{Math.round(score.gfg)}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Next steps */}
        <div>
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Next Steps to Improve
          </p>
          <ul className="space-y-1 text-xs text-slate-400">
            {percentage < 40 && (
              <>
                <li>• Build 2-3 public GitHub projects with documentation</li>
                <li>• Solve 30+ LeetCode problems to strengthen DSA</li>
                <li>• Create a compelling GitHub profile bio</li>
              </>
            )}
            {percentage >= 40 && percentage < 60 && (
              <>
                <li>• Increase GitHub stars through quality projects</li>
                <li>• Reach 100+ LeetCode problems solved</li>
                <li>• Contribute to open-source projects</li>
              </>
            )}
            {percentage >= 60 && percentage < 80 && (
              <>
                <li>• Focus on hard LeetCode problems</li>
                <li>• Build advanced full-stack projects</li>
                <li>• Engage with the developer community</li>
              </>
            )}
            {percentage >= 80 && (
              <>
                <li>• Mentor junior developers</li>
                <li>• Build system design projects</li>
                <li>• Lead open-source initiatives</li>
              </>
            )}
          </ul>
        </div>

        {/* Pro tip */}
        <div className="flex items-start gap-2 pt-2">
          <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Pro tip:</span> Share
            your profile link with recruiters to showcase your developer metrics
            in a clean, professional format.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ScoreItem({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="rounded-lg bg-surface-900/50 border border-white/5 p-3 text-center">
      <p className="text-xs font-medium text-slate-500 mb-1">{label}</p>
      <p className={cn("text-lg font-bold", color)}>{value}</p>
    </div>
  );
}

function RecruiterReadinessSkeleton() {
  return (
    <div className="rounded-2xl p-6 bg-surface-800 border border-white/5 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-2">
          <div className="h-3 w-32 bg-surface-700 rounded animate-pulse" />
          <div className="h-6 w-24 bg-surface-700 rounded animate-pulse" />
        </div>
        <div className="h-12 w-16 bg-surface-700 rounded animate-pulse" />
      </div>
      <div className="h-2 w-full bg-surface-700 rounded-full animate-pulse" />
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-surface-700 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}
