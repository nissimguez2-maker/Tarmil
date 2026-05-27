import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, EyeOff } from 'lucide-react';
import clsx from 'clsx';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { SectionLabel } from '../../components/SectionLabel';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { Avatar } from '../../components/shared/Avatar';
import { StatsPill } from '../../components/profile/StatsPill';
import { FriendGridItem } from '../../components/profile/FriendGridItem';
import { PastTripCard } from '../../components/profile/PastTripCard';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import { relateFriend } from '../../components/tripMap/utils/relateFriend';

type TripVisibility = {
  friends: boolean;
  fof: boolean;
};

const COUNTRY_BY_DESTINATION_ID: Record<string, string> = {
  buzios: 'br',
  'sao-paulo': 'br',
  jericoacoara: 'br',
  'rio-de-janeiro': 'br',
  'buenos-aires': 'ar',
  'punta-del-este': 'uy',
};

/**
 * Profile tab. Four editorial sections — Off-grid mode (one-tap),
 * route, past trips, friends grid, and per-trip privacy. Tools moved to
 * their own top-level /tools tab so this screen stays focused on
 * identity, history, and privacy controls. Settings remains in the
 * top-bar gear.
 *
 * Off-grid mode and per-trip privacy are local UI state for the demo —
 * brief §"A note on the privacy opt-in matrix" gives them as MVP
 * commitments; the persistence schema lands in a follow-up PR.
 */
export function ProfileScreen() {
  const { data, loading, error } = useSupabaseData();
  const [offGrid, setOffGrid] = useState(false);
  const [tripVisibility, setTripVisibility] = useState<
    Record<string, TripVisibility>
  >({});

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const countriesCount = new Set(
    data.plannedStops
      .map((s) => COUNTRY_BY_DESTINATION_ID[s.id])
      .filter(Boolean),
  ).size;
  const placesCount = data.places.length;
  const totalNights = data.plannedStops.reduce((acc, s) => acc + s.nights, 0);
  const stopsCount = data.plannedStops.length;

  const friendsForGrid = data.friendOverlaps.slice(0, 6);

  const visibilityFor = (stopId: string): TripVisibility =>
    tripVisibility[stopId] ?? { friends: true, fof: false };

  const setVisibilityFor = (
    stopId: string,
    next: Partial<TripVisibility>,
  ) => {
    setTripVisibility((prev) => ({
      ...prev,
      [stopId]: { ...visibilityFor(stopId), ...next },
    }));
  };

  return (
    <Screen>
      <TopBar
        back
        title="Profile"
        end={
          <Link
            to="/profile/settings"
            aria-label="Settings"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-charcoal transition-colors duration-instant ease-out-quart hover:bg-charcoal-8 active:bg-charcoal-15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
          >
            <Settings className="h-5 w-5" aria-hidden />
          </Link>
        }
      />

      <div className="flex flex-col gap-lg pb-xl">
        <header
          className="relative flex flex-col items-center gap-sm px-md pt-lg pb-md"
          style={{
            background:
              'linear-gradient(180deg, rgba(231,218,198,0.75) 0%, rgba(250,245,236,1) 100%)',
          }}
        >
          <Avatar
            photoUrl={null}
            initial="N"
            name="Nissim Guez"
            size="hero"
            copperBorder
          />
          <span className="font-serif text-sub leading-tight text-charcoal">
            Nissim Guez
          </span>
          <span className="text-small text-charcoal-55">
            Traveling since summer 2024
          </span>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            <StatsPill label="Countries" value={countriesCount + 4} />
            <StatsPill label="Places" value={placesCount} />
            <StatsPill label="Planned nights" value={totalNights} />
          </div>
        </header>

        <div className="flex flex-col gap-lg px-md">
          <OffGridCard
            on={offGrid}
            onToggle={() => setOffGrid((v) => !v)}
          />

          <section className="flex flex-col gap-sm">
            <SectionLabel number="01" label="Your route." />
            <Link
              to="/trip"
              className="flex items-center justify-between gap-sm rounded-2xl bg-sand shadow-card p-md transition-colors duration-instant ease-out-quart hover:bg-sand/70 active:bg-sand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
            >
              <span className="flex min-w-0 flex-1 flex-col gap-px">
                <span className="truncate font-serif text-lede text-charcoal">
                  Your route
                </span>
                <span className="text-small text-charcoal-70">
                  Rio right now ·{' '}
                  <span className="tnum">{stopsCount}</span> planned stop
                  {stopsCount === 1 ? '' : 's'} in LATAM
                </span>
              </span>
              <span className="meta-caps shrink-0 text-amber">Open map</span>
            </Link>
          </section>

          <section className="flex flex-col gap-sm">
            <SectionLabel number="02" label="Past trips." />
            <ul className="flex flex-col gap-sm">
              <li>
                <PastTripCard
                  destinationHe="Brazil — Rio, Petrópolis"
                  metaLine="Winter 2026 · 21 days"
                  countryCode="br"
                />
              </li>
              <li>
                <PastTripCard
                  destinationHe="Southeast Asia"
                  metaLine="Autumn 2025 · Bangkok, Krabi, Chiang Mai"
                  countryCode="th"
                />
              </li>
              <li>
                <PastTripCard
                  destinationHe="Côte d'Azur"
                  metaLine="Summer 2025 · Nice, Cannes, Monaco"
                  countryCode="fr"
                />
              </li>
              <li>
                <PastTripCard
                  destinationHe="Greece — the Cyclades"
                  metaLine="Summer 2024 · Athens, Santorini, Mykonos"
                  countryCode="gr"
                />
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-sm">
            <div className="flex items-baseline justify-between">
              <SectionLabel number="03" label="Friends in network." />
              <Link
                to="/profile/friends"
                className="text-small text-amber transition-colors duration-instant ease-out-quart hover:text-amber-85 focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-2"
              >
                See all
              </Link>
            </div>
            <ul className="grid grid-cols-3 gap-sm">
              {friendsForGrid.map((f) => (
                <li key={f.id}>
                  <FriendGridItem
                    friend={f}
                    relationship={relateFriend(f, data.plannedStops)}
                  />
                </li>
              ))}
            </ul>
          </section>

          <section className="flex flex-col gap-sm">
            <SectionLabel number="04" label="Per-trip privacy." />
            <p className="text-small leading-snug text-charcoal-70">
              Each declared stop is private by default. Opt in per trip to
              share with direct friends, or with friends-of-friends.
            </p>
            <ul className="overflow-hidden rounded-2xl border border-charcoal-15 bg-cream">
              {data.plannedStops.map((stop, i) => {
                const v = visibilityFor(stop.id);
                return (
                  <li
                    key={stop.id}
                    className={clsx(
                      'flex flex-col gap-2 px-md py-3',
                      i > 0 && 'border-t border-charcoal-08',
                    )}
                  >
                    <div className="flex items-baseline justify-between gap-sm">
                      <span className="font-serif text-body text-charcoal">
                        {stop.nameEn}
                      </span>
                      <span className="text-small text-charcoal-55">
                        <span className="tnum">{stop.nights}</span> nights
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <TinyToggle
                        label="Friends"
                        on={v.friends}
                        onChange={() =>
                          setVisibilityFor(stop.id, { friends: !v.friends })
                        }
                      />
                      <TinyToggle
                        label="Friends of friends"
                        on={v.fof}
                        onChange={() =>
                          setVisibilityFor(stop.id, { fof: !v.fof })
                        }
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </Screen>
  );
}

function OffGridCard({
  on,
  onToggle,
}: {
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <section
      className={clsx(
        'flex items-center justify-between gap-sm rounded-2xl border p-md transition-colors duration-instant ease-out-quart',
        on
          ? 'border-amber bg-amber/10'
          : 'border-charcoal-15 bg-cream',
      )}
    >
      <div className="flex items-center gap-sm">
        <span
          className={clsx(
            'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
            on ? 'bg-amber text-cream' : 'bg-charcoal-08 text-charcoal-55',
          )}
        >
          <EyeOff className="h-5 w-5" strokeWidth={1.8} aria-hidden />
        </span>
        <div className="flex flex-col leading-tight">
          <span className="font-serif text-lede text-charcoal">
            Off-grid mode
          </span>
          <span className="text-small text-charcoal-70">
            {on
              ? "You're invisible on every surface — overlaps, density, forums and pings."
              : 'Hide your route from every friend, in one tap.'}
          </span>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onToggle}
        className={clsx(
          'relative inline-flex h-7 w-12 shrink-0 items-center rounded-full',
          'transition-colors duration-instant ease-out-quart',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
          on ? 'bg-amber' : 'bg-charcoal-15',
        )}
        aria-label="Toggle off-grid mode"
      >
        <span
          aria-hidden
          className={clsx(
            'inline-block h-6 w-6 transform rounded-full bg-cream shadow-card transition-transform duration-instant ease-out-quart',
            on ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
    </section>
  );
}

function TinyToggle({
  label,
  on,
  onChange,
}: {
  label: string;
  on: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onChange}
      className={clsx(
        'inline-flex items-center gap-2 rounded-full ps-3 pe-3 py-1.5 text-small font-medium leading-none',
        'transition-colors duration-instant ease-out-quart',
        on
          ? 'bg-amber text-cream'
          : 'border border-charcoal-15 text-charcoal-70 hover:text-charcoal',
      )}
    >
      <span
        aria-hidden
        className={clsx(
          'inline-block h-2.5 w-2.5 rounded-full',
          on ? 'bg-cream' : 'bg-charcoal-30',
        )}
      />
      {label}
    </button>
  );
}
