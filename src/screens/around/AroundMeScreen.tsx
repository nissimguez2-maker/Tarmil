import { useMemo, useState } from 'react';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { SubNav } from '../../components/shared/SubNav';
import { ToolsButton } from '../../components/shared/ToolsButton';
import { BusinessCard } from '../../components/around/BusinessCard';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import clsx from 'clsx';

type Mode = 'now' | 'trip';

const MODE_TABS: { id: Mode; label: string }[] = [
  { id: 'now', label: 'Now' },
  { id: 'trip', label: 'Your trip' },
];

/**
 * "Around me" — the v0.3 monetization surface. Curated paid-placement
 * businesses, friend star ratings, Reserve/Contact CTAs.
 *
 * Two modes:
 *  - Now:        places within ~50km of `myTrip.present` (user's
 *                current home base). Falls back to "no results" copy
 *                when nothing is near.
 *  - Your trip:  horizontal pill scroller of planned stops, filtered
 *                by `destination_id`. Default-selects the first
 *                upcoming stop.
 *
 * Both modes scope to `places.paid_placement = true` — curated, not
 * the full venue index.
 */
export function AroundMeScreen() {
  const { data, loading, error } = useSupabaseData();
  // Pick "Your trip" by default — the most demo-useful state. The "Now"
  // mode still shows local Rio paid placements via the haversine filter
  // around `myTrip.present`.
  const [mode, setMode] = useState<Mode>('trip');
  const [selectedDestinationId, setSelectedDestinationId] = useState<
    string | null
  >(null);

  const paidPlaces = useMemo(() => {
    if (!data) return [];
    return data.places.filter((p) => p.paidPlacement);
  }, [data]);

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const present = data.myTrip.present;
  const nowPlaces = paidPlaces.filter((p) =>
    withinKm(p.lat, p.lng, present[0], present[1], 50),
  );

  const stops = data.plannedStops;
  const activeDestinationId =
    selectedDestinationId ?? stops[0]?.id ?? null;
  const tripPlaces = activeDestinationId
    ? paidPlaces.filter((p) => p.destinationId === activeDestinationId)
    : [];

  const visiblePlaces = mode === 'now' ? nowPlaces : tripPlaces;

  return (
    <Screen>
      <TopBar title="Around me" end={<ToolsButton />} />

      <SubNav items={MODE_TABS} active={mode} onChange={setMode} />

      <div className="flex flex-col gap-md p-md pb-xl">
        {mode === 'trip' && stops.length > 0 && (
          <div
            className="-mx-md overflow-x-auto px-md [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Pick a stop"
          >
            <ul className="flex w-max items-center gap-2">
              {stops.map((s) => {
                const isActive = s.id === activeDestinationId;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedDestinationId(s.id)}
                      className={clsx(
                        'inline-flex h-8 items-center rounded-full px-md text-small font-medium leading-none',
                        'transition-[transform,background-color,border-color,color] duration-instant ease-out-quart',
                        'active:scale-[0.96]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
                        isActive
                          ? 'bg-cocoa text-ivory shadow-card'
                          : 'border border-cocoa-15 bg-ivory text-cocoa-70 hover:border-cocoa-30 hover:text-cocoa',
                      )}
                    >
                      {s.nameEn}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {visiblePlaces.length === 0 ? (
          <EmptyState mode={mode} />
        ) : (
          <ul className="flex flex-col gap-md">
            {visiblePlaces.map((p) => (
              <li key={p.id}>
                <BusinessCard
                  place={p}
                  reviews={data.placeReviews}
                  friends={data.friendOverlaps}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Screen>
  );
}

function EmptyState({ mode }: { mode: Mode }) {
  return (
    <p className="rounded-2xl bg-sand shadow-card p-md text-small leading-snug text-cocoa-70">
      {mode === 'now'
        ? 'No partner places near you right now. Switch to "Your trip" to see what is curated where you are going next.'
        : 'No partner places listed here yet. Tarmil is rolling out city by city — your favourite venue can be next.'}
    </p>
  );
}

/** Cheap great-circle distance check (km). Good enough for the 50km filter. */
function withinKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
  km: number,
): boolean {
  const R = 6371; // km
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c <= km;
}
