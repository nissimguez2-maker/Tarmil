import { useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Send, EyeOff } from 'lucide-react';
import clsx from 'clsx';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { Avatar } from '../../components/shared/Avatar';
import { IdentityToggle } from '../../components/forums/IdentityToggle';
import { ReactionPill } from '../../components/activity/ReactionPill';
import { groupReactions } from '../../components/activity/reactionUtils';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';

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

  const [identity, setIdentity] = useState<'name' | 'anonymous'>('name');
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  // Bodies the user posted anonymously this session — used to identify
  // the freshly-refetched reply rows and render them as "Anonymous".
  const [anonBodies, setAnonBodies] = useState<Set<string>>(new Set());

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const thread = data.forumThreads.find((t) => t.id === threadId);
  if (!thread) {
    return (
      <Screen>
        <TopBar back title="Thread not found" />
        <div className="p-md text-charcoal-55">Removed or no longer exists.</div>
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
        <article className="flex flex-col gap-sm rounded-2xl bg-cream shadow-card p-md">
          <header className="flex items-center gap-sm">
            <Avatar
              photoUrl={author?.photoUrl}
              initial={author?.friendInitial ?? SELF_INITIAL}
              name={author?.friendName ?? SELF_NAME}
              size="md"
            />
            <span className="min-w-0 flex-1 truncate font-serif text-lede italic text-charcoal">
              {author?.friendName ?? SELF_NAME}
            </span>
          </header>
          <p className="text-body text-charcoal">{thread.body}</p>
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
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-charcoal-30 text-cream">
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
                  <span
                    className={clsx(
                      'truncate font-serif text-body italic',
                      isAnonymous ? 'text-charcoal-55' : 'text-charcoal',
                    )}
                  >
                    {displayName}
                  </span>
                  <p className="text-body text-charcoal">{r.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 flex flex-col gap-sm border-t border-charcoal-15 bg-cream px-md pt-sm"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 12px)' }}
      >
        <IdentityToggle
          value={identity}
          onChange={setIdentity}
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
              'h-10 min-w-0 flex-1 rounded-full bg-sand ps-md pe-md text-body text-charcoal placeholder:text-charcoal-55',
              'outline-none transition-colors duration-instant ease-out-quart',
              'focus:bg-cream focus:ring-2 focus:ring-amber-70',
            )}
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!draft.trim() || sending}
            className={clsx(
              'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
              'bg-umber text-cream shadow-fab',
              'transition-[transform,background-color] duration-instant ease-out-quart',
              'hover:bg-umber/90 active:scale-[0.96] active:bg-umber',
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
