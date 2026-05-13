import { Star, X, ChevronLeft, Bookmark } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../../Button';
import type { Place } from '../../../data/places';
import { categoryLabel } from '../utils/categoryLabel';
import { deriveFriendVisits } from '../utils/deriveFriendVisits';

type Props = {
  place: Place;
  onClose: () => void;
  onOpen: () => void;
  /** When provided, shows the "Save to a stop" CTA; tapping opens the stop picker. */
  onSaveToStop?: () => void;
};

export function PlaceSheet({ place, onClose, onOpen, onSaveToStop }: Props) {
  const visits = deriveFriendVisits(place);

  return (
    <div className="flex max-h-[70dvh] flex-col gap-sm overflow-y-auto px-md pb-md pt-sm">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex min-w-0 flex-1 flex-col gap-px">
          <div className="flex items-baseline gap-2">
            <h3 className="font-serif text-lede leading-tight text-cocoa">
              {place.hebrewName}
            </h3>
            {place.tarmilPick && (
              <span className="meta-caps text-copper">Tarmil pick</span>
            )}
          </div>
          <span className="text-small text-cocoa-55">
            {categoryLabel(place.category)}
          </span>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="-me-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-cocoa-55 transition-colors duration-instant ease-out-quart hover:bg-cocoa-8 active:bg-cocoa-15"
        >
          <X className="h-4 w-4" strokeWidth={1.8} aria-hidden />
        </button>
      </div>

      <p className="text-body text-cocoa-70">{place.hebrewDescription}</p>

      <div className="flex items-center gap-md">
        <span className="inline-flex items-center gap-1 text-small text-cocoa">
          <Star
            className="h-3.5 w-3.5 fill-copper text-copper"
            strokeWidth={0}
            aria-hidden
          />
          <span className="tnum">{place.rating.toFixed(1)}</span>
        </span>
        {place.friendsKnow > 0 && (
          <span className="text-small text-cocoa-70">
            <span className="tnum">{place.friendsKnow}</span> friends know it
          </span>
        )}
      </div>

      {visits.length > 0 && (
        <section className="flex flex-col gap-sm border-t border-cocoa-08 pt-sm">
          <span className="meta-caps text-cocoa-55">What friends say</span>
          <div className="flex flex-col gap-sm">
            {visits.map((v, i) => (
              <div key={i} className="flex items-start gap-sm">
                <span
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cocoa font-serif text-body text-ivory"
                  aria-hidden
                >
                  {v.friendInitial}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-px">
                  <div className="flex items-center justify-between gap-sm">
                    <span className="truncate text-body text-cocoa">
                      {v.friendName}
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          className={clsx(
                            'h-3 w-3',
                            n <= v.rating
                              ? 'fill-copper text-copper'
                              : 'text-cocoa-30',
                          )}
                          strokeWidth={0}
                          aria-hidden
                        />
                      ))}
                    </span>
                  </div>
                  <span className="text-small leading-snug text-cocoa-70">
                    {v.comment}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mt-xs flex flex-col gap-sm">
        {onSaveToStop && (
          <Button variant="ghost" size="sm" fullWidth onClick={onSaveToStop}>
            <Bookmark className="h-4 w-4" aria-hidden />
            <span>Save to a stop</span>
          </Button>
        )}
        <Button variant="primary" size="sm" fullWidth onClick={onOpen}>
          <span className="flex-1 text-start">Full details</span>
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
