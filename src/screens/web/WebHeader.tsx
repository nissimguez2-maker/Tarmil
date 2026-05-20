import { Link } from 'react-router-dom';
import type { PlannedStop } from '../../data/plannedStops';
import { formatTripMonthRange } from './dateUtils';

const TRIP_TITLE_REGION = 'Brazil & Argentina';

type Props = {
  stops: PlannedStop[];
};

export function WebHeader({ stops }: Props) {
  const range = stops.length
    ? formatTripMonthRange(
        stops[0].arrivalDate,
        stops[stops.length - 1].departureDate,
      )
    : '';
  return (
    <header className="h-14 shrink-0 bg-ivory border-b border-cocoa-15 flex items-center px-md gap-md">
      <span className="font-serif text-lede text-cocoa">Tarmil</span>
      <div className="flex-1 flex flex-col items-center leading-tight">
        <span className="meta-caps text-cocoa-55">Planned trip</span>
        <span className="font-serif text-lede text-cocoa">
          {TRIP_TITLE_REGION}
          {range && <span className="text-cocoa-55"> · {range}</span>}
        </span>
      </div>
      <div className="flex items-center gap-sm">
        <span className="text-small text-cocoa-55">1 traveler</span>
        <span
          aria-hidden="true"
          className="h-8 w-8 rounded-full bg-stone text-ivory font-serif text-small flex items-center justify-center"
        >
          Y
        </span>
        <Link
          to="/trip"
          className="text-small text-copper hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory rounded-sm"
        >
          Switch to App
        </Link>
      </div>
    </header>
  );
}
