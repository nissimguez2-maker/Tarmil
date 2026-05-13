import clsx from 'clsx';
import { Plus, MapPin } from 'lucide-react';
import type { PlannedStop } from '../../../data/plannedStops';
import type { FriendOverlap } from '../../../data/myTrip';
import { formatDateRange, formatDateChip } from '../utils/formatDateRange';
import { daysUntil } from '../utils/daysUntil';

type Props = {
  /** Upcoming stop. `null` renders the empty-state CTA. */
  stop: PlannedStop | null;
  /** Future-status friend overlaps that align with this stop. */
  friends: FriendOverlap[];
  /** Total number of planned stops. Renders "+N more" tail when > 1. */
  totalStops: number;
  /** Opens the planned-route sheet to view / reorder. */
  onTap: () => void;
  /** Opens the destination-search sheet to add a new stop. */
  onAdd: () => void;
};

/**
 * Pinned strip at the top of the Trip tab — the always-visible
 * "where will you be?" surface for v0.3.
 *
 * Three states:
 *  - No stops: inline CTA prompting the user to declare a stop.
 *  - 1 stop:   the next stop, with a trailing `+` to add a follow-on.
 *  - 2+ stops: the next stop, with a trailing `+N` chip that opens the
 *              planned-route sheet (and a separate `+` to add more).
 *
 * Tapping the body opens the planned-route sheet.
 */
export function NextTripCard({
  stop,
  friends,
  totalStops,
  onTap,
  onAdd,
}: Props) {
  if (!stop) {
    return <EmptyState onAdd={onAdd} />;
  }

  const days = daysUntil(stop.arrivalDate);
  const dateRange = formatDateRange(stop.arrivalDate, stop.departureDate);
  const followOnCount = Math.max(totalStops - 1, 0);

  return (
    <div
      className={clsx(
        'group/card block w-full border-b border-cocoa-08 bg-sand',
        'transition-colors duration-instant ease-out-quart',
      )}
    >
      <div className="flex items-stretch">
        <button
          type="button"
          onClick={onTap}
          className="flex-1 flex-col gap-1 px-md pb-sm pt-md text-start transition-colors duration-instant ease-out-quart hover:bg-sand/80 active:bg-rope/40 focus-visible:outline-none focus-visible:bg-sand/80"
        >
          <span className="meta-caps text-copper">Next trip</span>

          <h2 className="font-serif text-sub font-bold leading-[1] tracking-[-0.022em] text-balance text-cocoa">
            {stop.nameEn}
          </h2>

          <DaysUntilLine days={days} />

          <p className="text-small text-cocoa-55">
            <span className="text-cocoa-70">{dateRange}</span>
            <span aria-hidden className="px-1.5 text-cocoa-30">·</span>
            <span>
              <span className="tnum">{stop.nights}</span> nights
            </span>
            {followOnCount > 0 && (
              <>
                <span aria-hidden className="px-1.5 text-cocoa-30">·</span>
                <span className="font-medium text-cocoa">
                  +<span className="tnum">{followOnCount}</span> more stop
                  {followOnCount > 1 ? 's' : ''}
                </span>
              </>
            )}
          </p>
        </button>

        <button
          type="button"
          onClick={onAdd}
          aria-label="Add a stop"
          className="me-md inline-flex h-10 w-10 shrink-0 items-center justify-center self-center rounded-full bg-copper text-ivory shadow-card transition-[transform,background-color] duration-instant ease-out-quart hover:bg-copper-85 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
        >
          <Plus className="h-5 w-5" strokeWidth={2.2} aria-hidden />
        </button>
      </div>

      {friends.length > 0 && <FriendsRow friends={friends} stop={stop} />}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="block w-full border-b border-cocoa-08 bg-sand text-start transition-colors duration-instant ease-out-quart hover:bg-sand/80 active:bg-rope/40 focus-visible:outline-none focus-visible:bg-sand/80"
    >
      <div className="flex items-center gap-sm px-md py-md">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-copper text-ivory shadow-card">
          <MapPin className="h-5 w-5" strokeWidth={1.8} aria-hidden />
        </span>
        <div className="flex flex-1 flex-col gap-px">
          <span className="meta-caps text-copper">Your trip</span>
          <h2 className="font-serif text-lede italic leading-tight text-cocoa">
            Where will you be? · When?
          </h2>
        </div>
        <span
          aria-hidden
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ivory text-cocoa shadow-card"
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
      <p className="text-small font-medium text-copper">On the trip now</p>
    );
  }
  if (days === 0) {
    return <p className="text-small font-medium text-copper">Leaving today</p>;
  }
  if (days === 1) {
    return <p className="text-small font-medium text-copper">Leaving tomorrow</p>;
  }
  return (
    <p className="text-small text-cocoa-70">
      <span className="tnum text-cocoa">{days}</span> days to go
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
      return `${f.friendName} overlaps with you ${window}`;
    }
    return `${f.friendName} will be in ${stop.nameEn}`;
  }
  return `${friends.length} friends overlap with you`;
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
