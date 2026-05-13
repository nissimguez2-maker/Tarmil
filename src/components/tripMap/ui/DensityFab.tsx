import clsx from 'clsx';
import { Flame } from 'lucide-react';

type Props = {
  active: boolean;
  onClick: () => void;
};

/**
 * Floating toggle that flips the trip map into density-heat mode. Sits below
 * the FilterFab on the same top-start corner. Active state mirrors FilterFab:
 * copper dot at the trailing edge.
 */
export function DensityFab({ active, onClick }: Props) {
  return (
    <button
      type="button"
      aria-label={active ? 'כבה צפיפות תרמילים' : 'הראה צפיפות תרמילים'}
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        'pointer-events-auto absolute start-md top-[68px] z-[750]',
        'inline-flex h-10 w-10 items-center justify-center rounded-full',
        'border border-cocoa-15 shadow-device',
        'transition-colors duration-instant ease-out-quart',
        active
          ? 'bg-copper text-ivory'
          : 'bg-ivory text-cocoa active:bg-cocoa-08',
      )}
    >
      <Flame
        className="h-4 w-4"
        strokeWidth={active ? 2.2 : 1.7}
        aria-hidden
        {...(active ? { fill: 'currentColor' } : {})}
      />
    </button>
  );
}
