import { useParams, Link } from 'react-router-dom';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { Avatar } from '../../components/shared/Avatar';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import { formatDateRange } from '../../components/tripMap/utils/formatDateRange';

/**
 * Trip detail drill-down for the user's own planned stop. Surfaces:
 *  - destination + arrival/departure (full precision OK for own trip)
 *  - friend overlaps with that destination
 *  - forum threads tagged to the destination_id
 *  - tools shortcut hints
 *
 * No hero map yet — the small mock points back at /trip for the full map.
 */
export function TripDetailScreen() {
  const { plannedStopId = '' } = useParams<{ plannedStopId: string }>();
  const { data, loading, error } = useSupabaseData();

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const stop = data.plannedStops.find((s) => s.id === plannedStopId);
  if (!stop) {
    return (
      <Screen>
        <TopBar back title="טיול לא נמצא" />
        <div className="p-md text-cocoa-55">היעד הזה כבר לא במסלול שלך.</div>
      </Screen>
    );
  }

  const friends = (stop.friendOverlapIds ?? [])
    .map((id) => data.friendOverlaps.find((f) => f.id === id))
    .filter((f): f is NonNullable<typeof f> => !!f);
  const threads = data.forumThreads.filter(
    (t) =>
      data.forums.find((forum) => forum.id === t.forumId)?.destinationId ===
      stop.id,
  );
  const forum = data.forums.find((f) => f.destinationId === stop.id);

  return (
    <Screen>
      <TopBar back title={stop.nameHe} eyebrow="טיול הבא" />

      <div className="flex flex-col gap-lg p-md pb-xl">
        <section className="flex flex-col gap-xs rounded-2xl border border-cocoa-15 bg-sand shadow-card p-md">
          <span className="font-serif text-display leading-none text-cocoa">
            {stop.nameHe}
          </span>
          <span className="text-small text-cocoa-70">
            {formatDateRange(stop.arrivalDate, stop.departureDate)} ·{' '}
            <span className="tnum">{stop.nights}</span> לילות
          </span>
          {stop.note && (
            <p className="mt-xs text-body italic text-cocoa-70">{stop.note}</p>
          )}
        </section>

        {friends.length > 0 && (
          <section className="flex flex-col gap-sm">
            <h2 className="font-serif text-lede italic text-cocoa">
              חברים שיהיו שם
            </h2>
            <ul className="flex flex-col gap-sm">
              {friends.map((f) => (
                <li key={f.id}>
                  <Link
                    to={`/profile/friend/${f.id}`}
                    className="flex items-center gap-sm rounded-2xl border border-cocoa-15 bg-ivory shadow-card p-md transition-colors duration-instant ease-out-quart hover:bg-sand/40 active:bg-sand/60"
                  >
                    <Avatar
                      photoUrl={f.photoUrl}
                      initial={f.friendInitial}
                      name={f.friendName}
                      size="md"
                      statusDot={f.status === 'present'}
                    />
                    <span className="flex min-w-0 flex-1 flex-col gap-px">
                      <span className="truncate font-serif text-lede italic text-cocoa">
                        {f.friendName}
                      </span>
                      <span className="text-small text-cocoa-70">
                        {f.detail}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {forum && threads.length > 0 && (
          <section className="flex flex-col gap-sm">
            <h2 className="font-serif text-lede italic text-cocoa">
              {forum.nameHe} · מה מדברים
            </h2>
            <ul className="flex flex-col gap-sm">
              {threads.slice(0, 3).map((t) => (
                <li key={t.id}>
                  <Link
                    to={`/messages/forums/${forum.id}/${t.id}`}
                    className="flex flex-col gap-px rounded-2xl border border-cocoa-15 bg-ivory shadow-card p-md transition-colors duration-instant ease-out-quart hover:bg-sand/40 active:bg-sand/60"
                  >
                    <span className="font-serif text-lede italic text-cocoa">
                      {t.title}
                    </span>
                    <span className="line-clamp-2 text-small text-cocoa-70">
                      {t.body}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="flex flex-col gap-sm">
          <h2 className="font-serif text-lede italic text-cocoa">כלים ליעד</h2>
          <div className="grid grid-cols-3 gap-sm">
            {['ממיר מטבעות', 'eSIM', 'תרגום קולי'].map((tool) => (
              <div
                key={tool}
                className="rounded-2xl border border-cocoa-15 bg-ivory shadow-card p-sm text-center text-small text-cocoa"
              >
                {tool}
              </div>
            ))}
          </div>
        </section>
      </div>
    </Screen>
  );
}
