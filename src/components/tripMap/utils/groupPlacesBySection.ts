import type { RioPlace, RioPlaceCategory } from '../../../data/rioPlaces';

export type PlaceSection = {
  id: string;
  labelHe: string;
  places: RioPlace[];
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
  hotels: 'הוסטלים ומלונות',
  food: 'אוכל',
  beaches: 'חופים',
  nightlife: 'חיי לילה',
  kosher: 'כשר',
  chabad: 'בית חב״ד',
  other: 'נוסף',
};

function sectionFor(c: RioPlaceCategory): (typeof SECTION_ORDER)[number] {
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
      return 'chabad';
    case 'landmark':
      return 'other';
  }
}

/** Groups curated places into the planned-stop sheet's collapsible sections. */
export function groupPlacesBySection(places: RioPlace[]): PlaceSection[] {
  const buckets: Record<(typeof SECTION_ORDER)[number], RioPlace[]> = {
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
