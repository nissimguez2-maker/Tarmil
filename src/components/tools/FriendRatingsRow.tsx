import clsx from 'clsx';
import type { FriendOverlap } from '../../data/myTrip';
import type { PlaceReview } from '../../data/placeReviews';
import { Avatar } from '../shared/Avatar';
import { StarRow } from './StarRow';

type Props = {
  /** Friend reviews for one place. Demo-user reviews (`reviewerFriendId = null`) are filtered out. */
  reviews: PlaceReview[];
  /** Lookup for reviewer avatars. */
  friends: FriendOverlap[];
  /** Truncate at this many avatars. Excess shows as `+N`. */
  maxAvatars?: number;
  className?: string;
};

/**
 * Compact friend-rating summary used on Around-me business cards.
 * Renders a stacked avatar row, the average star rating, and a `(n)`
 * count. No-op when there are zero friend ratings.
 */
export function FriendRatingsRow({
  reviews,
  friends,
  maxAvatars = 3,
  className,
}: Props) {
  const friendReviews = reviews.filter((r) => r.reviewerFriendId !== null);
  if (friendReviews.length === 0) return null;

  const avg =
    friendReviews.reduce((acc, r) => acc + r.rating, 0) / friendReviews.length;
  const visible = friendReviews.slice(0, maxAvatars);
  const overflow = friendReviews.length - visible.length;

  return (
    <div className={clsx('flex items-center gap-sm', className)}>
      <div className="flex">
        {visible.map((r, i) => {
          const friend = friends.find((f) => f.id === r.reviewerFriendId);
          return (
            <span
              key={`${r.placeId}-${r.reviewerFriendId}-${i}`}
              className="-me-2 inline-flex items-center justify-center rounded-full border-2 border-sand"
              style={{ zIndex: visible.length - i }}
            >
              <Avatar
                photoUrl={friend?.photoUrl}
                initial={friend?.friendInitial ?? '·'}
                name={friend?.friendName ?? 'Friend'}
                size="sm"
              />
            </span>
          );
        })}
        {overflow > 0 && (
          <span className="-me-2 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-sand bg-charcoal-15 text-meta font-medium tnum text-charcoal-70">
            +{overflow}
          </span>
        )}
      </div>
      <span className="ms-2 inline-flex items-center gap-1">
        <StarRow rating={avg} size={12} />
        <span className="text-small tnum text-charcoal-70">
          {avg.toFixed(1)} ·{' '}
          <span className="text-charcoal-55">
            {friendReviews.length} friend{friendReviews.length > 1 ? 's' : ''}
          </span>
        </span>
      </span>
    </div>
  );
}
