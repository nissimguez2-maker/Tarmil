import { X, ChevronLeft } from 'lucide-react';
import { Button } from '../../Button';
import type { PlannedStop } from '../../../data/plannedStops';
import { formatDateRange } from '../utils/formatDateRange';

type Props = {
  stops: PlannedStop[];
  onPickStop: (id: string) => void;
  onAdd: () => void;
  onClose: () => void;
};

/**
 * Ordered list of planned stops — Polarsteps-style route summary. Tapping a
 * row opens the planned-stop detail sheet. Order is by arrivalDate (the
 * reducer enforces this on save).
 */
export function PlannedRouteSheet({
  stops,
  onPickStop,
  onAdd,
  onClose,
}: Props) {
  return (
    <div className="flex max-h-[70dvh] flex-col gap-md p-md">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex flex-col">
          <span className="meta-caps text-copper">המסע שלך</span>
          <h3 className="font-serif text-lede leading-tight">התוכנית הקרובה</h3>
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
            עדיין לא הוספת יעדים. תתחיל מ"הוסף יעד".
          </p>
        )}
        {stops.map((stop, i) => {
          const overlapCount = stop.friendOverlapIds?.length ?? 0;
          return (
            <button
              key={stop.id}
              type="button"
              onClick={() => onPickStop(stop.id)}
              className="flex items-start gap-md border-t border-cocoa-08 py-sm text-start first:border-t-0 active:bg-cocoa-08"
            >
              <span className="tnum mt-1 font-serif text-lede text-cocoa-55">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-1 flex-col">
                <span className="font-serif text-lede leading-tight">
                  {stop.nameHe}
                </span>
                <span className="text-[10pt] text-cocoa-70">
                  {formatDateRange(stop.arrivalDate, stop.departureDate)} ·{' '}
                  <span className="tnum">{stop.nights}</span> לילות
                </span>
                {overlapCount > 0 && (
                  <span className="text-[10pt] text-copper">
                    <span className="tnum">{overlapCount}</span>{' '}
                    {overlapCount === 1 ? 'חבר חופף' : 'חברים חופפים'}
                  </span>
                )}
              </div>
              <ChevronLeft
                className="mt-1 h-4 w-4 text-cocoa-55"
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      <Button variant="ghost" onClick={onAdd} fullWidth>
        + הוסף יעד נוסף
      </Button>
    </div>
  );
}
