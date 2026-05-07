import { useState } from 'react';
import { Search, X, MapPin } from 'lucide-react';

type Suggestion = {
  /** Stable id used when this suggestion becomes a planned-stop id, so the
   *  matching `places.destination_id` rows in Supabase light up immediately. */
  id: string;
  nameHe: string;
  nameEn: string;
  kindHe: string;
  lat: number;
  lng: number;
};

// Demo candidates — the cities the founder picks live in front of investors.
// Each one has a matching set of places + a friend overlap already seeded in
// Supabase (see `supabase/migrations/0003_seed_static_data.sql`), so on save
// the trip line extends, ~12 markers appear, and a friend bubble pops up.
const SUGGESTIONS: Suggestion[] = [
  {
    id: 'mendoza',
    nameHe: 'מנדוסה',
    nameEn: 'Mendoza',
    kindHe: 'יקבים · ארגנטינה',
    lat: -32.8908,
    lng: -68.8272,
  },
  {
    id: 'bariloche',
    nameHe: 'בריצ׳ה',
    nameEn: 'Bariloche',
    kindHe: 'אגמים · ארגנטינה',
    lat: -41.1335,
    lng: -71.3103,
  },
  {
    id: 'punta-del-este',
    nameHe: 'פונטה דל אסטה',
    nameEn: 'Punta del Este',
    kindHe: 'חוף · אורוגוואי',
    lat: -34.9591,
    lng: -54.9472,
  },
  {
    id: 'sug-cusco',
    nameHe: 'קוסקו',
    nameEn: 'Cusco',
    kindHe: 'עיר · פרו',
    lat: -13.5319,
    lng: -71.9675,
  },
];

const RECENT: Suggestion[] = [
  {
    id: 'rec-koh-phangan',
    nameHe: 'קו פנגן',
    nameEn: 'Koh Phangan',
    kindHe: 'אי · תאילנד',
    lat: 9.7349,
    lng: 100.0252,
  },
];

type Props = {
  onPickSuggestion: (sug: {
    nameHe: string;
    latlng: [number, number];
    idHint?: string;
  }) => void;
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

  const pick = (s: Suggestion) =>
    onPickSuggestion({
      nameHe: s.nameHe,
      latlng: [s.lat, s.lng],
      // Only pre-seeded demo cities carry an idHint. The "RECENT" / generic
      // picks fall back to the auto-generated stop id.
      idHint: s.id.startsWith('sug-') || s.id.startsWith('rec-') ? undefined : s.id,
    });

  return (
    <div className="flex max-h-[60dvh] flex-col gap-md p-md">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex flex-col">
          <span className="meta-caps text-cocoa-70">הוסף יעד למסע</span>
          <h2 className="font-serif text-lede leading-tight">
            לאן רוצה להגיע?
          </h2>
        </div>
        <button
          type="button"
          aria-label="סגור"
          onClick={onClose}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-cocoa-55 hover:bg-cocoa-8 active:bg-cocoa-15"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <div className="relative">
        <Search
          className="pointer-events-none absolute end-sm top-1/2 h-4 w-4 -translate-y-1/2 text-cocoa-55"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חפש עיר, אזור או יעד…"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          dir="rtl"
          className="h-11 w-full rounded-full border border-cocoa-15 bg-sand pe-lg ps-md text-body text-cocoa placeholder:text-cocoa-55 focus:border-copper focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1 overflow-y-auto">
        <span className="meta-caps text-cocoa-55">
          {q ? 'תוצאות' : 'מומלצים לישראלים'}
        </span>
        {filtered.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => pick(s)}
            className="flex items-center justify-between gap-sm border-t border-cocoa-08 py-sm text-start active:bg-cocoa-08"
          >
            <div className="flex flex-col">
              <span className="text-body text-cocoa">{s.nameHe}</span>
              <span className="text-small text-cocoa-55">{s.kindHe}</span>
            </div>
            <span className="text-small text-cocoa-55 ltr">{s.nameEn}</span>
          </button>
        ))}
        {!q && RECENT.length > 0 && (
          <>
            <span className="meta-caps mt-sm text-cocoa-55">לאחרונה</span>
            {RECENT.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => pick(s)}
                className="flex items-center justify-between gap-sm border-t border-cocoa-08 py-sm text-start active:bg-cocoa-08"
              >
                <div className="flex flex-col">
                  <span className="text-body text-cocoa">{s.nameHe}</span>
                  <span className="text-small text-cocoa-55">{s.kindHe}</span>
                </div>
                <span className="text-small text-cocoa-55 ltr">
                  {s.nameEn}
                </span>
              </button>
            ))}
          </>
        )}
      </div>

      <button
        type="button"
        onClick={onPickOnMap}
        className="inline-flex items-center gap-2 self-start rounded-full border border-cocoa-15 px-md py-2 text-body text-cocoa active:bg-cocoa-8"
      >
        <MapPin className="h-4 w-4 text-copper" aria-hidden />
        <span>בחר מיקום במפה</span>
      </button>
    </div>
  );
}
