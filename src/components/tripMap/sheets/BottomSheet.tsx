import type { ReactNode } from 'react';
import clsx from 'clsx';

type Props = {
  open: boolean;
  children: ReactNode;
  /** When 'tall', the sheet expands to ~85% of the map area with internal scroll. */
  height?: 'auto' | 'tall';
  className?: string;
};

/**
 * Bottom sheet primitive shared across the trip map. Always mounted; visibility
 * is class-driven so the close transition runs on hide. Click events inside the
 * sheet are stopped so they don't bubble to the map's "click outside" handler.
 */
export function BottomSheet({
  open,
  children,
  height = 'auto',
  className,
}: Props) {
  return (
    <div
      className={clsx(
        'absolute z-[1000] origin-bottom rounded-md border border-rope bg-ivory transition-all duration-300',
        height === 'tall'
          ? 'inset-x-md bottom-md top-[15%] flex flex-col overflow-hidden'
          : 'inset-x-md bottom-md',
        open
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-[120%] opacity-0',
        className,
      )}
      style={{ boxShadow: '0 -10px 30px -10px rgba(53, 40, 24, 0.25)' }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}
