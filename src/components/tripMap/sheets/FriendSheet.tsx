import { X } from 'lucide-react';
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
            className={
              friend.status === 'present'
                ? 'inline-block h-12 w-12 shrink-0 rounded-full border-2 border-solid border-copper bg-cover bg-center bg-no-repeat'
                : 'inline-block h-12 w-12 shrink-0 rounded-full border-2 border-dashed border-copper bg-cover bg-center bg-no-repeat'
            }
            style={{ backgroundImage: `url('${friend.photoUrl}')` }}
            role="img"
            aria-label={friend.friendName}
          />
          <div className="flex flex-col">
            <h2 className="font-serif text-lede leading-tight">
              {friend.friendName}
            </h2>
            <span className="meta-caps text-cocoa-70">
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
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-cocoa-55 hover:bg-cocoa-8 active:bg-cocoa-15"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {hasExactOverlap && (
        <p className="text-body font-medium text-cocoa">
          {friend.zoneLabel} ·{' '}
          {formatDateRange(friend.overlapStart!, friend.overlapEnd!)}
        </p>
      )}

      <p className="text-body text-cocoa-70">{friend.detail}</p>

      <p className="text-small leading-snug text-cocoa-55">
        מיקום ברמת עיר בלבד. תרמיל לעולם לא מציג את המיקום המדויק של חבר.
      </p>
    </div>
  );
}
