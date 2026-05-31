import { useEffect } from 'react';
import clsx from 'clsx';
import {
  Bed,
  Bus,
  Car,
  Check,
  ChevronRight,
  Home,
  Plane,
  Plus,
  Ship,
  Sparkles,
  Train,
  X,
} from 'lucide-react';
import { Button } from '../../components/Button';
import type { PlannedStop } from '../../data/plannedStops';
import type { HomeCity } from './homeCity';
import { generateLeg } from './transportGenerator';
import { cityPhotos } from './cityPhotos';
import {
  addStay,
  addTransit,
  findStay,
  placesForStop,
  transitForLeg,
  useWishlist,
} from './wishlist';
import { formatStopRange, formatShortDate } from './dateUtils';
import {
  legsForTrip,
  tripReadiness,
  type LegRef,
} from './readiness';
import { openBookingSheet } from './WebBookingSheet';
import { showToast } from './WebToast';

type Props = {
  open: boolean;
  onClose: () => void;
  stops: PlannedStop[];
  home: HomeCity;
};

function homeStop(home: HomeCity, dateIso: string): PlannedStop {
  return {
    id: 'home',
    nameEn: home.nameEn,
    nameHe: home.nameEn,
    type: 'city',
    lat: home.lat,
    lng: home.lng,
    arrivalDate: dateIso,
    departureDate: dateIso,
    nights: 0,
    privacy: 'private',
  };
}

function modeIcon(mode: string) {
  if (mode === 'flight') return Plane;
  if (mode === 'train') return Train;
  if (mode === 'ferry') return Ship;
  if (mode === 'drive') return Car;
  return Bus;
}

/**
 * Dedicated full-itinerary overlay (the "bigger view" off the compact sidebar).
 * Spacious, scrollable timeline showing every stop with its photo, dates,
 * nights, saved places, and the recommended transport between legs.
 */
export function WebItineraryOverlay({ open, onClose, stops, home }: Props) {
  useWishlist();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const first = stops[0];
  const last = stops[stops.length - 1];
  const hs = homeStop(home, first?.arrivalDate ?? '2026-01-01');
  const dateSpan =
    first && last
      ? `${formatShortDate(first.arrivalDate)} – ${formatShortDate(last.departureDate)}`
      : 'Your trip';
  const nights = stops.reduce((sum, s) => sum + s.nights, 0);

  const legs = legsForTrip(stops);
  const readiness = tripReadiness(stops, legs);
  const hasGaps =
    readiness.openStays.length + readiness.openLegs.length > 0;

  // Cosmetic AI fill: closes every gap with the recommended option, staggered
  // so it reads as the assistant doing the work. This is the seam the real
  // AI layer plugs into later — replace the loop body with model output.
  const planTheRest = () => {
    const stopFor = (id: string): PlannedStop | undefined =>
      id === 'home' ? hs : stops.find((s) => s.id === id);
    const total = readiness.openStays.length + readiness.openLegs.length;
    let step = 0;
    readiness.openStays.forEach((stopId) => {
      setTimeout(() => addStay({ stopId }), step * 110);
      step++;
    });
    readiness.openLegs.forEach((leg: LegRef) => {
      setTimeout(() => {
        const from = stopFor(leg.fromId);
        const to = stopFor(leg.toId);
        if (!from || !to) return;
        const generated = generateLeg(from, to, from.departureDate);
        const offer =
          generated.offers.find((o) => o.badge === 'recommended') ??
          generated.offers[0];
        if (offer) {
          addTransit({
            fromStopId: leg.fromId,
            toStopId: leg.toId,
            offer,
          });
        }
      }, step * 110);
      step++;
    });
    setTimeout(
      () => showToast(`Trip planned · ${total} gaps closed`),
      step * 110 + 220,
    );
  };

  return (
    <div
      className="fixed inset-0 z-[3000] flex items-start justify-center overflow-y-auto bg-charcoal/50 p-lg backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Full itinerary"
    >
      <div
        className="my-auto w-full max-w-3xl rounded-2xl bg-cream shadow-fab"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="sticky top-0 z-10 flex items-start justify-between gap-md rounded-t-2xl border-b border-charcoal-15 bg-cream/95 px-lg py-md backdrop-blur">
          <div className="flex min-w-0 flex-1 flex-col gap-px">
            <span className="meta-caps text-charcoal-70">Full itinerary</span>
            <h2 className="font-serif text-sub leading-tight text-charcoal">
              {dateSpan}
            </h2>
            <span className="text-small text-charcoal-70 tnum">
              {stops.length} stops · {nights} nights
            </span>
            <ReadinessLine readiness={readiness} />
          </div>
          <div className="flex shrink-0 items-center gap-sm">
            {hasGaps && (
              <Button variant="accent" size="sm" onClick={planTheRest}>
                <Sparkles size={14} strokeWidth={2} />
                Plan with AI
              </Button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close itinerary"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-charcoal-8 text-charcoal transition-colors duration-instant ease-out-quart hover:bg-charcoal-15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        </header>

        <div className="flex flex-col gap-sm px-lg py-lg">
          <Endpoint home={home} variant="departure" />
          {stops.map((stop, i) => (
            <div key={stop.id} className="flex flex-col gap-sm">
              <TransportLeg from={i === 0 ? hs : stops[i - 1]} to={stop} />
              <DetailStop stop={stop} index={i + 1} />
            </div>
          ))}
          {last && <TransportLeg from={last} to={hs} />}
          <Endpoint home={home} variant="return" />
        </div>
      </div>
    </div>
  );
}

function ReadinessLine({
  readiness,
}: {
  readiness: ReturnType<typeof tripReadiness>;
}) {
  if (readiness.stopsTotal === 0) return null;
  const done = readiness.pct === 100;
  const staysLeft = readiness.stopsTotal - readiness.staysSorted;
  const legsLeft = readiness.legsTotal - readiness.legsBooked;
  const parts = [
    staysLeft > 0 ? `${staysLeft} ${staysLeft === 1 ? 'stay' : 'stays'}` : null,
    legsLeft > 0 ? `${legsLeft} ${legsLeft === 1 ? 'leg' : 'legs'}` : null,
  ].filter(Boolean);
  return (
    <div className="mt-xs flex items-center gap-sm">
      <div
        className="h-1.5 w-32 rounded-full bg-charcoal-15 overflow-hidden"
        role="progressbar"
        aria-valuenow={readiness.pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Trip readiness"
      >
        <div
          className={clsx(
            'h-full rounded-full transition-[width] duration-considered ease-out-quart motion-reduce:transition-none',
            done ? 'bg-sea' : 'bg-charcoal',
          )}
          style={{ width: `${readiness.pct}%` }}
        />
      </div>
      <p className="text-small text-charcoal-70 tnum">
        {readiness.pct}% planned
        {!done && parts.length > 0 && (
          <span className="text-charcoal-55"> · {parts.join(' · ')} left</span>
        )}
      </p>
    </div>
  );
}

function Endpoint({
  home,
  variant,
}: {
  home: HomeCity;
  variant: 'departure' | 'return';
}) {
  return (
    <div className="flex items-center gap-md">
      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal text-cream">
        <Home size={16} strokeWidth={2} />
      </span>
      <div className="flex flex-col">
        <span className="meta-caps text-charcoal-70">
          {variant === 'departure' ? 'Departure' : 'Return'}
        </span>
        <span className="font-serif text-lede text-charcoal">{home.nameEn}</span>
      </div>
    </div>
  );
}

function TransportLeg({ from, to }: { from: PlannedStop; to: PlannedStop }) {
  const booked = transitForLeg(from.id, to.id);
  const hasBooked = booked.length > 0;
  const offer = hasBooked
    ? booked[0].offer
    : (() => {
        const leg = generateLeg(from, to, from.departureDate);
        return (
          leg.offers.find((o) => o.badge === 'recommended') ?? leg.offers[0]
        );
      })();
  if (!offer) return null;
  const Icon = modeIcon(offer.mode);
  return (
    <div
      className={clsx(
        'ms-5 flex items-center gap-md border-s border-dashed border-charcoal-15 ps-md',
        !hasBooked && 'opacity-80',
      )}
    >
      <span
        className={clsx(
          'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          hasBooked ? 'bg-sea/15 text-sea' : 'bg-charcoal-8 text-charcoal-70',
        )}
      >
        <Icon size={14} strokeWidth={2} />
      </span>
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-sm gap-y-px text-small text-charcoal-70">
        {!hasBooked && (
          <span className="meta-caps text-charcoal-55">Suggested</span>
        )}
        <span className="font-medium text-charcoal">{offer.provider}</span>
        {offer.mode !== 'drive' && (
          <span className="tnum">
            {offer.departureTime} → {offer.arrivalTime}
          </span>
        )}
        <span className="tnum text-charcoal-55">
          {offer.currency} {offer.price}
        </span>
      </div>
      {hasBooked ? (
        <span className="inline-flex items-center gap-xs text-meta uppercase font-medium text-sea">
          <Check size={11} strokeWidth={2} />
          Booked
        </span>
      ) : (
        <button
          type="button"
          onClick={() =>
            openBookingSheet({
              kind: 'transport',
              offer,
              fromStop: from,
              toStop: to,
            })
          }
          className="inline-flex items-center gap-xs rounded-full border border-dashed border-charcoal-30 ps-sm pe-sm py-px text-meta uppercase font-medium text-charcoal-70 transition-colors duration-instant ease-out-quart motion-reduce:transition-none hover:border-amber hover:text-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          <Plus size={11} strokeWidth={2} />
          Add transport
        </button>
      )}
    </div>
  );
}

function DetailStop({ stop, index }: { stop: PlannedStop; index: number }) {
  const photo = cityPhotos(stop.id)[0];
  const saved = placesForStop(stop.id);
  const staySorted = !!findStay(stop.id);
  return (
    <article className="overflow-hidden rounded-2xl bg-sand ring-1 ring-charcoal-15">
      <div className="flex gap-md p-md">
        <span className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-clay to-sand">
          {photo && (
            <img
              src={photo}
              alt=""
              loading="lazy"
              className="h-full w-full object-cover"
            />
          )}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-xs">
          <div className="flex items-center gap-sm">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber text-meta font-semibold tnum text-cream">
              {index}
            </span>
            <h3 className="font-serif text-sub leading-tight text-charcoal">
              {stop.nameEn}
            </h3>
          </div>
          <p className="text-small text-charcoal-70 tnum">
            {formatStopRange(stop.arrivalDate, stop.departureDate)} · {stop.nights}{' '}
            {stop.nights === 1 ? 'night' : 'nights'}
          </p>
        </div>
      </div>
      <div className="mx-md mb-md flex flex-col gap-xs border-t border-charcoal-08 pt-sm">
        <StayRow stop={stop} sorted={staySorted} />
        {saved.map((item) => (
          <div key={item.id} className="flex items-center gap-sm text-small">
            <span className="min-w-0 flex-1 truncate text-charcoal">
              {item.placeName}
            </span>
            <span
              className={clsx(
                'shrink-0 rounded-full px-sm py-px text-meta font-medium uppercase',
                item.status === 'saved'
                  ? 'bg-charcoal-8 text-charcoal-70'
                  : 'bg-amber text-cream',
              )}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}

function StayRow({
  stop,
  sorted,
}: {
  stop: PlannedStop;
  sorted: boolean;
}) {
  if (sorted) {
    return (
      <div className="flex items-center gap-sm text-small">
        <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sea/15 text-sea">
          <Bed size={11} strokeWidth={2} />
        </span>
        <span className="flex-1 min-w-0 text-charcoal">Stay sorted</span>
        <span className="inline-flex items-center gap-xs text-meta uppercase font-medium text-sea">
          <Check size={11} strokeWidth={2} />
          Done
        </span>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={() => openBookingSheet({ kind: 'stay', stop })}
      className="group flex items-center gap-sm rounded-xl text-start text-small transition-colors duration-instant ease-out-quart motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-charcoal-8 text-charcoal-70">
        <Bed size={11} strokeWidth={2} />
      </span>
      <span className="flex-1 min-w-0 truncate text-charcoal-70 group-hover:text-amber">
        Find a stay for {stop.nameEn}
      </span>
      <span className="inline-flex items-center gap-xs rounded-full border border-dashed border-charcoal-30 ps-sm pe-sm py-px text-meta uppercase font-medium text-charcoal-70 group-hover:border-amber group-hover:text-amber">
        <Plus size={10} strokeWidth={2} />
        Add stay
      </span>
      <ChevronRight
        size={12}
        strokeWidth={2}
        className="text-charcoal-30 group-hover:text-amber"
      />
    </button>
  );
}
