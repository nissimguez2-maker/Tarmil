import { Link } from 'react-router-dom';
import type { DM } from '../../data/dms';
import type { FriendOverlap } from '../../data/myTrip';
import { Avatar } from '../shared/Avatar';

type Props = {
  dm: DM;
  friend?: FriendOverlap;
};

/**
 * 1:1 conversation row. Friend's photo + name + last-message preview, plus a
 * small copper unread dot at the trailing edge when the thread has unread
 * messages.
 */
export function DMRow({ dm, friend }: Props) {
  return (
    <Link
      to={`/messages/dms/${dm.id}`}
      className="flex items-center gap-sm rounded-2xl bg-sand shadow-card p-md transition-colors duration-instant ease-out-quart hover:bg-sand/80 active:bg-rope/50"
    >
      <Avatar
        photoUrl={friend?.photoUrl}
        initial={friend?.friendInitial ?? '·'}
        name={friend?.friendName ?? 'Friend'}
        size="md"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-px">
        <span className="truncate font-serif text-lede italic text-cocoa">
          {friend?.friendName ?? 'Friend'}
        </span>
        <span className="line-clamp-1 text-small text-cocoa-70">
          {dm.lastMessagePreviewHe}
        </span>
      </div>
      {dm.unreadCount > 0 && (
        <span
          aria-label={`${dm.unreadCount} new messages`}
          className="tnum inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-copper px-1 text-small font-medium text-ivory"
        >
          {dm.unreadCount}
        </span>
      )}
    </Link>
  );
}
