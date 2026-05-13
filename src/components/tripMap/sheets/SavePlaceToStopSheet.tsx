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
 * "Save to a stop" CTA. SAVE_PLACE_TO_STOP in the reducer adds the place id to
 * the stop's savedPlaceIds and closes the sheet.
 */
export function SavePlaceToStopSheet({
  place,
  stops,
  onSave,
  onClose,
}: Props) {
  return (
    <div className="flex max-h-[60dvh] flex-col gap-md px-md pb-md pt-sm">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex min-w-0 flex-1 flex-col gap-px">
          <span className="meta-caps text-copper">Save to a stop</span>
          <h3 className="truncate font-serif text-lede leading-tight text-cocoa">
            {place.hebrewName}
          </h3>
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

      <div className="flex flex-col overflow-y-auto">
        {stops.length === 0 && (
          <p className="text-body text-cocoa-70">
            No planned stops yet. Add a destination first.
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
              className="flex items-center justify-between gap-sm border-t border-cocoa-08 py-sm text-start transition-colors duration-instant ease-out-quart first:border-t-0 disabled:opacity-50 active:bg-cocoa-08"
            >
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-body text-cocoa">
                  {stop.nameHe}
                </span>
                <span className="text-small text-cocoa-55">
                  {formatDateRange(stop.arrivalDate, stop.departureDate)}
                </span>
              </div>
              {alreadySaved && (
                <span className="meta-caps shrink-0 text-copper">Already saved</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
