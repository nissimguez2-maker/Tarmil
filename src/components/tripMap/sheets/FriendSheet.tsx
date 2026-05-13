import { X, Plus, ArrowRight, MessageCircle } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../../Button';
import type { FriendOverlap } from '../../../data/myTrip';
import { formatDateRange } from '../utils/formatDateRange';

type Props = {
  friend: FriendOverlap;
  onClose: () => void;
  /**
   * Opens the "join your friend's trip" flow. Shown when the friend has a
   * concrete overlap window AND their destination isn't already on the
   * user's plan. Otherwise the smarter `onOpenStop` / `onMessage` CTAs win.
   */
  onAddToTrip?: () => void;
  /**
   * The friend's destination is already a planned stop. Tapping the CTA
   * opens that stop's sheet instead of "Add to my trip" — no double-add.
   */
  onOpenStop?: () => void;
  /** Opens a DM thread with the friend. Always shown when provided. */
  onMessage?: () => void;
};

export function FriendSheet({
  friend,
  onClose,
  onAddToTrip,
  onOpenStop,
  onMessage,
}: Props) {
  const hasExactOverlap =
    friend.status === 'future' && !!friend.overlapStart && !!friend.overlapEnd;

  // Smart routing — if the destination is already on the plan, suppress the
  // "Add to my trip" CTA and offer the stop sheet instead. Friends in the
  // present (same city as the user) skip both since there's nothing to add.
  const showOpenStop = !!onOpenStop;
  const showAddToTrip = hasExactOverlap && !!onAddToTrip && !showOpenStop;

  return (
    <div className="flex flex-col gap-sm px-md pb-md pt-sm">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex min-w-0 flex-1 items-center gap-sm">
          <span
            className={clsx(
              'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-serif text-lede',
              friend.status === 'present'
                ? 'bg-copper text-ivory'
                : 'border-2 border-dashed border-copper bg-ivory text-copper',
            )}
            aria-hidden
          >
            {friend.friendInitial}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-px">
            <h3 className="truncate font-serif text-lede leading-tight text-cocoa">
              {friend.friendName}
            </h3>
            <span className="meta-caps text-copper">
              {friend.status === 'present' ? 'Here with you' : 'Future overlap'}
              <span className="ms-2 text-cocoa-55">· {friend.zoneLabel}</span>
            </span>
          </div>
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

      {hasExactOverlap && (
        <p className="text-body text-copper">
          {friend.zoneLabel} ·{' '}
          {formatDateRange(friend.overlapStart!, friend.overlapEnd!)}
        </p>
      )}

      <p className="text-body text-cocoa-70">{friend.detail}</p>

      {showOpenStop && (
        <Button variant="accent" size="sm" fullWidth onClick={onOpenStop}>
          <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden />
          Open {friend.zoneLabel} on your trip
        </Button>
      )}

      {showAddToTrip && (
        <Button variant="accent" size="sm" fullWidth onClick={onAddToTrip}>
          <Plus className="h-4 w-4" strokeWidth={2.2} aria-hidden />
          Add {friend.zoneLabel} to my trip
        </Button>
      )}

      {onMessage && (
        <Button variant="ghost" size="sm" fullWidth onClick={onMessage}>
          <MessageCircle className="h-4 w-4" strokeWidth={1.7} aria-hidden />
          Message {friend.friendName.split(' ')[0]}
        </Button>
      )}

      <p className="text-small leading-snug text-cocoa-55">
        City-level location only. Tarmil never shows a friend's exact spot.
      </p>
    </div>
  );
}
