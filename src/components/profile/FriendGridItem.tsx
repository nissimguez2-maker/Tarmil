import { Link } from 'react-router-dom';
import type { FriendOverlap } from '../../data/myTrip';
import type { FriendRelationship } from '../tripMap/utils/relateFriend';
import { Avatar } from '../shared/Avatar';

type Props = {
  friend: FriendOverlap;
  /**
   * Pre-computed relationship from `relateFriend()`. When provided the
   * status line uses the same vocabulary the trip map + friend sheet
   * use (Here / Overlap / Traveling). Falls back to the legacy
   * present/planning label when omitted.
   */
  relationship?: FriendRelationship;
};

/**
 * Profile tab friend grid cell — 56px photo + name + status pill.
 *
 * Status text reuses `friend.detail`'s short phrasing trimmed to ~22 chars,
 * which keeps the grid uniform. Tap drills to /profile/friend/:id.
 */
export function FriendGridItem({ friend, relationship }: Props) {
  const status = statusFor(friend, relationship);

  return (
    <Link
      to={`/friends/friend/${friend.id}`}
      className="flex flex-col items-center gap-xs rounded-xl p-sm transition-colors duration-instant ease-out-quart hover:bg-cocoa-8 active:bg-cocoa-15"
    >
      <Avatar
        photoUrl={friend.photoUrl}
        initial={friend.friendInitial}
        name={friend.friendName}
        size="xl"
        statusDot={friend.status === 'present'}
      />
      <span className="line-clamp-1 max-w-full text-small font-medium text-cocoa">
        {friend.friendName.split(' ')[0]}
      </span>
      <span className="line-clamp-1 max-w-full text-small text-cocoa-55">
        {status}
      </span>
    </Link>
  );
}

function statusFor(
  friend: FriendOverlap,
  relationship?: FriendRelationship,
): string {
  if (!relationship) {
    return friend.status === 'present'
      ? `In ${friend.zoneLabel}`
      : `Planning ${friend.zoneLabel}`;
  }
  switch (relationship.kind) {
    case 'present':
      return `In ${relationship.zoneLabel}`;
    case 'future_overlap':
      return `Overlap · ${relationship.stopName}`;
    case 'traveling':
      return `Traveling · ${relationship.city}`;
  }
}
