import { useCallback } from "react";
import { fetchGitHub, extractErrorMessage } from "../services/api";
import { useFetch } from "./useFetch";
import type { GitHubData } from "../types";

export function useGitHub() {
  const { data, status, error, fetch, reset } = useFetch<[string], GitHubData>(
    async (username: string, signal?: AbortSignal) => {
      if (!username.trim()) throw new Error("empty username");
      return fetchGitHub(username.trim(), signal);
    },
  );

  const wrappedFetch = useCallback(
    async (username: string) => {
      try {
        await fetch(username);
      } catch (err) {
        // state already updated inside useFetch; normalize message if needed
        // do not rethrow to preserve original hook behavior
        void extractErrorMessage(err as unknown);
      }
    },
    [fetch],
  );

  return { data, status, error, fetch: wrappedFetch, reset };
}
