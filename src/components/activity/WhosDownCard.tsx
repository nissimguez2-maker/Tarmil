import type { ActivityPost } from '../../data/activityPosts';
import type { FriendOverlap } from '../../data/myTrip';
import type { Reaction } from '../../data/reactions';
import { Avatar } from '../shared/Avatar';
import { ReactionPill } from './ReactionPill';
import { groupReactions } from './reactionUtils';

type Props = {
  post: ActivityPost;
  author?: FriendOverlap;
  reactions: Reaction[];
  onReact: (emoji: string) => void;
  onReply?: () => void;
};

/**
 * "Who's down" open invite card. Avatar + name + body + reactions + a small
 * reply count link. No route thumbnail (this is a question, not a route).
 */
export function WhosDownCard({
  post,
  author,
  reactions,
  onReact,
  onReply,
}: Props) {
  const grouped = groupReactions(reactions);
  const dateLabel =
    typeof post.payload?.dateLabel === 'string'
      ? (post.payload.dateLabel as string)
      : null;

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
          <span className="text-small text-cocoa-55">
            {dateLabel ?? 'Open invite'}
          </span>
        </div>
      </header>
      <p className="text-body text-cocoa">{post.bodyHe}</p>
      <div className="flex flex-wrap items-center justify-between gap-sm">
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
        <button
          type="button"
          onClick={onReply}
          className="text-small text-copper transition-colors duration-instant ease-out-quart hover:text-copper-85"
        >
          {post.replyCount > 0 ? `${post.replyCount} replies · Reply` : 'Reply'}
        </button>
      </div>
    </article>
  );
}
