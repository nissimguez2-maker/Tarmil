import { useState } from 'react';
import clsx from 'clsx';
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { CSS } from '@dnd-kit/utilities';
import { Bus, GripVertical, Pencil, Plane, Plus, Ship, Train, Trash2 } from 'lucide-react';
import { Button } from '../../components/Button';
import type { PlannedStop } from '../../data/plannedStops';
import { generateLeg } from './transportGenerator';
import { formatShortDate, formatStopRange } from './dateUtils';
import type { Selection } from './types';

type Props = {
  stops: PlannedStop[];
  selection: Selection;
  onSelect: (s: Selection) => void;
  onAddStop: () => void;
  onReorder: (fromIdx: number, toIdx: number) => void;
  onRemoveStop: (id: string) => void;
  onEditDates: (id: string, arrivalIso: string, departureIso: string) => void;
};

export function WebStopList({
  stops,
  selection,
  onSelect,
  onAddStop,
  onReorder,
  onRemoveStop,
  onEditDates,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIdx = stops.findIndex((s) => s.id === active.id);
    const toIdx = stops.findIndex((s) => s.id === over.id);
    if (fromIdx === -1 || toIdx === -1) return;
    onReorder(fromIdx, toIdx);
  };

  return (
    <aside className="w-96 shrink-0 border-e border-cocoa-15 bg-ivory overflow-y-auto min-h-0 py-md flex flex-col gap-md">
      <TripOverviewCard stops={stops} />
      <div>
        <p className="meta-caps text-cocoa-55 px-md mb-md">Itinerary</p>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[]}
        >
          <SortableContext
            items={stops.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
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
                    <SortableStopRow
                      stop={stop}
                      index={i + 1}
                      hasNext={!!next}
                      selected={isStopSelected}
                      canRemove={stops.length > 1}
                      onClick={() =>
                        onSelect({ type: 'stop', stopId: stop.id })
                      }
                      onRemove={() => onRemoveStop(stop.id)}
                      onEditDates={(a, d) => onEditDates(stop.id, a, d)}
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
          </SortableContext>
        </DndContext>
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

type SortableStopRowProps = {
  stop: PlannedStop;
  index: number;
  hasNext: boolean;
  selected: boolean;
  canRemove: boolean;
  onClick: () => void;
  onRemove: () => void;
  onEditDates: (arrivalIso: string, departureIso: string) => void;
};

function SortableStopRow(props: SortableStopRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        'relative',
        isDragging && 'z-10 opacity-90 shadow-card rounded-2xl bg-ivory',
      )}
    >
      <StopRow
        {...props}
        dragAttributes={attributes}
        dragListeners={listeners}
        isDragging={isDragging}
      />
    </div>
  );
}

type StopRowProps = SortableStopRowProps & {
  dragAttributes: React.HTMLAttributes<HTMLButtonElement>;
  dragListeners: SyntheticListenerMap | undefined;
  isDragging: boolean;
};

function StopRow({
  stop,
  index,
  hasNext,
  selected,
  canRemove,
  onClick,
  onRemove,
  onEditDates,
  dragAttributes,
  dragListeners,
  isDragging,
}: StopRowProps) {
  const [editing, setEditing] = useState(false);

  return (
    <div className="group flex gap-sm w-full text-start rounded-2xl">
      <div className="shrink-0 w-8 flex flex-col items-center">
        <button
          type="button"
          {...dragAttributes}
          {...dragListeners}
          aria-label={`Drag ${stop.nameEn}`}
          className={clsx(
            'h-8 w-8 rounded-full bg-copper text-ivory font-serif text-body flex items-center justify-center shrink-0 relative',
            'cursor-grab active:cursor-grabbing touch-none',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
          )}
        >
          <span className="group-hover:opacity-0 transition-opacity duration-instant ease-out-quart">
            {index}
          </span>
          <GripVertical
            size={14}
            strokeWidth={2}
            className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-instant ease-out-quart pointer-events-none"
          />
        </button>
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
        <div className="flex items-start gap-sm">
          <button
            type="button"
            onClick={onClick}
            className="flex-1 min-w-0 text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory rounded-sm"
            disabled={isDragging}
          >
            <h3 className="font-serif text-lede text-cocoa leading-tight">
              {stop.nameEn}
            </h3>
            {!editing && (
              <p className="text-small text-cocoa-55 tnum mt-xs">
                {formatStopRange(stop.arrivalDate, stop.departureDate)}
                <span className="text-cocoa-30"> · </span>
                {stop.nights} {stop.nights === 1 ? 'night' : 'nights'}
              </p>
            )}
            {!editing && stop.note && (
              <p className="text-small text-cocoa-55 italic mt-xs leading-snug">
                {stop.note}
              </p>
            )}
          </button>
          <div className="flex flex-col gap-xs opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-instant ease-out-quart">
            <IconButton
              onClick={() => setEditing((v) => !v)}
              label={editing ? 'Cancel edit' : 'Edit dates'}
            >
              <Pencil size={12} strokeWidth={2} />
            </IconButton>
            {canRemove && (
              <IconButton onClick={onRemove} label={`Remove ${stop.nameEn}`}>
                <Trash2 size={12} strokeWidth={2} />
              </IconButton>
            )}
          </div>
        </div>
        {editing && (
          <DateEditor
            arrivalIso={stop.arrivalDate}
            departureIso={stop.departureDate}
            onSave={(a, d) => {
              onEditDates(a, d);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        )}
      </div>
    </div>
  );
}

function IconButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="h-6 w-6 rounded-full flex items-center justify-center text-cocoa-55 hover:text-copper hover:bg-cocoa-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
    >
      {children}
    </button>
  );
}

function DateEditor({
  arrivalIso,
  departureIso,
  onSave,
  onCancel,
}: {
  arrivalIso: string;
  departureIso: string;
  onSave: (a: string, d: string) => void;
  onCancel: () => void;
}) {
  const [arrival, setArrival] = useState(arrivalIso);
  const [departure, setDeparture] = useState(departureIso);
  const arrivalDate = new Date(arrival + 'T12:00:00');
  const departureDate = new Date(departure + 'T12:00:00');
  const nights = Math.max(
    0,
    Math.round(
      (departureDate.getTime() - arrivalDate.getTime()) /
        (1000 * 60 * 60 * 24),
    ),
  );
  const valid = arrival && departure && nights >= 1;
  return (
    <div className="mt-sm flex flex-col gap-sm">
      <div className="flex gap-sm">
        <DateField label="Arrival" value={arrival} onChange={setArrival} />
        <DateField label="Depart" value={departure} onChange={setDeparture} />
      </div>
      <p
        className={clsx(
          'text-small',
          valid ? 'text-cocoa-55' : 'text-copper',
        )}
      >
        {valid
          ? `${nights} ${nights === 1 ? 'night' : 'nights'}`
          : 'Departure must be after arrival'}
      </p>
      <div className="flex gap-sm">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          variant="accent"
          size="sm"
          onClick={() => valid && onSave(arrival, departure)}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex-1 flex flex-col gap-xs">
      <span className="meta-caps text-cocoa-55">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-xl px-sm bg-ivory border border-cocoa-15 text-body text-cocoa focus:border-copper focus:outline-none transition-[border-color] duration-instant ease-out-quart"
      />
    </label>
  );
}

type LegRowProps = {
  from: PlannedStop;
  to: PlannedStop;
  selected: boolean;
  onClick: () => void;
};

function LegRow({ from, to, selected, onClick }: LegRowProps) {
  const leg = generateLeg(from, to, from.departureDate);
  const dominantMode = leg.offers.find((o) => o.badge === 'recommended')?.mode
    ?? leg.offers[0]?.mode
    ?? 'bus';
  const Icon =
    dominantMode === 'flight'
      ? Plane
      : dominantMode === 'train'
        ? Train
        : dominantMode === 'ferry'
          ? Ship
          : Bus;
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
          {dominantMode}
        </span>
      </div>
    </button>
  );
}
