import type { PlannedStop } from '../../data/plannedStops';
import type { Place } from '../../data/places';
import { formatShortDate } from './dateUtils';
import type { Selection } from './types';
import { WebCityPanel } from './WebCityPanel';
import { WebTransportPanel } from './WebTransportPanel';

type Props = {
  selection: Selection;
  onClose: () => void;
  stops: PlannedStop[];
  places: Place[];
};

export function WebRightPanel({ selection, onClose, stops, places }: Props) {
  return (
    <aside className="w-80 shrink-0 border-s border-cocoa-15 bg-ivory flex flex-col min-h-0 h-full">
      {selection.type === 'none' && <TripOverview stops={stops} />}
      {selection.type === 'stop' && (
        <WebCityPanel
          stop={requireStop(stops, selection.stopId)}
          places={places.filter((p) => p.destinationId === selection.stopId)}
          onClose={onClose}
        />
      )}
      {selection.type === 'leg' && (
        <WebTransportPanel
          fromStop={requireStop(stops, selection.fromStopId)}
          toStop={requireStop(stops, selection.toStopId)}
          onClose={onClose}
        />
      )}
    </aside>
  );
}

function requireStop(stops: PlannedStop[], id: string): PlannedStop {
  const stop = stops.find((s) => s.id === id);
  if (!stop) {
    throw new Error(`Selection referenced missing stop ${id}`);
  }
  return stop;
}

function TripOverview({ stops }: { stops: PlannedStop[] }) {
  const legs = stops.length > 0 ? stops.length - 1 : 0;
  const nights = stops.reduce((sum, s) => sum + s.nights, 0);
  const first = stops[0];
  const last = stops[stops.length - 1];
  const dateSpan =
    first && last
      ? `${formatShortDate(first.arrivalDate)} – ${formatShortDate(last.departureDate)}`
      : '';
  const year = last
    ? new Date(last.departureDate + 'T12:00:00').getFullYear()
    : '';

  return (
    <div className="flex-1 flex flex-col gap-md p-md">
      <article className="bg-sand border border-rope rounded-2xl p-md flex flex-col gap-sm">
        <p className="meta-caps text-cocoa-55">Trip overview</p>
        <h2 className="font-serif text-lede text-cocoa">
          {dateSpan}
          {year && <span className="text-cocoa-55">, {year}</span>}
        </h2>
        <dl className="grid grid-cols-3 gap-sm pt-sm border-t border-cocoa-15">
          <Stat label="Stops" value={stops.length} />
          <Stat label="Legs" value={legs} />
          <Stat label="Nights" value={nights} />
        </dl>
      </article>
      <p className="text-small text-cocoa-55 px-sm leading-snug">
        Pick a stop in the itinerary, or a transport line on the map, to see bookings and travel options.
      </p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col gap-xs">
      <dd className="font-serif text-sub text-cocoa tnum leading-none">
        {value}
      </dd>
      <dt className="text-small text-cocoa-55">{label}</dt>
    </div>
  );
}
