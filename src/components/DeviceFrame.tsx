import type { ReactNode } from 'react';
import clsx from 'clsx';

type Props = {
  children: ReactNode;
};

/**
 * iPhone 15 Pro frame.
 *
 * Below md (≤767px): renders children full-bleed at 100dvh.
 * At md+ (≥768px): renders children inside a 390×844 rounded shell with a notch
 * and a mock iOS status bar, sitting on a cocoa-15 page background.
 *
 * The visibility switch is pure CSS (Tailwind responsive utilities) — no JS,
 * no flash on load.
 */
export function DeviceFrame({ children }: Props) {
  return (
    <div
      className={clsx(
        // mobile: full-bleed ivory
        'relative h-dvh w-full bg-cream',
        // desktop: a light warm stage so the cream phone pops without the
        // muddy heavy-brown backdrop (it's projected on a wall during the demo)
        'md:flex md:h-dvh md:items-center md:justify-center md:p-md',
        'md:bg-gradient-to-br md:from-linen md:to-clay',
      )}
    >
      {/* Brand lockup — fills the otherwise-empty stage margins with the
          product name during a projected demo. Desktop stage only. */}
      <div
        aria-hidden
        className="pointer-events-none absolute start-lg top-lg hidden flex-col gap-px text-charcoal md:flex"
      >
        <span className="font-serif text-sub font-bold leading-none tracking-tight">
          Tarmil
        </span>
        <span className="text-small text-charcoal-70">
          Travel for Israelis abroad
        </span>
      </div>
      <div
        className={clsx(
          'relative h-full w-full bg-cream overflow-hidden',
          // device shell on desktop
          'md:h-[844px] md:w-[390px] md:max-h-[calc(100dvh-32px)]',
          'md:rounded-device md:shadow-device',
          'md:ring-1 md:ring-charcoal-15',
        )}
      >
        {/* notch — desktop only.
            Centered via flex+inset-x rather than left-1/2+translate so the
            Hebrew dir="rtl" flip leaves it visually anchored. */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 inset-x-0 z-30 flex hidden justify-center md:flex"
        >
          <div className="h-[28px] w-[120px] rounded-b-notch bg-charcoal" />
        </div>

        {/* status bar mock — desktop only.
            forced LTR because iOS clock/indicators are LTR even in Hebrew.
            top padding clears the 54px corner radius; px-9 clears the start curve. */}
        <div
          aria-hidden
          dir="ltr"
          className={clsx(
            'absolute top-0 inset-x-0 z-20 flex items-start justify-between',
            'h-[44px] pt-3 px-9 text-charcoal text-small font-medium tnum',
            'hidden md:flex',
          )}
        >
          <span>9:41</span>
          <span className="flex items-center gap-1.5">
            <SignalGlyph />
            <WifiGlyph />
            <BatteryGlyph />
          </span>
        </div>

        {/* content area — leaves room for the notch/status bar on desktop */}
        <div className="absolute inset-0 md:top-[44px] flex flex-col">
          {children}
        </div>

        {/* portal target for app-modal sheets (tool details, settings detail,
            compose). Anchored to the device interior so on desktop they cover
            the phone, not the desktop viewport. */}
        <div id="device-portal" className="pointer-events-none absolute inset-0 md:top-[44px] z-[2000]" />
      </div>
    </div>
  );
}

function SignalGlyph() {
  return (
    <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor" aria-hidden>
      <rect x="0" y="6" width="3" height="4" rx="0.5" />
      <rect x="4.5" y="4" width="3" height="6" rx="0.5" />
      <rect x="9" y="2" width="3" height="8" rx="0.5" />
      <rect x="13.5" y="0" width="3" height="10" rx="0.5" />
    </svg>
  );
}

function WifiGlyph() {
  return (
    <svg width="14" height="10" viewBox="0 0 14 10" fill="none" aria-hidden>
      <path
        d="M1 3a9 9 0 0 1 12 0M3 5.5a6 6 0 0 1 8 0M5 8a3 3 0 0 1 4 0"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BatteryGlyph() {
  return (
    <svg width="22" height="10" viewBox="0 0 22 10" fill="none" aria-hidden>
      <rect
        x="0.5"
        y="0.5"
        width="18"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect x="2" y="2" width="14" height="6" rx="1" fill="currentColor" />
      <rect x="20" y="3.5" width="1.5" height="3" rx="0.5" fill="currentColor" />
    </svg>
  );
}
