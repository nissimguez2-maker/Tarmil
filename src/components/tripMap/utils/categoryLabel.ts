import type { Place, PlaceCategory } from '../../../data/places';

export function categoryLabel(c: Place['category']): string {
  switch (c) {
    case 'beach':
      return 'Beach';
    case 'hostel':
      return 'Hostel';
    case 'cafe':
      return 'Café';
    case 'restaurant':
      return 'Restaurant';
    case 'bar':
      return 'Bar';
    case 'club':
      return 'Club';
    case 'chabad':
      return 'Chabad';
    case 'kosher':
      return 'Kosher';
    case 'landmark':
      return 'Landmark';
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
      return 'Hostels';
    case 'food':
      return 'Food';
    case 'beaches':
      return 'Beaches';
    case 'nightlife':
      return 'Nightlife';
    case 'kosher':
      return 'Kosher';
    case 'chabad':
      return 'Chabad';
    case 'picks':
      return 'Tarmil picks';
    case 'friends':
      return 'Friends know';
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
