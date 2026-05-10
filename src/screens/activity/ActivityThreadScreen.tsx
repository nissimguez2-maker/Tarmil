import { useMemo, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import clsx from 'clsx';
import { Heart, Send } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { Button } from '../../components/Button';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import type { Thread, ThreadReply } from '../../data/threads';
import type { Season } from '../../data/places';
import { timeAgoHe } from './timeAgo';

const SEASON_HE: Record<Season, string> = {
  spring: 'אביב',
  summer: 'קיץ',
  autumn: 'סתיו',
  winter: 'חורף',
};

const KIND_LABEL: Record<Thread['kind'], string> = {
  friend_trip: 'טיול חדש',
  city: 'בעיר',
  destination: 'יעד',
};

// The demo user identity. Aligns with the Profile screen ("נסים גז").
const ME = { initial: 'נ', name: 'נסים גז' };

export function ActivityThreadScreen() {
  const { threadId } = useParams<{ threadId: string }>();
  const { data, loading, error, postReply } = useSupabaseData();
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const [following, setFollowing] = useState(false);

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const thread = threadId
    ? data.threads.find((t) => t.id === threadId)
    : undefined;

  if (!thread) {
    return <Navigate to="/activity" replace />;
  }

  return (
    <ThreadView
      thread={thread}
      replies={data.threadReplies}
      draft={draft}
      setDraft={setDraft}
      posting={posting}
      following={following}
      setFollowing={setFollowing}
      onSubmit={async () => {
        if (!draft.trim() || posting) return;
        setPosting(true);
        try {
          await postReply({
            threadId: thread.id,
            body: draft,
            authorInitial: ME.initial,
            authorName: ME.name,
          });
          setDraft('');
        } catch (e) {
          console.error('Failed to post reply:', e);
        } finally {
          setPosting(false);
        }
      }}
    />
  );
}

type ViewProps = {
  thread: Thread;
  replies: ThreadReply[];
  draft: string;
  setDraft: (s: string) => void;
  posting: boolean;
  following: boolean;
  setFollowing: (v: boolean) => void;
  onSubmit: () => void | Promise<void>;
};

function ThreadView({
  thread,
  replies,
  draft,
  setDraft,
  posting,
  following,
  setFollowing,
  onSubmit,
}: ViewProps) {
  const threadReplies = useMemo(
    () =>
      replies
        .filter((r) => r.threadId === thread.id)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [replies, thread.id],
  );

  const seasonChip =
    thread.tripSeason && thread.tripYear
      ? `${SEASON_HE[thread.tripSeason]} ${thread.tripYear}`
      : null;

  return (
    <Screen>
      <TopBar back eyebrow="פעילות" title={thread.title} />

      <div className="flex flex-col gap-lg p-md pb-xl">
        <article className="flex flex-col gap-sm rounded-md border border-rope bg-sand p-md">
          <div className="flex items-center gap-sm">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cocoa font-serif text-lede text-ivory"
              aria-hidden
            >
              {thread.authorInitial}
            </span>
            <div className="flex flex-1 flex-col">
              <span className="text-body text-cocoa">{thread.authorName}</span>
              <span className="text-[10pt] text-cocoa-55">
                {timeAgoHe(thread.createdAt)}
              </span>
            </div>
            <span className="meta-caps text-copper">
              {KIND_LABEL[thread.kind]}
            </span>
          </div>

          <h1 className="font-serif text-sub leading-tight text-cocoa">
            {thread.title}
          </h1>

          <p className="text-body text-cocoa allow-select">{thread.body}</p>

          <div className="flex flex-wrap items-center gap-x-md gap-y-1 text-[10pt] text-cocoa-70">
            {thread.cityLabel && <span>{thread.cityLabel}</span>}
            {seasonChip && (
              <>
                <span className="text-cocoa-30" aria-hidden>·</span>
                <span className="tnum">{seasonChip}</span>
              </>
            )}
          </div>
        </article>

        <Button
          variant={following ? 'primary' : 'ghost'}
          fullWidth
          onClick={() => setFollowing(!following)}
        >
          <Heart
            className={clsx('h-4 w-4', following && 'fill-ivory')}
            aria-hidden
          />
          {following ? 'עוקב אחר השרשור' : 'עקוב אחר השרשור'}
        </Button>

        <section className="flex flex-col gap-sm">
          <h2 className="meta-caps text-copper">
            {threadReplies.length === 0
              ? 'אין תגובות עדיין'
              : `${threadReplies.length} תגובות`}
          </h2>

          {threadReplies.map((r) => (
            <ReplyRow key={r.id} reply={r} />
          ))}
        </section>

        <ReplyComposer
          draft={draft}
          setDraft={setDraft}
          posting={posting}
          onSubmit={onSubmit}
        />
      </div>
    </Screen>
  );
}

function ReplyRow({ reply }: { reply: ThreadReply }) {
  return (
    <article className="flex gap-sm rounded-sm border border-cocoa-15 bg-sand p-sm">
      <span
        className="mt-px inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cocoa font-serif text-body text-ivory"
        aria-hidden
      >
        {reply.authorInitial}
      </span>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between gap-sm">
          <span className="text-[11pt] font-medium text-cocoa">
            {reply.authorName}
          </span>
          <span className="text-[9pt] text-cocoa-55">
            {timeAgoHe(reply.createdAt)}
          </span>
        </div>
        <p className="text-body leading-relaxed text-cocoa-70 allow-select">
          {reply.body}
        </p>
      </div>
    </article>
  );
}

function ReplyComposer({
  draft,
  setDraft,
  posting,
  onSubmit,
}: {
  draft: string;
  setDraft: (s: string) => void;
  posting: boolean;
  onSubmit: () => void | Promise<void>;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onSubmit();
      }}
      className="flex flex-col gap-sm rounded-md border border-cocoa-15 bg-sand p-md"
    >
      <label htmlFor="reply-input" className="meta-caps text-copper">
        כתבו תגובה
      </label>
      <textarea
        id="reply-input"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        rows={3}
        placeholder="מה דעתך?"
        disabled={posting}
        className={clsx(
          'allow-select resize-none rounded-sm border border-cocoa-15 bg-ivory p-sm',
          'text-body text-cocoa placeholder:text-cocoa-55',
          'focus:border-copper focus:outline-none',
          'disabled:opacity-50',
        )}
      />
      <Button
        type="submit"
        variant="accent"
        fullWidth
        disabled={posting || !draft.trim()}
      >
        <Send className="h-4 w-4" aria-hidden />
        {posting ? 'שולח…' : 'שלח תגובה'}
      </Button>
    </form>
  );
}
