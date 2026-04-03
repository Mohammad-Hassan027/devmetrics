import { useState, useCallback } from "react";
import { fetchLeetCode, extractErrorMessage } from "../services/api";
import type { AsyncState, LeetCodeData } from "../types";
import { makeIdle } from "../types";

export function useLeetCode() {
  const [state, setState] = useState<AsyncState<LeetCodeData>>(makeIdle());

  const fetch = useCallback(async (username: string) => {
    if (!username.trim()) return;

    setState({ data: null, status: "loading", error: null });
    try {
      const data = await fetchLeetCode(username.trim());
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
