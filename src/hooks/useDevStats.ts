import { useCallback, useMemo } from "react";
import { useGitHub } from "./useGitHub";
import { useLeetCode } from "./useLeetCode";
import { useGFG } from "./useGFG";
import type { Usernames, DevStats, FetchStatus } from "../types";

/**
 * useDevStats
 *
 * Orchestrates all three platform fetches. Fires them in parallel and
 * exposes a unified `stats` object along with a combined loading/error state.
 *
 * Returns:
 *  - stats      → { github, leetcode, gfg } each with { data, status, error }
 *  - isLoading  → true while ANY platform is still loading
 *  - isError    → true if ALL requested platforms failed
 *  - hasData    → true if at least one platform returned data
 *  - overallStatus → 'idle' | 'loading' | 'partial' | 'success' | 'error'
 *  - fetchAll   → (usernames) trigger parallel fetches
 *  - resetAll   → reset entire combined state
 */
export function useDevStats() {
  const github = useGitHub();
  const leetcode = useLeetCode();
  const gfg = useGFG();

  const ghFetch = github.fetch;
  const lcFetch = leetcode.fetch;
  const gfgFetch = gfg.fetch;
  const ghReset = github.reset;
  const lcReset = leetcode.reset;
  const gfgReset = gfg.reset;
  const fetchAll = useCallback(
    async (usernames: Usernames) => {
      const promises: Promise<void>[] = [];

      if (usernames.github.trim()) promises.push(ghFetch(usernames.github));
      if (usernames.leetcode.trim()) promises.push(lcFetch(usernames.leetcode));
      if (usernames.gfg.trim()) promises.push(gfgFetch(usernames.gfg));

      await Promise.allSettled(promises);
    },
    [ghFetch, lcFetch, gfgFetch],
  );

  const resetAll = useCallback(() => {
    ghReset();
    lcReset();
    gfgReset();
  }, [ghReset, lcReset, gfgReset]);

  const stats: DevStats = useMemo(
    () => ({
      github: { data: github.data, status: github.status, error: github.error },
      leetcode: {
        data: leetcode.data,
        status: leetcode.status,
        error: leetcode.error,
      },
      gfg: { data: gfg.data, status: gfg.status, error: gfg.error },
    }),
    [
      github.data,
      github.status,
      github.error,
      leetcode.data,
      leetcode.status,
      leetcode.error,
      gfg.data,
      gfg.status,
      gfg.error,
    ],
  );

  const allStatuses: FetchStatus[] = [
    github.status,
    leetcode.status,
    gfg.status,
  ];

  const isLoading = allStatuses.some((s) => s === "loading");
  const hasData = [github.data, leetcode.data, gfg.data].some(Boolean);

  const activeStatuses = allStatuses.filter((s) => s !== "idle");
  const isError =
    activeStatuses.length > 0 && activeStatuses.every((s) => s === "error");

  const overallStatus: "idle" | "loading" | "partial" | "success" | "error" =
    isLoading
      ? "loading"
      : isError
        ? "error"
        : hasData && activeStatuses.some((s) => s === "error")
          ? "partial"
          : hasData
            ? "success"
            : "idle";

  return {
    stats,
    isLoading,
    isError,
    hasData,
    overallStatus,
    fetchAll,
    resetAll,
  };
}
