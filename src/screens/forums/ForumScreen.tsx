import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';
import clsx from 'clsx';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { Avatar } from '../../components/shared/Avatar';
import { Fab } from '../../components/shared/Fab';
import { SearchBar } from '../../components/shared/SearchBar';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import { SUBJECT_LABEL } from '../../data/forums';
import {
  parsePurposeFromBody,
  PURPOSE_LABEL,
  PURPOSE_TONE,
} from '../../data/forumPurpose';
import { ForumThreadComposeModal } from '../../components/forums/ForumThreadComposeModal';

/**
 * Single subject-forum view (one entry in the city × subject grid).
 *
 * The search bar above the thread list is the primary deterrent against
 * thread spam: users see what already exists before opening a new one.
 * The New-Thread FAB still exists; it's intentionally secondary.
 */
export function ForumScreen() {
  const { forumId = '' } = useParams<{ forumId: string }>();
  const { data, loading, error } = useSupabaseData();
  const [query, setQuery] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);

  const forum = data?.forums.find((f) => f.id === forumId);
  const threads = useMemo(() => {
    if (!data || !forum) return [];
    const all = data.forumThreads.filter((t) => t.forumId === forum.id);
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((t) => {
      const { cleaned } = parsePurposeFromBody(t.body);
      return (
        t.title.toLowerCase().includes(q) ||
        cleaned.toLowerCase().includes(q)
      );
    });
  }, [data, forum, query]);

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  if (!forum) {
    return (
      <Screen>
        <TopBar back title="Forum not found" />
        <div className="p-md text-cocoa-55">This forum isn't active right now.</div>
      </Screen>
    );
  }

  const title = forum.subject ? SUBJECT_LABEL[forum.subject] : forum.nameEn;
  const searching = query.trim().length > 0;

  return (
    <Screen className="relative">
      <TopBar back title={title} eyebrow={forum.cityLabel} />

      <div className="flex flex-col gap-md p-md pb-32">
        <p className="font-serif text-lede italic text-cocoa-70">
          {forum.heroBlurbHe}
        </p>
        <span className="text-small text-cocoa-55">
          <span className="tnum">{forum.memberCount}</span> members ·{' '}
          Look here before posting — most questions already have an answer.
        </span>

        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search this forum — hostel, scam, kite…"
        />

        {threads.length === 0 ? (
          <div className="flex flex-col gap-sm rounded-2xl bg-sand shadow-card p-md">
            <p className="text-small leading-snug text-cocoa-70">
              {searching
                ? `Nothing matches "${query.trim()}". Start a new thread if your question really isn't covered yet.`
                : 'No threads in this forum yet. Start the first one.'}
            </p>
            <button
              type="button"
              onClick={() => setComposeOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-copper px-md py-2 text-body font-medium text-ivory shadow-card transition-[transform,background-color] duration-instant ease-out-quart hover:bg-copper-85 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
            >
              <Plus className="h-4 w-4" strokeWidth={2} aria-hidden />
              New thread
            </button>
          </div>
        ) : (
          <ul className="flex flex-col gap-sm">
            {threads.map((t) => {
              const author = t.authorFriendId
                ? data.friendOverlaps.find((f) => f.id === t.authorFriendId)
                : null;
              const authorName = author
                ? author.friendName.split(' ')[0]
                : 'You';
              const { purpose, cleaned } = parsePurposeFromBody(t.body);
              return (
                <li key={t.id}>
                  <Link
                    to={`/forums/${forum.id}/${t.id}`}
                    className="flex items-start gap-sm rounded-2xl bg-sand shadow-card p-md transition-colors duration-instant ease-out-quart hover:bg-sand/80 active:bg-rope/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
                  >
                    <Avatar
                      photoUrl={author?.photoUrl}
                      initial={author?.friendInitial ?? 'Y'}
                      name={author?.friendName ?? 'You'}
                      size="sm"
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-px">
                      <div className="flex items-baseline gap-2">
                        {purpose && (
                          <span
                            className={clsx(
                              'shrink-0 rounded-full px-2 py-0.5 meta-caps',
                              PURPOSE_TONE[purpose],
                            )}
                          >
                            {PURPOSE_LABEL[purpose]}
                          </span>
                        )}
                        <span className="min-w-0 flex-1 truncate font-serif text-lede italic text-cocoa">
                          {t.title}
                        </span>
                      </div>
                      <span className="line-clamp-2 text-small text-cocoa-70">
                        {cleaned}
                      </span>
                      <span className="text-small text-cocoa-55">
                        {authorName} ·{' '}
                        <span className="tnum">{t.replyCount}</span> replies
                      </span>
                    </div>
                    <ChevronRight
                      className="mt-1 h-5 w-5 shrink-0 text-cocoa-30"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Fab
        icon={<Plus className="h-5 w-5" strokeWidth={2} />}
        ariaLabel="New thread"
        onClick={() => setComposeOpen(true)}
      />

      <ForumThreadComposeModal
        open={composeOpen}
        onClose={() => setComposeOpen(false)}
        forumId={forum.id}
        forumSubject={title}
      />
    </Screen>
  );
}
