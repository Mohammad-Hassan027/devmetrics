import { useCallback } from "react";
import { fetchGFG, extractErrorMessage } from "../services/api";
import { useFetch } from "./useFetch";
import type { GFGData } from "../types";

export function useGFG() {
  const { data, status, error, fetch, reset } = useFetch<[string], GFGData>(
    async (username: string, signal?: AbortSignal) => {
      if (!username.trim()) throw new Error("empty username");
      return fetchGFG(username.trim(), signal);
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
