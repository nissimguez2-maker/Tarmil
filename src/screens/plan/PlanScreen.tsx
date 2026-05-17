import { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import clsx from 'clsx';
import { Screen } from '../../components/Screen';
import { TopBar } from '../../components/TopBar';
import { ProfileAvatarButton } from '../../components/shared/ProfileAvatarButton';
import { Fab } from '../../components/shared/Fab';
import { SectionLabel } from '../../components/SectionLabel';
import { BusinessCard } from '../../components/tools/BusinessCard';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { DiscoverModal } from '../../components/plan/DiscoverModal';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import type { Place } from '../../data/places';
import type { PlannedStop } from '../../data/plannedStops';
import type { PlaceSave, PlaceSaveStatus } from '../../data/placeSaves';

type StatusFilter = 'all' | PlaceSaveStatus;

const STATUS_LABEL: Record<PlaceSaveStatus, string> = {
  reserved: 'Reserved',
  wishlist: 'Wishlist',
  visited: 'Visited',
};

/**
 * Plan tab — the list/micro side of the Trip ↔ Plan pivot. Saved places
 * organized by trip stop, with one shared "Saved (unsorted)" bucket for
 * stars that haven't been attached yet. The "+ Discover" FAB opens the
 * curated-place browsing experience (lifted from the old Around tab).
 *
 * Status grouping inside a stop (Reserved · Wishlist · Visited) is the
 * spine. Visited is the auto-confirmed history after a trip ends.
 */
export function PlanScreen() {
  const { data, loading, error } = useSupabaseData();
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [discoverDestinationId, setDiscoverDestinationId] = useState<
    string | undefined
  >(undefined);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const selfSaves = data.placeSaves.filter((s) => s.friendId === null);
  const placesById = new Map(data.places.map((p) => [p.id, p]));

  const upcomingStops = data.plannedStops
    .filter((s) => s.departureDate >= today)
    .sort((a, b) => a.arrivalDate.localeCompare(b.arrivalDate));
  const pastStops = data.plannedStops
    .filter((s) => s.departureDate < today)
    .sort((a, b) => b.arrivalDate.localeCompare(a.arrivalDate));

  const statusCounts: Record<PlaceSaveStatus, number> = {
    reserved: 0,
    wishlist: 0,
    visited: 0,
  };
  for (const s of selfSaves) statusCounts[s.status] += 1;

  const matchesStatus = (save: PlaceSave) =>
    statusFilter === 'all' || save.status === statusFilter;
  const filteredSaves = selfSaves.filter(matchesStatus);

  const unsortedSaves = filteredSaves.filter((s) => s.plannedStopId === null);
  const totalSaved = selfSaves.length;

  const openDiscover = (destinationId?: string) => {
    setDiscoverDestinationId(destinationId);
    setDiscoverOpen(true);
  };

  return (
    <Screen>
      <TopBar
        title="Plan"
        end={<ProfileAvatarButton initial="N" name="Nissim Guez" />}
      />

      <div className="relative flex flex-col gap-lg p-md pb-xxl">
        <DiscoverSearchButton onOpen={() => openDiscover()} />

        {totalSaved === 0 && upcomingStops.length === 0 && pastStops.length === 0 ? (
          <EmptyAll onDiscover={() => openDiscover()} />
        ) : (
          <>
            <StatusFilterRow
              value={statusFilter}
              onChange={setStatusFilter}
              counts={statusCounts}
              total={totalSaved}
            />

            <SectionLabel
              number="01"
              label={`Upcoming ${upcomingStops.length === 1 ? 'trip' : 'trips'}.`}
            />
            {upcomingStops.length === 0 ? (
              <EmptyHint copy="You have no upcoming stops on the map." />
            ) : (
              <div className="flex flex-col gap-lg">
                {upcomingStops.map((stop) => (
                  <StopBlock
                    key={stop.id}
                    stop={stop}
                    saves={filteredSaves.filter(
                      (s) => s.plannedStopId === stop.id,
                    )}
                    placesById={placesById}
                    reviews={data.placeReviews}
                    friends={data.friendOverlaps}
                    onAdd={() => openDiscover(stop.id)}
                    statusFilter={statusFilter}
                  />
                ))}
              </div>
            )}

            <SectionLabel number="02" label="Saved (unsorted)." />
            {unsortedSaves.length === 0 ? (
              <EmptyHint
                copy={
                  statusFilter === 'all'
                    ? 'Anything you star without a matching trip lands here.'
                    : `Nothing in the unsorted bucket matches ${STATUS_LABEL[statusFilter].toLowerCase()}.`
                }
              />
            ) : (
              <SaveGrid
                saves={unsortedSaves}
                placesById={placesById}
                reviews={data.placeReviews}
                friends={data.friendOverlaps}
                showCity
              />
            )}

            {pastStops.length > 0 && (
              <>
                <SectionLabel number="03" label="Past trips." />
                <div className="flex flex-col gap-lg">
                  {pastStops.map((stop) => (
                    <StopBlock
                      key={stop.id}
                      stop={stop}
                      saves={filteredSaves.filter(
                        (s) => s.plannedStopId === stop.id,
                      )}
                      placesById={placesById}
                      reviews={data.placeReviews}
                      friends={data.friendOverlaps}
                      past
                      statusFilter={statusFilter}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <Fab
        icon={<Plus className="h-5 w-5" strokeWidth={2} aria-hidden />}
        ariaLabel="Discover"
        extended
        onClick={() => openDiscover()}
      />

      <DiscoverModal
        open={discoverOpen}
        onClose={() => setDiscoverOpen(false)}
        initialDestinationId={discoverDestinationId}
      />
    </Screen>
  );
}

type StopBlockProps = {
  stop: PlannedStop;
  saves: PlaceSave[];
  placesById: Map<string, Place>;
  reviews: import('../../data/placeReviews').PlaceReview[];
  friends: import('../../data/myTrip').FriendOverlap[];
  past?: boolean;
  /** Open Discover prefiltered to this stop. Past stops don't get an add affordance. */
  onAdd?: () => void;
  statusFilter: StatusFilter;
};

function StopBlock({
  stop,
  saves,
  placesById,
  reviews,
  friends,
  past,
  onAdd,
  statusFilter,
}: StopBlockProps) {
  const orderedSaves = useMemo(() => orderByStatus(saves), [saves]);
  const filteringEmpty = saves.length === 0 && statusFilter !== 'all';
  return (
    <section className="flex flex-col gap-sm">
      <header className="flex items-baseline justify-between gap-sm">
        <div className="flex min-w-0 flex-col">
          <span className="font-serif text-lede italic leading-tight text-cocoa">
            {stop.nameEn}
          </span>
          <span className="text-small text-cocoa-55">
            {formatDateRange(stop.arrivalDate, stop.departureDate)} ·{' '}
            <span className="tnum">{stop.nights}</span> nights
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-sm">
          <span className="meta-caps text-cocoa-55">
            <span className="tnum">{saves.length}</span>{' '}
            {saves.length === 1 ? 'place' : 'places'}
          </span>
          {onAdd && !past && (
            <button
              type="button"
              onClick={onAdd}
              aria-label={`Find a place to add in ${stop.nameEn}`}
              className={clsx(
                'inline-flex h-7 w-7 items-center justify-center rounded-full',
                'border border-cocoa-15 bg-ivory text-cocoa-70',
                'transition-[transform,background-color,border-color,color] duration-instant ease-out-quart',
                'hover:border-copper hover:text-copper active:scale-[0.94]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
              )}
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
            </button>
          )}
        </div>
      </header>

      {saves.length === 0 ? (
        filteringEmpty ? (
          <p className="rounded-2xl bg-sand p-md text-small leading-snug text-cocoa-70">
            Nothing matches{' '}
            <span className="lowercase">{STATUS_LABEL[statusFilter as PlaceSaveStatus]}</span>{' '}
            in {stop.nameEn}.
          </p>
        ) : past ? (
          <p className="rounded-2xl bg-sand p-md text-small leading-snug text-cocoa-70">
            Nothing saved for this trip.
          </p>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            className="rounded-2xl bg-sand p-md text-start text-small leading-snug text-cocoa-70 transition-colors duration-instant ease-out-quart hover:bg-rope/50 active:bg-rope/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            Nothing planned in {stop.nameEn} yet — tap to find places.
          </button>
        )
      ) : (
        <ul className="flex flex-col gap-md">
          {orderedSaves.map((save) => {
            const place = placesById.get(save.placeId);
            if (!place) return null;
            return (
              <li key={save.id}>
                <BusinessCard
                  place={place}
                  reviews={reviews}
                  friends={friends}
                  statusBadge={save.status}
                  saved
                />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function DiscoverSearchButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={clsx(
        'group flex items-center gap-sm rounded-full bg-sand px-md py-2.5 text-start',
        'border border-cocoa-15 shadow-card',
        'transition-[transform,background-color,border-color] duration-instant ease-out-quart motion-reduce:transition-none',
        'hover:border-copper hover:bg-ivory active:scale-[0.99]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
      )}
    >
      <Search
        className="h-4 w-4 shrink-0 text-cocoa-55 group-hover:text-copper"
        strokeWidth={1.8}
        aria-hidden
      />
      <span className="flex-1 truncate text-body text-cocoa-55 group-hover:text-cocoa">
        Find a place to save
      </span>
      <span className="meta-caps shrink-0 text-copper">Discover</span>
    </button>
  );
}

type StatusFilterRowProps = {
  value: StatusFilter;
  onChange: (v: StatusFilter) => void;
  counts: Record<PlaceSaveStatus, number>;
  total: number;
};

function StatusFilterRow({
  value,
  onChange,
  counts,
  total,
}: StatusFilterRowProps) {
  const items: Array<{ id: StatusFilter; label: string; count: number }> = [
    { id: 'all', label: 'All', count: total },
  ];
  (['reserved', 'wishlist', 'visited'] as const).forEach((status) => {
    if (counts[status] > 0) {
      items.push({ id: status, label: STATUS_LABEL[status], count: counts[status] });
    }
  });
  if (items.length === 1) return null;
  return (
    <div
      role="tablist"
      aria-label="Filter saves by status"
      className="flex flex-wrap gap-2"
    >
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={clsx(
              'inline-flex items-center gap-1.5 rounded-full px-sm py-1.5',
              'border text-small font-medium leading-none',
              'transition-[transform,background-color,border-color,color] duration-instant ease-out-quart',
              'active:scale-[0.97]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
              active
                ? 'border-cocoa bg-cocoa text-ivory'
                : 'border-cocoa-15 bg-ivory text-cocoa-70 hover:border-cocoa-30 hover:text-cocoa',
            )}
          >
            <span>{item.label}</span>
            <span
              className={clsx(
                'tnum text-meta',
                active ? 'text-ivory/70' : 'text-cocoa-55',
              )}
            >
              {item.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

type SaveGridProps = {
  saves: PlaceSave[];
  placesById: Map<string, Place>;
  reviews: import('../../data/placeReviews').PlaceReview[];
  friends: import('../../data/myTrip').FriendOverlap[];
  showCity?: boolean;
};

function SaveGrid({
  saves,
  placesById,
  reviews,
  friends,
  showCity,
}: SaveGridProps) {
  return (
    <ul className="flex flex-col gap-md">
      {saves.map((save) => {
        const place = placesById.get(save.placeId);
        if (!place) return null;
        return (
          <li key={save.id}>
            <BusinessCard
              place={place}
              reviews={reviews}
              friends={friends}
              cityLabel={showCity ? cityLabel(place.destinationId) : undefined}
              statusBadge={save.status}
              saved
            />
          </li>
        );
      })}
    </ul>
  );
}

function EmptyAll({ onDiscover }: { onDiscover: () => void }) {
  return (
    <div className="flex flex-col gap-sm rounded-2xl bg-sand p-md shadow-card">
      <h3 className="font-serif text-lede italic text-cocoa">
        Nothing saved yet.
      </h3>
      <p className="text-small leading-snug text-cocoa-70">
        Tap Discover to browse curated places. Star one and it shows up
        here, sorted by trip when the city matches.
      </p>
      <button
        type="button"
        onClick={onDiscover}
        className="self-start rounded-full bg-copper px-md py-2 text-body font-medium text-ivory shadow-card transition-[transform,background-color] duration-instant ease-out-quart hover:bg-copper-85 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-sand"
      >
        Discover places
      </button>
    </div>
  );
}

function EmptyHint({ copy }: { copy: string }) {
  return (
    <p className="rounded-2xl bg-sand p-md text-small leading-snug text-cocoa-70">
      {copy}
    </p>
  );
}

const STATUS_ORDER: Record<PlaceSaveStatus, number> = {
  reserved: 0,
  wishlist: 1,
  visited: 2,
};

function orderByStatus(saves: PlaceSave[]): PlaceSave[] {
  return [...saves].sort((a, b) => {
    const d = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (d !== 0) return d;
    return a.createdAt.localeCompare(b.createdAt);
  });
}

const MONTH_LABEL = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function formatDateRange(arrival: string, departure: string): string {
  const a = parseISO(arrival);
  const d = parseISO(departure);
  if (a.getMonth() === d.getMonth() && a.getFullYear() === d.getFullYear()) {
    return `${MONTH_LABEL[a.getMonth()]} ${a.getDate()}–${d.getDate()}`;
  }
  return `${MONTH_LABEL[a.getMonth()]} ${a.getDate()} – ${MONTH_LABEL[d.getMonth()]} ${d.getDate()}`;
}

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split('-').map((n) => parseInt(n, 10));
  return new Date(y, m - 1, d);
}

const CITY_BY_DESTINATION_ID: Record<string, string> = {
  buzios: 'Búzios',
  'sao-paulo': 'São Paulo',
  jericoacoara: 'Jericoacoara',
  'rio-de-janeiro': 'Rio de Janeiro',
  'buenos-aires': 'Buenos Aires',
  'punta-del-este': 'Punta del Este',
  medellin: 'Medellín',
  cusco: 'Cusco',
  cartagena: 'Cartagena',
  mendoza: 'Mendoza',
  bariloche: 'Bariloche',
};

function cityLabel(destinationId: string): string {
  return CITY_BY_DESTINATION_ID[destinationId] ?? destinationId;
}
