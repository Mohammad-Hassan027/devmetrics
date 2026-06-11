/**
 * Benchmarking utilities to provide percentile context for user metrics.
 * Based on typical developer profiles and industry standards.
 */

export interface PercentileContext {
  percentile: number; // 0-100
  tier: string;
  message: string;
}

/**
 * Calculate GitHub followers percentile (0-100)
 * Based on typical developer distribution
 */
export function getFollowersPercentile(followers: number): PercentileContext {
  if (followers < 1) return { percentile: 5, tier: "Emerging", message: "Start building your network" };
  if (followers < 5) return { percentile: 20, tier: "Growing", message: "You're building momentum" };
  if (followers < 20) return { percentile: 40, tier: "Recognized", message: "Good community presence" };
  if (followers < 50) return { percentile: 60, tier: "Influential", message: "Strong network" };
  if (followers < 100) return { percentile: 75, tier: "Well-Known", message: "Respected in community" };
  if (followers < 500) return { percentile: 90, tier: "Notable", message: "Significant influence" };
  return { percentile: 98, tier: "Celebrity", message: "Major industry figure" };
}

/**
 * Calculate GitHub stars percentile (0-100)
 * Based on typical project popularity
 */
export function getStarsPercentile(stars: number): PercentileContext {
  if (stars < 1) return { percentile: 10, tier: "Starting Out", message: "Build more projects" };
  if (stars < 5) return { percentile: 25, tier: "Getting Noticed", message: "Projects gaining traction" };
  if (stars < 20) return { percentile: 40, tier: "Popular", message: "Good project quality" };
  if (stars < 50) return { percentile: 55, tier: "Trending", message: "Strong project appeal" };
  if (stars < 100) return { percentile: 70, tier: "Viral", message: "Highly sought projects" };
  if (stars < 500) return { percentile: 85, tier: "Legendary", message: "Exceptional projects" };
  return { percentile: 95, tier: "Icon", message: "Industry-defining work" };
}

/**
 * Calculate LeetCode problems solved percentile (0-100)
 * Based on typical problem-solving progression
 */
export function getLeetCodePercentile(solved: number): PercentileContext {
  if (solved < 10) return { percentile: 5, tier: "Beginner", message: "Just starting your DSA journey" };
  if (solved < 50) return { percentile: 25, tier: "Novice", message: "Building fundamentals" };
  if (solved < 100) return { percentile: 40, tier: "Intermediate", message: "Solid foundation" };
  if (solved < 200) return { percentile: 60, tier: "Advanced", message: "Strong problem-solving skills" };
  if (solved < 300) return { percentile: 75, tier: "Expert", message: "Exceptional DSA knowledge" };
  if (solved < 500) return { percentile: 88, tier: "Master", message: "Top-tier problem solver" };
  return { percentile: 95, tier: "Grandmaster", message: "Elite competitive programmer" };
}

/**
 * Calculate GFG problems solved percentile (0-100)
 */
export function getGFGPercentile(solved: number): PercentileContext {
  if (solved < 20) return { percentile: 10, tier: "Beginner", message: "Starting interview prep" };
  if (solved < 50) return { percentile: 30, tier: "Intermediate", message: "Building interview skills" };
  if (solved < 100) return { percentile: 50, tier: "Proficient", message: "Well-prepared for interviews" };
  if (solved < 200) return { percentile: 70, tier: "Advanced", message: "Strong interview readiness" };
  if (solved < 300) return { percentile: 85, tier: "Expert", message: "Highly prepared for top companies" };
  return { percentile: 95, tier: "Master", message: "Ready for any technical interview" };
}

/**
 * Calculate overall developer profile percentile (0-100)
 * Combines all metrics into a single score
 */
export function getOverallPercentile(
  followers: number,
  stars: number,
  lcSolved: number,
  gfgSolved: number
): PercentileContext {
  // Weighted average of all percentiles
  const followersPercentile = getFollowersPercentile(followers).percentile;
  const starsPercentile = getStarsPercentile(stars).percentile;
  const lcPercentile = getLeetCodePercentile(lcSolved).percentile;
  const gfgPercentile = getGFGPercentile(gfgSolved).percentile;

  // Weight: 20% followers, 20% stars, 30% LC, 30% GFG
  const overall = (followersPercentile * 0.2 + starsPercentile * 0.2 + lcPercentile * 0.3 + gfgPercentile * 0.3);

  if (overall < 20) return { percentile: overall, tier: "Emerging", message: "You're on your way" };
  if (overall < 40) return { percentile: overall, tier: "Developing", message: "Building strong fundamentals" };
  if (overall < 60) return { percentile: overall, tier: "Proficient", message: "Well-rounded developer" };
  if (overall < 75) return { percentile: overall, tier: "Advanced", message: "Strong technical profile" };
  if (overall < 90) return { percentile: overall, tier: "Expert", message: "Top-tier developer" };
  return { percentile: overall, tier: "Master", message: "Elite developer profile" };
}
