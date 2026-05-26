import { X, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '../../Button';
import { PingButton } from '../../friends/PingButton';
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
   * Whether the user has already pinged this friend for the current
   * co-presence event. When true, the Ping affordance is disabled.
   */
  pinged: boolean;
  /**
   * Fire a one-shot Ping to this friend. Brief §04 — one per direction
   * per co-presence event; the receiver opens whichever channel they
   * already share.
   */
  onPing: () => void;
};

export function FriendSheet({
  friend,
  relationship,
  onClose,
  onOpenStop,
  pinged,
  onPing,
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
                ? 'bg-amber text-cream'
                : relationship.kind === 'future_overlap'
                  ? 'border-2 border-dashed border-amber bg-cream text-amber'
                  : 'border-2 border-dashed border-charcoal-30 bg-cream text-charcoal-70',
            )}
            aria-hidden
          >
            {friend.friendInitial}
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-px">
            <h3 className="truncate font-serif text-lede leading-tight text-charcoal">
              {friend.friendName}
            </h3>
            <span
              className={clsx(
                'meta-caps',
                relationship.kind === 'traveling'
                  ? 'text-charcoal-55'
                  : 'text-amber',
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
          className="-me-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-charcoal-55 transition-colors duration-instant ease-out-quart hover:bg-charcoal-8 active:bg-charcoal-15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          <X className="h-4 w-4" strokeWidth={1.8} aria-hidden />
        </button>
      </div>

      {dateLine && (
        <p
          className={clsx(
            'text-body',
            relationship.kind === 'traveling' ? 'text-charcoal-70' : 'text-amber',
          )}
        >
          {dateLine}
        </p>
      )}

      <p className="text-body text-charcoal-70">{friend.detail}</p>

      {relationship.kind === 'future_overlap' && onOpenStop && (
        <Button variant="accent" size="sm" fullWidth onClick={onOpenStop}>
          <ArrowRight className="h-4 w-4" strokeWidth={2.2} aria-hidden />
          Open {relationship.stopName} on your trip
        </Button>
      )}

      {(relationship.kind === 'present' ||
        relationship.kind === 'future_overlap') && (
        <div className="flex items-center justify-between gap-sm">
          <span className="text-small leading-snug text-charcoal-55">
            One ping per co-presence event.
          </span>
          <PingButton pinged={pinged} onPing={onPing} />
        </div>
      )}

      <p className="text-small leading-snug text-charcoal-55">
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
