import { Star } from 'lucide-react';
import clsx from 'clsx';

type Props = {
  /** Numeric rating, 0–5. Half-stars not supported (decimal rounds down). */
  rating: number;
  /** Pixel size of each star icon. Default 14. */
  size?: number;
  /** When true, each star is a button — click to set rating. */
  interactive?: boolean;
  /** Required when interactive — fires with the picked rating (1–5). */
  onPick?: (rating: 1 | 2 | 3 | 4 | 5) => void;
  /** Accessible label for the row (read-only mode). */
  ariaLabel?: string;
  className?: string;
};

/**
 * 5-star rating row, used on Around-me business cards and on PlaceScreen.
 * Default mode is read-only display. Pass `interactive` + `onPick` to let
 * the user submit their own rating (used in PlaceScreen's reviews section).
 */
export function StarRow({
  rating,
  size = 14,
  interactive = false,
  onPick,
  ariaLabel,
  className,
}: Props) {
  const filled = Math.max(0, Math.min(5, Math.floor(rating)));
  return (
    <div
      className={clsx('inline-flex items-center gap-0.5', className)}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={
        ariaLabel ?? (interactive ? 'Pick rating' : `${filled} of 5 stars`)
      }
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const isFilled = i <= filled;
        const star = (
          <Star
            width={size}
            height={size}
            className={isFilled ? 'fill-copper text-copper' : 'text-cocoa-30'}
            strokeWidth={1.6}
            aria-hidden
          />
        );
        if (!interactive) return <span key={i}>{star}</span>;
        return (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={i === filled}
            aria-label={`${i} star${i === 1 ? '' : 's'}`}
            onClick={() => onPick?.(i as 1 | 2 | 3 | 4 | 5)}
            className="inline-flex items-center justify-center rounded-full p-0.5 transition-transform duration-instant ease-out-quart active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-1 focus-visible:ring-offset-ivory"
          >
            {star}
          </button>
        );
      })}
    </div>
  );
}
