import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { Fab } from '../../components/shared/Fab';
import { TripDeclarationCard } from '../../components/activity/TripDeclarationCard';
import { WhosDownCard } from '../../components/activity/WhosDownCard';
import { OverlapNotificationCard } from '../../components/activity/OverlapNotificationCard';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import type { Reaction } from '../../data/reactions';

/**
 * Activity tab — chronological feed of friends' trip declarations, open
 * invites, and system-generated overlap notifications. Each post fetches its
 * own slice of reactions; the reaction strip is interactive via
 * `toggleReaction`.
 *
 * The FAB at bottom-end opens a new-post composer (stub for now — taps scroll
 * to top so the button is never a dead-end).
 */
export function ActivityScreen() {
  const navigate = useNavigate();
  const { data, loading, error, toggleReaction } = useSupabaseData();

  const reactionsByTarget = useMemo(() => {
    const map = new Map<string, Reaction[]>();
    if (!data) return map;
    for (const r of data.reactions) {
      if (r.targetType !== 'activity_post') continue;
      const list = map.get(r.targetId) ?? [];
      list.push(r);
      map.set(r.targetId, list);
    }
    return map;
  }, [data]);

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  return (
    <Screen className="relative">
      <TopBar eyebrow="Tarmil" title="פעילות" />

      <ul className="flex flex-col gap-sm p-md pb-32">
        {data.activityPosts.map((post) => {
          const author = data.friendOverlaps.find(
            (f) => f.id === post.authorFriendId,
          );
          const r = reactionsByTarget.get(post.id) ?? [];

          if (post.kind === 'overlap_notification') {
            return (
              <li key={post.id}>
                <OverlapNotificationCard
                  post={post}
                  friend={author}
                  onOpenChat={() => {
                    if (!author) return;
                    const dm = data.dms.find((d) => d.friendId === author.id);
                    if (dm) navigate(`/messages/dms/${dm.id}`);
                    else navigate('/messages');
                  }}
                />
              </li>
            );
          }
          if (post.kind === 'whos_down') {
            return (
              <li key={post.id}>
                <WhosDownCard
                  post={post}
                  author={author}
                  reactions={r}
                  onReact={(emoji) =>
                    toggleReaction('activity_post', post.id, emoji)
                  }
                  onReply={() => {
                    if (author) {
                      const dm = data.dms.find((d) => d.friendId === author.id);
                      if (dm) navigate(`/messages/dms/${dm.id}`);
                    }
                  }}
                />
              </li>
            );
          }
          return (
            <li key={post.id}>
              <TripDeclarationCard
                post={post}
                author={author}
                reactions={r}
                onReact={(emoji) =>
                  toggleReaction('activity_post', post.id, emoji)
                }
              />
            </li>
          );
        })}
      </ul>

      <Fab
        ariaLabel="פוסט חדש"
        icon={<Plus className="h-6 w-6" strokeWidth={2} />}
        onClick={() => {
          // Stub: scroll to top to acknowledge tap. A future PR adds a composer sheet.
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </Screen>
  );
}
