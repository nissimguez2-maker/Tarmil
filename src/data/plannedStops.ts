/**
 * The user's declared future route — an ordered list of cities/regions with
 * exact dates. Polarsteps-style planning grafted onto Tarmil's city-level
 * privacy model: planned stops are the user's private intent, but friends'
 * matching declarations surface as future overlaps with exact dates.
 */

import { friendOverlaps, type FriendOverlap } from './myTrip';
import { globalPlaces, type GlobalPlace } from './globalPlaces';

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
 * Demo route — Israeli backpacker narrative: Rio (currently) → quick Búzios
 * stop → Bangkok → Chiang Mai → Pai → Hanoi.
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
    note: 'שלושה ימי ים אחרי ריו, לפני אסיה.',
    friendOverlapIds: ['roi-buzios'],
  },
  {
    id: 'bangkok',
    nameHe: 'בנגקוק',
    nameEn: 'Bangkok',
    type: 'city',
    lat: 13.7563,
    lng: 100.5018,
    arrivalDate: '2026-11-04',
    departureDate: '2026-11-07',
    nights: 3,
    privacy: 'friends',
    savedPlaceIds: [],
  },
  {
    id: 'chiang-mai',
    nameHe: 'צ׳אנג מאי',
    nameEn: 'Chiang Mai',
    type: 'city',
    lat: 18.7883,
    lng: 98.9853,
    arrivalDate: '2026-11-07',
    departureDate: '2026-11-12',
    nights: 5,
    privacy: 'friends',
    friendOverlapIds: ['noa-chiangmai'],
  },
  {
    id: 'pai',
    nameHe: 'פאי',
    nameEn: 'Pai',
    type: 'city',
    lat: 19.3585,
    lng: 98.4439,
    arrivalDate: '2026-11-12',
    departureDate: '2026-11-16',
    nights: 4,
    privacy: 'friends',
  },
  {
    id: 'hanoi',
    nameHe: 'האנוי',
    nameEn: 'Hanoi',
    type: 'city',
    lat: 21.0285,
    lng: 105.8542,
    arrivalDate: '2026-11-20',
    departureDate: '2026-11-28',
    nights: 8,
    privacy: 'friends',
    friendOverlapIds: ['david-hanoi'],
  },
];

export function getPlannedStopById(id: string): PlannedStop | undefined {
  return plannedStops.find((stop) => stop.id === id);
}

export function getPlacesForStop(stop: PlannedStop): GlobalPlace[] {
  return globalPlaces.filter((p) => p.destinationId === stop.id);
}

export function getFriendOverlapsForStop(stop: PlannedStop): FriendOverlap[] {
  if (!stop.friendOverlapIds || stop.friendOverlapIds.length === 0) return [];
  const ids = new Set(stop.friendOverlapIds);
  return friendOverlaps.filter((f) => ids.has(f.id));
}
