import { ChevronLeft } from 'lucide-react';
import clsx from 'clsx';
import type { PlannedStop } from '../../../data/plannedStops';
import type { FriendOverlap } from '../../../data/myTrip';
import { formatDateRange, formatDateChip } from '../utils/formatDateRange';
import { daysUntil } from '../utils/daysUntil';

type Props = {
  stop: PlannedStop;
  /** Future-status friend overlaps that align with this stop. */
  friends: FriendOverlap[];
  onTap: () => void;
};

/**
 * Pinned card at the top of the Trip tab — the "your next trip" headline.
 * Days-until counter, destination + date range, friends-who-will-be-there
 * row at city resolution. Tap opens the planned-route sheet for full
 * editing.
 *
 * Sits between <TopBar> and the map; eats vertical space rather than
 * floating, so the map below stays unambiguously the hero.
 */
export function NextTripCard({ stop, friends, onTap }: Props) {
  const days = daysUntil(stop.arrivalDate);
  const dateRange = formatDateRange(stop.arrivalDate, stop.departureDate);

  return (
    <button
      type="button"
      onClick={onTap}
      className={clsx(
        'flex w-full flex-col gap-1 border-b border-cocoa-15 bg-sand p-md text-start',
        'active:bg-cocoa-08',
      )}
    >
      <div className="flex items-baseline justify-between gap-sm">
        <span className="meta-caps text-copper">הטיול הבא</span>
        <ChevronLeft className="h-4 w-4 text-cocoa-55" aria-hidden />
      </div>

      <h2 className="font-serif text-sub leading-tight text-cocoa">
        {stop.nameHe}
      </h2>

      <p className="text-[10pt] text-cocoa-70">
        <DaysUntilChip days={days} />
        <span className="px-1.5 text-cocoa-30" aria-hidden>·</span>
        <span>{dateRange}</span>
        <span className="px-1.5 text-cocoa-30" aria-hidden>·</span>
        <span>
          <span className="tnum text-cocoa">{stop.nights}</span> לילות
        </span>
      </p>

      {friends.length > 0 && (
        <FriendsRow friends={friends} stop={stop} />
      )}
    </button>
  );
}

function DaysUntilChip({ days }: { days: number }) {
  if (days < 0) {
    return <span className="text-cocoa-55">בטיול עכשיו</span>;
  }
  if (days === 0) {
    return <span className="text-copper">יוצאים היום</span>;
  }
  if (days === 1) {
    return <span className="text-copper">מחר יוצאים</span>;
  }
  return (
    <span>
      <span className="tnum font-medium text-cocoa">{days}</span> ימים לדרך
    </span>
  );
}

function FriendsRow({
  friends,
  stop,
}: {
  friends: FriendOverlap[];
  stop: PlannedStop;
}) {
  return (
    <div className="mt-1 flex items-center gap-2">
      <FriendDots friends={friends.slice(0, 3)} />
      <span className="text-[10pt] text-cocoa-70">
        {summarize(friends, stop)}
      </span>
    </div>
  );
}

function FriendDots({ friends }: { friends: FriendOverlap[] }) {
  return (
    <div className="flex">
      {friends.map((f, i) => (
        <span
          key={f.id}
          className={clsx(
            '-me-2 inline-flex h-7 w-7 items-center justify-center rounded-full',
            'border-2 border-sand bg-cocoa font-serif text-[11pt] text-ivory',
          )}
          style={{ zIndex: friends.length - i }}
          aria-hidden
        >
          {f.friendInitial}
        </span>
      ))}
    </div>
  );
}

function summarize(friends: FriendOverlap[], stop: PlannedStop): string {
  if (friends.length === 1) {
    const f = friends[0];
    if (f.overlapStart && f.overlapEnd) {
      const window = formatOverlapWindow(f.overlapStart, f.overlapEnd);
      return `${f.friendName} יחפוף איתך ${window}`;
    }
    return `${f.friendName} יהיה ב${stop.nameHe}`;
  }
  return `${friends.length} חברים יחפפו איתך`;
}

function formatOverlapWindow(fromIso: string, toIso: string): string {
  const from = new Date(fromIso + 'T00:00:00Z');
  const to = new Date(toIso + 'T00:00:00Z');
  const sameMonth =
    from.getUTCMonth() === to.getUTCMonth() &&
    from.getUTCFullYear() === to.getUTCFullYear();
  if (sameMonth) {
    return `${from.getUTCDate()}–${to.getUTCDate()}`;
  }
  return `${formatDateChip(fromIso)} – ${formatDateChip(toIso)}`;
}
