import type { ActivityPost } from '../../data/activityPosts';
import type { FriendOverlap } from '../../data/myTrip';
import type { Reaction } from '../../data/reactions';
import { useState } from 'react';
import { SmilePlus } from 'lucide-react';
import { Avatar } from '../shared/Avatar';
import { cityPhotos } from '../../screens/web/cityPhotos';
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
  const photo = post.destinationId ? cityPhotos(post.destinationId)[0] : undefined;
  const [imgOk, setImgOk] = useState(true);
  return (
    <article className="flex flex-col gap-sm rounded-2xl bg-cream shadow-card p-md">
      <header className="flex items-center gap-sm">
        <Avatar
          photoUrl={author?.photoUrl}
          initial={author?.friendInitial ?? '·'}
          name={author?.friendName ?? 'User'}
          size="md"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-px leading-tight">
          <span className="truncate font-serif text-lede text-charcoal">
            {author?.friendName ?? 'User'}
          </span>
          <span className="meta-caps text-charcoal-55">Trip declaration</span>
        </div>
      </header>

      <p className="text-body text-charcoal-70">{post.bodyHe}</p>

      {photo && imgOk && (
        <div className="relative h-28 w-full overflow-hidden rounded-xl bg-gradient-to-br from-sand to-linen ring-1 ring-charcoal-08">
          <img
            src={photo}
            alt=""
            loading="lazy"
            onError={() => setImgOk(false)}
            className="h-full w-full object-cover"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent"
          />
        </div>
      )}

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
          <button
            type="button"
            onClick={() => onReact('🔥')}
            aria-label="React"
            className="inline-flex h-7 items-center gap-1 rounded-full bg-charcoal-08 ps-2 pe-2.5 text-small text-charcoal-70 transition-colors duration-instant ease-out-quart hover:bg-charcoal-15 hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-1 focus-visible:ring-offset-cream"
          >
            <SmilePlus className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
            React
          </button>
        )}
      </div>
    </article>
  );
}
