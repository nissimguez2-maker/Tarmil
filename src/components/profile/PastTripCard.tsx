import { useState } from 'react';

type Props = {
  destinationHe: string;
  /** Season + year + duration label, e.g. "Spring 2025 · 8 days". */
  metaLine: string;
  /** ISO 3166-1 alpha-2 country code, e.g. "br". Renders a crisp flag SVG. */
  countryCode?: string;
};

/**
 * Compact past-trip card for the Profile tab. The destination is rendered in
 * Fraunces serif italic at lede size; below it sits a meta line at season +
 * year + duration resolution. Privacy posture: we never expose raw dates.
 *
 * The flag is a real SVG (flagcdn) rather than an emoji — consistent across
 * platforms and design-controlled. It hides cleanly if the asset fails.
 */
export function PastTripCard({ destinationHe, metaLine, countryCode }: Props) {
  const [flagOk, setFlagOk] = useState(true);
  return (
    <div className="flex items-center gap-sm rounded-2xl bg-cream shadow-card p-md">
      {countryCode && flagOk && (
        <img
          src={`https://flagcdn.com/${countryCode}.svg`}
          alt=""
          loading="lazy"
          onError={() => setFlagOk(false)}
          className="h-6 w-9 shrink-0 rounded-[3px] object-cover shadow-[0_0_0_1px_var(--charcoal-15)]"
        />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="font-serif text-lede text-charcoal">
          {destinationHe}
        </span>
        <span className="text-small text-charcoal-55">{metaLine}</span>
      </div>
    </div>
  );
}
