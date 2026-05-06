import { ChevronLeft } from 'lucide-react';
import type { PlannedStop } from '../../../data/plannedStops';
import { formatDateRange } from '../utils/formatDateRange';

type Props = {
  hereLabel: string;
  next?: PlannedStop;
  friendCount: number;
  picksCount: number;
  onTap: () => void;
};

/**
 * Bottom summary card — investor headline. Shows where the user is, what's
 * next on the planned route, and the social/curated counts. Tapping opens
 * the planned-route sheet.
 *
 * Layout is owned by the parent; this is just the card shape.
 */
export function TravelMomentCard({
  hereLabel,
  next,
  friendCount,
  picksCount,
  onTap,
}: Props) {
  return (
    <button
      type="button"
      onClick={onTap}
      className="flex w-full flex-col gap-1 rounded-md border border-rope bg-ivory p-md text-start active:bg-cocoa-08"
      style={{ boxShadow: '0 -10px 30px -10px rgba(53, 40, 24, 0.20)' }}
    >
      <div className="flex items-center justify-between gap-sm">
        <span className="font-serif text-lede leading-tight">{hereLabel}</span>
        <ChevronLeft className="h-4 w-4 text-cocoa-55" aria-hidden />
      </div>
      {next && (
        <span className="text-small text-cocoa-70">
          הבא:{' '}
          <span className="text-cocoa">{next.nameHe}</span> ·{' '}
          {formatDateRange(next.arrivalDate, next.departureDate)} ·{' '}
          <span className="tnum">{next.nights}</span> לילות
        </span>
      )}
      {(friendCount > 0 || picksCount > 0) && (
        <div className="flex flex-wrap items-center gap-x-md gap-y-1 text-small text-cocoa-55">
          {friendCount > 0 && (
            <span>
              <span className="tnum">{friendCount}</span> חברים חופפים
            </span>
          )}
          {picksCount > 0 && (
            <span>
              <span className="tnum">{picksCount}</span> בחירות תרמיל קרוב
            </span>
          )}
        </div>
      )}
    </button>
  );
}
