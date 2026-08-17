import axios from "axios";
import type { GitHubData, LeetCodeData, GFGData } from "../types";

// ── API clients ────────────────────────────────────────────────────────────────
// All platform fetching is now routed through the same-origin Vercel Function
// proxy (/api/metrics/:platform). The proxy owns platform credentials and a
// shared server cache, so browser visitors never consume the GitHub public
// rate limit directly. Legacy direct clients are kept only where no proxy
// route exists yet.
const metricsClient = axios.create({ timeout: 15_000 });
const metricsUrl = (platform: string) => `/api/metrics/${platform}`;

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
// Server-side note: repository pagination/star/language aggregation moved to
// api/metrics/github.ts (single GraphQL call). The client no longer walks REST
// pages directly.

/**
 * Fetches GitHub user profile, aggregated stars, commit contributions, and
 * languages from the server-side proxy (/api/metrics/github). The proxy owns
 * the GitHub token, a shared cache, and GraphQL-based aggregation, so repeated
 * visits across tabs and browser sessions do not consume the GitHub rate
 * limit. A 15-minute localStorage layer remains in front of the proxy for
 * instant tab-switch loads.
 */
export const fetchGitHub = async (
  username: string,
  signal?: AbortSignal,
): Promise<GitHubData> => {
  const normalizedUsername = normalizeUsername(username);
  const cacheKey = `github:${normalizedUsername}`;
  const cached = cacheGet<GitHubData>(cacheKey);
  if (cached) return cached;

  const res = await metricsClient.get(metricsUrl("github"), {
    params: { username: normalizedUsername },
    signal,
  });

  const data = res.data?.data as GitHubData | undefined;
  if (!data || !isGitHubShape(data)) {
    throw new Error("Unexpected GitHub response shape");
  }

  cacheSet(cacheKey, data);
  return data;
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
    if (err.response?.status === 503) {
      return "Metrics service temporarily unavailable — try again shortly";
    }
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
