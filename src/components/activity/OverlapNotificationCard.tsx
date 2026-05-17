import type { ActivityPost } from '../../data/activityPosts';
import type { FriendOverlap } from '../../data/myTrip';
import { Avatar } from '../shared/Avatar';
import { PingButton } from '../friends/PingButton';

type Props = {
  post: ActivityPost;
  friend?: FriendOverlap;
  pinged: boolean;
  onPing: () => void;
};

/**
 * Trip-overlap notification card. Distinctive treatment: sand bg + cocoa-15
 * border + Fraunces italic body. CTA is a one-tap Ping — the brief makes
 * Ping the only one-to-one signal, so calendar overlaps converge there.
 */
export function OverlapNotificationCard({
  post,
  friend,
  pinged,
  onPing,
}: Props) {
  return (
    <article className="flex flex-col gap-sm rounded-2xl bg-sand shadow-card p-md">
      <header className="flex items-center gap-sm">
        <Avatar
          photoUrl={friend?.photoUrl}
          initial={friend?.friendInitial ?? '·'}
          name={friend?.friendName ?? 'Friend'}
          size="md"
          statusDot
        />
        <div className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate font-serif text-lede italic text-cocoa">
            {friend?.friendName ?? 'Friend'}
          </span>
          <span className="meta-caps text-copper">Calendar overlap</span>
        </div>
      </header>
      <p className="font-serif text-lede italic leading-snug text-cocoa">
        {post.bodyHe}
      </p>
      <div className="flex justify-start">
        <PingButton pinged={pinged} onPing={onPing} />
      </div>
    </article>
  );
}
