import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import type { DevStats } from "../types";
import { calculatePortfolioScore } from "../utils/scoreCalculator";
import { cn } from "../utils/cn";

interface PublicRecruiterViewProps {
  stats: DevStats;
  usernames: {
    github?: string;
    leetcode?: string;
    gfg?: string;
  };
}

/**
 * A clean, read-only view optimized for recruiters.
 * Shows only verified, non-empty data in a professional format.
 * No internal metrics, no placeholder charts, no editing capabilities.
 */
export default function PublicRecruiterView({
  stats,
  usernames,
}: PublicRecruiterViewProps) {
  const hasData = stats.github.data || stats.leetcode.data || stats.gfg.data;
  if (!hasData) return null;

  const score = calculatePortfolioScore(stats);
  const percentage = Math.round(score.total);

  // Determine tier
  let tier = "Developing";
  let tierColor = "text-blue-400";
  if (percentage >= 80) {
    tier = "Expert";
    tierColor = "text-purple-400";
  } else if (percentage >= 60) {
    tier = "Intermediate";
    tierColor = "text-green-400";
  } else if (percentage >= 40) {
    tier = "Developing";
    tierColor = "text-yellow-400";
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-surface-900 via-surface-800 to-surface-900 p-8"
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Developer Profile
          </h1>
          <p className="text-slate-400 text-lg">
            Verified metrics from GitHub, LeetCode, and GeeksforGeeks
          </p>
        </div>

        {/* Main Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl p-8 bg-gradient-to-br from-surface-800 to-surface-700 border border-white/10 shadow-xl"
        >
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Score */}
            <div className="flex flex-col justify-center space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Recruiter Readiness
                </p>
                <p className={cn("text-3xl font-bold", tierColor)}>{tier}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-bold text-white">
                    {percentage}
                  </span>
                  <span className="text-slate-400 text-sm font-medium">
                    out of 100
                  </span>
                </div>
                <div className="h-2 bg-surface-900/50 rounded-full overflow-hidden border border-white/5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{
                      duration: 1.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
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
            </div>

            {/* Right: Breakdown */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Score Breakdown
              </p>
              {score.github > 0 && (
                <ScoreRow label="GitHub Activity" value={Math.round(score.github)} color="text-blue-400" />
              )}
              {score.leetcode > 0 && (
                <ScoreRow label="LeetCode Proficiency" value={Math.round(score.leetcode)} color="text-yellow-400" />
              )}
              {score.gfg > 0 && (
                <ScoreRow label="GFG Contribution" value={Math.round(score.gfg)} color="text-green-400" />
              )}
            </div>
          </div>
        </motion.div>

        {/* Verified Data Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* GitHub */}
          {stats.github.data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl p-6 bg-surface-800/50 border border-white/5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">GitHub</h3>
                <a
                  href={`https://github.com/${usernames.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="space-y-2 text-sm">
                {stats.github.data.public_repos > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Public Repositories</span>
                    <span className="text-white font-semibold">
                      {stats.github.data.public_repos}
                    </span>
                  </div>
                )}
                {stats.github.data.followers > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Followers</span>
                    <span className="text-white font-semibold">
                      {stats.github.data.followers}
                    </span>
                  </div>
                )}
                {(stats.github.data?.total_stars ?? 0) > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Stars</span>
                    <span className="text-white font-semibold">
                      {stats.github.data.total_stars}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* LeetCode */}
          {stats.leetcode.data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-xl p-6 bg-surface-800/50 border border-white/5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">LeetCode</h3>
                <a
                  href={`https://leetcode.com/${usernames.leetcode}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="space-y-2 text-sm">
                {stats.leetcode.data.totalSolved > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Problems Solved</span>
                    <span className="text-white font-semibold">
                      {stats.leetcode.data.totalSolved}
                    </span>
                  </div>
                )}
                {stats.leetcode.data.acceptanceRate > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Acceptance Rate</span>
                    <span className="text-white font-semibold">
                      {stats.leetcode.data.acceptanceRate.toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* GFG */}
          {stats.gfg.data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-xl p-6 bg-surface-800/50 border border-white/5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  GeeksforGeeks
                </h3>
                <a
                  href={`https://auth.geeksforgeeks.org/user/${usernames.gfg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="space-y-2 text-sm">
                {stats.gfg.data.totalProblemsSolved > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Problems Solved</span>
                    <span className="text-white font-semibold">
                      {stats.gfg.data.totalProblemsSolved}
                    </span>
                  </div>
                )}
                {stats.gfg.data.codingScore > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Coding Score</span>
                    <span className="text-white font-semibold">
                      {stats.gfg.data.codingScore}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 space-y-2">
          <p>Data verified from official platform APIs</p>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </motion.div>
  );
}

function ScoreRow({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className={cn("font-semibold", color)}>{value}%</span>
    </div>
  );
}
