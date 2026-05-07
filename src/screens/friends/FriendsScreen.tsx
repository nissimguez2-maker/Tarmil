import clsx from 'clsx';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';
import { formatDateRange } from '../../components/tripMap/utils/formatDateRange';
import { useStaticData } from '../../lib/SupabaseStaticData';

/**
 * Friends tab — fed by the same `friend_overlaps` table the trip map uses.
 * Present-status friends are tagged "איתך כאן"; future-status friends show
 * the city + exact overlap dates.
 */
export function FriendsScreen() {
  const { data, loading, error } = useStaticData();

  if (loading) {
    return (
      <Screen>
        <div className="flex h-full items-center justify-center p-md">
          <span className="text-small text-cocoa-55">טוען חברים…</span>
        </div>
      </Screen>
    );
  }
  if (error || !data) {
    return (
      <Screen>
        <div className="flex h-full flex-col items-center justify-center gap-md p-md">
          <p className="font-serif text-lede text-cocoa">לא הצלחנו להתחבר.</p>
          {error?.message && (
            <p className="max-w-body text-small text-cocoa-55">{error.message}</p>
          )}
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar eyebrow="Tarmil" title="חברים" />

      <div className="flex flex-col gap-lg p-md">
        <SectionLabel number="01" label="Where trips touch." />

        <p className="max-w-body text-body text-cocoa-70">
          תמיד תראה רק את הרגעים שבהם הטיול שלך נוגע בטיול של חבר. לא היסטוריה,
          לא מעקב — רק חפיפה.
        </p>

        <ul className="flex flex-col gap-sm">
          {data.friendOverlaps.map((friend) => {
            const isPresent = friend.status === 'present';
            const dates =
              friend.overlapStart && friend.overlapEnd
                ? formatDateRange(friend.overlapStart, friend.overlapEnd)
                : undefined;
            return (
              <li
                key={friend.id}
                className="flex items-start gap-md rounded-sm border border-cocoa-15 bg-sand p-md"
              >
                <span
                  className={clsx(
                    'inline-block h-11 w-11 shrink-0 rounded-full bg-cover bg-center bg-no-repeat',
                    isPresent
                      ? 'border-2 border-solid border-copper'
                      : 'border-2 border-dashed border-copper',
                  )}
                  style={{ backgroundImage: `url('${friend.photoUrl}')` }}
                  role="img"
                  aria-label={friend.friendName}
                />
                <span className="flex flex-1 flex-col gap-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-serif text-lede leading-tight">
                      {friend.friendName}
                    </span>
                    <span className="meta-caps text-cocoa-70">
                      {isPresent ? 'איתך כאן' : 'חופף בעתיד'}
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
              </li>
            );
          })}
        </ul>

        <p className="text-small leading-snug text-cocoa-55">
          מיקום ברמת עיר בלבד. תרמיל לעולם לא חושף לחברים את הכתובת המדויקת
          שלך — חפיפות מוצגות ברמת עיר בלבד.
        </p>
      </div>
    </Screen>
  );
}
