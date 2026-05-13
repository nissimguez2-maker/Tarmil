import type { ReactNode } from 'react';
import clsx from 'clsx';

type Props = {
  open: boolean;
  children: ReactNode;
  /** When 'tall', the sheet expands to ~85% of the parent area with internal scroll. */
  height?: 'auto' | 'tall';
  className?: string;
};

/**
 * Bottom sheet primitive. Always mounted; visibility is class-driven so the
 * close transition runs on hide. Click events inside the sheet are stopped so
 * they don't bubble to the parent's "click outside" handler.
 *
 * Used by the trip map sheets and the activity composer.
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
        'absolute inset-x-0 bottom-0 z-[1000] origin-bottom',
        'rounded-t-3xl bg-ivory',
        'shadow-sheet duration-considered ease-out-quart',
        'transition-[transform,opacity] motion-reduce:transition-none',
        height === 'tall' && 'top-[10%] flex flex-col overflow-hidden',
        open
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-full opacity-0',
        className,
      )}
      onClick={(e) => e.stopPropagation()}
    >
      <span
        aria-hidden
        className="mx-auto mt-2.5 block h-1 w-9 rounded-full bg-cocoa-15"
      />
      {children}
    </div>
  );
}
