import type { ActivityPost } from '../../data/activityPosts';
import type { FriendOverlap } from '../../data/myTrip';
import type { Reaction } from '../../data/reactions';
import { Avatar } from '../shared/Avatar';
import { RouteThumbnail } from './RouteThumbnail';
import { ReactionPill } from './ReactionPill';
import { groupReactions } from './reactionUtils';

type Props = {
  post: ActivityPost;
  author?: FriendOverlap;
  reactions: Reaction[];
  onReact: (emoji: string) => void;
};

/**
 * Activity feed card for a friend's new trip declaration. Avatar + name +
 * body + route thumbnail + reaction strip. Renders only when the post kind
 * is 'trip_declaration'.
 */
export function TripDeclarationCard({ post, author, reactions, onReact }: Props) {
  const grouped = groupReactions(reactions);
  return (
    <article className="flex flex-col gap-sm rounded-2xl bg-ivory shadow-card p-md">
      <header className="flex items-center gap-sm">
        <Avatar
          photoUrl={author?.photoUrl}
          initial={author?.friendInitial ?? '·'}
          name={author?.friendName ?? 'User'}
          size="md"
        />
        <div className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate font-serif text-lede italic text-cocoa">
            {author?.friendName ?? 'User'}
          </span>
          <span className="text-small text-cocoa-55">Trip declaration</span>
        </div>
      </header>
      <p className="text-body text-cocoa-70">{post.bodyHe}</p>
      <RouteThumbnail cities={4} />
      <div className="flex flex-wrap items-center gap-2">
        {grouped.map((g) => (
          <ReactionPill
            key={g.emoji}
            emoji={g.emoji}
            count={g.count}
            active={g.selfActive}
            onClick={() => onReact(g.emoji)}
          />
        ))}
        {grouped.length === 0 && (
          <ReactionPill emoji="🔥" count={0} onClick={() => onReact('🔥')} />
        )}
      </div>
    </article>
  );
}
