import clsx from 'clsx';
import { Plane, Bus, Plus } from 'lucide-react';
import { Button } from '../../components/Button';
import type { PlannedStop } from '../../data/plannedStops';
import { findLeg } from '../../data/mockTransport';
import { formatShortDate, formatStopRange } from './dateUtils';
import type { Selection } from './types';

type Props = {
  stops: PlannedStop[];
  selection: Selection;
  onSelect: (s: Selection) => void;
  onAddStop: () => void;
};

export function WebStopList({ stops, selection, onSelect, onAddStop }: Props) {
  return (
    <aside className="w-96 shrink-0 border-e border-cocoa-15 bg-ivory overflow-y-auto min-h-0 py-md flex flex-col gap-md">
      <TripOverviewCard stops={stops} />
      <div>
        <p className="meta-caps text-cocoa-55 px-md mb-md">Itinerary</p>
        <ol className="flex flex-col px-md">
          {stops.map((stop, i) => {
            const next = stops[i + 1];
            const isStopSelected =
              selection.type === 'stop' && selection.stopId === stop.id;
            const isLegSelected =
              !!next &&
              selection.type === 'leg' &&
              selection.fromStopId === stop.id &&
              selection.toStopId === next.id;
            return (
              <li key={stop.id} className="flex flex-col">
                <StopRow
                  stop={stop}
                  index={i + 1}
                  hasNext={!!next}
                  selected={isStopSelected}
                  onClick={() => onSelect({ type: 'stop', stopId: stop.id })}
                />
                {next && (
                  <LegRow
                    from={stop}
                    to={next}
                    selected={isLegSelected}
                    onClick={() =>
                      onSelect({
                        type: 'leg',
                        fromStopId: stop.id,
                        toStopId: next.id,
                      })
                    }
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <div className="px-md mx-md pt-md border-t border-cocoa-08">
        <Button variant="ghost" size="sm" fullWidth onClick={onAddStop}>
          <Plus size={14} strokeWidth={2} />
          Add stop
        </Button>
      </div>
    </aside>
  );
}

function TripOverviewCard({ stops }: { stops: PlannedStop[] }) {
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
    <article className="mx-md bg-sand border border-rope rounded-2xl p-md flex flex-col gap-sm">
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

type StopRowProps = {
  stop: PlannedStop;
  index: number;
  hasNext: boolean;
  selected: boolean;
  onClick: () => void;
};

function StopRow({ stop, index, hasNext, selected, onClick }: StopRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex gap-sm w-full text-start rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
    >
      <div className="shrink-0 w-8 flex flex-col items-center">
        <span
          aria-hidden="true"
          className="h-8 w-8 rounded-full bg-copper text-ivory font-serif text-body flex items-center justify-center shrink-0"
        >
          {index}
        </span>
        {hasNext && (
          <div className="w-px flex-1 border-s border-dashed border-cocoa-15 mt-xs" />
        )}
      </div>
      <div
        className={clsx(
          'flex-1 min-w-0 rounded-2xl px-sm py-xs transition-[background-color] duration-instant ease-out-quart motion-reduce:transition-none',
          selected ? 'bg-sand' : 'group-hover:bg-cocoa-8',
        )}
      >
        <h3 className="font-serif text-lede text-cocoa leading-tight">
          {stop.nameEn}
        </h3>
        <p className="text-small text-cocoa-55 tnum mt-xs">
          {formatStopRange(stop.arrivalDate, stop.departureDate)}
          <span className="text-cocoa-30"> · </span>
          {stop.nights} {stop.nights === 1 ? 'night' : 'nights'}
        </p>
        {stop.note && (
          <p className="text-small text-cocoa-55 italic mt-xs leading-snug">
            {stop.note}
          </p>
        )}
      </div>
    </button>
  );
}

type LegRowProps = {
  from: PlannedStop;
  to: PlannedStop;
  selected: boolean;
  onClick: () => void;
};

function LegRow({ from, to, selected, onClick }: LegRowProps) {
  const leg = findLeg(from.id, to.id);
  const Icon = leg?.legType === 'flight' ? Plane : Bus;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Transport from ${from.nameEn} to ${to.nameEn}`}
      className="group flex gap-sm w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory rounded-2xl"
    >
      <div className="shrink-0 w-8 flex flex-col items-center">
        <div className="h-3 w-px border-s border-dashed border-cocoa-15" />
        <div
          className={clsx(
            'h-6 w-6 rounded-full bg-ivory border flex items-center justify-center shrink-0 transition-[border-color,color] duration-instant ease-out-quart motion-reduce:transition-none',
            selected
              ? 'border-copper text-copper'
              : 'border-cocoa-15 text-cocoa-55 group-hover:border-copper group-hover:text-copper',
          )}
        >
          <Icon size={12} strokeWidth={2} />
        </div>
        <div className="h-3 w-px border-s border-dashed border-cocoa-15" />
      </div>
      <div className="flex-1 flex items-center px-sm">
        <span
          className={clsx(
            'meta-caps transition-colors duration-instant ease-out-quart motion-reduce:transition-none',
            selected
              ? 'text-copper'
              : 'text-cocoa-55 group-hover:text-copper',
          )}
        >
          {leg?.legType ?? 'transit'}
        </span>
      </div>
    </button>
  );
}
