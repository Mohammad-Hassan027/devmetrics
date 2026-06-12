export interface Usernames {
  github: string;
  leetcode: string;
  gfg: string;
}

export interface GitHubData {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  total_stars?: number;
  total_commits?: number;
  /** Language → byte-count map aggregated from the user's repos */
  languages?: Record<string, number>;
}

export interface LeetCodeSubmitStats {
  difficulty: "Easy" | "Medium" | "Hard" | "All";
  count: number;
  submissions: number;
}

export interface LeetCodeData {
  username: string;
  name: string;
  avatar: string;
  ranking: number;
  reputation: number;
  totalSolved: number;
  totalSubmissions: LeetCodeSubmitStats[];
  totalQuestions: number;
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  acceptanceRate: number;
  contributionPoints: number;
}

export interface GFGData {
  userName: string;
  profilePicture: string;
  institute: string;
  instituteRank: string | number;
  /** API may return streak as a string ("15") or a number (15) */
  currentStreak: string | number;
  maxStreak: string | number;
  codingScore: number;
  monthlyScore: number;
  totalProblemsSolved: number;
  articlePublished: number;
  Languages: string[];
  solvedStats: {
    school?: { count: number };
    basic?: { count: number };
    easy?: { count: number };
    medium?: { count: number };
    hard?: { count: number };
  };
}

export type FetchStatus = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  status: FetchStatus;
  error: string | null;
}

export interface DevStats {
  github: AsyncState<GitHubData>;
  leetcode: AsyncState<LeetCodeData>;
  gfg: AsyncState<GFGData>;
}

export const makeIdle = <T>(): AsyncState<T> => ({
  data: null,
  status: "idle",
  error: null,
});

export interface ProblemEntry {
  id: string;
  user_id: string; // Foreign key to auth.users
  platform: string;
  title: string;
  url?: string;
  difficulty?: "Easy" | "Medium" | "Hard" | string;
  solved_at: string; // ISO string
  tags: string[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
