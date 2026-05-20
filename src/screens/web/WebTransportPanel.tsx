import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { ArrowRight, Plane, Bus, Ship, Car } from 'lucide-react';
import { Button } from '../../components/Button';
import type { PlannedStop } from '../../data/plannedStops';
import {
  findLeg,
  type TransportOffer,
} from '../../data/mockTransport';
import { formatLongDate } from './dateUtils';
import type { BookingTarget } from './WebBookingModal';

type Props = {
  fromStop: PlannedStop;
  toStop: PlannedStop;
  onBook: (target: BookingTarget) => void;
};

type Mode = TransportOffer['mode'];

const MODE_META: { mode: Mode; label: string; Icon: typeof Plane }[] = [
  { mode: 'flight', label: 'Flight', Icon: Plane },
  { mode: 'bus', label: 'Bus', Icon: Bus },
  { mode: 'ferry', label: 'Ferry', Icon: Ship },
  { mode: 'transfer', label: 'Transfer', Icon: Car },
];

export function WebTransportPanel({ fromStop, toStop, onBook }: Props) {
  const leg = findLeg(fromStop.id, toStop.id);

  const availableModes = useMemo<Set<Mode>>(() => {
    if (!leg) return new Set();
    return new Set(leg.offers.map((o) => o.mode));
  }, [leg]);

  const [enabledModes, setEnabledModes] = useState<Set<Mode>>(availableModes);

  useEffect(() => {
    setEnabledModes(new Set(availableModes));
  }, [availableModes]);

  const toggleMode = (mode: Mode) => {
    setEnabledModes((prev) => {
      const next = new Set(prev);
      if (next.has(mode)) next.delete(mode);
      else next.add(mode);
      return next;
    });
  };

  const visibleOffers = useMemo(() => {
    if (!leg) return [];
    return leg.offers.filter((o) => enabledModes.has(o.mode));
  }, [leg, enabledModes]);

  return (
    <div className="flex flex-col h-full min-h-0">
      <header className="shrink-0 px-md pt-md pb-sm border-b border-cocoa-15 flex flex-col gap-sm pe-12">
        <div className="flex flex-col gap-xs">
          <div className="flex items-center gap-xs font-serif text-sub text-cocoa leading-tight">
            <span>{fromStop.nameEn}</span>
            <ArrowRight size={16} strokeWidth={2} className="text-cocoa-55" />
            <span>{toStop.nameEn}</span>
          </div>
          {leg && (
            <p className="text-small text-cocoa-55">
              {formatLongDate(leg.travelDate)}
            </p>
          )}
        </div>
        {availableModes.size > 1 && (
          <div className="flex flex-col gap-xs">
            <p className="meta-caps text-cocoa-55">Travel modes</p>
            <div className="flex gap-xs flex-wrap">
              {MODE_META.filter((m) => availableModes.has(m.mode)).map(
                ({ mode, label, Icon }) => {
                  const on = enabledModes.has(mode);
                  return (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => toggleMode(mode)}
                      aria-pressed={on}
                      className={clsx(
                        'inline-flex items-center gap-xs px-sm py-xs rounded-full border text-small transition-[background-color,border-color,color,opacity] duration-instant ease-out-quart motion-reduce:transition-none',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
                        on
                          ? 'bg-cocoa text-ivory border-cocoa'
                          : 'bg-ivory text-cocoa-55 border-cocoa-15 opacity-50 hover:opacity-100 hover:border-cocoa',
                      )}
                    >
                      <Icon size={12} strokeWidth={2} />
                      {label}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        )}
      </header>
      <div className="flex-1 overflow-y-auto p-md flex flex-col gap-sm">
        {!leg ? (
          <p className="text-small text-cocoa-55 text-center py-xl">
            No transport options on this leg yet.
          </p>
        ) : visibleOffers.length === 0 ? (
          <p className="text-small text-cocoa-55 text-center py-xl">
            No offers match the selected modes. Toggle a mode back on.
          </p>
        ) : (
          visibleOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              onBook={() =>
                onBook({
                  kind: 'transport',
                  from: fromStop.nameEn,
                  to: toStop.nameEn,
                  provider: offer.provider,
                })
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

function modeIcon(mode: Mode) {
  if (mode === 'flight') return Plane;
  if (mode === 'bus') return Bus;
  if (mode === 'ferry') return Ship;
  return Car;
}

function badgeColor(badge: NonNullable<TransportOffer['badge']>): string {
  if (badge === 'cheapest') return 'bg-stone text-ivory';
  if (badge === 'fastest') return 'bg-cocoa text-ivory';
  if (badge === 'easiest') return 'bg-rope text-cocoa';
  return 'bg-copper text-ivory';
}

function OfferCard({
  offer,
  onBook,
}: {
  offer: TransportOffer;
  onBook: () => void;
}) {
  const Icon = modeIcon(offer.mode);
  return (
    <article className="rounded-2xl p-sm border bg-sand border-rope flex flex-col gap-sm">
      <div className="flex items-start gap-sm">
        <span className="shrink-0 h-9 w-9 rounded-full bg-ivory border border-cocoa-15 flex items-center justify-center text-cocoa">
          <Icon size={16} strokeWidth={2} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-sans font-semibold text-lede text-cocoa">
            {offer.provider}
          </p>
          <p className="text-small text-cocoa-70 inline-flex items-center gap-xs">
            <span className="tnum">{offer.departureTime}</span>
            <ArrowRight size={12} strokeWidth={2} className="text-cocoa-55" />
            <span className="tnum">{offer.arrivalTime}</span>
            <span className="text-cocoa-55">· {offer.durationLabel}</span>
          </p>
          <p className="text-small text-cocoa-55">
            {offer.stops === 0
              ? 'Direct'
              : `${offer.stops} ${offer.stops === 1 ? 'stop' : 'stops'}`}
            {offer.note && <> · {offer.note}</>}
          </p>
        </div>
        {offer.badge && (
          <span
            className={clsx(
              'shrink-0 rounded-full px-sm py-xs text-meta uppercase font-medium',
              badgeColor(offer.badge),
            )}
          >
            {offer.badge}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-sm">
        <p className="font-serif text-sub text-copper">
          {offer.currency} {offer.price}
        </p>
        <Button variant="accent" size="sm" onClick={onBook}>
          Book
        </Button>
      </div>
    </article>
  );
}
