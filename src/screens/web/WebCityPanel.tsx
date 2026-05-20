import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Star, Users } from 'lucide-react';
import { Button } from '../../components/Button';
import type { PlannedStop } from '../../data/plannedStops';
import type { Place, PlaceCategory } from '../../data/places';
import { formatStopRange } from './dateUtils';

type Props = {
  stop: PlannedStop;
  places: Place[];
};

type CategoryFilter = 'all' | PlaceCategory;

const CATEGORY_TABS: { value: CategoryFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'hostel', label: 'Hostels' },
  { value: 'restaurant', label: 'Restaurants' },
  { value: 'cafe', label: 'Cafés' },
  { value: 'bar', label: 'Bars' },
  { value: 'club', label: 'Clubs' },
  { value: 'landmark', label: 'Landmarks' },
  { value: 'beach', label: 'Beaches' },
  { value: 'chabad', label: 'Chabad' },
  { value: 'kosher', label: 'Kosher' },
];

export function WebCityPanel({ stop, places }: Props) {
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const visible = useMemo(() => {
    const filtered =
      filter === 'all' ? places : places.filter((p) => p.category === filter);
    return [...filtered].sort((a, b) => {
      const pickDiff = Number(b.tarmilPick ?? false) - Number(a.tarmilPick ?? false);
      if (pickDiff !== 0) return pickDiff;
      const ratingDiff = b.rating - a.rating;
      if (ratingDiff !== 0) return ratingDiff;
      return b.friendsKnow - a.friendsKnow;
    });
  }, [places, filter]);

  return (
    <div className="flex flex-col h-full min-h-0">
      <header className="shrink-0 p-md border-b border-cocoa-15 flex flex-col gap-xs">
        <div className="flex flex-col gap-xs">
          <h2 className="font-serif text-sub text-cocoa">{stop.nameEn}</h2>
          <p className="text-small text-cocoa-55">
            {formatStopRange(stop.arrivalDate, stop.departureDate)} ·{' '}
            {stop.nights} {stop.nights === 1 ? 'night' : 'nights'}
          </p>
          {stop.note && (
            <p className="text-small text-cocoa-55 italic">{stop.note}</p>
          )}
        </div>
        <div className="-mx-md px-md overflow-x-auto">
          <div className="flex gap-xs pb-xs">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value)}
                className={clsx(
                  'shrink-0 rounded-full px-sm py-xs text-meta uppercase border transition-[background-color,border-color,color] duration-instant ease-out-quart motion-reduce:transition-none',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
                  filter === tab.value
                    ? 'bg-copper text-ivory border-copper'
                    : 'bg-ivory text-cocoa-70 border-cocoa-15 hover:border-copper hover:text-copper',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto p-md flex flex-col gap-sm">
        {visible.length === 0 ? (
          <p className="text-small text-cocoa-55 text-center py-xl">
            No {filter === 'all' ? 'places' : CATEGORY_TABS.find((t) => t.value === filter)?.label.toLowerCase()} curated yet for this stop.
          </p>
        ) : (
          visible.map((place) => <PlaceCard key={place.id} place={place} />)
        )}
      </div>
    </div>
  );
}

function PlaceCard({ place }: { place: Place }) {
  const onBook = () => {
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(place.englishName)}`,
      '_blank',
      'noopener',
    );
  };
  return (
    <article className="bg-sand border border-rope rounded-2xl p-sm flex flex-col gap-xs">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex-1 min-w-0">
          <h3 className="font-sans font-semibold text-lede text-cocoa">
            {place.englishName}
          </h3>
          <p className="text-meta uppercase text-cocoa-55 mt-xs">
            {place.category}
          </p>
        </div>
        {place.tarmilPick && (
          <span className="shrink-0 text-meta uppercase font-medium text-copper">
            Tarmil Pick
          </span>
        )}
      </div>
      <p className="text-small text-cocoa-70 line-clamp-2">
        {place.englishDescription}
      </p>
      <div className="flex items-center gap-sm flex-wrap">
        <span className="inline-flex items-center gap-xs text-small text-copper">
          <Star size={12} strokeWidth={2} fill="currentColor" />
          {place.rating.toFixed(1)}
        </span>
        {place.friendsKnow > 0 && (
          <span className="inline-flex items-center gap-xs text-small text-cocoa-55">
            <Users size={12} strokeWidth={2} />
            {place.friendsKnow} {place.friendsKnow === 1 ? 'friend' : 'friends'} know this
          </span>
        )}
      </div>
      <div className="mt-xs">
        <Button variant="accent" size="sm" onClick={onBook}>
          Book
        </Button>
      </div>
    </article>
  );
}
