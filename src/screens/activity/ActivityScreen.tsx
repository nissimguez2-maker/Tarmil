import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { ThreadCard } from './ThreadCard';

/**
 * Activity feed. Reverse-chronological list of threads. Three kinds — the
 * card itself adapts: friend-trip threads lead with the friend's avatar +
 * season chip, city / destination threads lead with the location label.
 *
 * Tapping a card opens the detail at /activity/:threadId where the live
 * realtime channel keeps replies flowing in during the demo.
 */
export function ActivityScreen() {
  const { data, loading, error } = useSupabaseData();
  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const threads = data.threads;

  return (
    <Screen>
      <TopBar eyebrow="Tarmil" title="פעילות" />

      {threads.length === 0 ? (
        <div className="flex flex-col gap-md p-md">
          <p className="max-w-body text-body text-cocoa-70">
            עוד אין פעילות בפיד. ברגע שמישהו יכריז על טיול, ייפתח שרשור עיר
            או יעלה דיון על יעד פופולרי — זה יופיע כאן.
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-sm p-md">
          {threads.map((t) => (
            <li key={t.id}>
              <ThreadCard thread={t} />
            </li>
          ))}
        </ul>
      )}
    </Screen>
  );
}
