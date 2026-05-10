import { useParams, Navigate } from 'react-router-dom';
import clsx from 'clsx';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';
import { FriendMap } from '../../components/FriendMap';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { formatDateRange } from '../../components/tripMap/utils/formatDateRange';
import type { FriendOverlap, FriendPastTrip } from '../../data/myTrip';
import type { Season } from '../../data/places';

const SEASON_HE: Record<Season, string> = {
  spring: 'אביב',
  summer: 'קיץ',
  autumn: 'סתיו',
  winter: 'חורף',
};

/**
 * Friend profile.
 *
 * Header card with avatar + status + zone + overlap dates (for present/future
 * overlaps the user is the only one privy to). Map below renders past trips
 * as colored polylines. Below the map a list expands the same trips with
 * destination + season+year+duration. Privacy: the data layer never carried
 * full dates for past trips, so the rendering layer can't accidentally leak
 * them.
 */
export function FriendProfileScreen() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useSupabaseData();
  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const friend = id ? data.friendOverlaps.find((f) => f.id === id) : undefined;
  if (!friend) {
    return <Navigate to="/friends" replace />;
  }

  const trips = friend.pastTrips ?? [];

  return (
    <Screen>
      <TopBar back eyebrow="חבר/ת תרמיל" title={friend.friendName} />

      <div className="flex flex-col gap-lg p-md pb-xl">
        <FriendHeader friend={friend} />

        <SectionLabel number="01" label="Past trips." />

        {trips.length > 0 ? (
          <>
            <div className="h-[260px] overflow-hidden rounded-md border border-cocoa-15 bg-ivory">
              <FriendMap trips={trips} />
            </div>
            <PrivacyNote />
            <ul className="flex flex-col gap-sm">
              {trips.map((t) => (
                <PastTripRow key={t.id} trip={t} />
              ))}
            </ul>
          </>
        ) : (
          <p className="text-body text-cocoa-55">
            אין לנו עדיין רישום של טיולים קודמים שלה/שלו.
          </p>
        )}
      </div>
    </Screen>
  );
}

function FriendHeader({ friend }: { friend: FriendOverlap }) {
  const isPresent = friend.status === 'present';
  const badge = isPresent ? 'בחו״ל עכשיו' : 'בתכנון';
  const dates =
    friend.overlapStart && friend.overlapEnd
      ? formatDateRange(friend.overlapStart, friend.overlapEnd)
      : undefined;
  return (
    <article className="flex items-start gap-md rounded-md border border-rope bg-sand p-md">
      <span
        className={clsx(
          'inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full font-serif text-sub',
          isPresent
            ? 'bg-copper text-ivory'
            : 'border-2 border-dashed border-copper bg-ivory text-copper',
        )}
        aria-hidden
      >
        {friend.friendInitial}
      </span>
      <div className="flex flex-1 flex-col gap-1">
        <h1 className="font-serif text-sub leading-tight">{friend.friendName}</h1>
        <span className="meta-caps text-copper">{badge}</span>
        <span className="text-body text-cocoa-70">
          <span className="text-cocoa">{friend.zoneLabel}</span>
          {dates && <span className="text-cocoa-55"> · {dates}</span>}
        </span>
        <p className="text-[10pt] text-cocoa-55">{friend.detail}</p>
      </div>
    </article>
  );
}

function PastTripRow({ trip }: { trip: FriendPastTrip }) {
  return (
    <li className="flex items-center justify-between gap-md rounded-sm border border-cocoa-15 bg-sand px-md py-3">
      <div className="flex flex-col gap-1">
        <span className="font-serif text-lede leading-tight">
          {trip.destinationLabel}
        </span>
        <span className="text-[10pt] text-cocoa-70">
          {SEASON_HE[trip.season]}{' '}
          <span className="tnum">{trip.year}</span> · {trip.durationLabel}
        </span>
      </div>
      <span className="text-[10pt] text-cocoa-55">
        <span className="tnum">{trip.waypoints.length}</span> ערים
      </span>
    </li>
  );
}

function PrivacyNote() {
  return (
    <p className="text-[9pt] leading-snug text-cocoa-55">
      תרמיל מציג טיולי חברים ברמת עונה, שנה ומשך — לעולם לא תאריכים מדויקים,
      לעולם לא מסלולים יומיים.
    </p>
  );
}
