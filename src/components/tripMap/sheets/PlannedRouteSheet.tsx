import { X, ChevronRight } from 'lucide-react';
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
    <div className="flex max-h-[70dvh] flex-col gap-md px-md pb-md pt-sm">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex min-w-0 flex-1 flex-col gap-px">
          <span className="meta-caps text-amber">Your trip</span>
          <h3 className="font-serif text-lede leading-tight text-charcoal">
            What's coming up
          </h3>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="-me-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-charcoal-55 transition-colors duration-instant ease-out-quart hover:bg-charcoal-8 active:bg-charcoal-15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          <X className="h-4 w-4" strokeWidth={1.8} aria-hidden />
        </button>
      </div>

      <div className="flex flex-col overflow-y-auto">
        {stops.length === 0 && (
          <p className="text-body text-charcoal-70">
            No destinations yet. Start with "Add destination".
          </p>
        )}
        {stops.map((stop, i) => {
          const overlapCount = stop.friendOverlapIds?.length ?? 0;
          return (
            <button
              key={stop.id}
              type="button"
              onClick={() => onPickStop(stop.id)}
              className="flex items-start gap-md border-t border-charcoal-08 py-sm text-start transition-colors duration-instant ease-out-quart first:border-t-0 active:bg-charcoal-08"
            >
              <span className="tnum mt-1 font-serif text-lede text-charcoal-55">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-serif text-lede leading-tight text-charcoal">
                  {stop.nameHe}
                </span>
                <span className="text-small text-charcoal-70">
                  {formatDateRange(stop.arrivalDate, stop.departureDate)} ·{' '}
                  <span className="tnum">{stop.nights}</span> nights
                </span>
                {overlapCount > 0 && (
                  <span className="text-small text-amber">
                    <span className="tnum">{overlapCount}</span>{' '}
                    {overlapCount === 1 ? 'friend overlaps' : 'friends overlap'}
                  </span>
                )}
              </div>
              <ChevronRight
                className="mt-1 h-4 w-4 shrink-0 text-charcoal-55"
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      <Button variant="ghost" size="sm" onClick={onAdd} fullWidth>
        + Add another destination
      </Button>
    </div>
  );
}
