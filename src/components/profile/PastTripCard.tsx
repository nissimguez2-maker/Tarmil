type Props = {
  destinationHe: string;
  /** Season + year + duration label, e.g. "Spring 2025 · 8 days". */
  metaLine: string;
  /** Optional small emoji flag prefix. */
  flag?: string;
};

/**
 * Compact past-trip card for the Profile tab. The destination is rendered in
 * Fraunces serif italic at lede size; below it sits a meta line at season +
 * year + duration resolution. Privacy posture: we never expose raw dates.
 */
export function PastTripCard({ destinationHe, metaLine, flag }: Props) {
  return (
    <div className="flex items-center gap-sm rounded-2xl bg-cream shadow-card p-md">
      {flag && (
        <span className="text-sub leading-none" aria-hidden>
          {flag}
        </span>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="font-serif text-lede italic text-charcoal">
          {destinationHe}
        </span>
        <span className="text-small text-charcoal-55">{metaLine}</span>
      </div>
    </div>
  );
}
