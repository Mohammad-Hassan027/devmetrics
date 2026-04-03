import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useGitHub } from "../hooks/useGitHub";
import { useLeetCode } from "../hooks/useLeetCode";
import { useGFG } from "../hooks/useGFG";
import type { Usernames, DevStats, FetchStatus } from "../types";
import { makeIdle } from "../types";

export interface DevMetricsContextValue {
  /** Currently active usernames. null = form not yet submitted. */
  usernames: Usernames | null;

  /** Per-platform async state objects */
  stats: DevStats;

  /** true while ANY platform fetch is in-flight */
  isLoading: boolean;

  /** true only if every requested platform returned an error */
  isError: boolean;

  /** true if at least one platform returned data */
  hasData: boolean;

  /** Rolled-up status across all platforms */
  overallStatus: "idle" | "loading" | "partial" | "success" | "error";

  /** Submit usernames → triggers all fetches */
  submitUsernames: (u: Usernames) => void;

  /** Clear usernames + reset all async state */
  clearUsernames: () => void;
}

const DevMetricsContext = createContext<DevMetricsContextValue | null>(null);

/**
 * useDevMetrics
 *
 * Consume the global DevMetrics context. Throws a descriptive error if called
 * outside of <DevMetricsProvider>.
 */
export function useDevMetrics(): DevMetricsContextValue {
  const ctx = useContext(DevMetricsContext);
  if (!ctx) {
    throw new Error(
      "useDevMetrics must be used inside <DevMetricsProvider>. " +
        "Wrap your app (or at least the component tree that needs stats) with it.",
    );
  }
  return ctx;
}

interface DevMetricsProviderProps {
  children: ReactNode;
}

export function DevMetricsProvider({ children }: DevMetricsProviderProps) {
  const [usernames, setUsernames] = useState<Usernames | null>(null);

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
    async (u: Usernames) => {
      const promises: Promise<void>[] = [];
      if (u.github.trim()) promises.push(ghFetch(u.github.trim()));
      if (u.leetcode.trim()) promises.push(lcFetch(u.leetcode.trim()));
      if (u.gfg.trim()) promises.push(gfgFetch(u.gfg.trim()));
      await Promise.allSettled(promises);
    },
    [ghFetch, lcFetch, gfgFetch],
  );

  const resetAll = useCallback(() => {
    ghReset();
    lcReset();
    gfgReset();
  }, [ghReset, lcReset, gfgReset]);

  const submitUsernames = useCallback((u: Usernames) => {
    setUsernames(u);
  }, []);

  const clearUsernames = useCallback(() => {
    setUsernames(null);
    resetAll();
  }, [resetAll]);

  const ghUser = usernames?.github ?? "";
  const lcUser = usernames?.leetcode ?? "";
  const gfgUser = usernames?.gfg ?? "";

  useEffect(() => {
    if (!ghUser && !lcUser && !gfgUser) return;
    void fetchAll({ github: ghUser, leetcode: lcUser, gfg: gfgUser });
  }, [ghUser, lcUser, gfgUser, fetchAll]);

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
  const hasData = Boolean(github.data || leetcode.data || gfg.data);

  const activeStatuses = allStatuses.filter((s) => s !== "idle");
  const isError =
    activeStatuses.length > 0 && activeStatuses.every((s) => s === "error");

  const overallStatus: DevMetricsContextValue["overallStatus"] = isLoading
    ? "loading"
    : isError
      ? "error"
      : hasData && activeStatuses.some((s) => s === "error")
        ? "partial"
        : hasData
          ? "success"
          : "idle";

  const value = useMemo<DevMetricsContextValue>(
    () => ({
      usernames,
      stats,
      isLoading,
      isError,
      hasData,
      overallStatus,
      submitUsernames,
      clearUsernames,
    }),
    [
      usernames,
      stats,
      isLoading,
      isError,
      hasData,
      overallStatus,
      submitUsernames,
      clearUsernames,
    ],
  );

  return (
    <DevMetricsContext.Provider value={value}>
      {children}
    </DevMetricsContext.Provider>
  );
}

export const EMPTY_STATS: DevStats = {
  github: makeIdle(),
  leetcode: makeIdle(),
  gfg: makeIdle(),
};
