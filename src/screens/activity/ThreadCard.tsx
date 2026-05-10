import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { MessageCircle } from 'lucide-react';
import type { Thread } from '../../data/threads';
import type { Season } from '../../data/places';
import { timeAgoHe } from './timeAgo';

const SEASON_HE: Record<Season, string> = {
  spring: 'אביב',
  summer: 'קיץ',
  autumn: 'סתיו',
  winter: 'חורף',
};

const KIND_EYEBROW: Record<Thread['kind'], string> = {
  friend_trip: 'טיול חדש',
  city: 'בעיר',
  destination: 'יעד פופולרי',
};

type Props = {
  thread: Thread;
};

/**
 * One feed card. Tapping navigates to /activity/:threadId. Card variants are
 * subtly differentiated by which row sits at the top — friend-trip cards lead
 * with the friend's avatar + season chip; city/destination cards lead with the
 * location label.
 */
export function ThreadCard({ thread }: Props) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/activity/${thread.id}`)}
      className={clsx(
        'flex w-full flex-col gap-2 rounded-md border border-cocoa-15 bg-sand p-md text-start',
        'active:bg-cocoa-08',
      )}
    >
      <Header thread={thread} />

      <h3 className="font-serif text-lede leading-tight text-cocoa">
        {thread.title}
      </h3>

      <p className="line-clamp-2 text-body text-cocoa-70">{thread.body}</p>

      <Footer thread={thread} />
    </button>
  );
}

function Header({ thread }: { thread: Thread }) {
  if (thread.kind === 'friend_trip') {
    const seasonChip =
      thread.tripSeason && thread.tripYear
        ? `${SEASON_HE[thread.tripSeason]} ${thread.tripYear}`
        : null;
    return (
      <div className="flex items-center gap-sm">
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cocoa font-serif text-body text-ivory"
          aria-hidden
        >
          {thread.authorInitial}
        </span>
        <div className="flex flex-1 flex-col">
          <span className="meta-caps text-copper">
            {KIND_EYEBROW[thread.kind]} · {thread.cityLabel ?? '—'}
          </span>
          <span className="text-[10pt] text-cocoa-70">
            {thread.authorName}
            {seasonChip && (
              <>
                <span className="px-1.5 text-cocoa-30" aria-hidden>·</span>
                <span className="tnum">{seasonChip}</span>
              </>
            )}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-sm">
      <span className="meta-caps text-copper">
        {KIND_EYEBROW[thread.kind]}
        {thread.cityLabel && (
          <>
            <span className="px-1.5 text-cocoa-30" aria-hidden>·</span>
            <span className="text-cocoa-70">{thread.cityLabel}</span>
          </>
        )}
      </span>
      <span className="text-[9pt] text-cocoa-55">
        {timeAgoHe(thread.createdAt)}
      </span>
    </div>
  );
}

function Footer({ thread }: { thread: Thread }) {
  const replies = thread.replyCount;
  if (thread.kind === 'friend_trip') {
    return (
      <div className="flex items-center justify-between text-[10pt] text-cocoa-55">
        <span>{timeAgoHe(thread.createdAt)}</span>
        <ReplyCount count={replies} />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-between text-[10pt] text-cocoa-55">
      <span>
        מאת{' '}
        <span className="text-cocoa">
          {thread.authorInitial} · {thread.authorName}
        </span>
      </span>
      <ReplyCount count={replies} />
    </div>
  );
}

function ReplyCount({ count }: { count: number }) {
  if (count === 0) {
    return <span className="text-cocoa-55">אין תגובות עדיין</span>;
  }
  return (
    <span className="inline-flex items-center gap-1 text-cocoa-70">
      <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.7} aria-hidden />
      <span className="tnum">{count}</span>
    </span>
  );
}
