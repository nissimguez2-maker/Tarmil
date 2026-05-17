import { useMemo, useState } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { SubNav } from '../shared/SubNav';
import { SearchBar } from '../shared/SearchBar';
import { BusinessCard } from '../tools/BusinessCard';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import type { Place } from '../../data/places';
import type { PlannedStop } from '../../data/plannedStops';

type Mode = 'now' | 'trip';

const MODE_TABS: { id: Mode; label: string }[] = [
  { id: 'now', label: 'Now' },
  { id: 'trip', label: 'My trip' },
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
  bariloche: 'Bariloche',
};

function cityLabel(destinationId: string): string {
  return CITY_BY_DESTINATION_ID[destinationId] ?? destinationId;
}

type Props = {
  open: boolean;
  onClose: () => void;
  /** Pre-select a planned stop on open. Used when launched from a trip card. */
  initialDestinationId?: string;
};

/**
 * Discovery sheet inside the Plan tab. Lifts the curated-place browsing
 * experience that used to live on the Around tab into a full-bleed
 * modal launched by the "+ Discover" FAB. Three modes (Now / My trip /
 * Search). Partner placements get internal ranking boost; the UI never
 * labels a place as a partner. Star a card to add it to Plan.
 */
export function DiscoverModal({ open, onClose, initialDestinationId }: Props) {
  const { data, togglePlaceSave } = useSupabaseData();
  const [mode, setMode] = useState<Mode>('trip');
  const [selectedDestinationId, setSelectedDestinationId] = useState<
    string | null
  >(initialDestinationId ?? null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState('');

  const rankedPlaces = useMemo(() => {
    if (!data) return [];
    return [...data.places].sort((a, b) => {
      if (!!a.paidPlacement !== !!b.paidPlacement) {
        return a.paidPlacement ? -1 : 1;
      }
      return a.englishName.localeCompare(b.englishName);
    });
  }, [data]);

  const savedPlaceIds = useMemo(() => {
    if (!data) return new Set<string>();
    return new Set(
      data.placeSaves
        .filter((s) => s.friendId === null)
        .map((s) => s.placeId),
    );
  }, [data]);

  const target =
    typeof document !== 'undefined'
      ? document.getElementById('device-portal')
      : null;

  if (!target || !data) return null;

  const present = data.myTrip.present;
  const nowPlaces = rankedPlaces.filter((p) =>
    withinKm(p.lat, p.lng, present[0], present[1], 50),
  );

  const stops = data.plannedStops;
  const activeDestinationId =
    selectedDestinationId ?? stops[0]?.id ?? null;
  const activeStop = activeDestinationId
    ? stops.find((s) => s.id === activeDestinationId) ?? null
    : null;
  const tripPlaces = activeDestinationId
    ? rankedPlaces.filter((p) => p.destinationId === activeDestinationId)
    : [];

  const trimmed = query.trim().toLowerCase();
  const searching = trimmed.length > 0;
  const matchesQuery = (text: string | undefined) =>
    !!text && text.toLowerCase().includes(trimmed);
  const searchResults: Place[] = searching
    ? rankedPlaces.filter(
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

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Discover places"
      className={clsx(
        'absolute inset-0 flex flex-col justify-end',
        'transition-opacity duration-considered ease-out-quart',
        open
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none opacity-0',
      )}
    >
      <button
        type="button"
        aria-label="Dismiss"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={clsx(
          'absolute inset-0 cursor-default bg-cocoa-30',
          'transition-opacity duration-considered ease-out-quart',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        className={clsx(
          'relative flex max-h-[92%] flex-col rounded-t-3xl bg-ivory shadow-sheet',
          'transition-transform duration-considered ease-out-quart',
          open ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <span
          aria-hidden
          className="mx-auto mt-2.5 block h-1 w-9 shrink-0 rounded-full bg-cocoa-15"
        />

        <header className="flex items-start justify-between gap-sm px-md pb-sm pt-sm">
          <div className="flex min-w-0 flex-1 flex-col gap-px">
            <span className="meta-caps text-copper">Discover</span>
            <h2 className="font-serif text-lede leading-tight text-cocoa">
              Curated places
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-me-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-cocoa-55 transition-[transform,background-color] duration-instant ease-out-quart hover:bg-cocoa-8 hover:text-cocoa active:scale-95 active:bg-cocoa-15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
          >
            <X className="h-4 w-4" strokeWidth={1.8} aria-hidden />
          </button>
        </header>

        {!searching && (
          <SubNav items={MODE_TABS} active={mode} onChange={setMode} />
        )}

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="flex flex-col gap-md p-md pb-xl">
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
                      saved={savedPlaceIds.has(p.id)}
                      onToggleSave={() => togglePlaceSave(p.id)}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>,
    target,
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
      'Nothing matches that yet. Try a city, a category, or a venue name.';
  } else if (mode === 'now') {
    copy =
      'Nothing curated near you right now. Switch to "My trip" to see what is curated where you are going next.';
  } else {
    copy = cityName
      ? `Nothing curated in ${cityName} yet.`
      : 'Nothing curated here yet.';
  }
  return (
    <p className="rounded-2xl bg-sand p-md text-small leading-snug text-cocoa-70">
      {copy}
    </p>
  );
}

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
