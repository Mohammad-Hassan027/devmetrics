import { useCallback } from "react";
import { fetchLeetCode, extractErrorMessage } from "../services/api";
import { useFetch } from "./useFetch";
import type { LeetCodeData } from "../types";

export function useLeetCode() {
  const { data, status, error, fetch, reset } = useFetch<[string], LeetCodeData>(
    async (username: string, signal?: AbortSignal) => {
      if (!username.trim()) throw new Error("empty username");
      return fetchLeetCode(username.trim(), signal);
    },
  );

  const wrappedFetch = useCallback(
    async (username: string) => {
      try {
        await fetch(username);
      } catch (err) {
        void extractErrorMessage(err as unknown);
      }
    },
    [fetch],
  );

  return { data, status, error, fetch: wrappedFetch, reset };
}
