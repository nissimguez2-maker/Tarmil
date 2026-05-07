import type { Place } from '../../../data/places';
import { X } from 'lucide-react';
import type { PlannedStop } from '../../../data/plannedStops';
import { formatDateRange } from '../utils/formatDateRange';

type Props = {
  place: Place | Place;
  stops: PlannedStop[];
  onSave: (stopId: string) => void;
  onClose: () => void;
};

/**
 * Pick which planned stop to save a place to. Opened from the place sheet's
 * "שמור ליעד" CTA. SAVE_PLACE_TO_STOP in the reducer adds the place id to the
 * stop's savedPlaceIds and closes the sheet.
 */
export function SavePlaceToStopSheet({
  place,
  stops,
  onSave,
  onClose,
}: Props) {
  return (
    <div className="flex max-h-[60dvh] flex-col gap-md p-md">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex flex-col">
          <span className="meta-caps text-copper">שמור ליעד</span>
          <h3 className="font-serif text-lede leading-tight">
            {place.hebrewName}
          </h3>
        </div>
        <button
          type="button"
          aria-label="סגור"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-cocoa-55 hover:bg-cocoa-8 active:bg-cocoa-15"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="flex flex-col overflow-y-auto">
        {stops.length === 0 && (
          <p className="text-body text-cocoa-70">
            עדיין אין יעדים מתוכננים. הוסף יעד קודם.
          </p>
        )}
        {stops.map((stop) => {
          const alreadySaved = stop.savedPlaceIds?.includes(place.id) ?? false;
          return (
            <button
              key={stop.id}
              type="button"
              disabled={alreadySaved}
              onClick={() => onSave(stop.id)}
              className="flex items-center justify-between gap-sm border-t border-cocoa-08 py-sm text-start first:border-t-0 disabled:opacity-50 active:bg-cocoa-08"
            >
              <div className="flex flex-col">
                <span className="text-body text-cocoa">{stop.nameHe}</span>
                <span className="text-[10pt] text-cocoa-55">
                  {formatDateRange(stop.arrivalDate, stop.departureDate)}
                </span>
              </div>
              {alreadySaved && (
                <span className="meta-caps text-copper">כבר שמור</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
