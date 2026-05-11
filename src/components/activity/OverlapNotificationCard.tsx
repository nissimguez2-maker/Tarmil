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
    <article className="flex flex-col gap-sm rounded-md border border-cocoa-15 bg-sand p-md">
      <header className="flex items-center gap-3">
        <Avatar
          photoUrl={friend?.photoUrl}
          initial={friend?.friendInitial ?? '·'}
          name={friend?.friendName ?? 'חבר'}
          size="md"
          statusDot
        />
        <span className="font-serif text-lede italic text-cocoa">
          {friend?.friendName ?? 'חבר'} ביומן
        </span>
      </header>
      <p className="font-serif text-lede italic text-cocoa">{post.bodyHe}</p>
      <div className="flex justify-start">
        <Button variant="accent" onClick={onOpenChat}>
          פתח שיחה
        </Button>
      </div>
    </article>
  );
}
