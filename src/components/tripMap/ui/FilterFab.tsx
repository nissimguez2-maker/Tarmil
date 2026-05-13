import clsx from 'clsx';
import { SlidersHorizontal } from 'lucide-react';

type Props = {
  onClick: () => void;
  /** True when the current filters differ from defaults — shows a dot. */
  active?: boolean;
};

/**
 * Single floating control that opens the filter sheet. Lives top-start of
 * the map (physical right in RTL), out of the way of the AddDestinationFab.
 */
export function FilterFab({ onClick, active }: Props) {
  return (
    <button
      type="button"
      aria-label="Open filters"
      onClick={onClick}
      className={clsx(
        'pointer-events-auto absolute start-md top-md z-[750]',
        'inline-flex h-10 w-10 items-center justify-center rounded-full',
        'border border-cocoa-15 bg-ivory text-cocoa shadow-device',
        'active:bg-cocoa-08',
      )}
    >
      <SlidersHorizontal className="h-4 w-4" strokeWidth={1.7} aria-hidden />
      {active && (
        <span
          aria-hidden
          className="absolute -end-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-copper ring-2 ring-ivory"
        />
      )}
    </button>
  );
}
