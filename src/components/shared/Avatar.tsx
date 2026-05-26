import { useState } from 'react';
import clsx from 'clsx';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'hero';

type Props = {
  /** Friend or user photo URL. If missing or fails to load, falls back to initial. */
  photoUrl?: string | null;
  /** Hebrew initial shown in fallback. */
  initial: string;
  /** Full name for alt text + accessibility. */
  name: string;
  size?: Size;
  /** Mark the current user / "verified" via a copper border. */
  copperBorder?: boolean;
  /** Small copper status dot at the trailing-bottom corner (e.g., currently traveling). */
  statusDot?: boolean;
  className?: string;
};

const SIZE: Record<Size, { box: string; text: string; dot: string }> = {
  xs: { box: 'h-6 w-6', text: 'text-small', dot: 'h-2 w-2' },
  sm: { box: 'h-8 w-8', text: 'text-small', dot: 'h-2.5 w-2.5' },
  md: { box: 'h-10 w-10', text: 'text-body', dot: 'h-3 w-3' },
  lg: { box: 'h-12 w-12', text: 'text-lede', dot: 'h-3 w-3' },
  xl: { box: 'h-14 w-14', text: 'text-lede', dot: 'h-3.5 w-3.5' },
  xxl: { box: 'h-16 w-16', text: 'text-sub', dot: 'h-3.5 w-3.5' },
  hero: { box: 'h-24 w-24', text: 'text-sub', dot: 'h-4 w-4' },
};

/**
 * Avatar component used everywhere a friend or user face shows up — activity
 * feed cards, message rows, message bubbles, friend grids, profile heroes.
 *
 * Renders a real photo when available; falls back to a cocoa-filled circle
 * with the Hebrew first-letter in ivory at Heebo 700. The fallback also
 * activates if the image fails to load.
 *
 * `copperBorder` marks the current user or "verified" status with a 2px copper
 * ring. `statusDot` adds a small copper dot at the bottom-trailing corner for
 * "currently traveling" / "online" indicators.
 */
export function Avatar({
  photoUrl,
  initial,
  name,
  size = 'md',
  copperBorder,
  statusDot,
  className,
}: Props) {
  const [failed, setFailed] = useState(false);
  const showPhoto = photoUrl && !failed;
  const s = SIZE[size];

  return (
    <span
      className={clsx(
        'relative inline-flex shrink-0 items-center justify-center overflow-visible rounded-full',
        copperBorder && 'ring-2 ring-amber ring-offset-1 ring-offset-cream',
        className,
      )}
    >
      <span
        className={clsx(
          'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-charcoal text-cream',
          s.box,
        )}
      >
        {showPhoto ? (
          <img
            src={photoUrl}
            alt={name}
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span
            className={clsx('font-sans font-bold leading-none', s.text)}
            aria-label={name}
          >
            {initial}
          </span>
        )}
      </span>
      {statusDot && (
        <span
          aria-hidden
          className={clsx(
            'absolute end-0 bottom-0 inline-block rounded-full bg-amber ring-2 ring-cream',
            s.dot,
          )}
        />
      )}
    </span>
  );
}
