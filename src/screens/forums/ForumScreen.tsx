import { Link, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { Avatar } from '../../components/shared/Avatar';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import { SUBJECT_LABEL } from '../../data/forums';

/**
 * Single subject-forum view (one entry in the city × subject grid). The
 * TopBar title is the subject label, eyebrow is the city. Thread list is
 * unfiltered — search lives at the Forums tab level.
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
        <TopBar back title="Forum not found" />
        <div className="p-md text-charcoal-55">This forum isn't active right now.</div>
      </Screen>
    );
  }

  const threads = data.forumThreads.filter((t) => t.forumId === forum.id);
  const title = forum.subject ? SUBJECT_LABEL[forum.subject] : forum.nameEn;

  return (
    <Screen>
      <TopBar back title={title} eyebrow={forum.cityLabel} />

      <div className="flex flex-col gap-md p-md">
        <p className="font-serif text-lede italic text-charcoal-70">
          {forum.heroBlurbHe}
        </p>
        <span className="text-small text-charcoal-55">
          <span className="tnum">{forum.memberCount}</span> members
        </span>

        {threads.length === 0 ? (
          <p className="rounded-2xl bg-sand shadow-card p-md text-small leading-snug text-charcoal-70">
            No threads in this forum yet. Tap any subject pill on the
            Forums tab to find a busier one.
          </p>
        ) : (
          <ul className="flex flex-col gap-sm">
            {threads.map((t) => {
              const author = t.authorFriendId
                ? data.friendOverlaps.find((f) => f.id === t.authorFriendId)
                : null;
              const authorName = author
                ? author.friendName.split(' ')[0]
                : 'You';
              return (
                <li key={t.id}>
                  <Link
                    to={`/forums/${forum.id}/${t.id}`}
                    className="flex items-start gap-sm rounded-2xl bg-sand shadow-card p-md transition-colors duration-instant ease-out-quart hover:bg-sand/80 active:bg-clay/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
                  >
                    <Avatar
                      photoUrl={author?.photoUrl}
                      initial={author?.friendInitial ?? 'Y'}
                      name={author?.friendName ?? 'You'}
                      size="sm"
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-px">
                      <span className="font-serif text-lede text-charcoal">
                        {t.title}
                      </span>
                      <span className="line-clamp-2 text-small text-charcoal-70">
                        {t.body}
                      </span>
                      <span className="text-small text-charcoal-55">
                        {authorName} ·{' '}
                        <span className="tnum">{t.replyCount}</span> replies
                      </span>
                    </div>
                    <ChevronRight
                      className="mt-1 h-5 w-5 shrink-0 text-charcoal-30"
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
