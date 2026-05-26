import { useState } from 'react';
import clsx from 'clsx';
import { Plus, MapPin, ChevronUp } from 'lucide-react';
import type { PlannedStop } from '../../../data/plannedStops';
import { formatDateChip } from '../utils/formatDateRange';
import { daysUntil } from '../utils/daysUntil';

type Props = {
  /** All planned stops in arrival order. Empty = empty-state CTA. */
  stops: PlannedStop[];
  /** Opens the planned-route sheet to view / reorder. */
  onTap: () => void;
  /** Opens the destination-search sheet to add a new stop. */
  onAdd: () => void;
};

/**
 * Pinned strip at the top of the Trip tab — the always-visible
 * "where will you be?" surface.
 *
 * States:
 *  - No stops:    empty-state CTA prompting to add the first stop.
 *  - Stops:       multi-stop summary — title joins the first 2 cities
 *                 (Búzios → São Paulo) plus "+N more" tail when there
 *                 are 3+. Dates span the full trip (first arrival to
 *                 last departure). Trailing `+` adds a follow-on.
 *
 * Collapsible: tap the chevron to fold the card down to a thin pill so
 * the map gets the full canvas. Tap the pill to expand again.
 */
export function NextTripCard({ stops, onTap, onAdd }: Props) {
  const [collapsed, setCollapsed] = useState(false);

  if (stops.length === 0) {
    return <EmptyState onAdd={onAdd} />;
  }

  const title = formatTripTitle(stops);
  const span = formatTripSpan(stops);
  const totalNights = stops.reduce((acc, s) => acc + s.nights, 0);
  const days = daysUntil(stops[0].arrivalDate);

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => setCollapsed(false)}
        aria-label="Expand trip details"
        aria-expanded={false}
        className="block w-full border-b border-charcoal-08 bg-sand text-start transition-colors duration-instant ease-out-quart hover:bg-sand/80 active:bg-clay/40 focus-visible:outline-none focus-visible:bg-sand/80"
      >
        <div className="flex items-center gap-sm px-md py-2">
          <span className="meta-caps shrink-0 text-amber">Trip</span>
          <span className="line-clamp-1 flex-1 font-serif text-body italic text-charcoal">
            {title}
          </span>
          <ChevronUp
            className="h-4 w-4 shrink-0 rotate-180 text-charcoal-55"
            strokeWidth={1.7}
            aria-hidden
          />
        </div>
      </button>
    );
  }

  return (
    <div
      className={clsx(
        'group/card block w-full border-b border-charcoal-08 bg-sand',
        'transition-colors duration-instant ease-out-quart',
      )}
    >
      <div className="flex items-stretch">
        <button
          type="button"
          onClick={onTap}
          className="flex-1 flex-col gap-1 px-md pb-sm pt-md text-start transition-colors duration-instant ease-out-quart hover:bg-sand/80 active:bg-clay/40 focus-visible:outline-none focus-visible:bg-sand/80"
        >
          <span className="meta-caps text-amber">Next trip</span>

          <h2 className="truncate font-serif text-sub font-bold leading-tight text-charcoal">
            {title}
          </h2>

          <DaysUntilLine days={days} />

          <p className="text-small text-charcoal-55">
            <span className="text-charcoal-70">{span}</span>
            <span aria-hidden className="px-1.5 text-charcoal-30">·</span>
            <span>
              <span className="tnum">{totalNights}</span> nights
            </span>
          </p>
        </button>

        <div className="me-md flex shrink-0 flex-col items-center justify-center gap-1 self-stretch py-sm">
          <button
            type="button"
            onClick={onAdd}
            aria-label="Add a stop"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber text-cream shadow-card transition-[transform,background-color] duration-instant ease-out-quart hover:bg-amber-85 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
          >
            <Plus className="h-5 w-5" strokeWidth={2.2} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setCollapsed(true)}
            aria-label="Collapse trip details"
            aria-expanded={true}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-charcoal-55 transition-colors duration-instant ease-out-quart hover:bg-charcoal-8 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            <ChevronUp className="h-4 w-4" strokeWidth={1.7} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="block w-full border-b border-charcoal-08 bg-sand text-start transition-colors duration-instant ease-out-quart hover:bg-sand/80 active:bg-clay/40 focus-visible:outline-none focus-visible:bg-sand/80"
    >
      <div className="flex items-center gap-sm px-md py-md">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber text-cream shadow-card">
          <MapPin className="h-5 w-5" strokeWidth={1.8} aria-hidden />
        </span>
        <div className="flex flex-1 flex-col gap-px">
          <span className="meta-caps text-amber">Your trip</span>
          <h2 className="font-serif text-lede italic leading-tight text-charcoal">
            Where will you be? · When?
          </h2>
        </div>
        <span
          aria-hidden
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cream text-charcoal shadow-card"
        >
          <Plus className="h-4 w-4" strokeWidth={2.2} />
        </span>
      </div>
    </button>
  );
}

function DaysUntilLine({ days }: { days: number }) {
  if (days < 0) {
    return (
      <p className="text-small font-medium text-amber">On the trip now</p>
    );
  }
  if (days === 0) {
    return <p className="text-small font-medium text-amber">Leaving today</p>;
  }
  if (days === 1) {
    return <p className="text-small font-medium text-amber">Leaving tomorrow</p>;
  }
  return (
    <p className="text-small text-charcoal-70">
      <span className="tnum text-charcoal">{days}</span> days to go
    </p>
  );
}

/**
 * Title rule — single short line, never wraps.
 *  - 1 stop : "São Paulo"
 *  - 2 stops: "Búzios → São Paulo"
 *  - 3+     : "Búzios + N more"
 *
 * For 3+ stops we collapse to "first + N more" because trying to fit two
 * arrows and a tail in a `text-sub` (22pt) headline wraps to three lines
 * on the card width. The full sequence is still in the planned-route
 * sheet (tap the title).
 */
function formatTripTitle(stops: PlannedStop[]): string {
  if (stops.length === 1) return stops[0].nameEn;
  if (stops.length === 2) {
    return `${stops[0].nameEn} → ${stops[1].nameEn}`;
  }
  return `${stops[0].nameEn} + ${stops.length - 1} more`;
}

/**
 * Span rule: from the first arrival_date to the last departure_date.
 * "Nov 1–6" for a single stop, "Oct 28 – Nov 14" for multi-stop.
 */
function formatTripSpan(stops: PlannedStop[]): string {
  if (stops.length === 1) {
    const s = stops[0];
    const from = new Date(s.arrivalDate + 'T00:00:00Z');
    const to = new Date(s.departureDate + 'T00:00:00Z');
    if (from.getUTCMonth() === to.getUTCMonth()) {
      return `${formatDateChip(s.arrivalDate)}–${to.getUTCDate()}`;
    }
    return `${formatDateChip(s.arrivalDate)} – ${formatDateChip(s.departureDate)}`;
  }
  const first = stops[0];
  const last = stops[stops.length - 1];
  return `${formatDateChip(first.arrivalDate)} – ${formatDateChip(last.departureDate)}`;
}
