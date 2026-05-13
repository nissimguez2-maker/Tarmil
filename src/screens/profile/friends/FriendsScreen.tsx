import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { Screen } from '../../../components/Screen';
import { TopBar } from '../../../components/TopBar';
import { SectionLabel } from '../../../components/SectionLabel';
import { formatDateRange } from '../../../components/tripMap/utils/formatDateRange';
import { useSupabaseData } from '../../../lib/SupabaseDataProvider';
import { LoadingPanel, ErrorPanel } from '../../../components/DataState';
import { Avatar } from '../../../components/shared/Avatar';

/**
 * Full friends list, reached from the Profile tab via the "See all" link.
 * Fed by the same `friendOverlaps` table the trip map uses. Present-status
 * friends are tagged "Here with you"; future-status friends show city + exact
 * overlap dates. Each row links to /profile/friend/:id.
 */
export function FriendsScreen() {
  const { data, loading, error } = useSupabaseData();
  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  return (
    <Screen>
      <TopBar back title="Friends" />

      <div className="flex flex-col gap-lg p-md">
        <SectionLabel number="01" label="Where trips touch." />

        <p className="max-w-body text-body text-cocoa-70">
          You only see the moments where your trip touches a friend's. No history,
          no tracking — just overlap.
        </p>

        <ul className="flex flex-col gap-sm">
          {data.friendOverlaps.map((friend) => {
            const isPresent = friend.status === 'present';
            const dates =
              friend.overlapStart && friend.overlapEnd
                ? formatDateRange(friend.overlapStart, friend.overlapEnd)
                : undefined;
            return (
              <li key={friend.id}>
                <Link
                  to={`/profile/friend/${friend.id}`}
                  className={clsx(
                    'flex items-start gap-sm rounded-2xl bg-sand shadow-card p-md',
                    'transition-colors duration-instant ease-out-quart hover:bg-sand/70 active:bg-sand',
                  )}
                >
                  <Avatar
                    photoUrl={friend.photoUrl}
                    initial={friend.friendInitial}
                    name={friend.friendName}
                    size="lg"
                    statusDot={isPresent}
                  />
                  <span className="flex min-w-0 flex-1 flex-col gap-xs">
                    <span className="flex flex-wrap items-baseline gap-2">
                      <span className="font-serif text-lede leading-tight text-cocoa">
                        {friend.friendName}
                      </span>
                      <span className="meta-caps text-copper">
                        {isPresent ? 'Here with you' : 'Future overlap'}
                      </span>
                    </span>
                    <span className="text-small text-cocoa-70">
                      <span className="text-cocoa">{friend.zoneLabel}</span>
                      {dates && <span className="text-cocoa-55"> · {dates}</span>}
                    </span>
                    <span className="text-small text-cocoa-55">
                      {friend.detail}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="text-small leading-snug text-cocoa-55">
          City-level location only. Tarmil never shows friends your exact address —
          overlaps appear at city level only.
        </p>
      </div>
    </Screen>
  );
}
