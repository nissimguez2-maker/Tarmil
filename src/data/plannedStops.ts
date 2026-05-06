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
