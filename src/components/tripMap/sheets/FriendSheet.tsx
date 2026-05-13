import { X, ArrowRight, MessageCircle } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../../Button';
import type { FriendOverlap } from '../../../data/myTrip';
import { formatDateRange } from '../utils/formatDateRange';
import type { FriendRelationship } from '../utils/relateFriend';

type Props = {
  friend: FriendOverlap;
  /**
   * Pre-computed relationship from `relateFriend()`. Drives every
   * branching decision in this sheet — eyebrow copy, body framing, and
   * which CTAs render. Computed in TripScreen once per render so map +
   * sheet stay in sync.
   */
  relationship: FriendRelationship;
  onClose: () => void;
  /**
   * Opens the matching planned-stop sheet. Only meaningful when the
   * relationship is `future_overlap`. Ignored for present / traveling.
   */
  onOpenStop?: () => void;
  /**
   * Opens a DM thread with the friend. Rendered as primary on
   * `present` / `traveling`, secondary on `future_overlap`. Omit when
   * there's no DM thread for this friend.
   */
  onMessage?: () => void;
};

export function FriendSheet({
  friend,
  relationship,
  onClose,
  onOpenStop,
  onMessage,
}: Props) {
  const eyebrow = eyebrowFor(relationship);
  const dateLine = dateLineFor(relationship);

  return (
    <div className="flex flex-col gap-sm px-md pb-md pt-sm">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex min-w-0 flex-1 items-center gap-sm">
          <span
            className={clsx(
              'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-serif text-lede',
              relationship.kind === 'present'
                ? 'bg-copper text-ivory'
                : relationship.kind === 'future_overlap'
                  ? 'border-2 border-dashed border-copper bg-ivory text-copper'
                  : 'border-2 border-dashed border-cocoa-30 bg-ivory text-cocoa-70',
            )}
            aria-hidden
          >
            {friend.friendInitial}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-px">
            <h3 className="truncate font-serif text-lede leading-tight text-cocoa">
              {friend.friendName}
            </h3>
            <span
              className={clsx(
                'meta-caps',
                relationship.kind === 'traveling'
                  ? 'text-cocoa-55'
                  : 'text-copper',
              )}
            >
              {eyebrow}
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

      {dateLine && (
        <p
          className={clsx(
            'text-body',
            relationship.kind === 'traveling' ? 'text-cocoa-70' : 'text-copper',
          )}
        >
          {dateLine}
        </p>
      )}

      <p className="text-body text-cocoa-70">{friend.detail}</p>

      {relationship.kind === 'future_overlap' && onOpenStop && (
        <Button variant="accent" size="sm" fullWidth onClick={onOpenStop}>
          <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden />
          Open {relationship.stopName} on your trip
        </Button>
      )}

      {onMessage && (
        <Button
          variant={
            relationship.kind === 'future_overlap' ? 'ghost' : 'accent'
          }
          size="sm"
          fullWidth
          onClick={onMessage}
        >
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

function eyebrowFor(r: FriendRelationship): string {
  switch (r.kind) {
    case 'present':
      return `Here with you · ${r.zoneLabel}`;
    case 'future_overlap':
      return `Overlapping with you · ${r.stopName}`;
    case 'traveling':
      return `Traveling · ${r.city}`;
  }
}

function dateLineFor(r: FriendRelationship): string | null {
  if (r.kind === 'present') return null;
  if (!r.start || !r.end) return null;
  if (r.kind === 'future_overlap') {
    return `${r.stopName} · ${formatDateRange(r.start, r.end)}`;
  }
  return `${r.city} · ${formatDateRange(r.start, r.end)}`;
}
