import { useEffect, useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Send, EyeOff, MapPin } from 'lucide-react';
import clsx from 'clsx';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { Avatar } from '../../components/shared/Avatar';
import { IdentityToggle } from '../../components/forums/IdentityToggle';
import { ReactionPill } from '../../components/activity/ReactionPill';
import { groupReactions } from '../../components/activity/reactionUtils';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import { useDemoState } from '../../lib/demoState';
import {
  parsePurposeFromBody,
  PURPOSE_LABEL,
  PURPOSE_TONE,
} from '../../data/forumPurpose';
import { subjectForCategory } from '../../data/categoryForumLink';

const SELF_NAME = 'Nissim Guez';
const SELF_INITIAL = 'N';

/**
 * Forum thread detail. Original post on top, replies below, sticky
 * composer at the bottom with an identity selector (Post as <Name> /
 * Anonymous) per brief §04 — "identity is the user's choice on each
 * post". Brief §06 forbids DMs and group chats; replies are flat
 * one-level, not nested.
 *
 * Anonymous persistence lands in chunk 4 with a real
 * `forum_thread_replies.anonymous` column. For now the toggle is local
 * UI state and locally-posted anonymous replies are tracked by body so
 * the freshly-refetched row renders as "Anonymous".
 */
export function ForumThreadScreen() {
  const { threadId = '' } = useParams<{ threadId: string }>();
  const { data, loading, error, postForumReply, toggleReaction } =
    useSupabaseData();
  const demo = useDemoState();

  const [identity, setIdentity] = useState<'name' | 'anonymous'>('name');
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  // Bodies the user posted anonymously this session — used to identify
  // the freshly-refetched reply rows and render them as "Anonymous".
  const [anonBodies, setAnonBodies] = useState<Set<string>>(new Set());

  // Off-grid forces anonymity on new posts. Honour it even if the user
  // had picked "name" before flipping the toggle.
  useEffect(() => {
    if (demo.offGrid && identity !== 'anonymous') setIdentity('anonymous');
  }, [demo.offGrid, identity]);

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const thread = data.forumThreads.find((t) => t.id === threadId);
  if (!thread) {
    return (
      <Screen>
        <TopBar back title="Thread not found" />
        <div className="p-md text-cocoa-55">Removed or no longer exists.</div>
      </Screen>
    );
  }

  const replies = data.forumThreadReplies.filter(
    (r) => r.threadId === thread.id,
  );
  const author = thread.authorFriendId
    ? data.friendOverlaps.find((f) => f.id === thread.authorFriendId)
    : null;
  const threadReactions = data.reactions.filter(
    (r) => r.targetType === 'forum_thread' && r.targetId === thread.id,
  );
  const grouped = groupReactions(threadReactions);
  const { purpose, cleaned: threadBody } = parsePurposeFromBody(thread.body);

  const forum = data.forums.find((f) => f.id === thread.forumId);
  const mentionedPlaces = (() => {
    if (!forum?.destinationId) return [];
    const haystack = `${thread.title} ${threadBody}`.toLowerCase();
    const candidates = data.places.filter(
      (p) => p.destinationId === forum.destinationId,
    );
    const direct = candidates.filter((p) =>
      haystack.includes(p.englishName.toLowerCase()),
    );
    if (direct.length > 0) return direct.slice(0, 4);
    if (forum.subject) {
      return candidates
        .filter((p) => subjectForCategory(p.category) === forum.subject)
        .slice(0, 3);
    }
    return [];
  })();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || sending) return;
    setSending(true);
    try {
      await postForumReply(thread!.id, trimmed);
      if (identity === 'anonymous') {
        setAnonBodies((prev) => new Set(prev).add(trimmed));
      }
      setDraft('');
    } finally {
      setSending(false);
    }
  }

  return (
    <Screen className="flex flex-col">
      <TopBar back title={thread.title} />

      <div className="flex flex-1 flex-col gap-md overflow-y-auto p-md">
        <article className="flex flex-col gap-sm rounded-2xl bg-ivory shadow-card p-md">
          <header className="flex items-center gap-sm">
            <Avatar
              photoUrl={author?.photoUrl}
              initial={author?.friendInitial ?? SELF_INITIAL}
              name={author?.friendName ?? SELF_NAME}
              size="md"
            />
            <AuthorName
              friendId={author?.id ?? null}
              name={author?.friendName ?? SELF_NAME}
            />
            {purpose && (
              <span
                className={clsx(
                  'ms-auto shrink-0 rounded-full px-2 py-1 meta-caps',
                  PURPOSE_TONE[purpose],
                )}
              >
                {PURPOSE_LABEL[purpose]}
              </span>
            )}
          </header>
          <p className="text-body text-cocoa">{threadBody}</p>
          <div className="flex flex-wrap items-center gap-2">
            {grouped.map((g) => (
              <ReactionPill
                key={g.emoji}
                emoji={g.emoji}
                count={g.count}
                active={g.selfActive}
                onClick={() =>
                  toggleReaction('forum_thread', thread.id, g.emoji)
                }
              />
            ))}
            {grouped.length === 0 && (
              <ReactionPill
                emoji="🔥"
                count={0}
                onClick={() =>
                  toggleReaction('forum_thread', thread.id, '🔥')
                }
              />
            )}
          </div>
        </article>

        {mentionedPlaces.length > 0 && (
          <section className="flex flex-col gap-sm">
            <span className="meta-caps text-copper">Places mentioned</span>
            <ul className="-mx-md flex gap-sm overflow-x-auto px-md pb-1">
              {mentionedPlaces.map((p) => (
                <li key={p.id} className="shrink-0">
                  <Link
                    to={`/place/${p.id}`}
                    className="flex w-[200px] items-center gap-sm rounded-2xl bg-sand shadow-card p-sm transition-colors duration-instant ease-out-quart hover:bg-sand/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ivory text-cocoa-70">
                      <MapPin className="h-4 w-4" strokeWidth={1.6} aria-hidden />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col leading-tight">
                      <span className="truncate font-serif text-body italic text-cocoa">
                        {p.englishName}
                      </span>
                      <span className="truncate text-small text-cocoa-55">
                        ★ <span className="tnum">{p.rating.toFixed(1)}</span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <ul className="flex flex-col gap-sm">
          {replies.map((r) => {
            const isAnonymous = anonBodies.has(r.body);
            const replyAuthor = !isAnonymous && r.authorFriendId
              ? data.friendOverlaps.find((f) => f.id === r.authorFriendId)
              : null;
            const displayName = isAnonymous
              ? 'Anonymous'
              : (replyAuthor?.friendName ?? SELF_NAME);
            return (
              <li
                key={r.id}
                className="flex items-start gap-sm rounded-2xl bg-sand p-md"
              >
                {isAnonymous ? (
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cocoa-30 text-ivory">
                    <EyeOff
                      className="h-4 w-4"
                      strokeWidth={1.7}
                      aria-hidden
                    />
                  </span>
                ) : (
                  <Avatar
                    photoUrl={replyAuthor?.photoUrl}
                    initial={replyAuthor?.friendInitial ?? SELF_INITIAL}
                    name={displayName}
                    size="sm"
                  />
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-px">
                  {isAnonymous ? (
                    <span className="truncate font-serif text-body italic text-cocoa-55">
                      {displayName}
                    </span>
                  ) : (
                    <AuthorName
                      friendId={replyAuthor?.id ?? null}
                      name={displayName}
                      size="sm"
                    />
                  )}
                  <p className="text-body text-cocoa">{r.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 flex flex-col gap-sm border-t border-cocoa-15 bg-ivory px-md pt-sm"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)' }}
      >
        {demo.offGrid && (
          <span className="text-small italic text-cocoa-55">
            Off-grid mode — your reply will post anonymously.
          </span>
        )}
        <IdentityToggle
          value={identity}
          onChange={(v) => {
            if (demo.offGrid) return;
            setIdentity(v);
          }}
          realName={SELF_NAME}
        />
        <div className="flex items-center gap-sm">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={
              identity === 'anonymous'
                ? 'Reply anonymously…'
                : 'Reply to thread…'
            }
            disabled={sending}
            className={clsx(
              'h-10 min-w-0 flex-1 rounded-full bg-sand ps-md pe-md text-body text-cocoa placeholder:text-cocoa-55',
              'outline-none transition-colors duration-instant ease-out-quart',
              'focus:bg-ivory focus:ring-2 focus:ring-copper-70',
            )}
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!draft.trim() || sending}
            className={clsx(
              'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
              'bg-copper text-ivory shadow-fab',
              'transition-[transform,background-color] duration-instant ease-out-quart',
              'hover:bg-copper-85 active:scale-[0.96] active:bg-copper',
              'disabled:opacity-30 disabled:shadow-none disabled:active:scale-100',
            )}
          >
            <Send className="h-4 w-4" strokeWidth={2} aria-hidden />
          </button>
        </div>
      </form>
    </Screen>
  );
}

function AuthorName({
  friendId,
  name,
  size = 'md',
}: {
  friendId: string | null;
  name: string;
  size?: 'sm' | 'md';
}) {
  const cls = clsx(
    'min-w-0 flex-1 truncate font-serif italic text-cocoa',
    size === 'sm' ? 'text-body' : 'text-lede',
  );
  if (friendId) {
    return (
      <Link
        to={`/profile/friend/${friendId}`}
        className={clsx(
          cls,
          'transition-colors duration-instant ease-out-quart hover:text-copper-85 focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-2',
        )}
      >
        {name}
      </Link>
    );
  }
  return <span className={cls}>{name}</span>;
}
