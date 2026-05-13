import type { FriendOverlap } from '../../../data/myTrip';
import type { PlannedStop } from '../../../data/plannedStops';

/**
 * The runtime-derived relationship between a friend and the user's trip.
 * Drives FriendSheet copy + CTAs, map bubble styling, and the Profile
 * friends-grid status label.
 *
 *  - `present`        — the friend is in the user's current city right now
 *  - `future_overlap` — the friend's declared destination matches one of
 *                       the user's planned stops (true overlap)
 *  - `traveling`      — the friend has a future trip but it's somewhere
 *                       the user is NOT going — informational only,
 *                       never framed as an overlap
 *
 * The DB columns `friend_overlaps.overlap_start` / `overlap_end` stay
 * named as they are (internal), but their meaning is "friend's trip
 * window" — they only count as a true overlap when `destinationId`
 * matches a planned stop. Hence this util.
 */
export type FriendRelationship =
  | { kind: 'present'; zoneLabel: string }
  | {
      kind: 'future_overlap';
      stopId: string;
      stopName: string;
      start?: string;
      end?: string;
    }
  | { kind: 'traveling'; city: string; start?: string; end?: string };

export function relateFriend(
  friend: FriendOverlap,
  plannedStops: PlannedStop[],
): FriendRelationship {
  if (friend.status === 'present') {
    return { kind: 'present', zoneLabel: friend.zoneLabel };
  }
  if (friend.destinationId) {
    const stop = plannedStops.find((s) => s.id === friend.destinationId);
    if (stop) {
      return {
        kind: 'future_overlap',
        stopId: stop.id,
        stopName: stop.nameEn,
        start: friend.overlapStart,
        end: friend.overlapEnd,
      };
    }
  }
  return {
    kind: 'traveling',
    city: friend.zoneLabel,
    start: friend.overlapStart,
    end: friend.overlapEnd,
  };
}
