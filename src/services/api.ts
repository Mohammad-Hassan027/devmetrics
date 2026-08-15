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

// ── persistent TTL cache ───────────────────────────────────────────────────────

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const CACHE_PREFIX = "devmetrics:cache:v2:";

interface CacheEntry<T> {
  data: T;
  ts: number;
}

function getCacheStorage(): Storage | null {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage;
  } catch {
    // Storage can be disabled by privacy settings or unavailable in some
    // embedded browsers. The fetch path remains fully functional without it.
    return null;
  }
}

function cacheGet<T>(key: string): T | null {
  const storage = getCacheStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(`${CACHE_PREFIX}${key}`);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    if (!entry || Date.now() - entry.ts > CACHE_TTL_MS) {
      storage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return entry.data;
  } catch {
    return null;
  }
}

function cacheSet<T>(key: string, data: T): void {
  const storage = getCacheStorage();
  if (!storage) return;

  try {
    const entry: CacheEntry<T> = { data, ts: Date.now() };
    storage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
  } catch {
    // Quota errors should never turn a successful upstream request into a
    // failed dashboard load.
  }
}

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
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

const GITHUB_REPOS_PAGE_SIZE = 100;

type GitHubRepository = {
  stargazers_count?: number;
  language?: string | null;
};

async function fetchAllGitHubRepositories(
  username: string,
  signal?: AbortSignal,
): Promise<GitHubRepository[]> {
  const repositories: GitHubRepository[] = [];
  let page = 1;

  // REST pagination is intentionally handled here rather than in the UI. This
  // keeps all consumers consistent and prevents silently under-counting users
  // with more than 100 repositories.
  while (true) {
    const response = await githubClient.get<GitHubRepository[]>(
      `/users/${encodeURIComponent(username)}/repos`,
      {
        params: {
          per_page: GITHUB_REPOS_PAGE_SIZE,
          page,
          sort: "updated",
        },
        signal,
      },
    );

    const pageRepositories = Array.isArray(response.data)
      ? response.data
      : [];
    repositories.push(...pageRepositories);

    if (pageRepositories.length < GITHUB_REPOS_PAGE_SIZE) break;
    page += 1;
  }

  return repositories;
}

/**
 * Fetches GitHub user profile and aggregates stars and languages from every
 * repository page. Results are cached in localStorage for 15 minutes so that
 * repeated visits across tabs and browser sessions do not consume the public
 * GitHub rate limit unnecessarily.
 */
export const fetchGitHub = async (
  username: string,
  signal?: AbortSignal,
): Promise<GitHubData> => {
  const normalizedUsername = normalizeUsername(username);
  const cacheKey = `github:${normalizedUsername}`;
  const cached = cacheGet<GitHubData>(cacheKey);
  if (cached) return cached;

  const [userRes, repos] = await Promise.all([
    githubClient.get(`/users/${encodeURIComponent(normalizedUsername)}`, {
      signal,
    }),
    fetchAllGitHubRepositories(normalizedUsername, signal),
  ]);

  const data = userRes.data;
  if (!isGitHubShape(data)) throw new Error("Unexpected GitHub response shape");

  const total_stars = repos.reduce(
    (sum, repository) => sum + (repository.stargazers_count ?? 0),
    0,
  );
  const languages: Record<string, number> = {};
  for (const repository of repos) {
    if (repository.language) {
      languages[repository.language] =
        (languages[repository.language] ?? 0) + 1;
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
  const normalizedUsername = normalizeUsername(username);
  const cacheKey = `leetcode:${normalizedUsername}`;
  const cached = cacheGet<LeetCodeData>(cacheKey);
  if (cached) return cached;

  const res = await leetcodeClient.get(`/${encodeURIComponent(normalizedUsername)}`, {
    signal,
  });
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
  const normalizedUsername = normalizeUsername(username);
  const cacheKey = `gfg:${normalizedUsername}`;
  const cached = cacheGet<GFGData>(cacheKey);
  if (cached) return cached;

  const res = await gfgClient.get(`/${encodeURIComponent(normalizedUsername)}`, {
    signal,
  });
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
    if (err.code === "ERR_CANCELED") return "Request canceled";
    if (err.response?.status === 404) return "User not found (404)";
    if (err.response?.status === 403 || err.response?.status === 429) {
      return "Rate limited — try again later";
    }
    if (err.code === "ECONNABORTED") return "Request timed out";
    return (
      (err.response?.data?.message as string) ?? err.message ?? "Unknown error"
    );
  }
  return err instanceof Error ? err.message : "Unknown error";
};

export { CACHE_TTL_MS };
export const clearMetricsCache = (): void => {
  const storage = getCacheStorage();
  if (!storage) return;

  for (let index = storage.length - 1; index >= 0; index -= 1) {
    const key = storage.key(index);
    if (key?.startsWith(CACHE_PREFIX)) storage.removeItem(key);
  }
};

export const getCacheTimestamp = (key: string): number | null => {
  const storage = getCacheStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(`${CACHE_PREFIX}${key}`);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry<unknown>;
    return typeof entry.ts === "number" ? entry.ts : null;
  } catch {
    return null;
  }
};

export const cacheKeyFor = (platform: "github" | "leetcode" | "gfg", username: string) =>
  `${platform}:${normalizeUsername(username)}`;
