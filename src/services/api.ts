import axios from "axios";
import type { GitHubData, LeetCodeData, GFGData } from "../types";

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

function isGitHubShape(obj: unknown): obj is GitHubData {
  return (
    !!obj &&
    typeof (obj as any).login === "string" &&
    typeof (obj as any).html_url === "string" &&
    typeof (obj as any).avatar_url === "string"
  );
}

export const fetchGitHub = async (
  username: string,
  signal?: AbortSignal,
): Promise<GitHubData> => {
  const res = await githubClient.get(`/users/${username}`, { signal });
  const data = res.data;
  if (!isGitHubShape(data)) throw new Error("Unexpected GitHub response shape");
  return data as GitHubData;
};

export const fetchLeetCode = async (
  username: string,
  signal?: AbortSignal,
): Promise<LeetCodeData> => {
  const res = await leetcodeClient.get(`/${username}`, { signal });
  const data = res.data as LeetCodeData;
  if (!data || typeof data.username !== "string") {
    throw new Error("Unexpected LeetCode response shape");
  }
  return data;
};

export const fetchGFG = async (
  username: string,
  signal?: AbortSignal,
): Promise<GFGData> => {
  const res = await gfgClient.get(`/${username}`, { signal });
  const data = res.data as GFGData;
  if (!data || typeof (data as any).userName !== "string") {
    throw new Error("Unexpected GFG response shape");
  }
  return data;
};

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
