import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import {
  ArrowRight,
  Bus,
  Car,
  Check,
  CircleDollarSign,
  Plane,
  Ship,
  Train,
} from 'lucide-react';
import { Button } from '../../components/Button';
import type { PlannedStop } from '../../data/plannedStops';
import type { TransportOffer } from '../../data/mockTransport';
import { generateLeg } from './transportGenerator';
import { formatLongDate } from './dateUtils';
import {
  fetchDrivingRoute,
  formatDriveDuration,
  formatDriveKm,
} from './osrmApi';
import {
  addTransit,
  findTransit,
  removeTransit,
  useWishlist,
} from './wishlist';
import { showToast } from './WebToast';

type Props = {
  fromStop: PlannedStop;
  toStop: PlannedStop;
  travelDate: string;
};

type Mode = TransportOffer['mode'];

const MODE_META: { mode: Mode; label: string; Icon: typeof Plane }[] = [
  { mode: 'flight', label: 'Flight', Icon: Plane },
  { mode: 'train', label: 'Train', Icon: Train },
  { mode: 'bus', label: 'Bus', Icon: Bus },
  { mode: 'ferry', label: 'Ferry', Icon: Ship },
  { mode: 'transfer', label: 'Transfer', Icon: Car },
  { mode: 'drive', label: 'Drive', Icon: Car },
];

export function WebTransportPanel({ fromStop, toStop, travelDate }: Props) {
  // Subscribe to wishlist changes for re-render.
  useWishlist();

  const leg = useMemo(
    () => generateLeg(fromStop, toStop, travelDate),
    [fromStop, toStop, travelDate],
  );

  const [drive, setDrive] = useState<TransportOffer | null>(null);
  useEffect(() => {
    let cancelled = false;
    setDrive(null);
    fetchDrivingRoute(fromStop.lat, fromStop.lng, toStop.lat, toStop.lng).then(
      (route) => {
        if (cancelled || !route) return;
        setDrive({
          id: `${fromStop.id}-${toStop.id}-drive`,
          fromStopId: fromStop.id,
          toStopId: toStop.id,
          mode: 'drive',
          provider: 'Drive yourself',
          departureTime: '—',
          arrivalTime: '—',
          durationLabel: formatDriveDuration(route.minutes),
          price: Math.round(route.km * 0.12),
          currency: 'USD',
          badge: null,
          stops: 0,
          note: `${formatDriveKm(route.km)} · fuel estimate`,
        });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [fromStop.id, toStop.id, fromStop.lat, fromStop.lng, toStop.lat, toStop.lng]);

  const allOffers = useMemo(
    () => (drive ? [...leg.offers, drive] : leg.offers),
    [leg, drive],
  );

  const availableModes = useMemo<Set<Mode>>(() => {
    return new Set(allOffers.map((o) => o.mode));
  }, [allOffers]);

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
    return allOffers.filter((o) => enabledModes.has(o.mode));
  }, [allOffers, enabledModes]);

  return (
    <div className="flex flex-col h-full min-h-0">
      <header className="shrink-0 px-md pt-md pb-sm border-b border-cocoa-15 flex flex-col gap-sm pe-12">
        <div className="flex flex-col gap-xs">
          <div className="flex items-center gap-xs font-serif text-sub text-cocoa leading-tight">
            <span>{fromStop.nameEn}</span>
            <ArrowRight size={16} strokeWidth={2} className="text-cocoa-55" />
            <span>{toStop.nameEn}</span>
          </div>
          <p className="text-small text-cocoa-55">
            {formatLongDate(leg.travelDate)}
          </p>
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
        {visibleOffers.length === 0 ? (
          <EmptyOffers />
        ) : (
          visibleOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              fromStop={fromStop}
              toStop={toStop}
            />
          ))
        )}
      </div>
    </div>
  );
}

function EmptyOffers() {
  return (
    <div className="bg-sand border border-rope rounded-2xl p-md text-center">
      <p className="text-small text-cocoa-55">
        No offers match the selected modes. Toggle a mode back on.
      </p>
    </div>
  );
}

function modeIcon(mode: Mode) {
  if (mode === 'flight') return Plane;
  if (mode === 'train') return Train;
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
  fromStop,
  toStop,
}: {
  offer: TransportOffer;
  fromStop: PlannedStop;
  toStop: PlannedStop;
}) {
  const booked = !!findTransit(fromStop.id, toStop.id, offer.id);
  const Icon = modeIcon(offer.mode);
  const isDrive = offer.mode === 'drive';

  const onBook = () => {
    if (booked) return;
    addTransit({ fromStopId: fromStop.id, toStopId: toStop.id, offer });
    showToast(`${offer.provider} booked`, () => {
      removeTransit(fromStop.id, toStop.id, offer.id);
    });
  };
  const onRemove = () => {
    if (!booked) return;
    removeTransit(fromStop.id, toStop.id, offer.id);
    showToast(`${offer.provider} removed`, () => {
      addTransit({ fromStopId: fromStop.id, toStopId: toStop.id, offer });
    });
  };

  return (
    <article
      className={clsx(
        'rounded-2xl p-sm border flex flex-col gap-sm transition-[border-color,background-color] duration-instant ease-out-quart motion-reduce:transition-none',
        booked ? 'bg-sand border-copper' : 'bg-sand border-rope',
      )}
    >
      <div className="flex items-start gap-sm">
        <span className="shrink-0 h-9 w-9 rounded-full bg-ivory border border-cocoa-15 flex items-center justify-center text-cocoa">
          <Icon size={16} strokeWidth={2} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-sans font-semibold text-lede text-cocoa">
            {offer.provider}
          </p>
          {!isDrive ? (
            <p className="text-small text-cocoa-70 inline-flex items-center gap-xs">
              <span className="tnum">{offer.departureTime}</span>
              <ArrowRight size={12} strokeWidth={2} className="text-cocoa-55" />
              <span className="tnum">{offer.arrivalTime}</span>
              <span className="text-cocoa-55">· {offer.durationLabel}</span>
            </p>
          ) : (
            <p className="text-small text-cocoa-70">{offer.durationLabel}</p>
          )}
          <p className="text-small text-cocoa-55">
            {isDrive
              ? 'Direct'
              : offer.stops === 0
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
        <p className="font-serif text-sub text-copper inline-flex items-baseline gap-xs">
          {isDrive && (
            <CircleDollarSign
              size={14}
              strokeWidth={2}
              className="text-cocoa-30"
            />
          )}
          {offer.currency} {offer.price}
        </p>
        {booked ? (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex items-center gap-xs text-meta uppercase font-medium text-copper hover:text-cocoa transition-colors duration-instant ease-out-quart motion-reduce:transition-none focus-visible:outline-none focus-visible:underline rounded-sm"
          >
            <Check size={12} strokeWidth={2} />
            Booked · Remove
          </button>
        ) : (
          <Button variant="accent" size="sm" onClick={onBook}>
            Book
          </Button>
        )}
      </div>
    </article>
  );
}
