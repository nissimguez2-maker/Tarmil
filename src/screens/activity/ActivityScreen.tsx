import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Bell, EyeOff, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { ProfileAvatarButton } from '../../components/shared/ProfileAvatarButton';
import { Fab } from '../../components/shared/Fab';
import { Modal } from '../../components/shared/Modal';
import { TripDeclarationCard } from '../../components/activity/TripDeclarationCard';
import { WhosDownCard } from '../../components/activity/WhosDownCard';
import { PingHistoryRow } from '../../components/friends/PingHistoryRow';
import { ActivityComposeModal } from '../../components/friends/ActivityComposeModal';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import { useDemoState } from '../../lib/demoState';
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
    submitPollVote,
  } = useSupabaseData();
  const { offGrid } = useDemoState();

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

      <RightNowBanner
        friends={presentOverlaps}
        offGrid={offGrid}
      />


      <ul className="flex flex-col gap-sm p-md pb-32">
        {topLevel
          .filter((post) => post.kind !== 'overlap_notification')
          .map((post) => {
          const author = post.authorFriendId
            ? authorById.get(post.authorFriendId)
            : undefined;
          const r = reactionsByTarget.get(post.id) ?? [];

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

// ---------- "Right now" banner ----------
//
// v0.8b: demoted from a horizontal strip with per-friend ping cards to a
// compact text banner that links to the Trip map. The map is the single
// source of truth for "who's here right now" — duplicating it in two
// surfaces fragmented the ping flow and stretched the Activity wall.

function RightNowBanner({
  friends,
  offGrid,
}: {
  friends: FriendOverlap[];
  offGrid: boolean;
}) {
  if (offGrid) {
    return (
      <section
        className="border-b border-cocoa-08 bg-cocoa-08/40 px-md py-2"
        aria-label="Off-grid"
      >
        <div className="flex items-center gap-2 text-small text-cocoa-70">
          <EyeOff className="h-3.5 w-3.5 shrink-0 text-cocoa-55" aria-hidden />
          <span>
            Off-grid mode is on — friends can't see you here, and your pings
            are paused.
          </span>
        </div>
      </section>
    );
  }
  if (friends.length === 0) return null;
  const cityLabel = friends[0]?.zoneLabel ?? 'your city';
  return (
    <Link
      to="/trip"
      className="flex items-center gap-2 border-b border-cocoa-08 bg-sand/40 px-md py-2 transition-colors duration-instant ease-out-quart hover:bg-sand/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper"
      aria-label="See friends in your city on the map"
    >
      <span className="meta-caps shrink-0 text-copper">Right now</span>
      <span className="min-w-0 flex-1 truncate text-small text-cocoa-70">
        <span className="tnum font-medium text-cocoa">{friends.length}</span>{' '}
        {friends.length === 1 ? 'friend' : 'friends'} in {cityLabel}
      </span>
      <span className="inline-flex shrink-0 items-center gap-1 text-small text-copper">
        See on map
        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
      </span>
    </Link>
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
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-cocoa transition-[transform,background-color] duration-instant ease-out-quart hover:bg-cocoa-8 active:scale-95 active:bg-cocoa-15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
    >
      <Bell className="h-5 w-5" strokeWidth={1.6} aria-hidden />
      {count > 0 && (
        <span
          aria-hidden
          className="tnum absolute end-1 top-1 inline-flex h-3 min-w-3 items-center justify-center rounded-full bg-copper px-1 text-meta font-bold leading-none text-ivory ring-2 ring-ivory"
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
        <p className="text-small leading-snug text-cocoa-70">
          One ping per direction per co-presence event — no re-ping until
          a new overlap surfaces. The receiver opens the channel they
          already use.
        </p>

        <div className="inline-flex self-start rounded-full bg-cocoa-08 p-1">
          {(['received', 'sent'] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setSegment(id)}
              className={clsx(
                'rounded-full px-md py-1.5 text-small font-medium leading-none',
                'transition-colors duration-instant ease-out-quart',
                segment === id
                  ? 'bg-cocoa text-ivory'
                  : 'text-cocoa-70 hover:text-cocoa',
              )}
            >
              {id === 'received' ? 'Received' : 'Sent'}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <p className="rounded-2xl bg-sand p-md text-small leading-snug text-cocoa-70">
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
