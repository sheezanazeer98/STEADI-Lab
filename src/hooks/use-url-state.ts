"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Primitive = string | string[];
type StateShape = Record<string, Primitive>;

function parse(search: string, defaults: StateShape): StateShape {
  const params = new URLSearchParams(search);
  const next: StateShape = { ...defaults };
  for (const key of Object.keys(defaults)) {
    const value = params.get(key);
    if (value === null) continue;
    next[key] = Array.isArray(defaults[key]) ? value.split(",").filter(Boolean) : value;
  }
  return next;
}

function serialize(state: StateShape, defaults: StateShape): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(state)) {
    const fallback = defaults[key];
    const isDefault = Array.isArray(value)
      ? value.length === 0 || value.join(",") === (fallback as string[]).join(",")
      : value === fallback;
    if (isDefault) continue;
    params.set(key, Array.isArray(value) ? value.join(",") : value);
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

/**
 * Keeps lightweight filter state in sync with the URL query string without
 * opting the page out of static rendering. The first render uses the defaults
 * (matching the server HTML); the URL is read once after hydration.
 */
export function useUrlState<T extends StateShape>(defaults: T) {
  const defaultsRef = useRef(defaults);
  const [state, setState] = useState<T>(defaults);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(parse(window.location.search, defaultsRef.current) as T);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const query = serialize(state, defaultsRef.current);
    const url = `${window.location.pathname}${query}${window.location.hash}`;
    if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
      window.history.replaceState(window.history.state, "", url);
    }
  }, [state, hydrated]);

  const update = useCallback((patch: Partial<T>) => {
    setState((previous) => ({ ...previous, ...patch }));
  }, []);

  const reset = useCallback(() => setState(defaultsRef.current), []);

  return { state, update, reset } as const;
}
