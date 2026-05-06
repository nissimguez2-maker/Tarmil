import { useEffect, useState } from 'react';
import { CURRENCIES, type CurrencyCode } from '../data/currencies';

const CACHE_KEY = 'tarmil:rates:v1';
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12h
const ENDPOINT =
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/ils.json';

export type LiveRates = Partial<Record<CurrencyCode, number>>;

type Cached = { fetchedAt: number; rates: LiveRates; date: string };

type State = {
  rates: LiveRates | null;
  fetchedDate: string | null;
  loading: boolean;
  error: boolean;
};

/**
 * Fetches live currency rates from the free `@fawazahmed0/currency-api`
 * (jsDelivr CDN, no API key, no rate limit, MIT). Returns ILS-base
 * multipliers — `rates[USD] = 3.70` means 1 USD = 3.70 ILS.
 *
 * Caches the response in localStorage for 12 hours. Falls back to `null`
 * if the network fails — callers should use the static rates from
 * currencies.ts as the offline default.
 */
export function useLiveRates(): State {
  const [state, setState] = useState<State>({
    rates: null,
    fetchedDate: null,
    loading: true,
    error: false,
  });

  useEffect(() => {
    let cancelled = false;

    // Cache hit?
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const cached = JSON.parse(raw) as Cached;
        if (
          cached &&
          typeof cached.fetchedAt === 'number' &&
          Date.now() - cached.fetchedAt < CACHE_TTL_MS &&
          cached.rates
        ) {
          setState({
            rates: cached.rates,
            fetchedDate: cached.date ?? null,
            loading: false,
            error: false,
          });
          return;
        }
      }
    } catch {
      // ignore cache parse errors
    }

    fetch(ENDPOINT)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: { date: string; ils: Record<string, number> }) => {
        if (cancelled) return;
        const ils = data.ils ?? {};
        const rates: LiveRates = { ILS: 1 };
        for (const c of CURRENCIES) {
          if (c.code === 'ILS') continue;
          const ilsToCode = ils[c.code.toLowerCase()];
          if (typeof ilsToCode === 'number' && ilsToCode > 0) {
            rates[c.code] = 1 / ilsToCode;
          }
        }
        try {
          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify({
              fetchedAt: Date.now(),
              rates,
              date: data.date,
            } satisfies Cached),
          );
        } catch {
          // ignore quota errors
        }
        setState({
          rates,
          fetchedDate: data.date ?? null,
          loading: false,
          error: false,
        });
      })
      .catch(() => {
        if (cancelled) return;
        setState({
          rates: null,
          fetchedDate: null,
          loading: false,
          error: true,
        });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
