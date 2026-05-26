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
 * Trip-overlap notification card. Distinctive treatment so it pops above
 * the quieter trip-declaration / who's-down cards: sand fill, a 1px
 * copper border on the start edge as the eye-catching mark, Fraunces
 * italic body for the human-voiced overlap announcement, and a copper
 * Ping CTA — the brief makes Ping the only one-to-one signal, so
 * calendar overlaps converge there.
 */
export function OverlapNotificationCard({
  post,
  friend,
  pinged,
  onPing,
}: Props) {
  const dateLabel =
    typeof post.payload?.dateLabel === 'string'
      ? (post.payload.dateLabel as string)
      : null;
  const overlapDays =
    typeof post.payload?.overlapDays === 'number'
      ? (post.payload.overlapDays as number)
      : null;

  return (
    <article className="flex flex-col gap-sm rounded-2xl bg-sand shadow-card ring-1 ring-amber-70 p-md">
      <header className="flex items-center gap-sm">
        <Avatar
          photoUrl={friend?.photoUrl}
          initial={friend?.friendInitial ?? '·'}
          name={friend?.friendName ?? 'Friend'}
          size="md"
          statusDot
        />
        <div className="flex min-w-0 flex-1 flex-col gap-px leading-tight">
          <span className="truncate font-serif text-lede italic text-charcoal">
            {friend?.friendName ?? 'Friend'}
          </span>
          <span className="meta-caps text-amber">
            {overlapDays
              ? `${overlapDays}-day overlap`
              : 'Calendar overlap'}
          </span>
        </div>
      </header>

      <p className="font-serif text-lede italic leading-snug text-charcoal">
        {post.bodyHe}
      </p>

      {dateLabel && (
        <p className="text-small text-charcoal-70">
          <span className="tnum">{dateLabel}</span>
          {friend?.zoneLabel && (
            <>
              <span aria-hidden className="px-1 text-charcoal-30">·</span>
              <span>{friend.zoneLabel}</span>
            </>
          )}
        </p>
      )}

      <div className="flex items-center justify-between gap-sm pt-xs">
        <span className="text-small leading-snug text-charcoal-55">
          One ping per co-presence event.
        </span>
        <PingButton pinged={pinged} onPing={onPing} />
      </div>
    </article>
  );
}
