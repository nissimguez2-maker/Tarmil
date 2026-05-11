import { Link, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Screen } from '../../../components/Screen';
import { TopBar } from '../../../components/TopBar';
import { LoadingPanel, ErrorPanel } from '../../../components/DataState';
import { Avatar } from '../../../components/shared/Avatar';
import { useSupabaseData } from '../../../lib/SupabaseDataProvider';

/**
 * Single forum view — hero blurb + thread list. Each thread row links to
 * /messages/forums/:forumId/:threadId.
 *
 * Author rendering: if `authorFriendId` matches a friend row, show their
 * photo + first name; if null, show the user's own initial placeholder.
 */
export function ForumScreen() {
  const { forumId = '' } = useParams<{ forumId: string }>();
  const { data, loading, error } = useSupabaseData();

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

  const threads = data.forumThreads.filter((t) => t.forumId === forum.id);

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
                  className="flex items-start gap-sm rounded-md border border-cocoa-15 bg-ivory p-md transition-colors duration-instant ease-out-quart hover:bg-sand/40 active:bg-sand/60"
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
      </div>
    </Screen>
  );
}
