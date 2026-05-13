import clsx from 'clsx';
import { Maximize2, Minimize2 } from 'lucide-react';

type Props = {
  active: boolean;
  onClick: () => void;
};

/**
 * Toggle that puts the Trip tab into map-only focus mode. Collapses the
 * NextTripCard and closes any open sheet so the map gets the full screen.
 *
 * Anchored top-end (physical left in RTL) — opposite side from FilterFab so
 * the two controls don't crowd each other.
 */
export function MapOnlyToggle({ active, onClick }: Props) {
  const Icon = active ? Minimize2 : Maximize2;
  return (
    <button
      type="button"
      aria-label={active ? 'Exit fullscreen map' : 'Fullscreen map'}
      aria-pressed={active}
      onClick={onClick}
      className={clsx(
        'pointer-events-auto absolute end-md top-md z-[750]',
        'inline-flex h-10 w-10 items-center justify-center rounded-full',
        'border border-cocoa-15 shadow-device',
        'transition-colors duration-instant ease-out-quart',
        active
          ? 'bg-cocoa text-ivory'
          : 'bg-ivory text-cocoa active:bg-cocoa-08',
      )}
    >
      <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden />
    </button>
  );
}
