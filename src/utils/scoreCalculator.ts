import type { DevStats } from "../types";

export interface ScoreBreakdown {
  github: number;
  leetcode: number;
  gfg: number;
  total: number;
}

/**
 * Calculates a portfolio score based on GitHub, LeetCode, and GFG metrics.
 * Score is out of 100 and represents "Recruiter Readiness".
 */
export function calculatePortfolioScore(stats: DevStats): ScoreBreakdown {
  let github = 0;
  let leetcode = 0;
  let gfg = 0;

  // GitHub Score (0-40 points)
  if (stats.github.data) {
    const { public_repos = 0, followers = 0, total_stars = 0 } = stats.github.data;
    github += Math.min(public_repos * 2, 15); // Up to 15 points for repos
    github += Math.min(followers, 10); // Up to 10 points for followers
    github += Math.min(total_stars / 5, 15); // Up to 15 points for stars
  }

  // LeetCode Score (0-35 points)
  if (stats.leetcode.data) {
    const { totalSolved = 0, acceptanceRate = 0 } = stats.leetcode.data;
    github += Math.min(totalSolved / 10, 20); // Up to 20 points for problems solved
    github += Math.min(acceptanceRate / 3, 15); // Up to 15 points for acceptance rate
  }

  // GFG Score (0-25 points)
  if (stats.gfg.data) {
    const { totalProblemsSolved = 0, codingScore = 0 } = stats.gfg.data;
    gfg += Math.min(totalProblemsSolved / 5, 15); // Up to 15 points for problems
    gfg += Math.min(codingScore / 200, 10); // Up to 10 points for coding score
  }

  const total = Math.min(github + leetcode + gfg, 100);

  return { github, leetcode, gfg, total };
}

/**
 * Generates actionable insights based on the user's stats.
 */
export interface Insight {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  actionItems: string[];
}

export function generateInsights(stats: DevStats): Insight[] {
  const insights: Insight[] = [];

  const github = stats.github.data;
  const leetcode = stats.leetcode.data;
  const gfg = stats.gfg.data;

  // Check GitHub presence
  if (!github || github.public_repos < 5) {
    insights.push({
      title: "Build More GitHub Projects",
      description:
        "Recruiters look for practical project experience. Having fewer than 5 public repositories limits your visibility.",
      priority: "high",
      actionItems: [
        "Create 2-3 full-stack projects with proper documentation",
        "Ensure projects have clear README files",
        "Showcase diverse tech stacks (frontend, backend, full-stack)",
      ],
    });
  }

  // Check LeetCode presence
  if (!leetcode || leetcode.totalSolved < 50) {
    insights.push({
      title: "Strengthen DSA Skills",
      description:
        "Problem-solving ability is crucial for technical interviews. Aim for at least 50 problems solved.",
      priority: "high",
      actionItems: [
        "Solve at least 50 LeetCode problems",
        "Focus on medium-difficulty problems",
        "Track your progress and maintain a streak",
      ],
    });
  }

  // Check GitHub followers/stars
  if (github && github.followers < 10) {
    insights.push({
      title: "Improve Your GitHub Presence",
      description:
        "Followers and stars indicate community engagement and project quality.",
      priority: "medium",
      actionItems: [
        "Contribute to open-source projects",
        "Share your projects on social media",
        "Engage with the developer community",
      ],
    });
  }

  // Check GFG presence
  if (!gfg || gfg.totalProblemsSolved < 50) {
    insights.push({
      title: "Leverage GeeksforGeeks",
      description:
        "GFG is a great resource for interview preparation and building a strong foundation.",
      priority: "medium",
      actionItems: [
        "Solve problems on GeeksforGeeks",
        "Focus on core DSA concepts",
        "Track your coding score improvement",
      ],
    });
  }

  // Check LeetCode acceptance rate
  if (leetcode && leetcode.acceptanceRate < 40) {
    insights.push({
      title: "Improve Solution Quality",
      description:
        "Your acceptance rate suggests room for improvement. Focus on understanding problems deeply.",
      priority: "medium",
      actionItems: [
        "Review failed submissions",
        "Study optimal solutions",
        "Practice similar problem patterns",
      ],
    });
  }

  // Positive reinforcement
  if (github && github.public_repos >= 5 && leetcode && leetcode.totalSolved >= 50) {
    insights.push({
      title: "Great Progress!",
      description:
        "You have a solid foundation. Continue building and refining your skills.",
      priority: "low",
      actionItems: [
        "Contribute to open-source projects",
        "Build more advanced projects",
        "Mentor junior developers",
      ],
    });
  }

  return insights.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
