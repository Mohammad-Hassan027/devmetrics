import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import type { DevStats } from "../types";
import {
  getFollowersPercentile,
  getStarsPercentile,
  getLeetCodePercentile,
  getGFGPercentile,
} from "../utils/benchmarking";
import { cn } from "../utils/cn";

interface BenchmarkingIndicatorsProps {
  stats: DevStats;
}

export default function BenchmarkingIndicators({
  stats,
}: BenchmarkingIndicatorsProps) {
  const github = stats.github.data;
  const leetcode = stats.leetcode.data;
  const gfg = stats.gfg.data;

  if (!github && !leetcode && !gfg) return null;

  const indicators = [];

  if (github) {
    const followersContext = getFollowersPercentile(github.followers || 0);
    const starsContext = getStarsPercentile(github.total_stars || 0);

    indicators.push({
      label: "GitHub Followers",
      percentile: followersContext.percentile,
      message: followersContext.message,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    });

    indicators.push({
      label: "Project Stars",
      percentile: starsContext.percentile,
      message: starsContext.message,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    });
  }

  if (leetcode) {
    const lcContext = getLeetCodePercentile(leetcode.totalSolved || 0);
    indicators.push({
      label: "LeetCode Rank",
      percentile: lcContext.percentile,
      message: lcContext.message,
      color: "text-orange-400",
      bg: "bg-orange-500/10",
    });
  }

  if (gfg) {
    const gfgContext = getGFGPercentile(gfg.totalProblemsSolved || 0);
    indicators.push({
      label: "GFG Proficiency",
      percentile: gfgContext.percentile,
      message: gfgContext.message,
      color: "text-green-400",
      bg: "bg-green-500/10",
    });
  }

  if (indicators.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-2xl p-6 border border-white/5 backdrop-blur-sm bg-surface-800/50 space-y-4"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
          <TrendingUp className="w-4 h-4 text-purple-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Benchmarking
          </h3>
          <p className="text-xs text-slate-500">How you compare to the community</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {indicators.map((indicator, idx) => (
          <BenchmarkCard key={idx} {...indicator} />
        ))}
      </div>
    </motion.div>
  );
}

function BenchmarkCard({
  label,
  percentile,
  message,
  color,
  bg,
}: {
  label: string;
  percentile: number;
  message: string;
  color: string;
  bg: string;
}) {
  const displayPercentile = Math.round(percentile);

  return (
    <div className={cn("rounded-lg p-4 border border-white/5", bg)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
        <span className={cn("text-lg font-bold", color)}>{displayPercentile}%</span>
      </div>

      <div className="h-1.5 bg-surface-900/50 rounded-full overflow-hidden border border-white/5 mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${displayPercentile}%` }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className={cn(
            "h-full rounded-full bg-gradient-to-r",
            color === "text-blue-400"
              ? "from-blue-500 to-blue-400"
              : color === "text-yellow-400"
                ? "from-yellow-500 to-yellow-400"
                : color === "text-orange-400"
                  ? "from-orange-500 to-orange-400"
                  : "from-green-500 to-green-400"
          )}
        />
      </div>

      <p className="text-xs text-slate-500">{message}</p>
    </div>
  );
}
