import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Sparkles, X } from 'lucide-react';

/**
 * Guided demo mode — a presenter aid for the projected investor demo.
 *
 * A small "Guided tour" pill sits just below the header on every surface.
 * Toggling it on shows a one-line caption for the current screen that calls
 * out the differentiator investors should notice (presence, privacy, the
 * curated kosher / Jewish-friendly layer, the disclosed merchant model). The
 * on/off state is shared and persisted, so it carries across tabs.
 *
 * Tiny external store (mirrors the wishlist pattern) so the toggle and the
 * caption stay in sync without threading state through the router.
 */
const KEY = 'tarmil:demo-guide';
let enabled =
  typeof window !== 'undefined' && localStorage.getItem(KEY) === '1';
const listeners = new Set<() => void>();

function setEnabled(value: boolean): void {
  enabled = value;
  try {
    localStorage.setItem(KEY, value ? '1' : '0');
  } catch {
    // ignore storage errors
  }
  listeners.forEach((fn) => fn());
}

function useGuideEnabled(): boolean {
  const [, force] = useState(0);
  useEffect(() => {
    const fn = () => force((n) => n + 1);
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return enabled;
}

type Caption = { label: string; text: string };

const WEB_CAPTION: Caption = {
  label: 'Desktop planner',
  text: 'Map, itinerary, and a live city panel side by side. Drag to reorder, or open Full view for the whole trip.',
};

function captionFor(pathname: string): Caption {
  if (/^\/place\//.test(pathname))
    return {
      label: 'Place detail',
      text: 'Tarmil and Google ratings, friends who know it, and an honest Sponsored vs. earned Tarmil Selection label.',
    };
  if (/^\/trip\/stop\//.test(pathname))
    return {
      label: 'Next stop',
      text: 'Everything for one stop: who will be there, plus the forum chatter that matters.',
    };
  if (/^\/trip/.test(pathname))
    return {
      label: 'Trip, the map',
      text: 'You and your friends on one continent-scale map. Pins and bubbles, never an exact location.',
    };
  if (/^\/plan/.test(pathname))
    return {
      label: 'Plan',
      text: 'Saved places organised by trip. Worldwide curated spots, including kosher and Jewish-friendly, via Discover.',
    };
  if (/^\/activity/.test(pathname))
    return {
      label: 'Activity, the hook',
      text: 'Right now shows friends in your city. One-tap Ping is the daily-open moment the social layer rests on.',
    };
  if (/^\/forums\/[^/]+\/[^/]+/.test(pathname))
    return {
      label: 'Forum thread',
      text: 'Post as yourself or anonymously. Your choice every time.',
    };
  if (/^\/forums/.test(pathname))
    return {
      label: 'Forums',
      text: 'One forum per city and subject. Local, practical, verified.',
    };
  if (/^\/tools/.test(pathname))
    return {
      label: 'Tools',
      text: 'Seven travel utilities that work offline: currency, translate, checklist, and more.',
    };
  if (/^\/profile\/friend/.test(pathname))
    return {
      label: 'A friend',
      text: 'Dates show as season and year only, never the exact day.',
    };
  if (/^\/profile/.test(pathname))
    return {
      label: 'Privacy first',
      text: 'One tap to go Off-grid and hide your route from every friend.',
    };
  return {
    label: 'Tarmil',
    text: 'Travel for Israeli backpackers: presence, privacy, and curated local knowledge.',
  };
}

export function DemoGuide({ surface = 'app' }: { surface?: 'app' | 'web' }) {
  const on = useGuideEnabled();
  const { pathname } = useLocation();
  const cap = surface === 'web' ? WEB_CAPTION : captionFor(pathname);

  return (
    <div
      className={clsx(
        'pointer-events-none absolute inset-x-0 z-[1500] flex justify-center px-md',
        surface === 'web' ? 'top-16' : 'top-lg',
      )}
    >
      {on ? (
        <div className="pointer-events-auto flex w-full max-w-[460px] items-start gap-sm rounded-2xl bg-charcoal/95 p-sm ps-md text-cream shadow-sheet backdrop-blur motion-reduce:transition-none">
          <Sparkles
            className="mt-0.5 h-4 w-4 shrink-0 text-amber"
            strokeWidth={2}
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <p className="meta-caps text-amber">{cap.label}</p>
            <p className="text-small leading-snug text-cream/90">{cap.text}</p>
          </div>
          <button
            type="button"
            onClick={() => setEnabled(false)}
            aria-label="Hide guided tour"
            className="shrink-0 rounded-full p-1 text-cream/70 hover:bg-cream/10 hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
          >
            <X className="h-4 w-4" strokeWidth={2} aria-hidden />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setEnabled(true)}
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-charcoal/85 px-sm py-1 text-cream shadow-card backdrop-blur transition-colors duration-instant ease-out-quart hover:bg-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber motion-reduce:transition-none"
        >
          <Sparkles className="h-3 w-3 text-amber" strokeWidth={2} aria-hidden />
          <span className="meta-caps">Guided tour</span>
        </button>
      )}
    </div>
  );
}
