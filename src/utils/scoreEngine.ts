import type { GitHubData, LeetCodeData, GFGData } from "../types";

/**
 * scoreEngine — "Impact Score" system (unbounded).
 *
 * This is SEPARATE from the 0–100 "Recruiter Readiness" score in scoreCalculator.ts.
 * The Impact Score has no ceiling and grows as the developer's output grows,
 * enabling meaningful badge tiers (Newcomer → Legend) without an arbitrary cap.
 * Weights are tuned to reward depth (hard problems, high stars) over breadth.
 */

export type BadgeTier =
  | "Newcomer"
  | "Explorer"
  | "Contributor"
  | "Achiever"
  | "Expert"
  | "Legend";

export interface BadgeInfo {
  tier: BadgeTier;
  minScore: number;
  emoji: string;
  color: string;
  bg: string;
  glow: string;
  border: string;
  description: string;
}

export const BADGE_TIERS: BadgeInfo[] = [
  {
    tier: "Newcomer",
    minScore: 0,
    emoji: "🌱",
    color: "text-slate-300",
    bg: "from-slate-700/60 to-slate-800/60",
    glow: "shadow-slate-900/40",
    border: "border-slate-600/40",
    description: "Establishing a technical footprint. Initializing baseline metrics.",
  },
  {
    tier: "Explorer",
    minScore: 100,
    emoji: "🔭",
    color: "text-blue-300",
    bg: "from-blue-900/50 to-slate-800/60",
    glow: "shadow-blue-900/40",
    border: "border-blue-700/40",
    description: "Expanding reach across platforms. Demonstrating consistent growth.",
  },
  {
    tier: "Contributor",
    minScore: 300,
    emoji: "⚡",
    color: "text-cyan-300",
    bg: "from-cyan-900/50 to-blue-900/40",
    glow: "shadow-cyan-900/40",
    border: "border-cyan-700/40",
    description: "Substantial engineering output. Actively contributing to the ecosystem.",
  },
  {
    tier: "Achiever",
    minScore: 600,
    emoji: "🚀",
    color: "text-purple-300",
    bg: "from-purple-900/50 to-indigo-900/40",
    glow: "shadow-purple-900/50",
    border: "border-purple-600/50",
    description: "High-performance problem solver with a proven track record of excellence.",
  },
  {
    tier: "Expert",
    minScore: 1000,
    emoji: "🏆",
    color: "text-yellow-300",
    bg: "from-yellow-900/50 to-amber-900/40",
    glow: "shadow-yellow-900/50",
    border: "border-yellow-600/50",
    description: "Elite technical proficiency. Demonstrating mastery in complex problem-solving.",
  },
  {
    tier: "Legend",
    minScore: 1500,
    emoji: "👑",
    color: "text-orange-300",
    bg: "from-orange-900/50 to-red-900/40",
    glow: "shadow-orange-900/50",
    border: "border-orange-500/60",
    description: "Distinguished engineering impact. Benchmarking at the top 0.1% of global talent.",
  },
];

export interface ScoreBreakdown {
  github: number;
  leetcode: number;
  gfg: number;
  total: number;
  badge: BadgeInfo;
  progressToNext: number;
  nextTier: BadgeTier | null;
  pointsToNext: number | null;
}

const W = {
  repo: 1.5,
  follower: 0.5,
  star: 2,
  easy: 3,
  medium: 7,
  hard: 15,
  acceptanceBonus: 0.2,
  gfgProblem: 2,
  codingScore: 0.05,
  streakDay: 1.5,
};

const clamp = (v: number, max: number) => Math.min(v, max);

export function calcGitHubScore(data: GitHubData | null): number {
  if (!data) return 0;
  return Math.round(
    clamp(data.public_repos * W.repo, 150) +
      clamp(data.followers * W.follower, 100) +
      clamp((data.total_stars ?? 0) * W.star, 200),
  );
}

export function calcLeetCodeScore(data: LeetCodeData | null): number {
  if (!data) return 0;
  return Math.round(
    clamp(data.easySolved * W.easy, 150) +
      clamp(data.mediumSolved * W.medium, 350) +
      clamp(data.hardSolved * W.hard, 600) +
      clamp(data.acceptanceRate * W.acceptanceBonus, 20),
  );
}

export function calcGFGScore(data: GFGData | null): number {
  if (!data) return 0;
  // currentStreak may arrive as a string ("15") or a number (15) from the API
  const streak =
    typeof data.currentStreak === "number"
      ? data.currentStreak
      : parseInt(String(data.currentStreak ?? "0"), 10) || 0;
  return Math.round(
    clamp(data.totalProblemsSolved * W.gfgProblem, 400) +
      clamp(data.codingScore * W.codingScore, 200) +
      clamp(streak * W.streakDay, 150),
  );
}

export function computeScore(
  github: GitHubData | null,
  leetcode: LeetCodeData | null,
  gfg: GFGData | null,
): ScoreBreakdown {
  const ghPts = calcGitHubScore(github);
  const lcPts = calcLeetCodeScore(leetcode);
  const gfgPts = calcGFGScore(gfg);
  const total = ghPts + lcPts + gfgPts;

  let badge = BADGE_TIERS[0];
  for (const tier of BADGE_TIERS) {
    if (total >= tier.minScore) badge = tier;
  }

  const currentIdx = BADGE_TIERS.indexOf(badge);
  const nextBadge = BADGE_TIERS[currentIdx + 1] ?? null;
  const pointsToNext = nextBadge ? nextBadge.minScore - total : null;
  const progressToNext = nextBadge
    ? Math.min(
        100,
        ((total - badge.minScore) / (nextBadge.minScore - badge.minScore)) *
          100,
      )
    : 100;

  return {
    github: ghPts,
    leetcode: lcPts,
    gfg: gfgPts,
    total,
    badge,
    progressToNext,
    nextTier: nextBadge?.tier ?? null,
    pointsToNext,
  };
}
