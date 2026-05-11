import { useParams } from 'react-router-dom';
import { Screen } from '../../../components/Screen';
import { TopBar } from '../../../components/TopBar';
import { LoadingPanel, ErrorPanel } from '../../../components/DataState';
import { Avatar } from '../../../components/shared/Avatar';
import { MessageComposer } from '../../../components/messages/MessageComposer';
import { ReactionPill } from '../../../components/activity/ReactionPill';
import { groupReactions } from '../../../components/activity/reactionUtils';
import { useSupabaseData } from '../../../lib/SupabaseDataProvider';

/**
 * Forum thread detail. Original post on top, replies below, sticky composer
 * at the bottom. `postForumReply` writes through Supabase and the realtime
 * subscription on `forum_thread_replies` brings the new row back into state.
 */
export function ForumThreadScreen() {
  const { threadId = '' } = useParams<{ threadId: string }>();
  const { data, loading, error, postForumReply, toggleReaction } =
    useSupabaseData();

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const thread = data.forumThreads.find((t) => t.id === threadId);
  if (!thread) {
    return (
      <Screen>
        <TopBar back title="שרשור לא נמצא" />
        <div className="p-md text-cocoa-55">הוסר או לא קיים יותר.</div>
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

  return (
    <Screen className="flex flex-col">
      <TopBar back title={thread.title} />

      <div className="flex flex-1 flex-col gap-md overflow-y-auto p-md">
        <article className="flex flex-col gap-sm rounded-md border border-cocoa-15 bg-ivory p-md">
          <header className="flex items-center gap-sm">
            <Avatar
              photoUrl={author?.photoUrl}
              initial={author?.friendInitial ?? 'א'}
              name={author?.friendName ?? 'את'}
              size="md"
            />
            <span className="min-w-0 flex-1 truncate font-serif text-lede italic text-cocoa">
              {author?.friendName ?? 'את'}
            </span>
          </header>
          <p className="text-body text-cocoa">{thread.body}</p>
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
                onClick={() => toggleReaction('forum_thread', thread.id, '🔥')}
              />
            )}
          </div>
        </article>

        <ul className="flex flex-col gap-sm">
          {replies.map((r) => {
            const replyAuthor = r.authorFriendId
              ? data.friendOverlaps.find((f) => f.id === r.authorFriendId)
              : null;
            return (
              <li
                key={r.id}
                className="flex items-start gap-sm rounded-md bg-sand p-md"
              >
                <Avatar
                  photoUrl={replyAuthor?.photoUrl}
                  initial={replyAuthor?.friendInitial ?? 'א'}
                  name={replyAuthor?.friendName ?? 'את'}
                  size="sm"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-px">
                  <span className="truncate font-serif text-body italic text-cocoa">
                    {replyAuthor?.friendName ?? 'את'}
                  </span>
                  <p className="text-body text-cocoa">{r.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <MessageComposer
        placeholder="הגב לשרשור..."
        onSend={(body) => postForumReply(thread.id, body)}
      />
    </Screen>
  );
}
