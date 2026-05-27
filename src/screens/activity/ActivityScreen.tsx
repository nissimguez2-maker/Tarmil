import { useMemo, useState } from 'react';
import { Plus, Bell } from 'lucide-react';
import clsx from 'clsx';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { ProfileAvatarButton } from '../../components/shared/ProfileAvatarButton';
import { Fab } from '../../components/shared/Fab';
import { Avatar } from '../../components/shared/Avatar';
import { Modal } from '../../components/shared/Modal';
import { TripDeclarationCard } from '../../components/activity/TripDeclarationCard';
import { WhosDownCard } from '../../components/activity/WhosDownCard';
import { PingButton } from '../../components/friends/PingButton';
import { PingHistoryRow } from '../../components/friends/PingHistoryRow';
import { ActivityComposeModal } from '../../components/friends/ActivityComposeModal';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import type { ActivityPost } from '../../data/activityPosts';
import type { Reaction } from '../../data/reactions';
import type { FriendOverlap } from '../../data/myTrip';

/**
 * Activity tab. The social feed — brief §11B #1 load-bearing assumption
 * ("Forums + Activity wall + Ping replace Facebook destination groups
 * and WhatsApp threads"). Promoted to a primary tab in v0.6 because it's
 * the compounding mechanism the whole social-layer thesis rests on.
 *
 * Layout:
 *   - Top: "Right now" overlap strip — horizontal scroll of present
 *     overlaps with one-tap Ping each. Daily-open hook.
 *   - Body: chronological wall of trip declarations, who's-down posts,
 *     overlap notifications, and user-composed posts with polls.
 *   - TopBar end: Bell (Ping history sheet) · Wrench (Tools) · Avatar (Profile).
 *   - FAB: compose a new post (text + emoji + optional city pin + poll).
 */
export function ActivityScreen() {
  const {
    data,
    loading,
    error,
    toggleReaction,
    postActivity,
    sendPing,
    submitPollVote,
  } = useSupabaseData();

  const [composeOpen, setComposeOpen] = useState(false);
  const [pingHistoryOpen, setPingHistoryOpen] = useState(false);

  const reactionsByTarget = useMemo(() => {
    const map = new Map<string, Reaction[]>();
    if (!data) return map;
    for (const r of data.reactions) {
      if (r.targetType !== 'activity_post') continue;
      const list = map.get(r.targetId) ?? [];
      list.push(r);
      map.set(r.targetId, list);
    }
    return map;
  }, [data]);

  const authorById = useMemo(() => {
    const map = new Map<string, FriendOverlap>();
    if (!data) return map;
    for (const f of data.friendOverlaps) map.set(f.id, f);
    return map;
  }, [data]);

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const presentOverlaps = data.friendOverlaps.filter(
    (f) => f.status === 'present',
  );
  const hasPinged = (friendId: string) =>
    data.pings.some(
      (p) => p.friendId === friendId && p.direction === 'sent',
    );

  // Top-level posts only — replies threaded via payload.parent_id.
  const topLevel = data.activityPosts.filter(
    (p) => !(p.payload as Record<string, unknown> | undefined)?.parent_id,
  );
  const repliesByParent = new Map<string, ActivityPost[]>();
  for (const p of data.activityPosts) {
    const parentId = (p.payload as Record<string, unknown> | undefined)
      ?.parent_id;
    if (typeof parentId !== 'string') continue;
    const list = repliesByParent.get(parentId) ?? [];
    list.push(p);
    repliesByParent.set(parentId, list);
  }

  const pingCount = data.pings.length;

  return (
    <Screen className="relative">
      <TopBar
        title="Activity"
        end={
          <div className="flex items-center gap-0.5">
            <PingBellButton
              count={pingCount}
              onClick={() => setPingHistoryOpen(true)}
            />
            <ProfileAvatarButton initial="N" name="Nissim Guez" />
          </div>
        }
      />

      {presentOverlaps.length > 0 && (
        <RightNowStrip
          friends={presentOverlaps}
          hasPinged={hasPinged}
          onPing={(friendId) => sendPing(friendId)}
        />
      )}

      <ul className="flex flex-col gap-sm p-md pb-32">
        {topLevel.map((post) => {
          const author = post.authorFriendId
            ? authorById.get(post.authorFriendId)
            : undefined;
          const r = reactionsByTarget.get(post.id) ?? [];

          // v0.8 audit: overlap_notification cards no longer render in
          // the Activity feed. The Right Now strip above + the Trip-map
          // friend pins cover the present-overlap signal; future overlaps
          // surface via the friend's own trip_declaration post. Rows stay
          // in the DB so we can re-enable later if the strip ever leaves.
          if (post.kind === 'overlap_notification') return null;

          if (post.kind === 'whos_down') {
            return (
              <li key={post.id}>
                <WhosDownCard
                  post={post}
                  author={author}
                  reactions={r}
                  replies={repliesByParent.get(post.id) ?? []}
                  authorById={authorById}
                  onReact={(emoji) =>
                    toggleReaction('activity_post', post.id, emoji)
                  }
                  onReply={(body) =>
                    postActivity('whos_down', body, undefined, {
                      parent_id: post.id,
                    })
                  }
                  onPollVote={(i) => submitPollVote(post.id, i)}
                />
              </li>
            );
          }

          return (
            <li key={post.id}>
              <TripDeclarationCard
                post={post}
                author={author}
                reactions={r}
                onReact={(emoji) =>
                  toggleReaction('activity_post', post.id, emoji)
                }
              />
            </li>
          );
        })}
      </ul>

      <Fab
        icon={<Plus className="h-5 w-5" strokeWidth={2} />}
        ariaLabel="New post"
        onClick={() => setComposeOpen(true)}
      />

      <ActivityComposeModal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        stops={data.plannedStops}
        onSubmit={async (body, destinationId, poll) => {
          await postActivity('whos_down', body, destinationId, {}, poll);
          setComposeOpen(false);
        }}
      />

      <PingHistorySheet
        open={pingHistoryOpen}
        onClose={() => setPingHistoryOpen(false)}
        pings={data.pings}
        authorById={authorById}
      />
    </Screen>
  );
}

// ---------- "Right now" overlap strip ----------

function RightNowStrip({
  friends,
  hasPinged,
  onPing,
}: {
  friends: FriendOverlap[];
  hasPinged: (id: string) => boolean;
  onPing: (id: string) => void;
}) {
  return (
    <section
      className="border-b border-charcoal-08 bg-sand/40 px-md py-sm"
      aria-label="Friends in your city right now"
    >
      <div className="flex items-baseline justify-between">
        <span className="meta-caps text-amber">Right now</span>
        <span className="text-small text-charcoal-55">
          <span className="tnum">{friends.length}</span>{' '}
          {friends.length === 1 ? 'friend' : 'friends'} in your city
        </span>
      </div>
      <ul className="mt-2 flex gap-sm overflow-x-auto pb-1 -mx-md px-md">
        {friends.map((friend) => {
          const pinged = hasPinged(friend.id);
          return (
            <li key={friend.id} className="shrink-0">
              <article className="flex w-[232px] flex-col gap-sm rounded-2xl bg-cream shadow-card p-sm">
                <div className="flex items-center gap-sm">
                  <Avatar
                    photoUrl={friend.photoUrl}
                    initial={friend.friendInitial}
                    name={friend.friendName}
                    size="md"
                    statusDot
                  />
                  <div className="flex min-w-0 flex-1 flex-col leading-tight">
                    <span className="truncate font-serif text-body text-charcoal">
                      {friend.friendName}
                    </span>
                    <span className="truncate text-small text-charcoal-55">
                      {friend.zoneLabel}
                    </span>
                  </div>
                </div>
                <PingButton
                  pinged={pinged}
                  onPing={() => onPing(friend.id)}
                  fullWidth
                />
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

// ---------- Ping bell + history sheet ----------

function PingBellButton({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label="Ping history"
      onClick={onClick}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-charcoal transition-[transform,background-color] duration-instant ease-out-quart hover:bg-charcoal-8 active:scale-95 active:bg-charcoal-15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      <Bell className="h-5 w-5" strokeWidth={1.6} aria-hidden />
      {count > 0 && (
        <span
          aria-hidden
          className="tnum absolute end-1 top-1 inline-flex h-3 min-w-3 items-center justify-center rounded-full bg-amber px-1 text-meta font-bold leading-none text-cream ring-2 ring-cream"
        >
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}

function PingHistorySheet({
  open,
  onClose,
  pings,
  authorById,
}: {
  open: boolean;
  onClose: () => void;
  pings: import('../../data/pings').Ping[];
  authorById: Map<string, FriendOverlap>;
}) {
  const [segment, setSegment] = useState<'received' | 'sent'>('received');
  const visible = pings
    .filter((p) => p.direction === segment)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  return (
    <Modal
      open={open}
      onClose={onClose}
      eyebrow="One-shot signals"
      title="Pings"
    >
      <div className="flex flex-col gap-md">
        <p className="text-small leading-snug text-charcoal-70">
          One ping per direction per co-presence event — no re-ping until
          a new overlap surfaces. The receiver opens the channel they
          already use.
        </p>

        <div className="inline-flex self-start rounded-full bg-charcoal-08 p-1">
          {(['received', 'sent'] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setSegment(id)}
              className={clsx(
                'rounded-full px-md py-1.5 text-small font-medium leading-none',
                'transition-colors duration-instant ease-out-quart',
                segment === id
                  ? 'bg-charcoal text-cream'
                  : 'text-charcoal-70 hover:text-charcoal',
              )}
            >
              {id === 'received' ? 'Received' : 'Sent'}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="rounded-2xl bg-sand p-md text-small leading-snug text-charcoal-70">
            {segment === 'sent'
              ? 'No pings sent yet. Tap a friend pin on the map or in the Right-now strip to ping them.'
              : "No pings received yet. When a friend pings you, it'll land here."}
          </p>
        ) : (
          <ul className="flex flex-col gap-sm">
            {visible.map((p) => (
              <li key={p.id}>
                <PingHistoryRow
                  direction={p.direction}
                  friend={authorById.get(p.friendId)}
                  zoneLabel={p.zoneLabel}
                  at={new Date(p.createdAt).getTime()}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Modal>
  );
}
