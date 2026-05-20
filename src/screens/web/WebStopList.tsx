import clsx from 'clsx';
import { Plane, Bus, Plus } from 'lucide-react';
import { Button } from '../../components/Button';
import type { PlannedStop } from '../../data/plannedStops';
import { findLeg } from '../../data/mockTransport';
import { formatStopRange } from './dateUtils';
import type { Selection } from './types';

type Props = {
  stops: PlannedStop[];
  selection: Selection;
  onSelect: (s: Selection) => void;
};

export function WebStopList({ stops, selection, onSelect }: Props) {
  return (
    <aside className="w-60 shrink-0 border-e border-cocoa-15 bg-ivory overflow-y-auto p-md flex flex-col gap-xs">
      {stops.map((stop, i) => {
        const next = stops[i + 1];
        const isSelected =
          selection.type === 'stop' && selection.stopId === stop.id;
        return (
          <div key={stop.id} className="flex flex-col">
            <StopCard
              stop={stop}
              index={i + 1}
              selected={isSelected}
              onClick={() => onSelect({ type: 'stop', stopId: stop.id })}
            />
            {next && (
              <LegConnector
                fromStopId={stop.id}
                toStopId={next.id}
                selected={
                  selection.type === 'leg' &&
                  selection.fromStopId === stop.id &&
                  selection.toStopId === next.id
                }
                onClick={() =>
                  onSelect({
                    type: 'leg',
                    fromStopId: stop.id,
                    toStopId: next.id,
                  })
                }
              />
            )}
          </div>
        );
      })}
      <div className="mt-md">
        <Button variant="ghost" size="sm" fullWidth>
          <Plus size={14} strokeWidth={2} />
          Add stop
        </Button>
      </div>
    </aside>
  );
}

type StopCardProps = {
  stop: PlannedStop;
  index: number;
  selected: boolean;
  onClick: () => void;
};

function StopCard({ stop, index, selected, onClick }: StopCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'w-full text-start rounded-2xl p-sm border transition-[background-color,border-color] duration-instant ease-out-quart motion-reduce:transition-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
        selected
          ? 'bg-sand border-rope'
          : 'bg-ivory border-transparent hover:border-cocoa-15',
      )}
    >
      <div className="flex items-start gap-sm">
        <span
          aria-hidden="true"
          className="h-7 w-7 shrink-0 rounded-full bg-copper text-ivory font-serif text-small flex items-center justify-center"
        >
          {index}
        </span>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-serif text-lede text-cocoa truncate">
            {stop.nameEn}
          </span>
          <span className="text-small text-cocoa-55">
            {formatStopRange(stop.arrivalDate, stop.departureDate)}
          </span>
          <span className="text-small text-cocoa-55">
            {stop.nights} {stop.nights === 1 ? 'night' : 'nights'}
          </span>
          {stop.note && (
            <span className="text-small text-cocoa-55 italic truncate mt-xs">
              {stop.note}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

type LegConnectorProps = {
  fromStopId: string;
  toStopId: string;
  selected: boolean;
  onClick: () => void;
};

function LegConnector({
  fromStopId,
  toStopId,
  selected,
  onClick,
}: LegConnectorProps) {
  const leg = findLeg(fromStopId, toStopId);
  const Icon = leg?.legType === 'flight' ? Plane : Bus;
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'group flex items-center gap-sm py-xs ms-sm rounded-sm',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
      )}
      aria-label={`Transport between stops`}
    >
      <div
        className={clsx(
          'h-8 w-px border-s border-dashed',
          selected
            ? 'border-copper'
            : 'border-cocoa-15 group-hover:border-copper',
        )}
      />
      <span
        className={clsx(
          'flex items-center gap-xs text-meta uppercase',
          selected ? 'text-copper' : 'text-cocoa-55 group-hover:text-copper',
        )}
      >
        <Icon size={12} strokeWidth={2} />
        {leg?.legType ?? 'transit'}
      </span>
    </button>
  );
}
