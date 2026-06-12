import axios from "axios";
import type { GitHubData, LeetCodeData, GFGData } from "../types";

// ── API clients ────────────────────────────────────────────────────────────────

const githubClient = axios.create({
  baseURL: "https://api.github.com",
  timeout: 10_000,
  headers: { Accept: "application/vnd.github.v3+json" },
});

const leetcodeClient = axios.create({
  baseURL: "https://alfa-leetcode-api.onrender.com",
  timeout: 15_000,
});

const gfgClient = axios.create({
  baseURL: "https://gfg-stats-api.vercel.app",
  timeout: 10_000,
});

// ── sessionStorage TTL cache ───────────────────────────────────────────────────

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
  data: T;
  ts: number;
}

function cacheGet<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const entry: CacheEntry<T> = JSON.parse(raw);
    if (Date.now() - entry.ts > CACHE_TTL_MS) {
      sessionStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function cacheSet<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, ts: Date.now() };
    sessionStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // sessionStorage may be unavailable (private browsing quotas etc.) — fail silently
  }
}

// ── Type guards ────────────────────────────────────────────────────────────────

function isGitHubShape(obj: unknown): obj is GitHubData {
  return (
    !!obj &&
    typeof (obj as any).login === "string" &&
    typeof (obj as any).html_url === "string" &&
    typeof (obj as any).avatar_url === "string"
  );
}

// ── GitHub ─────────────────────────────────────────────────────────────────────

/**
 * Fetches GitHub user profile + aggregates total_stars and languages from repos.
 * Two requests are made in parallel (user + repos) and merged into a single
 * GitHubData object. Results are cached in sessionStorage for 5 minutes.
 */
export const fetchGitHub = async (
  username: string,
  signal?: AbortSignal,
): Promise<GitHubData> => {
  const cacheKey = `devmetrics:github:${username.toLowerCase()}`;
  const cached = cacheGet<GitHubData>(cacheKey);
  if (cached) return cached;

  // Fetch user profile and repos in parallel to minimise latency
  const [userRes, reposRes] = await Promise.all([
    githubClient.get(`/users/${username}`, { signal }),
    githubClient.get(`/users/${username}/repos?per_page=100&sort=updated`, {
      signal,
    }),
  ]);

  const data = userRes.data;
  if (!isGitHubShape(data)) throw new Error("Unexpected GitHub response shape");

  // Aggregate stars and language byte-counts from repos (max 100)
  const repos: any[] = Array.isArray(reposRes.data) ? reposRes.data : [];
  const total_stars = repos.reduce(
    (sum, r) => sum + (r.stargazers_count ?? 0),
    0,
  );
  const languages: Record<string, number> = {};
  for (const repo of repos) {
    if (repo.language) {
      languages[repo.language] = (languages[repo.language] ?? 0) + 1;
    }
  }

  const result: GitHubData = {
    ...(data as GitHubData),
    total_stars,
    languages,
  };

  cacheSet(cacheKey, result);
  return result;
};

// ── LeetCode ───────────────────────────────────────────────────────────────────

export const fetchLeetCode = async (
  username: string,
  signal?: AbortSignal,
): Promise<LeetCodeData> => {
  const cacheKey = `devmetrics:leetcode:${username.toLowerCase()}`;
  const cached = cacheGet<LeetCodeData>(cacheKey);
  if (cached) return cached;

  const res = await leetcodeClient.get(`/${username}`, { signal });
  const data = res.data as LeetCodeData;
  if (!data || typeof data.username !== "string") {
    throw new Error("Unexpected LeetCode response shape");
  }

  cacheSet(cacheKey, data);
  return data;
};

// ── GFG ────────────────────────────────────────────────────────────────────────

export const fetchGFG = async (
  username: string,
  signal?: AbortSignal,
): Promise<GFGData> => {
  const cacheKey = `devmetrics:gfg:${username.toLowerCase()}`;
  const cached = cacheGet<GFGData>(cacheKey);
  if (cached) return cached;

  const res = await gfgClient.get(`/${username}`, { signal });
  const data = res.data as GFGData;
  if (!data || typeof (data as any).userName !== "string") {
    throw new Error("Unexpected GFG response shape");
  }

  cacheSet(cacheKey, data);
  return data;
};

// ── Error helpers ──────────────────────────────────────────────────────────────

/** Extracts a human-readable message from an axios error or unknown throw. */
export const extractErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 404) return "User not found (404)";
    if (err.response?.status === 429) return "Rate limited — try again later";
    if (err.code === "ECONNABORTED") return "Request timed out";
    return (err.response?.data?.message as string) ?? err.message ?? "Unknown error";
  }
  return err instanceof Error ? err.message : "Unknown error";
};
