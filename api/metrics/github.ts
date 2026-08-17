import type { VercelRequest, VercelResponse } from "@vercel/node";
import axios, { AxiosError } from "axios";
import { getCache, setCache, cacheKey, TTL } from "../../lib/serverCache";

// ── GitHub client ──────────────────────────────────────────────────────────────
// A fine-grained token raises the rate ceiling from 60 req/hr (IP-based,
// unauthenticated) to 1,000 req/hr. The token is read-only and scoped to
// public repo content only. It is deliberately NOT committed; set it via
// `vercel env add GITHUB_TOKEN`.
const gh = axios.create({
  baseURL: "https://api.github.com",
  timeout: 12_000,
  headers: {
    Accept: "application/vnd.github+json",
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
    "User-Agent": "DevMetrics (https://github.com/Mohammad-Hassan027/devmetrics)",
  },
});

type GitHubRepositoryNode = {
  stargazerCount?: number | null;
  primaryLanguage?: { name: string } | null;
};

// GraphQL single-call replacement for the old REST pagination loop
// (per_page=100, one request per 100 repos). Large contributors now cost
// exactly one upstream call instead of N.
const LANGUAGE_QUERY = `
  query($login: String!) {
    user(login: $login) {
      login
      name
      avatarUrl
      url
      bio
      publicRepositories: repositories(
        first: 100
        affiliations: [OWNER, COLLABORATOR]
        isFork: false
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        nodes {
          stargazerCount
          primaryLanguage { name }
        }
      }
      contributionsCollection {
        totalCommitContributions
      }
    }
  }
`;

// ── Resilience helpers ─────────────────────────────────────────────────────────
/** Exponential backoff with jitter, gated by GitHub's x-ratelimit-reset header. */
async function withBackoff<T>(
  fn: (attempt: number) => Promise<T>,
  opts: { maxAttempts?: number; baseMs?: number } = {},
): Promise<T> {
  const maxAttempts = opts.maxAttempts ?? 4;
  const baseMs = opts.baseMs ?? 500;
  let lastErr: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastErr = err;
      const status = (err as AxiosError<{ message?: string }>)?.response?.status;
      if (status === 403 || status === 429) {
        const headers = (err as AxiosError)?.response?.headers ?? {};
        const reset = Number(headers["x-ratelimit-reset"] ?? 0);
        const sleepMs = reset
          ? Math.min(Math.max(reset * 1000 - Date.now(), 0), 60_000)
          : baseMs * 2 ** attempt + Math.random() * 500;
        await new Promise((resolve) => setTimeout(resolve, Math.max(sleepMs, 250)));
        continue;
      }
      throw err;
    }
  }
  throw lastErr;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const username = typeof req.query.username === "string" ? req.query.username.trim() : "";
  if (!username) {
    res.status(400).json({ error: "username required" });
    return;
  }

  const key = cacheKey("github", username);
  const cached = await getCache<Record<string, unknown>>(key);
  if (cached) {
    res.json({ data: cached, fresh: false });
    return;
  }

  let data: Record<string, unknown>;
  try {
    const gqlRes = await withBackoff(() =>
      gh.post("/graphql", { query: LANGUAGE_QUERY, variables: { login: username } }),
    );
    const user = gqlRes.data?.data?.user;
    if (!user || typeof user.login !== "string") {
      res.status(404).json({ error: "User not found (404)" });
      return;
    }
    const repos = (user.publicRepositories?.nodes ?? []) as GitHubRepositoryNode[];
    const total_stars = repos.reduce(
      (sum: number, repository) => sum + (repository.stargazerCount ?? 0),
      0,
    );
    const languages: Record<string, number> = {};
    for (const repository of repos) {
      const language = repository.primaryLanguage?.name;
      if (language) {
        languages[language] = (languages[language] ?? 0) + 1;
      }
    }
    data = {
      login: user.login,
      name: user.name ?? null,
      avatar_url: user.avatarUrl,
      html_url: user.url,
      bio: user.bio ?? null,
      public_repos: repos.length,
      followers: 0,
      following: 0,
      total_stars,
      total_commits:
        user.contributionsCollection?.totalCommitContributions ?? 0,
      languages,
    };
  } catch (err) {
    const status = (err as AxiosError)?.response?.status ?? 500;
    if (status === 404) {
      res.status(404).json({ error: "User not found (404)" });
      return;
    }
    res.status(503).json({ error: "GitHub data unavailable — try again later" });
    return;
  }

  await setCache(key, data, TTL.github);
  res.json({ data, fresh: true });
}
