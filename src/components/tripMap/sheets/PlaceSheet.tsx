import { Star, X, ChevronLeft, Bookmark } from 'lucide-react';
import clsx from 'clsx';
import type { RioPlace } from '../../../data/rioPlaces';
import { categoryLabel } from '../utils/categoryLabel';
import { deriveFriendVisits } from '../utils/deriveFriendVisits';

type Props = {
  place: RioPlace;
  onClose: () => void;
  onOpen: () => void;
  /** When provided, shows the "שמור ליעד" CTA; tapping opens the stop picker. */
  onSaveToStop?: () => void;
};

export function PlaceSheet({ place, onClose, onOpen, onSaveToStop }: Props) {
  const visits = deriveFriendVisits(place);

  return (
    <div className="flex max-h-[70dvh] flex-col gap-sm overflow-y-auto p-md">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <h2 className="font-serif text-lede leading-tight">
              {place.hebrewName}
            </h2>
            {place.tarmilPick && (
              <span className="meta-caps text-cocoa-70">בחירת תרמיל</span>
            )}
          </div>
          <span className="text-small text-cocoa-55">
            {categoryLabel(place.category)}
          </span>
        </div>
        <button
          type="button"
          aria-label="סגור"
          onClick={onClose}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-cocoa-55 hover:bg-cocoa-8 active:bg-cocoa-15"
        >
          <X className="h-4 w-4" aria-hidden />
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
            <span className="tnum">{place.friendsKnow}</span> חברים מכירים
          </span>
        )}
      </div>

      {visits.length > 0 && (
        <section className="flex flex-col gap-sm border-t border-cocoa-08 pt-sm">
          <span className="meta-caps text-cocoa-55">מה החברים אומרים</span>
          <div className="flex flex-col gap-sm">
            {visits.map((v, i) => (
              <div key={i} className="flex items-start gap-sm">
                <span
                  className="inline-block h-9 w-9 shrink-0 rounded-full border border-cocoa-15 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url('${v.photoUrl}')` }}
                  role="img"
                  aria-label={v.friendName}
                />
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center justify-between gap-sm">
                    <span className="text-body text-cocoa">{v.friendName}</span>
                    <span className="inline-flex items-center gap-0.5">
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

      <div className="mt-1 flex flex-col gap-sm">
        {onSaveToStop && (
          <button
            type="button"
            onClick={onSaveToStop}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-cocoa-15 px-4 text-body font-medium text-cocoa active:bg-cocoa-8"
          >
            <Bookmark className="h-4 w-4" aria-hidden />
            <span>שמור ליעד</span>
          </button>
        )}
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex h-11 items-center justify-between gap-2 rounded-full bg-cocoa px-4 text-body font-medium text-ivory active:bg-cocoa-70"
        >
          <span>פרטים מלאים</span>
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
