import { useState } from 'react';
import { Send } from 'lucide-react';
import type { ActivityPost, Poll } from '../../data/activityPosts';
import type { FriendOverlap } from '../../data/myTrip';
import type { Reaction } from '../../data/reactions';
import { Avatar } from '../shared/Avatar';
import { ReactionPill } from './ReactionPill';
import { groupReactions } from './reactionUtils';
import { PollCard } from '../friends/PollCard';

type Props = {
  post: ActivityPost;
  author?: FriendOverlap;
  reactions: Reaction[];
  /** Flat one-level replies for this post — brief §05 caps depth at one. */
  replies?: ActivityPost[];
  authorById: Map<string, FriendOverlap>;
  onReact: (emoji: string) => void;
  onReply?: (body: string) => Promise<void>;
  onPollVote?: (optionIndex: number) => void;
};

/**
 * "Who's down" open invite card. Avatar + name + body + optional location
 * pin + optional attached poll + reactions + one-level replies. No DM jump
 * — brief §06 removes direct messaging entirely.
 */
export function WhosDownCard({
  post,
  author,
  reactions,
  replies = [],
  authorById,
  onReact,
  onReply,
  onPollVote,
}: Props) {
  const grouped = groupReactions(reactions);
  const dateLabel =
    typeof post.payload?.dateLabel === 'string'
      ? (post.payload.dateLabel as string)
      : null;
  const poll = (post.payload?.poll as Poll | undefined) ?? null;
  const selfVotes = poll?.votes?.self ?? [];

  const [replyOpen, setReplyOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitReply = async () => {
    if (!onReply) return;
    const trimmed = draft.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await onReply(trimmed);
      setDraft('');
      setReplyOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="flex flex-col gap-sm rounded-2xl bg-cream shadow-card p-md">
      <header className="flex items-center gap-sm">
        <Avatar
          photoUrl={author?.photoUrl}
          initial={author?.friendInitial ?? '·'}
          name={author?.friendName ?? 'User'}
          size="md"
        />
        <div className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate font-serif text-lede italic text-charcoal">
            {author?.friendName ?? 'User'}
          </span>
          <span className="text-small text-charcoal-55">
            {dateLabel ?? 'Open invite'}
          </span>
        </div>
      </header>

      <p className="text-body text-charcoal">{post.bodyHe}</p>

      {poll && (
        <PollCard
          poll={poll}
          selfVotes={selfVotes}
          onVote={(i) => onPollVote?.(i)}
        />
      )}

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
          onClick={() => setReplyOpen((o) => !o)}
          className="text-small text-amber transition-colors duration-instant ease-out-quart hover:text-amber-85 focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-2"
        >
          {replies.length > 0
            ? `${replies.length} ${replies.length === 1 ? 'reply' : 'replies'} · Reply`
            : 'Reply'}
        </button>
      </div>

      {replies.length > 0 && (
        <ul className="flex flex-col gap-2 border-t border-charcoal-08 pt-sm">
          {replies.map((reply) => {
            const replyAuthor = reply.authorFriendId
              ? authorById.get(reply.authorFriendId)
              : undefined;
            return (
              <li key={reply.id} className="flex items-start gap-2">
                <Avatar
                  photoUrl={replyAuthor?.photoUrl}
                  initial={replyAuthor?.friendInitial ?? '·'}
                  name={replyAuthor?.friendName ?? 'You'}
                  size="sm"
                />
                <div className="flex min-w-0 flex-1 flex-col leading-tight">
                  <span className="font-serif text-body italic text-charcoal">
                    {replyAuthor?.friendName ?? 'You'}
                  </span>
                  <span className="text-small text-charcoal-70">{reply.bodyHe}</span>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {replyOpen && onReply && (
        <div className="flex items-center gap-2 border-t border-charcoal-08 pt-sm">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a reply"
            className="flex-1 rounded-full border border-charcoal-15 bg-cream ps-md pe-md py-2 text-body text-charcoal placeholder:text-charcoal-55 focus:border-amber focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitReply();
            }}
          />
          <button
            type="button"
            onClick={submitReply}
            disabled={submitting || draft.trim().length === 0}
            aria-label="Send reply"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber text-cream transition-colors duration-instant ease-out-quart hover:bg-amber-85 disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            <Send className="h-4 w-4" strokeWidth={2} aria-hidden />
          </button>
        </div>
      )}
    </article>
  );
}
