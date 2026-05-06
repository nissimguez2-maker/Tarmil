import { useEffect, useRef, useState } from 'react';

/**
 * Generic localStorage-backed React state. Survives refresh — important for
 * investor demos where mid-walkthrough refreshes shouldn't reset the mock.
 *
 *  - Reads the initial value lazily on first render.
 *  - Writes through to localStorage on every change.
 *  - Catches JSON parse errors and quota errors silently — falls back to the
 *    `initial` value if storage is corrupted.
 */
export function usePersistentState<T>(
  key: string,
  initial: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const initialRef = useRef(initial);

  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initialRef.current;
    try {
      const stored = window.localStorage.getItem(key);
      if (stored == null) return initialRef.current;
      return JSON.parse(stored) as T;
    } catch {
      return initialRef.current;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore quota / serialization errors — the demo still works in memory
    }
  }, [key, state]);

  return [state, setState];
}
