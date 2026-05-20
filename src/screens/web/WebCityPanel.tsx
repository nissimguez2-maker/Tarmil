import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Cloud, Star, Users } from 'lucide-react';
import { Button } from '../../components/Button';
import type { PlannedStop } from '../../data/plannedStops';
import type { Place, PlaceCategory } from '../../data/places';
import { cityDescription } from './cityCopy';
import { formatShortDate, formatStopRange } from './dateUtils';

type Props = {
  stop: PlannedStop;
  places: Place[];
};

type TabId = 'overview' | 'stay' | 'eat' | 'drink' | 'see' | 'religious';

type SubFilter = { label: string; category: PlaceCategory | 'all' };

const TABS: { id: TabId; label: string; categories: PlaceCategory[] }[] = [
  { id: 'overview', label: 'Overview', categories: [] },
  { id: 'stay', label: 'Stay', categories: ['hostel'] },
  { id: 'eat', label: 'Eat', categories: ['restaurant', 'cafe'] },
  { id: 'drink', label: 'Drink', categories: ['bar', 'club'] },
  { id: 'see', label: 'See', categories: ['landmark', 'beach'] },
  { id: 'religious', label: 'Religious', categories: ['chabad', 'kosher'] },
];

const SUB_FILTERS: Record<TabId, SubFilter[]> = {
  overview: [],
  stay: [],
  eat: [
    { label: 'All', category: 'all' },
    { label: 'Restaurants', category: 'restaurant' },
    { label: 'Cafés', category: 'cafe' },
  ],
  drink: [
    { label: 'All', category: 'all' },
    { label: 'Bars', category: 'bar' },
    { label: 'Clubs', category: 'club' },
  ],
  see: [
    { label: 'All', category: 'all' },
    { label: 'Landmarks', category: 'landmark' },
    { label: 'Beaches', category: 'beach' },
  ],
  religious: [
    { label: 'All', category: 'all' },
    { label: 'Chabad', category: 'chabad' },
    { label: 'Kosher', category: 'kosher' },
  ],
};

export function WebCityPanel({ stop, places }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [activeSub, setActiveSub] = useState<PlaceCategory | 'all'>('all');

  useEffect(() => {
    setActiveTab('overview');
    setActiveSub('all');
  }, [stop.id]);

  const activeTabDef = TABS.find((t) => t.id === activeTab)!;
  const subFilters = SUB_FILTERS[activeTab];

  return (
    <div className="flex flex-col h-full min-h-0">
      <header className="shrink-0 px-md pt-md pb-sm border-b border-cocoa-15 flex flex-col gap-xs pe-12">
        <h2 className="font-serif text-sub text-cocoa leading-tight">
          {stop.nameEn}
        </h2>
        <p className="text-small text-cocoa-55">
          {formatStopRange(stop.arrivalDate, stop.departureDate)} ·{' '}
          {stop.nights} {stop.nights === 1 ? 'night' : 'nights'}
        </p>
      </header>

      <nav className="shrink-0 px-md pt-sm border-b border-cocoa-15 flex flex-col gap-sm">
        <div className="flex gap-xs overflow-x-auto -mx-md px-md pb-xs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setActiveTab(tab.id);
                setActiveSub('all');
              }}
              className={clsx(
                'shrink-0 font-sans text-small px-sm py-xs rounded-full border transition-[background-color,border-color,color] duration-instant ease-out-quart motion-reduce:transition-none',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
                activeTab === tab.id
                  ? 'bg-cocoa text-ivory border-cocoa'
                  : 'bg-ivory text-cocoa-70 border-cocoa-15 hover:border-cocoa hover:text-cocoa',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {subFilters.length > 0 && (
          <div className="flex gap-xs overflow-x-auto -mx-md px-md pb-sm">
            {subFilters.map((sub) => (
              <button
                key={sub.category}
                type="button"
                onClick={() => setActiveSub(sub.category)}
                className={clsx(
                  'shrink-0 text-meta uppercase px-sm py-xs rounded-full border transition-[background-color,border-color,color] duration-instant ease-out-quart motion-reduce:transition-none',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
                  activeSub === sub.category
                    ? 'bg-copper text-ivory border-copper'
                    : 'bg-ivory text-cocoa-55 border-cocoa-15 hover:border-copper hover:text-copper',
                )}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="flex-1 overflow-y-auto p-md">
        {activeTab === 'overview' ? (
          <OverviewTab stop={stop} />
        ) : (
          <PlacesList
            places={filterAndSortPlaces(places, activeTabDef.categories, activeSub)}
            emptyLabel={activeTabDef.label.toLowerCase()}
          />
        )}
      </div>
    </div>
  );
}

function filterAndSortPlaces(
  places: Place[],
  tabCategories: PlaceCategory[],
  subFilter: PlaceCategory | 'all',
): Place[] {
  const inTab = places.filter((p) => tabCategories.includes(p.category));
  const filtered =
    subFilter === 'all' ? inTab : inTab.filter((p) => p.category === subFilter);
  return [...filtered].sort((a, b) => {
    const friendsDiff = b.friendsKnow - a.friendsKnow;
    if (friendsDiff !== 0) return friendsDiff;
    return b.rating - a.rating;
  });
}

function OverviewTab({ stop }: { stop: PlannedStop }) {
  const description = cityDescription(stop.id, stop.note);
  return (
    <div className="flex flex-col gap-md">
      <PhotoPlaceholders />
      {description && (
        <p className="font-sans text-body text-cocoa leading-relaxed">
          {description}
        </p>
      )}
      <WeatherSkeleton
        arrivalIso={stop.arrivalDate}
        departureIso={stop.departureDate}
      />
    </div>
  );
}

function PhotoPlaceholders() {
  return (
    <div className="grid grid-cols-3 gap-sm" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="aspect-square rounded-xl bg-gradient-to-br from-rope to-sand"
        />
      ))}
    </div>
  );
}

function WeatherSkeleton({
  arrivalIso,
  departureIso,
}: {
  arrivalIso: string;
  departureIso: string;
}) {
  const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4'];
  return (
    <div className="bg-sand border border-rope rounded-2xl p-md flex flex-col gap-sm">
      <div className="flex items-center justify-between">
        <p className="meta-caps text-cocoa-55">Forecast</p>
        <p className="text-meta uppercase text-cocoa-55 tnum">
          {formatShortDate(arrivalIso)} – {formatShortDate(departureIso)}
        </p>
      </div>
      <div className="grid grid-cols-4 gap-sm opacity-50">
        {days.map((day) => (
          <div key={day} className="flex flex-col items-center gap-xs">
            <p className="text-meta uppercase text-cocoa-30">{day}</p>
            <Cloud size={20} strokeWidth={1.5} className="text-cocoa-30" />
            <p className="font-serif text-lede text-cocoa-30 tnum">—°</p>
          </div>
        ))}
      </div>
      <p className="text-meta italic text-cocoa-55 text-center">
        Live forecast coming soon
      </p>
    </div>
  );
}

function PlacesList({
  places,
  emptyLabel,
}: {
  places: Place[];
  emptyLabel: string;
}) {
  if (places.length === 0) {
    return (
      <p className="text-small text-cocoa-55 text-center py-xl">
        No {emptyLabel} places curated yet for this stop.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-sm">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
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
    <article className="bg-sand border border-rope rounded-2xl p-sm flex flex-col gap-sm">
      <div className="flex gap-sm">
        <PlaceThumbnail src={place.imageUrl} name={place.englishName} />
        <div className="flex-1 min-w-0 flex flex-col gap-xs">
          <h4 className="font-serif text-lede text-cocoa leading-tight">
            {place.englishName}
          </h4>
          <div className="flex items-center gap-sm flex-wrap">
            <span className="inline-flex items-center gap-xs text-small text-copper">
              <Star size={12} strokeWidth={2} fill="currentColor" />
              {place.rating.toFixed(1)}
            </span>
            {place.friendsKnow > 0 && (
              <span className="inline-flex items-center gap-xs text-small text-cocoa-55">
                <Users size={12} strokeWidth={2} />
                {place.friendsKnow}
              </span>
            )}
            <span className="text-meta uppercase text-cocoa-55">
              {place.category}
            </span>
            {place.tarmilPick && (
              <span className="text-meta uppercase font-medium text-copper">
                Tarmil Pick
              </span>
            )}
          </div>
        </div>
      </div>
      <DescriptionWithMore text={place.englishDescription} />
      <div className="flex justify-end">
        <Button variant="accent" size="sm" onClick={onBook}>
          Book
        </Button>
      </div>
    </article>
  );
}

function PlaceThumbnail({ src, name }: { src?: string; name: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className="h-16 w-16 rounded-xl object-cover shrink-0"
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      className="h-16 w-16 rounded-xl shrink-0 flex items-center justify-center bg-gradient-to-br from-rope to-sand text-cocoa-55 font-serif text-sub"
    >
      {name.charAt(0)}
    </div>
  );
}

function DescriptionWithMore({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);
  if (!text) return null;
  const long = text.length > 110;
  return (
    <div className="text-small text-cocoa-70">
      <p className={expanded || !long ? '' : 'line-clamp-2'}>{text}</p>
      {long && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="text-meta uppercase text-copper mt-xs hover:underline focus-visible:outline-none focus-visible:underline"
        >
          {expanded ? 'Less' : 'More'}
        </button>
      )}
    </div>
  );
}
