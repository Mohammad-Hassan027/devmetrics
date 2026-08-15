import { supabase } from "./supabase";
export interface MetricSnapshotInput {
  userId: string;
  displayName: string | null;
  avatarUrl: string | null;
  usernames: {
    github: string;
    leetcode: string;
    gfg: string;
  };
  githubScore: number;
  leetcodeScore: number;
  gfgScore: number;
  totalScore: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  username: string;
  score: number;
  github: number;
  leetcode: number;
  gfg: number;
  avatar?: string;
  badge?: string;
}

export async function saveMetricSnapshot(
  snapshot: MetricSnapshotInput,
): Promise<void> {
  const { error } = await supabase.from("metric_snapshots").upsert(
    {
      user_id: snapshot.userId,
      display_name: snapshot.displayName,
      avatar_url: snapshot.avatarUrl,
      github_username: snapshot.usernames.github || null,
      leetcode_username: snapshot.usernames.leetcode || null,
      gfg_username: snapshot.usernames.gfg || null,
      github_score: snapshot.githubScore,
      leetcode_score: snapshot.leetcodeScore,
      gfg_score: snapshot.gfgScore,
      total_score: snapshot.totalScore,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) throw new Error(error.message);
}

export async function getLeaderboard(limit = 50): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase
    .from("metric_snapshots")
    .select(
      "display_name, avatar_url, github_username, leetcode_username, gfg_username, total_score, github_score, leetcode_score, gfg_score",
    )
    .order("total_score", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row, index) => {
    const username =
      row.github_username ?? row.leetcode_username ?? row.gfg_username ?? "unknown";

    return {
      rank: index + 1,
      name: row.display_name ?? username,
      username,
      score: row.total_score,
      github: row.github_score,
      leetcode: row.leetcode_score,
      gfg: row.gfg_score,
      avatar: row.avatar_url ?? undefined,
      badge: index === 0 ? "Top Contributor" : undefined,
    };
  });
}
