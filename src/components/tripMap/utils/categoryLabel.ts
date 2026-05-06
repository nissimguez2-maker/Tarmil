import type { RioPlace, RioPlaceCategory } from '../../../data/rioPlaces';

export function categoryLabel(c: RioPlace['category']): string {
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
  RioPlaceCategory[]
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

/** Category chips (hostels/food/etc) — visibility is OR'd among these. */
export const CATEGORY_FILTER_IDS: Array<Exclude<FilterId, 'picks' | 'friends'>> = [
  'hostels',
  'food',
  'beaches',
  'nightlife',
  'kosher',
  'chabad',
];

/**
 * A place passes when:
 *  - It's a landmark (always visible — sights aren't category-tagged), OR its
 *    category matches at least one active category chip,
 *  - AND if "picks" is active, the place is a Tarmil Pick,
 *  - AND if "friends" is active, the place has friendsKnow > 0.
 */
export function placeMatchesFilters(
  place: { category: RioPlaceCategory; tarmilPick?: boolean; friendsKnow: number },
  active: Set<FilterId>,
): boolean {
  if (place.category !== 'landmark') {
    let matchesCategory = false;
    for (const cat of CATEGORY_FILTER_IDS) {
      if (!active.has(cat)) continue;
      if (FILTER_TO_CATEGORIES[cat].includes(place.category)) {
        matchesCategory = true;
        break;
      }
    }
    if (!matchesCategory) return false;
  }

  if (active.has('picks') && !place.tarmilPick) return false;
  if (active.has('friends') && place.friendsKnow === 0) return false;

  return true;
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

/** Default-active filter set on cold load — kosher and chabad off; modifiers off. */
export const DEFAULT_ACTIVE_FILTERS: ReadonlySet<FilterId> = new Set<FilterId>([
  'hostels',
  'food',
  'beaches',
  'nightlife',
]);
