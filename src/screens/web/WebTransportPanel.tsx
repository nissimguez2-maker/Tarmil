import { useState } from 'react';
import clsx from 'clsx';
import { ArrowRight, Plane, Bus, Ship, Car } from 'lucide-react';
import { Button } from '../../components/Button';
import type { PlannedStop } from '../../data/plannedStops';
import {
  findLeg,
  type TransportOffer,
  type TransportLeg,
} from '../../data/mockTransport';
import { formatLongDate } from './dateUtils';

type Props = {
  fromStop: PlannedStop;
  toStop: PlannedStop;
};

type BadgeFilter = TransportOffer['badge'];

const BADGE_TABS: { value: NonNullable<BadgeFilter>; label: string }[] = [
  { value: 'cheapest', label: 'Cheapest' },
  { value: 'fastest', label: 'Fastest' },
  { value: 'easiest', label: 'Easiest' },
  { value: 'recommended', label: 'Recommended' },
];

export function WebTransportPanel({ fromStop, toStop }: Props) {
  const leg = findLeg(fromStop.id, toStop.id);
  const [activeBadge, setActiveBadge] = useState<BadgeFilter>(null);

  return (
    <div className="flex flex-col h-full min-h-0">
      <header className="shrink-0 p-md border-b border-cocoa-15 flex flex-col gap-sm">
        <div className="flex flex-col gap-xs">
          <div className="flex items-center gap-xs font-serif text-lede text-cocoa">
            <span>{fromStop.nameEn}</span>
            <ArrowRight size={14} strokeWidth={2} className="text-cocoa-55" />
            <span>{toStop.nameEn}</span>
          </div>
          {leg && (
            <p className="text-small text-cocoa-55">
              {formatLongDate(leg.travelDate)}
            </p>
          )}
        </div>
        <div className="flex gap-xs flex-wrap">
          {BADGE_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() =>
                setActiveBadge(activeBadge === tab.value ? null : tab.value)
              }
              className={clsx(
                'rounded-full px-sm py-xs text-meta uppercase border transition-[background-color,border-color,color] duration-instant ease-out-quart motion-reduce:transition-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
                activeBadge === tab.value
                  ? 'bg-copper text-ivory border-copper'
                  : 'bg-ivory text-cocoa-70 border-cocoa-15 hover:border-copper hover:text-copper',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-md flex flex-col gap-sm">
        {!leg ? (
          <p className="text-small text-cocoa-55 text-center py-xl">
            No transport options on this leg yet.
          </p>
        ) : (
          <OfferList leg={leg} activeBadge={activeBadge} />
        )}
      </div>
    </div>
  );
}

function OfferList({
  leg,
  activeBadge,
}: {
  leg: TransportLeg;
  activeBadge: BadgeFilter;
}) {
  return (
    <>
      {leg.offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          highlighted={activeBadge != null && offer.badge === activeBadge}
        />
      ))}
    </>
  );
}

function modeIcon(mode: TransportOffer['mode']) {
  if (mode === 'flight') return Plane;
  if (mode === 'bus') return Bus;
  if (mode === 'ferry') return Ship;
  return Car;
}

function badgeColor(badge: NonNullable<BadgeFilter>): string {
  if (badge === 'cheapest') return 'bg-stone text-ivory';
  if (badge === 'fastest') return 'bg-cocoa text-ivory';
  if (badge === 'easiest') return 'bg-rope text-cocoa';
  return 'bg-copper text-ivory';
}

function OfferCard({
  offer,
  highlighted,
}: {
  offer: TransportOffer;
  highlighted: boolean;
}) {
  const Icon = modeIcon(offer.mode);
  const onBook = () => {
    const query = `${offer.provider} ${offer.fromStopId} to ${offer.toStopId}`;
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      '_blank',
      'noopener',
    );
  };
  return (
    <article
      className={clsx(
        'rounded-2xl p-sm border flex flex-col gap-sm transition-[border-color,background-color] duration-instant ease-out-quart motion-reduce:transition-none',
        highlighted ? 'bg-sand border-copper' : 'bg-sand border-rope',
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
