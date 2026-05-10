import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronLeft, Users } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';
import { formatDateRange } from '../../components/tripMap/utils/formatDateRange';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import type { FriendOverlap } from '../../data/myTrip';

/**
 * Friends tab v2.
 *
 * Top of the list: a friends-of-friends opt-in toggle (mock — local state).
 * Below: every friend with a status badge, zone label, optional overlap dates,
 * and a chevron showing the row is tappable. Tapping opens the friend profile
 * at /friends/:id where past trips render at season+year+duration resolution
 * on a Leaflet map.
 */
export function FriendsScreen() {
  const { data, loading, error } = useSupabaseData();
  const [fofEnabled, setFofEnabled] = useState(false);
  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  // Friends without a present/future overlap are "home" — none in the seed
  // today, but the badge logic accommodates it.
  const friends = data.friendOverlaps;

  return (
    <Screen>
      <TopBar eyebrow="Tarmil" title="חברים" />

      <div className="flex flex-col gap-lg p-md">
        <FofToggle enabled={fofEnabled} onToggle={setFofEnabled} />

        <SectionLabel number="01" label="Where trips touch." />

        <p className="max-w-body text-body text-cocoa-70">
          תמיד תראה רק את הרגעים שבהם הטיול שלך נוגע בטיול של חבר. לא היסטוריה,
          לא מעקב — רק חפיפה.
        </p>

        <ul className="flex flex-col gap-sm">
          {friends.map((friend) => (
            <FriendRow key={friend.id} friend={friend} />
          ))}
        </ul>

        <p className="text-[9pt] leading-snug text-cocoa-55">
          מיקום ברמת עיר בלבד. תרמיל לעולם לא חושף לחברים את הכתובת המדויקת
          שלך — חפיפות מוצגות ברמת עיר בלבד.
        </p>
      </div>
    </Screen>
  );
}

function FriendRow({ friend }: { friend: FriendOverlap }) {
  const navigate = useNavigate();
  const isPresent = friend.status === 'present';
  const dates =
    friend.overlapStart && friend.overlapEnd
      ? formatDateRange(friend.overlapStart, friend.overlapEnd)
      : undefined;
  const badge = isPresent ? 'בחו״ל עכשיו' : 'בתכנון';

  return (
    <button
      type="button"
      onClick={() => navigate(`/friends/${friend.id}`)}
      className={clsx(
        'flex w-full items-start gap-md rounded-sm border border-cocoa-15 bg-sand p-md text-start',
        'active:bg-cocoa-08',
      )}
    >
      <span
        className={clsx(
          'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-lede',
          isPresent
            ? 'bg-copper text-ivory'
            : 'border-2 border-dashed border-copper bg-ivory text-copper',
        )}
        aria-hidden
      >
        {friend.friendInitial}
      </span>
      <span className="flex flex-1 flex-col gap-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-serif text-lede leading-tight">
            {friend.friendName}
          </span>
          <span className="meta-caps text-copper">{badge}</span>
        </span>
        <span className="text-[10pt] text-cocoa-70">
          <span className="text-cocoa">{friend.zoneLabel}</span>
          {dates && <span className="text-cocoa-55"> · {dates}</span>}
        </span>
        <span className="text-[10pt] text-cocoa-55">{friend.detail}</span>
      </span>
      <ChevronLeft className="mt-1 h-5 w-5 shrink-0 text-cocoa-55" aria-hidden />
    </button>
  );
}

function FofToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: (next: boolean) => void;
}) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-sm rounded-md border border-cocoa-15 p-md',
        enabled ? 'bg-sand' : 'bg-ivory',
      )}
    >
      <div className="flex items-center gap-md">
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-cocoa text-ivory"
          aria-hidden
        >
          <Users className="h-4 w-4" strokeWidth={1.7} aria-hidden />
        </span>
        <div className="flex flex-1 flex-col">
          <span className="font-serif text-lede leading-tight">
            חברים של חברים
          </span>
          <span className="text-[10pt] text-cocoa-55">
            {enabled
              ? 'מציג גם חפיפות עם חברים של חברים'
              : 'הצגה רק של חברים ישירים שלך'}
          </span>
        </div>
        <Switch enabled={enabled} onToggle={onToggle} />
      </div>
      {enabled && (
        <p className="text-[10pt] text-cocoa-70">
          כשהאפשרות דולקת תרמיל מציג חפיפות גם עם חברים של חברים — תמיד ברמת
          עיר בלבד, אף פעם לא ברמת תאריכים מדויקים.
        </p>
      )}
    </div>
  );
}

function Switch({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={(e) => {
        e.stopPropagation();
        onToggle(!enabled);
      }}
      className={clsx(
        'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
        enabled ? 'bg-copper' : 'bg-cocoa-15',
      )}
    >
      <span
        aria-hidden
        className={clsx(
          'inline-block h-5 w-5 rounded-full bg-ivory shadow transition-transform',
          enabled ? 'translate-x-[2px]' : 'translate-x-[22px]',
        )}
      />
    </button>
  );
}
