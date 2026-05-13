import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import clsx from 'clsx';
import { Screen } from '../../../components/Screen';
import { TopBar } from '../../../components/TopBar';
import { LoadingPanel, ErrorPanel } from '../../../components/DataState';
import { Avatar } from '../../../components/shared/Avatar';
import { useSupabaseData } from '../../../lib/SupabaseDataProvider';
import type { ForumSubject } from '../../../data/forumThreads';

type SubjectFilter = ForumSubject | 'all';

const SUBJECT_CHIPS: Array<{ id: SubjectFilter; label: string }> = [
  { id: 'all', label: 'הכל' },
  { id: 'kosher_chabad', label: 'כשרות וחב״ד' },
  { id: 'parties', label: 'מסיבות' },
  { id: 'treks_activities', label: 'טרקים ופעילויות' },
  { id: 'restaurants', label: 'מסעדות' },
  { id: 'meetups', label: 'מיטאפים' },
];

/**
 * Single forum view — hero blurb + thread list. Each thread links into the
 * thread detail. The chip strip up top lets the user filter by one of five
 * standard subject buckets that every city forum carries.
 */
export function ForumScreen() {
  const { forumId = '' } = useParams<{ forumId: string }>();
  const { data, loading, error } = useSupabaseData();
  const [filter, setFilter] = useState<SubjectFilter>('all');

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const forum = data.forums.find((f) => f.id === forumId);
  if (!forum) {
    return (
      <Screen>
        <TopBar back title="פורום לא נמצא" />
        <div className="p-md text-cocoa-55">הפורום הזה לא קיים בעונה.</div>
      </Screen>
    );
  }

  const allThreads = data.forumThreads.filter((t) => t.forumId === forum.id);
  const threads =
    filter === 'all'
      ? allThreads
      : allThreads.filter((t) => t.subject === filter);

  return (
    <Screen>
      <TopBar back title={forum.nameHe} eyebrow={forum.cityLabel} />

      <div className="flex flex-col gap-md p-md">
        <p className="font-serif text-lede italic text-cocoa-70">
          {forum.heroBlurbHe}
        </p>
        <span className="text-small text-cocoa-55">
          <span className="tnum">{forum.memberCount}</span> חברים
        </span>

        <div
          className="-mx-md overflow-x-auto px-md [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="tablist"
          aria-label="סנן לפי נושא"
        >
          <ul className="flex w-max items-center gap-2">
            {SUBJECT_CHIPS.map((chip) => {
              const active = chip.id === filter;
              return (
                <li key={chip.id}>
                  <button
                    type="button"
                    role="tab"
                    onClick={() => setFilter(chip.id)}
                    aria-pressed={active}
                    aria-selected={active}
                    className={clsx(
                      'inline-flex h-8 items-center rounded-full px-md text-small font-medium leading-none',
                      'transition-[transform,background-color,border-color,color] duration-instant ease-out-quart',
                      'active:scale-[0.96]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
                      active
                        ? 'bg-cocoa text-ivory shadow-card'
                        : 'border border-cocoa-15 bg-ivory text-cocoa-70 hover:border-cocoa-30 hover:text-cocoa',
                    )}
                  >
                    {chip.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {threads.length === 0 ? (
          <p className="rounded-2xl bg-sand shadow-card p-md text-small leading-snug text-cocoa-70">
            עדיין אין שרשורים בקטגוריה הזו. תתחיל את הראשון מ"פוסט חדש" בפעילות.
          </p>
        ) : (
          <ul className="flex flex-col gap-sm">
            {threads.map((t) => {
              const author = t.authorFriendId
                ? data.friendOverlaps.find((f) => f.id === t.authorFriendId)
                : null;
              const authorName = author ? author.friendName.split(' ')[0] : 'את';
              return (
                <li key={t.id}>
                  <Link
                    to={`/messages/forums/${forum.id}/${t.id}`}
                    className="flex items-start gap-sm rounded-2xl bg-ivory shadow-card p-md transition-colors duration-instant ease-out-quart hover:bg-sand/40 active:bg-sand/60"
                  >
                    <Avatar
                      photoUrl={author?.photoUrl}
                      initial={author?.friendInitial ?? 'א'}
                      name={author?.friendName ?? 'את'}
                      size="sm"
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-px">
                      <span className="font-serif text-lede italic text-cocoa">
                        {t.title}
                      </span>
                      <span className="line-clamp-2 text-small text-cocoa-70">
                        {t.body}
                      </span>
                      <span className="text-small text-cocoa-55">
                        {authorName} ·{' '}
                        <span className="tnum">{t.replyCount}</span> תגובות
                      </span>
                    </div>
                    <ChevronLeft
                      className="mt-1 h-5 w-5 shrink-0 text-cocoa-55"
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
    </Screen>
  );
}
