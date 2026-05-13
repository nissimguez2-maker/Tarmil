import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../../Button';
import type {
  PlannedStop,
  PlannedStopPrivacy,
} from '../../../data/plannedStops';
import type { FriendOverlap } from '../../../data/myTrip';
import { nightsBetween } from '../utils/nightsBetween';
import { PrivacyRadios } from '../ui/PrivacyRadios';
import { formatDateRange } from '../utils/formatDateRange';

type Props = {
  friend: FriendOverlap;
  onSave: (stop: PlannedStop) => void;
  onClose: () => void;
};

const FALLBACK_ARRIVAL = '2026-11-15';
const FALLBACK_DEPARTURE = '2026-11-18';

/**
 * "Join your friend's trip" sheet — opened from FriendSheet's primary CTA when
 * the friend has an overlap window. Pre-fills the new stop's name + coords
 * from the friend, and the dates from `overlapStart` / `overlapEnd`. The user
 * can still tweak the dates before saving.
 */
export function ConfirmFriendTripSheet({ friend, onSave, onClose }: Props) {
  const [arrivalDate, setArrivalDate] = useState(
    friend.overlapStart ?? FALLBACK_ARRIVAL,
  );
  const [departureDate, setDepartureDate] = useState(
    friend.overlapEnd ?? FALLBACK_DEPARTURE,
  );
  const [privacy, setPrivacy] = useState<PlannedStopPrivacy>('friends');

  const nights = Math.max(0, nightsBetween(arrivalDate, departureDate));

  const handleSave = () => {
    const stop: PlannedStop = {
      id: `stop-${Date.now()}`,
      nameHe: friend.zoneLabel,
      nameEn: friend.zoneLabel,
      type: 'city',
      lat: friend.lat,
      lng: friend.lng,
      arrivalDate,
      departureDate,
      nights,
      privacy,
      friendOverlapIds: [friend.id],
    };
    onSave(stop);
  };

  const overlapWindow =
    friend.overlapStart && friend.overlapEnd
      ? formatDateRange(friend.overlapStart, friend.overlapEnd)
      : null;

  return (
    <div className="flex max-h-[80dvh] flex-col gap-md overflow-y-auto px-md pb-md pt-sm">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex min-w-0 flex-1 flex-col gap-px">
          <span className="meta-caps text-copper">Join a friend</span>
          <h3 className="font-serif text-lede leading-tight text-cocoa">
            {friend.friendName} in {friend.zoneLabel}
          </h3>
          {overlapWindow && (
            <span className="text-small text-cocoa-70">
              Overlaps with you {overlapWindow}
            </span>
          )}
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="-me-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-cocoa-55 transition-colors duration-instant ease-out-quart hover:bg-cocoa-8 active:bg-cocoa-15"
        >
          <X className="h-4 w-4" strokeWidth={1.8} aria-hidden />
        </button>
      </div>

      <p className="text-body leading-snug text-cocoa-70">
        We'll create a new stop on your trip with {friend.friendName}'s location
        and the window where you overlap. You can still tweak the dates before
        saving.
      </p>

      <div className="flex flex-col gap-xs">
        <span className="meta-caps text-cocoa-55">When will you be there?</span>
        <div className="flex flex-col gap-2">
          <DateField
            label="Arrival"
            value={arrivalDate}
            onChange={setArrivalDate}
          />
          <DateField
            label="Departure"
            value={departureDate}
            onChange={setDepartureDate}
          />
        </div>
        <span className="text-small text-cocoa-70">
          <span className="tnum">{nights}</span> nights
        </span>
      </div>

      <PrivacyRadios value={privacy} onChange={setPrivacy} />

      <Button variant="accent" onClick={handleSave} fullWidth>
        Add to my trip
      </Button>
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
    <label className="flex h-10 cursor-pointer items-center justify-between gap-sm rounded-full border border-cocoa-15 bg-sand px-md text-cocoa transition-colors duration-instant ease-out-quart focus-within:border-copper">
      <span className="text-small text-cocoa-55">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir="ltr"
        aria-label={label}
        className="tnum cursor-pointer border-none bg-transparent text-body text-cocoa focus:outline-none"
      />
    </label>
  );
}
