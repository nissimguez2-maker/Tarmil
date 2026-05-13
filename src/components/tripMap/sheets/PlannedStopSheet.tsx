import { useState } from 'react';
import clsx from 'clsx';
import { ChevronDown, ChevronRight, X, Star } from 'lucide-react';
import { Button } from '../../Button';
import type { PlannedStop } from '../../../data/plannedStops';
import type { Place } from '../../../data/places';
import type { FriendOverlap } from '../../../data/myTrip';
import { formatDateRange } from '../utils/formatDateRange';
import { categoryLabel } from '../utils/categoryLabel';
import { groupPlacesBySection } from '../utils/groupPlacesBySection';

type Props = {
  stop: PlannedStop;
  /** Curated places for this stop's destination (pre-filtered by parent). */
  places: Place[];
  /** Friend overlaps that match this stop (pre-filtered by parent). */
  overlaps: FriendOverlap[];
  onClose: () => void;
  onBack: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onOpenPlace: (placeId: string) => void;
  /** When provided, shows an "סמן כהגעתי" button that opens arrival confirm. */
  onMarkArrived?: () => void;
};

const PRIVACY_LABEL: Record<PlannedStop['privacy'], string> = {
  private: 'פרטי',
  friends: 'גלוי לחברים',
  hidden: 'מוסתר',
};

/**
 * Planned-stop detail — tall sheet with header, friend overlaps, collapsible
 * curated-place sections, and edit/remove actions. Reuses the existing
 * /place/:id route on place row taps.
 */
export function PlannedStopSheet({
  stop,
  places,
  overlaps,
  onClose,
  onBack,
  onEdit,
  onRemove,
  onOpenPlace,
  onMarkArrived,
}: Props) {
  const sections = groupPlacesBySection(places);
  const savedIds = new Set(stop.savedPlaceIds ?? []);

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-start justify-between gap-sm border-b border-cocoa-08 px-md pb-sm pt-sm">
        <div className="flex min-w-0 flex-1 flex-col gap-px">
          <button
            type="button"
            onClick={onBack}
            className="meta-caps inline-flex items-center gap-1 self-start text-cocoa-55 transition-colors duration-instant ease-out-quart active:text-cocoa"
          >
            <ChevronRight className="h-3 w-3" aria-hidden />
            <span>לתוכנית שלך</span>
          </button>
          <h3 className="truncate font-serif text-sub leading-tight text-cocoa">
            {stop.nameHe}
          </h3>
          <span className="text-small text-cocoa-70">
            {formatDateRange(stop.arrivalDate, stop.departureDate)} ·{' '}
            <span className="tnum">{stop.nights}</span> לילות ·{' '}
            <span className="text-cocoa-55">
              {PRIVACY_LABEL[stop.privacy]}
            </span>
          </span>
        </div>
        <button
          type="button"
          aria-label="סגור"
          onClick={onClose}
          className="-me-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-cocoa-55 transition-colors duration-instant ease-out-quart hover:bg-cocoa-8 active:bg-cocoa-15"
        >
          <X className="h-4 w-4" strokeWidth={1.8} aria-hidden />
        </button>
      </header>

      <div className="flex flex-1 flex-col gap-md overflow-y-auto p-md">
        {stop.note && (
          <p className="text-body leading-snug text-cocoa-70">{stop.note}</p>
        )}

        {overlaps.length > 0 && (
          <section className="flex flex-col gap-sm">
            <span className="meta-caps text-cocoa-70">חברים שחופפים איתך</span>
            <div className="flex flex-col gap-sm">
              {overlaps.map((f) => (
                <div
                  key={f.id}
                  className="flex items-start gap-sm rounded-xl border border-cocoa-08 bg-sand p-sm"
                >
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-copper bg-ivory font-serif text-body text-copper"
                    aria-hidden
                  >
                    {f.friendInitial}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-body text-cocoa">{f.friendName}</span>
                    {f.overlapStart && f.overlapEnd && (
                      <span className="text-small text-copper">
                        {f.zoneLabel} ·{' '}
                        {formatDateRange(f.overlapStart, f.overlapEnd)}
                      </span>
                    )}
                    <span className="text-small leading-snug text-cocoa-55">
                      {f.detail}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {sections.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="meta-caps text-cocoa-70">מקומות מומלצים</span>
            {sections.map((sec) => (
              <CollapsibleSection key={sec.id} label={sec.labelHe}>
                {sec.places.map((p) => (
                  <PlaceRow
                    key={p.id}
                    place={p as Place}
                    saved={savedIds.has(p.id)}
                    onClick={() => onOpenPlace(p.id)}
                  />
                ))}
              </CollapsibleSection>
            ))}
          </div>
        )}

        {sections.length === 0 && (
          <p className="text-small text-cocoa-55">
            עדיין אין מקומות מומלצים ליעד הזה. אפשר לשמור מהמפה.
          </p>
        )}

        <div className="flex flex-wrap items-center gap-sm pt-sm">
          <Button variant="ghost" size="sm" onClick={onEdit}>
            ערוך תאריכים
          </Button>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            הסר יעד
          </Button>
          {onMarkArrived && (
            <Button variant="ghost" size="sm" onClick={onMarkArrived}>
              סמן כהגעתי
            </Button>
          )}
        </div>

        <p className="text-small leading-snug text-cocoa-55">
          התאריכים שלך פרטיים. תרמיל לעולם לא חושף לחברים את הכתובת המדויקת
          שלך — חפיפות מוצגות ברמת עיר בלבד.
        </p>
      </div>
    </div>
  );
}

function CollapsibleSection({
  label,
  defaultOpen = true,
  children,
}: {
  label: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-cocoa-08 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-sm py-sm text-start"
      >
        <span className="font-serif text-body text-cocoa">{label}</span>
        <ChevronDown
          className={clsx(
            'h-4 w-4 text-cocoa-55',
            'transition-transform duration-instant ease-out-quart',
            open && 'rotate-180',
          )}
          aria-hidden
        />
      </button>
      {open && <div className="flex flex-col gap-1 pb-sm">{children}</div>}
    </section>
  );
}

function PlaceRow({
  place,
  saved,
  onClick,
}: {
  place: Place;
  saved: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-start justify-between gap-sm rounded-xl py-2 text-start active:bg-cocoa-08"
    >
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className="text-body text-cocoa">{place.hebrewName}</span>
          {place.tarmilPick && (
            <span className="meta-caps text-copper">בחירה</span>
          )}
        </div>
        <span className="inline-flex items-center gap-2 text-small text-cocoa-55">
          <span>{categoryLabel(place.category)}</span>
          <span className="inline-flex items-center gap-1">
            <Star
              className="h-3 w-3 fill-copper text-copper"
              strokeWidth={0}
              aria-hidden
            />
            <span className="tnum">{place.rating.toFixed(1)}</span>
          </span>
          {place.friendsKnow > 0 && (
            <span>
              <span className="tnum">{place.friendsKnow}</span> מכירים
            </span>
          )}
        </span>
      </div>
      {saved && (
        <span className="meta-caps mt-1 shrink-0 text-copper">נשמר</span>
      )}
    </button>
  );
}
