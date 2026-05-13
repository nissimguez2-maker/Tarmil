import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { ToolsButton } from '../../components/shared/ToolsButton';
import { SectionLabel } from '../../components/SectionLabel';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { Avatar } from '../../components/shared/Avatar';
import { StatsPill } from '../../components/profile/StatsPill';
import { FriendGridItem } from '../../components/profile/FriendGridItem';
import { PastTripCard } from '../../components/profile/PastTripCard';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';

/**
 * Profile tab. Three editorial sections — route, past trips, friends in
 * network. Tools moved to their own top-level /tools tab so this screen
 * stays focused on identity + history. Settings remains in the top-bar gear.
 */
export function ProfileScreen() {
  const { data, loading, error } = useSupabaseData();

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  // Quick stats derived from existing data — countries via destination_id of
  // planned_stops + past leg seeding, places visited via friends_know-style
  // count, total nights from planned_stops.
  const countriesCount = (() => {
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
        title="Profile"
        end={
          <div className="flex items-center gap-1">
            <ToolsButton />
            <Link
              to="/profile/settings"
              aria-label="Settings"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-cocoa transition-colors duration-instant ease-out-quart hover:bg-cocoa-8 active:bg-cocoa-15"
            >
              <Settings className="h-5 w-5" aria-hidden />
            </Link>
          </div>
        }
      />

      <div className="flex flex-col gap-lg p-md pb-xl">
        <header className="flex flex-col items-center gap-sm">
          <Avatar
            photoUrl={null}
            initial="N"
            name="Nissim Gez"
            size="hero"
            copperBorder
          />
          <span className="font-serif text-sub leading-tight text-cocoa">
            Nissim Gez
          </span>
          <span className="text-small text-cocoa-55">Traveling since summer 2024</span>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            <StatsPill label="Countries" value={countriesCount + 2} />
            <StatsPill label="Places" value={placesCount} />
            <StatsPill label="Planned nights" value={totalNights} />
          </div>
        </header>

        <section className="flex flex-col gap-sm">
          <SectionLabel number="01" label="Your route." />
          <Link
            to="/trip"
            className="flex items-center justify-between gap-sm rounded-2xl bg-sand shadow-card p-md transition-colors duration-instant ease-out-quart hover:bg-sand/70 active:bg-sand"
          >
            <span className="flex min-w-0 flex-1 flex-col gap-px">
              <span className="truncate font-serif text-lede italic text-cocoa">
                Your route
              </span>
              <span className="text-small text-cocoa-70">
                Rio right now · 4 planned stops in LATAM
              </span>
            </span>
            <span className="meta-caps shrink-0 text-copper">Open map</span>
          </Link>
        </section>

        <section className="flex flex-col gap-sm">
          <SectionLabel number="02" label="Past trips." />
          <ul className="flex flex-col gap-sm">
            <li>
              <PastTripCard
                destinationHe="Brazil — Rio, Petrópolis"
                metaLine="Winter 2026 · 21 days"
                flag="🇧🇷"
              />
            </li>
            <li>
              <PastTripCard
                destinationHe="Southeast Asia"
                metaLine="Autumn 2025 · Bangkok, Krabi, Chiang Mai"
                flag="🇹🇭"
              />
            </li>
            <li>
              <PastTripCard
                destinationHe="Côte d'Azur"
                metaLine="Summer 2025 · Nice, Cannes, Monaco"
                flag="🇫🇷"
              />
            </li>
            <li>
              <PastTripCard
                destinationHe="Greece — the Cyclades"
                metaLine="Summer 2024 · Athens, Santorini, Mykonos"
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
              className="text-small text-copper transition-colors duration-instant ease-out-quart hover:text-copper-85"
            >
              See all
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
