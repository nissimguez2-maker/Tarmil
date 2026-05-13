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
 * Editorial rhythm: eyebrow, headline, countdown, dates, optional friends row.
 * Tap opens the planned-route sheet.
 */
export function NextTripCard({ stop, friends, onTap }: Props) {
  const days = daysUntil(stop.arrivalDate);
  const dateRange = formatDateRange(stop.arrivalDate, stop.departureDate);

  return (
    <button
      type="button"
      onClick={onTap}
      className={clsx(
        'group/card block w-full border-b border-cocoa-08 bg-sand text-start',
        'transition-colors duration-instant ease-out-quart hover:bg-sand/80 active:bg-rope/40',
        'focus-visible:outline-none focus-visible:bg-sand/80',
      )}
    >
      <div className="flex flex-col gap-1 px-md pb-sm pt-md">
        <span className="meta-caps text-copper">הטיול הבא</span>

        <h2 className="font-serif text-sub font-bold leading-[1] tracking-[-0.022em] text-balance text-cocoa">
          {stop.nameHe}
        </h2>

        <DaysUntilLine days={days} />

        <p className="text-small text-cocoa-55">
          <span className="text-cocoa-70">{dateRange}</span>
          <span aria-hidden className="px-1.5 text-cocoa-30">·</span>
          <span>
            <span className="tnum">{stop.nights}</span> לילות
          </span>
        </p>
      </div>

      {friends.length > 0 && <FriendsRow friends={friends} stop={stop} />}
    </button>
  );
}

function DaysUntilLine({ days }: { days: number }) {
  if (days < 0) {
    return (
      <p className="text-small font-medium text-copper">בטיול עכשיו</p>
    );
  }
  if (days === 0) {
    return <p className="text-small font-medium text-copper">יוצאים היום</p>;
  }
  if (days === 1) {
    return <p className="text-small font-medium text-copper">מחר יוצאים</p>;
  }
  return (
    <p className="text-small text-cocoa-70">
      <span className="tnum text-cocoa">{days}</span> ימים לדרך
    </p>
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
    <div className="flex items-center gap-sm border-t border-cocoa-08 px-md py-sm">
      <FriendDots friends={friends.slice(0, 3)} />
      <span className="text-small text-cocoa-70">
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
            'border-2 border-sand bg-cocoa font-serif text-body leading-none text-ivory',
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
