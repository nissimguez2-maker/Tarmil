import { X, Plus } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../../Button';
import type { FriendOverlap } from '../../../data/myTrip';
import { formatDateRange } from '../utils/formatDateRange';

type Props = {
  friend: FriendOverlap;
  onClose: () => void;
  /**
   * Opens the "join your friend's trip" flow. When provided AND the friend has
   * a concrete overlap window, render a copper CTA that calls this. Otherwise
   * the sheet stays informational.
   */
  onAddToTrip?: () => void;
};

export function FriendSheet({ friend, onClose, onAddToTrip }: Props) {
  const hasExactOverlap =
    friend.status === 'future' && !!friend.overlapStart && !!friend.overlapEnd;
  const showAddToTripCta = hasExactOverlap && !!onAddToTrip;

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
              {friend.status === 'present' ? 'איתך כאן' : 'חופף בעתיד'}
              <span className="ms-2 text-cocoa-55">· {friend.zoneLabel}</span>
            </span>
          </div>
        </div>
        <button
          type="button"
          aria-label="סגור"
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

      {showAddToTripCta && (
        <Button variant="accent" size="sm" fullWidth onClick={onAddToTrip}>
          <Plus className="h-4 w-4" strokeWidth={2.2} aria-hidden />
          הוסף את {friend.zoneLabel} לנסיעה שלי
        </Button>
      )}

      <p className="text-small leading-snug text-cocoa-55">
        מיקום ברמת עיר בלבד. תרמיל לעולם לא מציג את המיקום המדויק של חבר.
      </p>
    </div>
  );
}
