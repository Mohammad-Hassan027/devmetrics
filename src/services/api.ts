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

export const fetchGitHub = async (username: string): Promise<GitHubData> => {
  const res = await githubClient.get<GitHubData>(`/users/${username}`);
  return res.data;
};

export const fetchLeetCode = async (
  username: string,
): Promise<LeetCodeData> => {
  const res = await leetcodeClient.get<LeetCodeData>(`/${username}`);
  return res.data;
};

export const fetchGFG = async (username: string): Promise<GFGData> => {
  const res = await gfgClient.get<GFGData>(`/${username}`);
  return res.data;
};

/** Extracts a human-readable message from an axios error or unknown throw. */
export const extractErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 404) return "User not found (404)";
    if (err.response?.status === 429) return "Rate limited — try again later";
    if (err.code === "ECONNABORTED") return "Request timed out";
    return err.response?.data?.message ?? err.message;
  }
  return err instanceof Error ? err.message : "Unknown error";
};
