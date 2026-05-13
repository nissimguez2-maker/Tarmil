import type { ActivityPost } from '../../data/activityPosts';
import type { FriendOverlap } from '../../data/myTrip';
import { Avatar } from '../shared/Avatar';
import { Button } from '../Button';

type Props = {
  post: ActivityPost;
  friend?: FriendOverlap;
  onOpenChat?: () => void;
};

/**
 * Trip-overlap notification card. Distinctive treatment: sand bg + cocoa-15
 * border + Fraunces italic body, with a primary copper CTA. The card stands
 * out from the regular ivory cards in the feed because overlap moments are
 * the most actionable thing the app surfaces.
 */
export function OverlapNotificationCard({ post, friend, onOpenChat }: Props) {
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
        <Button variant="accent" onClick={onOpenChat}>
          Open chat
        </Button>
      </div>
    </article>
  );
}
