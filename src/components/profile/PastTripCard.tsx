type Props = {
  destinationHe: string;
  /** Season + year + duration label, e.g. "אביב 2025 · 8 ימים". */
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
    <div className="flex items-center gap-3 rounded-md border border-cocoa-15 bg-ivory p-md">
      {flag && (
        <span className="text-[20pt] leading-none" aria-hidden>
          {flag}
        </span>
      )}
      <div className="flex flex-col gap-1">
        <span className="font-serif text-lede italic text-cocoa">
          {destinationHe}
        </span>
        <span className="text-[10pt] text-cocoa-55">{metaLine}</span>
      </div>
    </div>
  );
}
