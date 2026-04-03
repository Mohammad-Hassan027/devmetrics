import { useState, useCallback } from "react";
import { fetchGitHub, extractErrorMessage } from "../services/api";
import type { AsyncState, GitHubData } from "../types";
import { makeIdle } from "../types";

export function useGitHub() {
  const [state, setState] = useState<AsyncState<GitHubData>>(makeIdle());

  const fetch = useCallback(async (username: string) => {
    if (!username.trim()) return;

    setState({ data: null, status: "loading", error: null });
    try {
      const data = await fetchGitHub(username.trim());
      setState({ data, status: "success", error: null });
    } catch (err) {
      setState({
        data: null,
        status: "error",
        error: extractErrorMessage(err),
      });
    }
  }, []);

  const reset = useCallback(() => setState(makeIdle()), []);

  return { ...state, fetch, reset };
}
