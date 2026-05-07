/**
 * The user's declared future route — an ordered list of cities/regions with
 * exact dates. Polarsteps-style planning grafted onto Tarmil's city-level
 * privacy model: planned stops are the user's private intent, but friends'
 * matching declarations surface as future overlaps with exact dates.
 *
 * SEED ONLY for the array below. Runtime data is read from the
 * `planned_stops` table in Supabase via SupabaseDataProvider, and mutated by
 * the hook's saveStop / removeStop / savePlaceToStop / resetDemo. The
 * `reset_demo_state()` SQL function (see migration 0002) restores the same
 * 4-stop seed below. Keep them in sync if you edit either side.
 */

export type PlannedStopPrivacy = 'private' | 'friends' | 'hidden';

export type PlannedStop = {
  id: string;
  nameHe: string;
  nameEn: string;
  type: 'city' | 'region';
  lat: number;
  lng: number;
  /** ISO yyyy-mm-dd. */
  arrivalDate: string;
  /** ISO yyyy-mm-dd. */
  departureDate: string;
  nights: number;
  privacy: PlannedStopPrivacy;
  note?: string;
  /** Cross-references entries in friendOverlaps. */
  friendOverlapIds?: string[];
  /** Place ids the user has saved to this destination. */
  savedPlaceIds?: string[];
};

/**
 * Demo route — Israeli backpacker narrative: Rio (currently) → Búzios coast
 * weekend → São Paulo → Jericoacoara → Buenos Aires.
 */
export const plannedStops: PlannedStop[] = [
  {
    id: 'buzios',
    nameHe: 'בוזיוס',
    nameEn: 'Búzios',
    type: 'city',
    lat: -22.747,
    lng: -41.881,
    arrivalDate: '2026-10-28',
    departureDate: '2026-10-31',
    nights: 3,
    privacy: 'friends',
    note: 'שלושה ימי ים אחרי ריו, לפני סאו פאולו.',
    friendOverlapIds: ['roi-buzios'],
  },
  {
    id: 'sao-paulo',
    nameHe: 'סאו פאולו',
    nameEn: 'São Paulo',
    type: 'city',
    lat: -23.5505,
    lng: -46.6333,
    arrivalDate: '2026-11-01',
    departureDate: '2026-11-06',
    nights: 5,
    privacy: 'friends',
    note: 'וילה מדלנה, פאוליסטה, אסאדו ובאר ראשון בלילה.',
    friendOverlapIds: ['shir-saopaulo'],
  },
  {
    id: 'jericoacoara',
    nameHe: 'ז׳ריקואקוארה',
    nameEn: 'Jericoacoara',
    type: 'city',
    lat: -2.7959,
    lng: -40.5125,
    arrivalDate: '2026-11-08',
    departureDate: '2026-11-14',
    nights: 6,
    privacy: 'friends',
    note: 'דיונות, קייטסרף ובוקרים יחפים.',
    friendOverlapIds: ['yotam-jericoacoara'],
  },
  {
    id: 'buenos-aires',
    nameHe: 'בואנוס איירס',
    nameEn: 'Buenos Aires',
    type: 'city',
    lat: -34.6037,
    lng: -58.3816,
    arrivalDate: '2026-11-16',
    departureDate: '2026-11-25',
    nights: 9,
    privacy: 'friends',
    note: 'פאלרמו, סן תלמו, טנגו ואסאדו עד חצות.',
    friendOverlapIds: ['tom-buenosaires'],
  },
];
