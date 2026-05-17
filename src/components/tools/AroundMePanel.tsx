import { useMemo, useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import clsx from 'clsx';
import { SubNav } from '../shared/SubNav';
import { SearchBar } from '../shared/SearchBar';
import { BusinessCard } from './BusinessCard';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import type { PlannedStop } from '../../data/plannedStops';

type Mode = 'now' | 'trip';

const MODE_TABS: { id: Mode; label: string }[] = [
  { id: 'now', label: 'Now' },
  { id: 'trip', label: 'Your trip' },
];

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
};

function cityLabel(destinationId: string): string {
  return CITY_BY_DESTINATION_ID[destinationId] ?? destinationId;
}

/**
 * Places-nearby panel — partner-channel paid placements presented as a
 * Tools-tab utility. Brief §07 puts partner-channel deals in V1, but the
 * tile exists in the Tools shell today so we have somewhere to test the
 * Reserve / Contact CTAs once partners go live.
 *
 * Lifted from the old AroundMeScreen — same three modes (Now, Your trip,
 * global search), minus the outer Screen/TopBar (the parent Modal frames
 * the surface).
 */
export function AroundMePanel() {
  const { data } = useSupabaseData();
  const [mode, setMode] = useState<Mode>('trip');
  const [selectedDestinationId, setSelectedDestinationId] = useState<
    string | null
  >(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState('');

  const paidPlaces = useMemo(() => {
    if (!data) return [];
    return data.places.filter((p) => p.paidPlacement);
  }, [data]);

  if (!data) return null;

  const present = data.myTrip.present;
  const nowPlaces = paidPlaces.filter((p) =>
    withinKm(p.lat, p.lng, present[0], present[1], 50),
  );

  const stops = data.plannedStops;
  const activeDestinationId =
    selectedDestinationId ?? stops[0]?.id ?? null;
  const activeStop = activeDestinationId
    ? stops.find((s) => s.id === activeDestinationId) ?? null
    : null;
  const tripPlaces = activeDestinationId
    ? paidPlaces.filter((p) => p.destinationId === activeDestinationId)
    : [];

  const trimmed = query.trim().toLowerCase();
  const searching = trimmed.length > 0;
  const matchesQuery = (text: string | undefined) =>
    !!text && text.toLowerCase().includes(trimmed);
  const searchResults = searching
    ? paidPlaces.filter(
        (p) =>
          matchesQuery(p.englishName) ||
          matchesQuery(p.englishDescription) ||
          matchesQuery(cityLabel(p.destinationId)) ||
          matchesQuery(p.category),
      )
    : [];

  const visiblePlaces = searching
    ? searchResults
    : mode === 'now'
      ? nowPlaces
      : tripPlaces;

  const searchCities = searching
    ? [...new Set(searchResults.map((p) => p.destinationId))]
    : [];
  const unplannedSearchCities = searchCities.filter(
    (id) => !stops.some((s) => s.id === id),
  );

  return (
    <div className="flex flex-col gap-md">
      {!searching && (
        <SubNav items={MODE_TABS} active={mode} onChange={setMode} />
      )}

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Search a place or a city"
      />

      {!searching && mode === 'trip' && stops.length > 0 && (
        <CityPicker
          stops={stops}
          selectedId={activeDestinationId}
          open={pickerOpen}
          onToggle={() => setPickerOpen((o) => !o)}
          onPick={(id) => {
            setSelectedDestinationId(id);
            setPickerOpen(false);
          }}
        />
      )}

      {searching && unplannedSearchCities.length > 0 && (
        <p className="text-small leading-snug text-cocoa-70">
          Considering{' '}
          <span className="font-medium text-cocoa">
            {unplannedSearchCities.map(cityLabel).join(', ')}
          </span>
          ? Tap a card to see what's curated there — you can decide
          whether to add it to your trip later.
        </p>
      )}

      {visiblePlaces.length === 0 ? (
        <EmptyState
          mode={searching ? 'search' : mode}
          cityName={
            !searching && mode === 'trip'
              ? activeStop?.nameEn
              : undefined
          }
        />
      ) : (
        <ul className="flex flex-col gap-md">
          {visiblePlaces.map((p) => (
            <li key={p.id}>
              <BusinessCard
                place={p}
                reviews={data.placeReviews}
                friends={data.friendOverlaps}
                cityLabel={
                  searching ? cityLabel(p.destinationId) : undefined
                }
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type CityPickerProps = {
  stops: PlannedStop[];
  selectedId: string | null;
  open: boolean;
  onToggle: () => void;
  onPick: (id: string) => void;
};

function CityPicker({
  stops,
  selectedId,
  open,
  onToggle,
  onPick,
}: CityPickerProps) {
  const selected = stops.find((s) => s.id === selectedId) ?? stops[0];

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={clsx(
          'flex items-center justify-between gap-sm rounded-full px-md py-2',
          'bg-cocoa text-ivory shadow-card',
          'transition-[transform,background-color] duration-instant ease-out-quart',
          'active:scale-[0.98] hover:bg-cocoa/90',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
        )}
      >
        <span className="flex min-w-0 items-baseline gap-2">
          <span className="font-serif text-body italic">
            {selected.nameEn}
          </span>
          <span className="text-small text-ivory/60">
            <span className="tnum">{stops.length}</span> stops
          </span>
        </span>
        <ChevronDown
          className={clsx(
            'h-4 w-4 shrink-0 transition-transform duration-instant ease-out-quart',
            open && 'rotate-180',
          )}
          strokeWidth={1.7}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Pick a stop"
          className="overflow-hidden rounded-2xl bg-sand shadow-card"
        >
          {stops.map((s, i) => {
            const isActive = s.id === selected.id;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  onClick={() => onPick(s.id)}
                  className={clsx(
                    'flex w-full items-center justify-between gap-sm px-md py-sm text-start',
                    'transition-colors duration-instant ease-out-quart hover:bg-rope/40 active:bg-rope/60',
                    i > 0 && 'border-t border-cocoa-08',
                  )}
                >
                  <span className="flex flex-col">
                    <span
                      className={clsx(
                        'font-serif text-body italic leading-tight',
                        isActive ? 'text-cocoa' : 'text-cocoa-70',
                      )}
                    >
                      {s.nameEn}
                    </span>
                    <span className="text-small text-cocoa-55">
                      <span className="tnum">{s.nights}</span> nights
                    </span>
                  </span>
                  {isActive && (
                    <Check
                      className="h-4 w-4 shrink-0 text-copper"
                      strokeWidth={2.2}
                      aria-hidden
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function EmptyState({
  mode,
  cityName,
}: {
  mode: Mode | 'search';
  cityName?: string;
}) {
  let copy: string;
  if (mode === 'search') {
    copy =
      "No partner places match that yet. Try a city, a category, or a venue name — Tarmil is rolling out city by city.";
  } else if (mode === 'now') {
    copy =
      'No partner places near you right now. Switch to "Your trip" to see what is curated where you are going next.';
  } else {
    copy = cityName
      ? `No partner places listed in ${cityName} yet. Tarmil is rolling out city by city — your favourite venue can be next.`
      : 'No partner places listed here yet. Tarmil is rolling out city by city — your favourite venue can be next.';
  }
  return (
    <p className="rounded-2xl bg-sand p-md text-small leading-snug text-cocoa-70">
      {copy}
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
  const R = 6371;
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
