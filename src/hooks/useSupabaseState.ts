import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Drop-in replacement for usePersistentState that persists through Supabase
 * instead of localStorage. Same signature, same semantics — every state
 * change writes through to the `app_state(key, value jsonb)` table, and a
 * Realtime subscription pulls in changes from other clients viewing the
 * same key (so a founder editing on their phone shows the change live on
 * an investor's screen mid-demo).
 *
 *  - Reads the row once on mount; renders `initial` until the row arrives.
 *  - Writes through on every setState. Fire-and-forget (no awaiting).
 *    Errors are logged; the local React state still advances so the UI
 *    stays snappy and the next successful write recovers.
 *  - Realtime: any UPDATE on this key (from anywhere) reconciles into
 *    local state. INSERTs are echoes from our own write but cost only a
 *    setState (no extra render if the value is referentially equal).
 *  - DELETEs (e.g. from reset_demo_state()) reset the local state to
 *    `initial` so the screens snap back to seed.
 */
export function useSupabaseState<T>(
  key: string,
  initial: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Hold the latest initial in a ref so the deletion path can reset to the
  // current seed without re-running effects on every render.
  const initialRef = useRef(initial);
  initialRef.current = initial;

  const [state, setLocalState] = useState<T>(initial);

  // Initial fetch.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from('app_state')
        .select('value')
        .eq('key', key)
        .maybeSingle();
      if (cancelled) return;
      if (error) {
        console.error(`[useSupabaseState:${key}] fetch failed:`, error);
        return;
      }
      if (data && data.value !== undefined && data.value !== null) {
        setLocalState(data.value as T);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [key]);

  // Realtime: pick up changes from any client editing this key.
  useEffect(() => {
    const channel = supabase
      .channel(`app_state:${key}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'app_state',
          filter: `key=eq.${key}`,
        },
        (payload) => {
          if (payload.eventType === 'DELETE') {
            setLocalState(initialRef.current);
          } else {
            const next = (payload.new as { value: unknown } | null)?.value;
            if (next !== undefined && next !== null) {
              setLocalState(next as T);
            }
          }
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [key]);

  // Write-through. Wraps React's setState so the local update is synchronous
  // (callers see snappy UI) and the network upsert fires in the background.
  const setState: React.Dispatch<React.SetStateAction<T>> = useCallback(
    (updater) => {
      setLocalState((prev) => {
        const next =
          typeof updater === 'function'
            ? (updater as (p: T) => T)(prev)
            : updater;
        supabase
          .from('app_state')
          .upsert({ key, value: next as never })
          .then(({ error }) => {
            if (error) {
              console.error(`[useSupabaseState:${key}] upsert failed:`, error);
            }
          });
        return next;
      });
    },
    [key],
  );

  return [state, setState];
}
