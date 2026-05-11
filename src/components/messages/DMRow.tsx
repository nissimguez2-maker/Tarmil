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
      className="flex items-center gap-3 rounded-md border border-cocoa-15 bg-ivory p-md hover:bg-sand/40 active:bg-sand/60"
    >
      <Avatar
        photoUrl={friend?.photoUrl}
        initial={friend?.friendInitial ?? '·'}
        name={friend?.friendName ?? 'חבר'}
        size="md"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-serif text-lede italic text-cocoa">
          {friend?.friendName ?? 'חבר'}
        </span>
        <span className="line-clamp-1 text-[10pt] text-cocoa-70">
          {dm.lastMessagePreviewHe}
        </span>
      </div>
      {dm.unreadCount > 0 && (
        <span
          aria-label={`${dm.unreadCount} הודעות חדשות`}
          className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-copper px-1 text-[9pt] font-medium text-ivory"
        >
          {dm.unreadCount}
        </span>
      )}
    </Link>
  );
}
