import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, UserPlus, Users } from 'lucide-react';
import clsx from 'clsx';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { SubNav } from '../../components/shared/SubNav';
import { SearchBar } from '../../components/shared/SearchBar';
import { ToolsButton } from '../../components/shared/ToolsButton';
import { Fab } from '../../components/shared/Fab';
import { Avatar } from '../../components/shared/Avatar';
import { Button } from '../../components/Button';
import { TripDeclarationCard } from '../../components/activity/TripDeclarationCard';
import { WhosDownCard } from '../../components/activity/WhosDownCard';
import { OverlapNotificationCard } from '../../components/activity/OverlapNotificationCard';
import { PingButton } from '../../components/friends/PingButton';
import { PingHistoryRow } from '../../components/friends/PingHistoryRow';
import { ActivityComposeModal } from '../../components/friends/ActivityComposeModal';
import { formatDateRange } from '../../components/tripMap/utils/formatDateRange';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import type { ActivityPost, Poll } from '../../data/activityPosts';
import type { Reaction } from '../../data/reactions';
import type { FriendOverlap } from '../../data/myTrip';

type SubTab = 'overlaps' | 'activity' | 'ping' | 'list';

const TABS: { id: SubTab; label: string }[] = [
  { id: 'overlaps', label: 'Overlaps' },
  { id: 'activity', label: 'Activity' },
  { id: 'ping', label: 'Ping' },
  { id: 'list', label: 'Friends' },
];

type LocalPing = {
  id: string;
  friendId: string;
  direction: 'sent' | 'received';
  zoneLabel: string;
  createdAt: number;
};

/**
 * Friends tab — Overlaps, Activity wall, Ping history, Friends list.
 * Replaces the old Activity tab and the nested /profile/friends list.
 *
 * Ping today is local React state — chunk 4 swaps it for a real
 * `sendPing` provider method backed by a `pings` table. Polls live in
 * `activity_posts.payload.poll`; chunk 4 promotes that to a first-class
 * `poll` column with a `submitPollVote` mutator.
 */
export function FriendsScreen() {
  const { data, loading, error, toggleReaction, postActivity } =
    useSupabaseData();

  const [localPings, setLocalPings] = useState<LocalPing[]>([]);
  const [composeOpen, setComposeOpen] = useState(false);
  const [listQuery, setListQuery] = useState('');
  const [seeFoF, setSeeFoF] = useState(false);
  const [beSeenFoF, setBeSeenFoF] = useState(false);
  const [showDensity, setShowDensity] = useState(true);
  // Local poll-vote state. Maps post-id → option indices the user has
  // voted for. Each vote ALSO optimistically bumps the count in
  // `localPollVotes[postId][optionIdx]`; chunk 4's real mutator will read
  // from the post.payload.poll directly.
  const [localPollVotes, setLocalPollVotes] = useState<
    Record<string, number[]>
  >({});

  const initialTab: SubTab = (() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'overlaps' || hash === 'activity' || hash === 'ping' || hash === 'list') {
      return hash;
    }
    return 'overlaps';
  })();
  const [active, setActive] = useState<SubTab>(initialTab);

  const onChangeTab = (id: SubTab) => {
    setActive(id);
    window.history.replaceState(null, '', `#${id}`);
  };

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

  const sendPing = (friend: FriendOverlap) => {
    setLocalPings((prev) => {
      if (
        prev.some((p) => p.friendId === friend.id && p.direction === 'sent')
      ) {
        return prev;
      }
      return [
        {
          id: `ping-${friend.id}-${Date.now()}`,
          friendId: friend.id,
          direction: 'sent',
          zoneLabel: friend.zoneLabel,
          createdAt: Date.now(),
        },
        ...prev,
      ];
    });
  };

  const hasPinged = (friendId: string) =>
    localPings.some((p) => p.friendId === friendId && p.direction === 'sent');

  const handlePollVote = (postId: string, optionIndex: number) => {
    setLocalPollVotes((prev) => {
      const current = prev[postId] ?? [];
      if (current.includes(optionIndex)) {
        return { ...prev, [postId]: current.filter((i) => i !== optionIndex) };
      }
      return { ...prev, [postId]: [...current, optionIndex] };
    });
  };

  return (
    <Screen className="relative">
      <TopBar title="Friends" end={<ToolsButton />} />

      <SubNav items={TABS} active={active} onChange={onChangeTab} />

      {active === 'overlaps' && (
        <OverlapsPanel
          friends={data.friendOverlaps}
          hasPinged={hasPinged}
          onPing={sendPing}
        />
      )}

      {active === 'activity' && (
        <>
          <ActivityPanel
            posts={data.activityPosts}
            plannedStopIds={data.plannedStops.map((s) => s.id)}
            authorById={authorById}
            reactionsByTarget={reactionsByTarget}
            localPollVotes={localPollVotes}
            onReact={(postId, emoji) =>
              toggleReaction('activity_post', postId, emoji)
            }
            onPing={sendPing}
            hasPinged={hasPinged}
            onPollVote={handlePollVote}
            onReply={async (parentId, body) =>
              postActivity('whos_down', body, undefined, { parent_id: parentId })
            }
          />
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
              const payload: Record<string, unknown> = {};
              if (poll) payload.poll = poll;
              await postActivity('whos_down', body, destinationId, payload);
              setComposeOpen(false);
            }}
          />
        </>
      )}

      {active === 'ping' && (
        <PingPanel
          friends={data.friendOverlaps}
          pings={localPings}
          authorById={authorById}
        />
      )}

      {active === 'list' && (
        <FriendsListPanel
          friends={data.friendOverlaps}
          query={listQuery}
          onQueryChange={setListQuery}
          seeFoF={seeFoF}
          beSeenFoF={beSeenFoF}
          showDensity={showDensity}
          onToggleSeeFoF={() => setSeeFoF((v) => !v)}
          onToggleBeSeenFoF={() => setBeSeenFoF((v) => !v)}
          onToggleDensity={() => setShowDensity((v) => !v)}
        />
      )}
    </Screen>
  );
}

// ---------- Overlaps panel ----------

function OverlapsPanel({
  friends,
  hasPinged,
  onPing,
}: {
  friends: FriendOverlap[];
  hasPinged: (id: string) => boolean;
  onPing: (friend: FriendOverlap) => void;
}) {
  const present = friends.filter((f) => f.status === 'present');
  const future = friends.filter((f) => f.status === 'future');

  return (
    <div className="flex flex-col gap-lg p-md pb-xl">
      <p className="text-small leading-snug text-cocoa-70">
        Only the moments where your trip touches a friend's. One Ping per
        co-presence event — discovery, not chat.
      </p>

      <OverlapSection
        eyebrow="Right now"
        empty="No friends in your city right now."
        friends={present}
        hasPinged={hasPinged}
        onPing={onPing}
      />

      <OverlapSection
        eyebrow="Future"
        empty="No declared future overlaps yet."
        friends={future}
        hasPinged={hasPinged}
        onPing={onPing}
      />
    </div>
  );
}

function OverlapSection({
  eyebrow,
  empty,
  friends,
  hasPinged,
  onPing,
}: {
  eyebrow: string;
  empty: string;
  friends: FriendOverlap[];
  hasPinged: (id: string) => boolean;
  onPing: (friend: FriendOverlap) => void;
}) {
  return (
    <section className="flex flex-col gap-sm">
      <span className="meta-caps text-cocoa-55">{eyebrow}</span>
      {friends.length === 0 ? (
        <p className="rounded-2xl bg-sand p-md text-small text-cocoa-70">
          {empty}
        </p>
      ) : (
        <ul className="flex flex-col gap-sm">
          {friends.map((friend) => {
            const dates =
              friend.overlapStart && friend.overlapEnd
                ? formatDateRange(friend.overlapStart, friend.overlapEnd)
                : undefined;
            return (
              <li key={friend.id}>
                <article className="flex items-center gap-sm rounded-2xl bg-ivory shadow-card p-md">
                  <Link
                    to={`/friends/friend/${friend.id}`}
                    className="flex min-w-0 flex-1 items-center gap-sm"
                  >
                    <Avatar
                      photoUrl={friend.photoUrl}
                      initial={friend.friendInitial}
                      name={friend.friendName}
                      size="lg"
                      statusDot={friend.status === 'present'}
                    />
                    <span className="flex min-w-0 flex-1 flex-col leading-tight">
                      <span className="truncate font-serif text-lede italic text-cocoa">
                        {friend.friendName}
                      </span>
                      <span className="text-small text-cocoa-70">
                        <span className="text-cocoa">{friend.zoneLabel}</span>
                        {dates && (
                          <span className="text-cocoa-55"> · {dates}</span>
                        )}
                      </span>
                    </span>
                  </Link>
                  <PingButton
                    pinged={hasPinged(friend.id)}
                    onPing={() => onPing(friend)}
                  />
                </article>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

// ---------- Activity panel ----------

function ActivityPanel({
  posts,
  plannedStopIds,
  authorById,
  reactionsByTarget,
  localPollVotes,
  onReact,
  onPing,
  hasPinged,
  onPollVote,
  onReply,
}: {
  posts: ActivityPost[];
  plannedStopIds: string[];
  authorById: Map<string, FriendOverlap>;
  reactionsByTarget: Map<string, Reaction[]>;
  localPollVotes: Record<string, number[]>;
  onReact: (postId: string, emoji: string) => void;
  onPing: (friend: FriendOverlap) => void;
  hasPinged: (friendId: string) => boolean;
  onPollVote: (postId: string, optionIndex: number) => void;
  onReply: (parentId: string, body: string) => Promise<void>;
}) {
  // Top-level posts = anything without a parent_id payload.
  const topLevel = posts.filter((p) => !(p.payload as Record<string, unknown> | undefined)?.parent_id);
  const repliesByParent = useMemo(() => {
    const map = new Map<string, ActivityPost[]>();
    for (const p of posts) {
      const parentId = (p.payload as Record<string, unknown> | undefined)
        ?.parent_id;
      if (typeof parentId !== 'string') continue;
      const list = map.get(parentId) ?? [];
      list.push(p);
      map.set(parentId, list);
    }
    return map;
  }, [posts]);

  return (
    <ul className="flex flex-col gap-sm p-md pb-32">
      {topLevel.map((post) => {
        const author = post.authorFriendId
          ? authorById.get(post.authorFriendId)
          : undefined;
        const r = reactionsByTarget.get(post.id) ?? [];

        if (post.kind === 'overlap_notification') {
          // Only render when the friend's declared destination matches a
          // user planned stop — see ActivityScreen legacy logic.
          const isTrueOverlap =
            !!author?.destinationId &&
            plannedStopIds.includes(author.destinationId);
          if (!isTrueOverlap) return null;
          return (
            <li key={post.id}>
              <OverlapNotificationCard
                post={post}
                friend={author}
                pinged={author ? hasPinged(author.id) : false}
                onPing={() => author && onPing(author)}
              />
            </li>
          );
        }

        if (post.kind === 'whos_down') {
          // Merge local optimistic votes into the rendered poll.
          const merged = mergePoll(post, localPollVotes[post.id] ?? []);
          const postWithPoll: ActivityPost = merged
            ? { ...post, payload: { ...post.payload, poll: merged } }
            : post;
          return (
            <li key={post.id}>
              <WhosDownCard
                post={postWithPoll}
                author={author}
                reactions={r}
                replies={repliesByParent.get(post.id) ?? []}
                authorById={authorById}
                onReact={(emoji) => onReact(post.id, emoji)}
                onReply={(body) => onReply(post.id, body)}
                onPollVote={(i) => onPollVote(post.id, i)}
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
              onReact={(emoji) => onReact(post.id, emoji)}
            />
          </li>
        );
      })}
    </ul>
  );
}

function mergePoll(post: ActivityPost, selfVotes: number[]): Poll | null {
  const original = (post.payload as Record<string, unknown> | undefined)?.poll as
    | Poll
    | undefined;
  if (!original) return null;
  const options = original.options.map((option, i) => {
    const baselineSelfHad = original.votes?.self?.includes(i) ?? false;
    const nowSelfHas = selfVotes.includes(i);
    let count = option.voteCount;
    if (!baselineSelfHad && nowSelfHas) count += 1;
    if (baselineSelfHad && !nowSelfHas) count -= 1;
    return { ...option, voteCount: count };
  });
  return {
    ...original,
    options,
    votes: { ...(original.votes ?? {}), self: selfVotes },
  };
}

// ---------- Ping panel ----------

function PingPanel({
  pings,
  authorById,
}: {
  friends: FriendOverlap[];
  pings: LocalPing[];
  authorById: Map<string, FriendOverlap>;
}) {
  const [segment, setSegment] = useState<'received' | 'sent'>('sent');
  const visible = pings
    .filter((p) => p.direction === segment)
    .sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="flex flex-col gap-md p-md pb-xl">
      <p className="text-small leading-snug text-cocoa-70">
        Ping is one-shot. One per direction per co-presence event — no
        re-ping until a new overlap surfaces. The receiver opens the
        channel they already use.
      </p>

      <div className="inline-flex self-start rounded-full bg-cocoa-08 p-1">
        {(['sent', 'received'] as const).map((id) => (
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
            {id === 'sent' ? 'Sent' : 'Received'}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="rounded-2xl bg-sand p-md text-small leading-snug text-cocoa-70">
          {segment === 'sent'
            ? 'No pings sent yet. Open Overlaps and tap Ping next to any friend in your city.'
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
                at={p.createdAt}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ---------- Friends list panel ----------

function FriendsListPanel({
  friends,
  query,
  onQueryChange,
  seeFoF,
  beSeenFoF,
  showDensity,
  onToggleSeeFoF,
  onToggleBeSeenFoF,
  onToggleDensity,
}: {
  friends: FriendOverlap[];
  query: string;
  onQueryChange: (v: string) => void;
  seeFoF: boolean;
  beSeenFoF: boolean;
  showDensity: boolean;
  onToggleSeeFoF: () => void;
  onToggleBeSeenFoF: () => void;
  onToggleDensity: () => void;
}) {
  const lower = query.trim().toLowerCase();
  const filtered = !lower
    ? friends
    : friends.filter((f) =>
        f.friendName.toLowerCase().includes(lower) ||
        f.zoneLabel.toLowerCase().includes(lower),
      );

  return (
    <div className="flex flex-col gap-md p-md pb-xl">
      <SearchBar
        value={query}
        onChange={onQueryChange}
        placeholder="Search friends"
      />

      <section className="flex items-center justify-between gap-sm rounded-2xl bg-sand p-md">
        <div className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="font-serif text-body italic text-cocoa">
            2 friend requests
          </span>
          <span className="text-small text-cocoa-55">
            Tamar Yaron, Itai Cohen
          </span>
        </div>
        <Button variant="ghost" size="sm">
          <UserPlus className="h-4 w-4" aria-hidden />
          Review
        </Button>
      </section>

      <Button variant="ghost" fullWidth>
        <Users className="h-4 w-4" aria-hidden />
        Re-sync from contacts
      </Button>

      <section className="flex flex-col gap-1 rounded-2xl border border-cocoa-15 bg-ivory">
        <ToggleRow
          label="See friends-of-friends posts"
          description="Friend-of-friend Activity posts appear only when you both opt in."
          checked={seeFoF}
          onChange={onToggleSeeFoF}
        />
        <ToggleRow
          label="Let friends-of-friends see mine"
          description="Lets your posts surface to friends-of-friends who've also opted in."
          checked={beSeenFoF}
          onChange={onToggleBeSeenFoF}
        />
        <ToggleRow
          label="Show friend density on the map"
          description="Direct friends appear as pins on the Trip map."
          checked={showDensity}
          onChange={onToggleDensity}
        />
      </section>

      <ul className="flex flex-col gap-sm">
        {filtered.map((friend) => {
          const isPresent = friend.status === 'present';
          const dates =
            friend.overlapStart && friend.overlapEnd
              ? formatDateRange(friend.overlapStart, friend.overlapEnd)
              : undefined;
          return (
            <li key={friend.id}>
              <Link
                to={`/friends/friend/${friend.id}`}
                className={clsx(
                  'flex items-start gap-sm rounded-2xl bg-sand shadow-card p-md',
                  'transition-colors duration-instant ease-out-quart hover:bg-sand/70 active:bg-sand',
                )}
              >
                <Avatar
                  photoUrl={friend.photoUrl}
                  initial={friend.friendInitial}
                  name={friend.friendName}
                  size="lg"
                  statusDot={isPresent}
                />
                <span className="flex min-w-0 flex-1 flex-col gap-xs">
                  <span className="flex flex-wrap items-baseline gap-2">
                    <span className="font-serif text-lede leading-tight text-cocoa">
                      {friend.friendName}
                    </span>
                    <span className="meta-caps text-copper">
                      {isPresent ? 'Here with you' : 'Future overlap'}
                    </span>
                  </span>
                  <span className="text-small text-cocoa-70">
                    <span className="text-cocoa">{friend.zoneLabel}</span>
                    {dates && <span className="text-cocoa-55"> · {dates}</span>}
                  </span>
                  <span className="text-small text-cocoa-55">
                    {friend.detail}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="text-small leading-snug text-cocoa-55">
        City-level location only. Tarmil never shows friends your exact
        address — overlaps appear at city level only.
      </p>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-sm border-b border-cocoa-08 px-md py-3 last:border-b-0">
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        <span className="text-body text-cocoa">{label}</span>
        <span className="text-small text-cocoa-55">{description}</span>
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={clsx(
          'relative mt-1 inline-flex h-6 w-11 shrink-0 items-center rounded-full',
          'transition-colors duration-instant ease-out-quart',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
          checked ? 'bg-copper' : 'bg-cocoa-15',
        )}
      >
        <span
          aria-hidden
          className={clsx(
            'inline-block h-5 w-5 transform rounded-full bg-ivory shadow-card transition-transform duration-instant ease-out-quart',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
    </label>
  );
}
