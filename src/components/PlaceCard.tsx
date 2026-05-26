import clsx from 'clsx';
import { Star } from 'lucide-react';

type Props = {
  /** Hebrew place name, set in Fraunces serif. */
  name: string;
  /** "Café · Tel Aviv" style metadata. Sans, cocoa-55, small. */
  meta?: string;
  /** Tarmil community rating, 1–5. Optional. */
  rating?: number;
  /** Number of friends who know this place. Optional. */
  friendsKnow?: number;
  /** Visual badge for hand-picked Tarmil recommendations. */
  tarmilPick?: boolean;
  /** Click handler — typically navigates to /place/:id. */
  onClick?: () => void;
  className?: string;
};

/**
 * Card surface for places. Sand background per DA "elevated surface" token,
 * rope hairline border for definition. Title in Fraunces, meta in Heebo.
 *
 * Compact by default (60mm tall). Used inline in lists; tap → /place/:id.
 */
export function PlaceCard({
  name,
  meta,
  rating,
  friendsKnow,
  tarmilPick,
  onClick,
  className,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'group flex w-full flex-col gap-xs rounded-2xl bg-sand shadow-card p-md text-start',
        'transition-colors duration-instant ease-out-quart hover:bg-sand/80 active:bg-clay',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-sm">
        <h3 className="font-serif text-lede leading-tight text-charcoal">{name}</h3>
        {tarmilPick && (
          <span className="meta-caps shrink-0 text-amber">Tarmil pick</span>
        )}
      </div>

      {meta && <p className="text-small text-charcoal-55">{meta}</p>}

      {(rating !== undefined || friendsKnow !== undefined) && (
        <div className="mt-xs flex items-center gap-md">
          {rating !== undefined && (
            <span className="inline-flex items-center gap-1 text-small text-charcoal">
              <Star
                className="h-3.5 w-3.5 fill-amber text-amber"
                strokeWidth={0}
                aria-hidden
              />
              <span className="tnum">{rating.toFixed(1)}</span>
            </span>
          )}
          {friendsKnow !== undefined && friendsKnow > 0 && (
            <span className="text-small text-charcoal-70">
              <span className="tnum">{friendsKnow}</span> friends know it
            </span>
          )}
        </div>
      )}
    </button>
  );
}
