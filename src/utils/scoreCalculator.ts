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

  // GitHub insights
  if (!github) {
    insights.push({
      title: "Connect Your GitHub Account",
      description: "GitHub is essential for showcasing your projects and contributions to recruiters.",
      priority: "high",
      actionItems: [
        "Add your GitHub username to get started",
        "Make sure your profile is public",
        "Add a professional bio and profile picture",
      ],
    });
  } else if (github.public_repos < 3) {
    insights.push({
      title: "Build Your First Projects",
      description: `You have ${github.public_repos} public repo(s). Aim for at least 3-5 to showcase your skills.`,
      priority: "high",
      actionItems: [
        "Create a portfolio project (e.g., todo app, weather app)",
        "Build a full-stack project to demonstrate end-to-end skills",
        "Ensure projects have comprehensive README files",
      ],
    });
  } else if (github.total_stars === 0) {
    insights.push({
      title: "Make Your Projects Discoverable",
      description: "Your projects have no stars yet. Improve visibility and quality to attract attention.",
      priority: "medium",
      actionItems: [
        "Add detailed documentation and examples",
        "Share projects on Twitter, LinkedIn, or dev.to",
        "Contribute to trending open-source projects",
      ],
    });
  }

  // LeetCode insights
  if (!leetcode) {
    insights.push({
      title: "Start Your DSA Journey",
      description: "LeetCode helps you prepare for technical interviews and improve problem-solving skills.",
      priority: "high",
      actionItems: [
        "Create a LeetCode account",
        "Start with easy problems to build confidence",
        "Aim to solve at least 1-2 problems daily",
      ],
    });
  } else if (leetcode.totalSolved < 50) {
    insights.push({
      title: `Keep Grinding on LeetCode (${leetcode.totalSolved}/50)`,
      description: "You're on the right track! Reach 50 problems to build a strong DSA foundation.",
      priority: "high",
      actionItems: [
        `Solve ${50 - leetcode.totalSolved} more problems to reach 50`,
        "Focus on medium-difficulty problems after easy ones",
        "Review solutions and understand different approaches",
      ],
    });
  } else if (leetcode.totalSolved >= 50 && leetcode.totalSolved < 150) {
    insights.push({
      title: `You're Making Great Progress (${leetcode.totalSolved} solved)!`,
      description: "Continue solving more problems to reach expert level.",
      priority: "medium",
      actionItems: [
        "Focus on hard problems to prepare for top-tier interviews",
        "Practice problems by topic (arrays, trees, graphs, etc.)",
        "Track your acceptance rate and improve solution quality",
      ],
    });
  }

  // GitHub followers/stars insights
  if (github && github.followers < 5) {
    insights.push({
      title: "Build Your GitHub Network",
      description: "Followers indicate community recognition. Engage with the developer community.",
      priority: "medium",
      actionItems: [
        "Star and contribute to projects you find interesting",
        "Comment on and discuss issues in popular repositories",
        "Share your learning journey on social media",
      ],
    });
  }

  // GFG insights
  if (!gfg) {
    insights.push({
      title: "Diversify with GeeksforGeeks",
      description: "GFG offers interview-focused problems and company-specific questions.",
      priority: "medium",
      actionItems: [
        "Create a GeeksforGeeks account",
        "Solve company-specific interview questions",
        "Track your daily coding streak",
      ],
    });
  } else if (gfg.totalProblemsSolved < 50) {
    insights.push({
      title: `Boost Your GFG Score (${gfg.totalProblemsSolved}/50)`,
      description: "GeeksforGeeks problems are great for interview preparation.",
      priority: "medium",
      actionItems: [
        `Solve ${50 - gfg.totalProblemsSolved} more problems on GFG`,
        "Focus on company-specific interview questions",
        "Practice problems from different difficulty levels",
      ],
    });
  }

  // LeetCode acceptance rate insights
  if (leetcode && leetcode.acceptanceRate < 35) {
    insights.push({
      title: "Improve Your Acceptance Rate",
      description: `Your acceptance rate is ${leetcode.acceptanceRate.toFixed(1)}%. Focus on understanding problems before coding.`,
      priority: "medium",
      actionItems: [
        "Read problem statements carefully before coding",
        "Test edge cases before submitting",
        "Learn from accepted solutions and optimize your approach",
      ],
    });
  }

  // Positive reinforcement
  if (github && github.public_repos >= 5 && leetcode && leetcode.totalSolved >= 100) {
    insights.push({
      title: "🎉 You're Interview-Ready!",
      description: "You have a strong foundation. Focus on system design and behavioral prep now.",
      priority: "low",
      actionItems: [
        "Study system design patterns",
        "Practice behavioral interview questions",
        "Contribute to open-source to showcase leadership",
      ],
    });
  } else if (github && github.public_repos >= 3 && leetcode && leetcode.totalSolved >= 50) {
    insights.push({
      title: "Great Foundation!",
      description: "You're building a solid profile. Keep pushing to reach expert level.",
      priority: "low",
      actionItems: [
        "Build more complex projects",
        "Solve harder LeetCode problems",
        "Start contributing to open-source",
      ],
    });
  }

  return insights.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}
