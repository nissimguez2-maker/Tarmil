import clsx from 'clsx';

type Props = {
  /** Two-digit section number, e.g., "01". Always shown in copper. */
  number: string;
  /** Sentence-case label set in Fraunces italic 500. */
  label: string;
  className?: string;
};

/**
 * The DA's editorial section header pattern:
 *   01    Concept   ──────────
 *   ↑     ↑         ↑
 *   copper italic   cocoa-15 hairline rule, 0.4pt, full content width
 *   meta  Fraunces
 *   caps  500
 *
 * Used at the top of any sectioned content. Sets the editorial tone.
 */
export function SectionLabel({ number, label, className }: Props) {
  return (
    <div className={clsx('flex flex-col gap-xs', className)}>
      <div className="flex items-baseline gap-md">
        <span className="meta-caps text-amber">{number}</span>
        <span className="mid-title text-lede">{label}</span>
      </div>
      <span className="block h-px w-full bg-charcoal-15" />
    </div>
  );
}
