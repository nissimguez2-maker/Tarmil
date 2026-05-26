import { useState } from 'react';
import { Search, X, MapPin } from 'lucide-react';

type Suggestion = {
  id: string;
  nameHe: string;
  nameEn: string;
  kindHe: string;
  lat: number;
  lng: number;
};

const SUGGESTIONS: Suggestion[] = [
  {
    id: 'sug-cusco',
    nameHe: 'Cusco',
    nameEn: 'Cusco',
    kindHe: 'City · Peru',
    lat: -13.5319,
    lng: -71.9675,
  },
  {
    id: 'sug-medellin',
    nameHe: 'Medellín',
    nameEn: 'Medellín',
    kindHe: 'City · Colombia',
    lat: 6.2442,
    lng: -75.5812,
  },
  {
    id: 'sug-lisbon',
    nameHe: 'Lisbon',
    nameEn: 'Lisbon',
    kindHe: 'City · Portugal',
    lat: 38.7223,
    lng: -9.1393,
  },
  {
    id: 'sug-tokyo',
    nameHe: 'Tokyo',
    nameEn: 'Tokyo',
    kindHe: 'City · Japan',
    lat: 35.6762,
    lng: 139.6503,
  },
];

const RECENT: Suggestion[] = [
  {
    id: 'rec-koh-phangan',
    nameHe: 'Koh Phangan',
    nameEn: 'Koh Phangan',
    kindHe: 'Island · Thailand',
    lat: 9.7349,
    lng: 100.0252,
  },
];

type Props = {
  onPickSuggestion: (sug: { nameHe: string; latlng: [number, number] }) => void;
  onPickOnMap: () => void;
  onClose: () => void;
};

export function SearchDestinationSheet({
  onPickSuggestion,
  onPickOnMap,
  onClose,
}: Props) {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const filtered = q
    ? SUGGESTIONS.filter(
        (s) =>
          s.nameHe.includes(query.trim()) ||
          s.nameEn.toLowerCase().includes(q),
      )
    : SUGGESTIONS;

  return (
    <div className="flex max-h-[60dvh] flex-col gap-md px-md pb-md pt-sm">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex min-w-0 flex-1 flex-col gap-px">
          <span className="meta-caps text-amber">Add a destination</span>
          <h3 className="font-serif text-lede leading-tight text-charcoal">
            Where do you want to go?
          </h3>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="-me-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-charcoal-55 transition-colors duration-instant ease-out-quart hover:bg-charcoal-8 active:bg-charcoal-15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          <X className="h-4 w-4" strokeWidth={1.8} aria-hidden />
        </button>
      </div>

      <div className="relative">
        <Search
          className="pointer-events-none absolute end-sm top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-55"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city, region or destination…"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          dir="ltr"
          className="h-10 w-full rounded-full border border-charcoal-15 bg-sand pe-lg ps-md text-body text-charcoal placeholder:text-charcoal-55 transition-colors duration-instant ease-out-quart focus:border-amber focus:outline-none"
        />
      </div>

      <div className="flex flex-col overflow-y-auto">
        <span className="meta-caps pb-xs text-charcoal-55">
          {q ? 'Results' : 'Backpacker favourites'}
        </span>
        {filtered.map((s) => (
          <SuggestionRow
            key={s.id}
            suggestion={s}
            onClick={() =>
              onPickSuggestion({ nameHe: s.nameHe, latlng: [s.lat, s.lng] })
            }
          />
        ))}
        {!q && RECENT.length > 0 && (
          <>
            <span className="meta-caps mt-sm pb-xs text-charcoal-55">Recent</span>
            {RECENT.map((s) => (
              <SuggestionRow
                key={s.id}
                suggestion={s}
                onClick={() =>
                  onPickSuggestion({ nameHe: s.nameHe, latlng: [s.lat, s.lng] })
                }
              />
            ))}
          </>
        )}
      </div>

      <button
        type="button"
        onClick={onPickOnMap}
        className="inline-flex items-center gap-2 self-start rounded-full border border-charcoal-15 px-md py-2 text-body text-charcoal transition-colors duration-instant ease-out-quart active:bg-charcoal-8"
      >
        <MapPin className="h-4 w-4 text-amber" aria-hidden />
        <span>Pick on the map</span>
      </button>
    </div>
  );
}

function SuggestionRow({
  suggestion,
  onClick,
}: {
  suggestion: Suggestion;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between gap-sm border-t border-charcoal-08 py-sm text-start transition-colors duration-instant ease-out-quart first:border-t-0 active:bg-charcoal-08"
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-body text-charcoal">{suggestion.nameHe}</span>
        <span className="text-small text-charcoal-55">{suggestion.kindHe}</span>
      </div>
      <span className="shrink-0 text-small text-charcoal-55 ltr">
        {suggestion.nameEn}
      </span>
    </button>
  );
}
