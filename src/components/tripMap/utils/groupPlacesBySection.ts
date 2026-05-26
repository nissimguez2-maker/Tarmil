import type { Place, PlaceCategory } from '../../../data/places';

export type PlaceSection = {
  id: string;
  labelHe: string;
  places: Place[];
};

const SECTION_ORDER = [
  'hotels',
  'food',
  'beaches',
  'nightlife',
  'kosher',
  'chabad',
  'other',
] as const;

const SECTION_LABELS: Record<(typeof SECTION_ORDER)[number], string> = {
  hotels: 'Hostels & hotels',
  food: 'Food',
  beaches: 'Beaches',
  nightlife: 'Nightlife',
  kosher: 'Kosher',
  chabad: 'Chabad & community',
  other: 'More',
};

function sectionFor(c: PlaceCategory): (typeof SECTION_ORDER)[number] {
  switch (c) {
    case 'hostel':
      return 'hotels';
    case 'restaurant':
    case 'cafe':
      return 'food';
    case 'bar':
    case 'club':
      return 'nightlife';
    case 'beach':
      return 'beaches';
    case 'kosher':
      return 'kosher';
    case 'chabad':
    case 'synagogue':
    case 'mikveh':
      return 'chabad';
    case 'landmark':
      return 'other';
  }
}

/** Groups curated places into the planned-stop sheet's collapsible sections. */
export function groupPlacesBySection(places: Place[]): PlaceSection[] {
  const buckets: Record<(typeof SECTION_ORDER)[number], Place[]> = {
    hotels: [],
    food: [],
    beaches: [],
    nightlife: [],
    kosher: [],
    chabad: [],
    other: [],
  };
  places.forEach((p) => {
    buckets[sectionFor(p.category)].push(p);
  });
  return SECTION_ORDER.filter((id) => buckets[id].length > 0).map((id) => ({
    id,
    labelHe: SECTION_LABELS[id],
    places: buckets[id],
  }));
}
