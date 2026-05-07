import type { Place, PlaceCategory } from '../../../data/places';

export function categoryLabel(c: Place['category']): string {
  switch (c) {
    case 'beach':
      return 'חוף';
    case 'hostel':
      return 'הוסטל';
    case 'cafe':
      return 'קפה';
    case 'restaurant':
      return 'מסעדה';
    case 'bar':
      return 'בר';
    case 'club':
      return 'מועדון';
    case 'chabad':
      return 'חב״ד';
    case 'kosher':
      return 'כשר';
    case 'landmark':
      return 'נקודת ציון';
  }
}

export type FilterId =
  | 'hostels'
  | 'food'
  | 'beaches'
  | 'nightlife'
  | 'kosher'
  | 'chabad'
  | 'picks'
  | 'friends';

const FILTER_TO_CATEGORIES: Record<
  Exclude<FilterId, 'picks' | 'friends'>,
  PlaceCategory[]
> = {
  hostels: ['hostel'],
  food: ['restaurant', 'cafe'],
  beaches: ['beach'],
  nightlife: ['bar', 'club'],
  kosher: ['kosher'],
  chabad: ['chabad'],
};

export function filterLabel(id: FilterId): string {
  switch (id) {
    case 'hostels':
      return 'הוסטלים';
    case 'food':
      return 'אוכל';
    case 'beaches':
      return 'חופים';
    case 'nightlife':
      return 'חיי לילה';
    case 'kosher':
      return 'כשר';
    case 'chabad':
      return 'חב״ד';
    case 'picks':
      return 'בחירות תרמיל';
    case 'friends':
      return 'חברים מכירים';
  }
}

/** A place passes when ANY active filter matches it. Empty set = nothing matches. */
export function placeMatchesFilters(
  place: { category: PlaceCategory; tarmilPick?: boolean; friendsKnow: number },
  active: Set<FilterId>,
): boolean {
  for (const id of active) {
    if (id === 'picks') {
      if (place.tarmilPick) return true;
      continue;
    }
    if (id === 'friends') {
      if (place.friendsKnow > 0) return true;
      continue;
    }
    const cats = FILTER_TO_CATEGORIES[id];
    if (cats.includes(place.category)) return true;
  }
  return false;
}

export const ALL_FILTERS: FilterId[] = [
  'hostels',
  'food',
  'beaches',
  'nightlife',
  'picks',
  'friends',
  'kosher',
  'chabad',
];

/** Default-active filter set on cold load — kosher and chabad excluded. */
export const DEFAULT_ACTIVE_FILTERS: ReadonlySet<FilterId> = new Set<FilterId>([
  'hostels',
  'food',
  'beaches',
  'nightlife',
  'picks',
  'friends',
]);
