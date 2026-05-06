import { X } from 'lucide-react';
import clsx from 'clsx';
import type { FriendOverlap } from '../../../data/myTrip';
import { formatDateRange } from '../utils/formatDateRange';

type Props = {
  friend: FriendOverlap;
  onClose: () => void;
};

export function FriendSheet({ friend, onClose }: Props) {
  const hasExactOverlap =
    friend.status === 'future' && !!friend.overlapStart && !!friend.overlapEnd;

  return (
    <div className="flex flex-col gap-sm p-md">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex items-center gap-md">
          <span
            className={clsx(
              'inline-flex h-12 w-12 items-center justify-center rounded-full font-serif text-lede',
              friend.status === 'present'
                ? 'bg-copper text-ivory'
                : 'border-2 border-dashed border-copper bg-ivory text-copper',
            )}
            aria-hidden
          >
            {friend.friendInitial}
          </span>
          <div className="flex flex-col">
            <h3 className="font-serif text-lede leading-tight">
              {friend.friendName}
            </h3>
            <span className="meta-caps text-copper">
              {friend.status === 'present' ? 'איתך כאן' : 'חופף בעתיד'}
              <span className="ms-2 text-cocoa-55">
                · {friend.zoneLabel}
              </span>
            </span>
          </div>
        </div>
        <button
          type="button"
          aria-label="סגור"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-cocoa-55 hover:bg-cocoa-8 active:bg-cocoa-15"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {hasExactOverlap && (
        <p className="text-[11pt] text-copper">
          {friend.zoneLabel} ·{' '}
          {formatDateRange(friend.overlapStart!, friend.overlapEnd!)}
        </p>
      )}

      <p className="text-body text-cocoa-70">{friend.detail}</p>

      <p className="text-[9pt] leading-snug text-cocoa-55">
        מיקום ברמת עיר בלבד. תרמיל לעולם לא מציג את המיקום המדויק של חבר.
      </p>
    </div>
  );
}
