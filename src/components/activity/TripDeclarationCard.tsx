import type { ActivityPost } from '../../data/activityPosts';
import type { FriendOverlap } from '../../data/myTrip';
import type { Reaction } from '../../data/reactions';
import { Avatar } from '../shared/Avatar';
import { TripMapPreview } from './TripMapPreview';
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
 * meta-caps eyebrow + body + city-centred mini-map + reaction strip. Card
 * sits on ivory (the quiet baseline) so the more actionable Overlap
 * notification cards (sand + copper eyebrow) read as the higher-priority
 * surface above.
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
        <div className="flex min-w-0 flex-1 flex-col gap-px leading-tight">
          <span className="truncate font-serif text-lede italic text-cocoa">
            {author?.friendName ?? 'User'}
          </span>
          <span className="meta-caps text-cocoa-55">Trip declaration</span>
        </div>
      </header>

      <p className="text-body text-cocoa-70">{post.bodyHe}</p>

      <div className="overflow-hidden rounded-xl ring-1 ring-cocoa-08">
        <TripMapPreview
          destinationId={post.destinationId}
          ariaLabel={
            author
              ? `${author.friendName}'s trip preview map`
              : 'Trip preview map'
          }
        />
      </div>

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
