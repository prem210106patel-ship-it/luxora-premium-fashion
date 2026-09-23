import { useEffect, useState } from "react";

/**
 * Persisted state that is SSR-safe: the first render always uses `initial`,
 * then the stored value is hydrated in an effect to avoid mismatches.
 */
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage may be unavailable */
    }
  }, [key, value, hydrated]);

  return [value, setValue, hydrated] as const;
}
