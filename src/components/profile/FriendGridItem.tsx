import { Link } from 'react-router-dom';
import type { FriendOverlap } from '../../data/myTrip';
import { Avatar } from '../shared/Avatar';

type Props = {
  friend: FriendOverlap;
};

/**
 * Profile tab friend grid cell — 56px photo + name + status pill.
 *
 * Status text reuses `friend.detail`'s short phrasing trimmed to ~22 chars,
 * which keeps the grid uniform. Tap drills to /profile/friend/:id.
 */
export function FriendGridItem({ friend }: Props) {
  const status =
    friend.status === 'present'
      ? `ב${friend.zoneLabel}`
      : `מתכנן ${friend.zoneLabel}`;

  return (
    <Link
      to={`/profile/friend/${friend.id}`}
      className="flex flex-col items-center gap-xs rounded-md p-sm transition-colors duration-instant ease-out-quart hover:bg-cocoa-8 active:bg-cocoa-15"
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
