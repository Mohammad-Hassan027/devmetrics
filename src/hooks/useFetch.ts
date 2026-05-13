import { useCallback, useRef, useState, useEffect } from "react";

export type FetchStatus = "idle" | "loading" | "success" | "error";

export interface AsyncState<T> {
  data: T | null;
  status: FetchStatus;
  error: string | null;
}

export function makeIdle<T>(): AsyncState<T> {
  return { data: null, status: "idle", error: null };
}

/**
 * useFetch - generic fetch hook that supports AbortController and typing.
 * fetcher signature: (arg: A, signal?: AbortSignal) => Promise<T>
 */
export function useFetch<A extends unknown[], T>(
  fetcher: (...args: [...A, AbortSignal?]) => Promise<T>,
) {
  const [state, setState] = useState<AsyncState<T>>(makeIdle());
  const abortRef = useRef<AbortController | null>(null);
  
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const run = useCallback(
    async (...args: A) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setState({ data: null, status: "loading", error: null });

      try {
        const result = await fetcherRef.current(...args, controller.signal);
        setState({ data: result, status: "success", error: null });
        return result;
      } catch (err: unknown) {
        if ((err as Error)?.name === "AbortError") {
          setState(makeIdle());
          return Promise.reject(err);
        }
        const message = err instanceof Error ? err.message : "Unknown error";
        setState({ data: null, status: "error", error: message });
        return Promise.reject(err);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setState(makeIdle());
  }, []);

  return { ...state, fetch: run, reset } as const;
}
