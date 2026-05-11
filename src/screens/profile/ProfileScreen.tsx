import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { Avatar } from '../../components/shared/Avatar';
import { StatsPill } from '../../components/profile/StatsPill';
import { FriendGridItem } from '../../components/profile/FriendGridItem';
import { PastTripCard } from '../../components/profile/PastTripCard';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';

/**
 * Profile tab — densified. Replaces the placeholder settings list with the
 * Figma-spec four sections: stats pills, "המסלול שלך" mini-map preview link,
 * past trips, friend grid (3-col with "ראה הכל"). The gear icon in TopBar.end
 * routes to /profile/settings where settings, privacy, and the demo reset
 * button now live.
 */
export function ProfileScreen() {
  const { data, loading, error } = useSupabaseData();

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  // Quick stats derived from existing data — countries via destination_id of
  // planned_stops + past leg seeding, places visited via friends_know-style
  // count, total nights from planned_stops.
  const countriesCount = (() => {
    // 4 LATAM countries in seed: Brazil + Argentina + Uruguay + (planned).
    // Derive distinct destination_id prefixes from planned_stops as a proxy.
    const stops = data.plannedStops.map((s) => s.id);
    return new Set(
      stops.map((id) => {
        if (id === 'buenos-aires' || id === 'punta-del-este') return 'sa';
        return 'br';
      }),
    ).size;
  })();
  const placesCount = data.places.length;
  const totalNights = data.plannedStops.reduce((acc, s) => acc + s.nights, 0);

  const friendsForGrid = data.friendOverlaps.slice(0, 6);

  return (
    <Screen>
      <TopBar
        eyebrow="Tarmil"
        title="פרופיל"
        end={
          <Link
            to="/profile/settings"
            aria-label="הגדרות"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-cocoa hover:bg-cocoa-8 active:bg-cocoa-15"
          >
            <Settings className="h-5 w-5" aria-hidden />
          </Link>
        }
      />

      <div className="flex flex-col gap-lg p-md">
        <header className="flex flex-col items-center gap-sm">
          <Avatar
            photoUrl={null}
            initial="נ"
            name="נסים גז"
            size="hero"
            copperBorder
          />
          <span className="font-serif text-sub leading-tight">נסים גז</span>
          <span className="text-[10pt] text-cocoa-55">מטייל מאז קיץ 2024</span>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            <StatsPill label="ארצות" value={countriesCount + 2} />
            <StatsPill label="מקומות" value={placesCount} />
            <StatsPill label="לילות מתוכננים" value={totalNights} />
          </div>
        </header>

        <section className="flex flex-col gap-sm">
          <SectionLabel number="01" label="Your route." />
          <Link
            to="/trip"
            className="flex items-center justify-between rounded-md border border-cocoa-15 bg-sand p-md hover:bg-sand/70 active:bg-sand"
          >
            <span className="flex flex-col gap-1">
              <span className="font-serif text-lede italic text-cocoa">
                המסלול שלך
              </span>
              <span className="text-[10pt] text-cocoa-70">
                ריו עכשיו · 4 יעדים מתוכננים בלאטם
              </span>
            </span>
            <span className="meta-caps text-copper">פתח מפה</span>
          </Link>
        </section>

        <section className="flex flex-col gap-sm">
          <SectionLabel number="02" label="Past trips." />
          <ul className="flex flex-col gap-sm">
            <li>
              <PastTripCard
                destinationHe="ברזיל — ריו, פטרופוליס"
                metaLine="חורף 2026 · 21 ימים"
                flag="🇧🇷"
              />
            </li>
            <li>
              <PastTripCard
                destinationHe="דרום־מזרח אסיה"
                metaLine="סתיו 2025 · בנגקוק, קראבי, צ׳יאנג מאי"
                flag="🇹🇭"
              />
            </li>
            <li>
              <PastTripCard
                destinationHe="קוט ד׳אזור"
                metaLine="קיץ 2025 · ניס, קאן, מונקו"
                flag="🇫🇷"
              />
            </li>
            <li>
              <PastTripCard
                destinationHe="יוון — הקיקלאדס"
                metaLine="קיץ 2024 · אתונה, סנטוריני, מיקונוס"
                flag="🇬🇷"
              />
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-sm">
          <div className="flex items-baseline justify-between">
            <SectionLabel number="03" label="Friends in network." />
            <Link
              to="/profile/friends"
              className="text-[10pt] text-copper hover:text-copper-85"
            >
              ראה הכל
            </Link>
          </div>
          <ul className="grid grid-cols-3 gap-sm">
            {friendsForGrid.map((f) => (
              <li key={f.id}>
                <FriendGridItem friend={f} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Screen>
  );
}
