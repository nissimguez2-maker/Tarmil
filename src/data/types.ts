/**
 * Shared types for the trip data layer. These shapes are the canonical
 * runtime representation — same as the rows fetched from Supabase
 * (`places`, `friend_overlaps`, `trip_waypoints`), already mapped from
 * snake_case to camelCase by SupabaseStaticDataProvider.
 *
 * Also re-exported for legacy paths (RioPlace / GlobalPlace / RioPlaceCategory)
 * so existing imports keep working without a sweeping rename. Both names
 * point to the same `Place` type now that all places share one table.
 */

export type PlaceCategory =
  | 'beach'
  | 'hostel'
  | 'cafe'
  | 'restaurant'
  | 'bar'
  | 'club'
  | 'chabad'
  | 'kosher'
  | 'landmark';

export type Place = {
  id: string;
  destinationId: string;
  hebrewName: string;
  englishName: string;
  category: PlaceCategory;
  lat: number;
  lng: number;
  hebrewDescription: string;
  englishDescription: string;
  rating: number;
  friendsKnow: number;
  tarmilPick?: boolean;
};

// Aliases so existing imports keep compiling.
export type RioPlaceCategory = PlaceCategory;
export type RioPlace = Place;
export type GlobalPlace = Place;

export type LatLng = [number, number];

export type FriendOverlap = {
  id: string;
  friendName: string;
  friendInitial: string;
  photoUrl: string;
  lat: number;
  lng: number;
  zoneLabel: string;
  status: 'present' | 'future';
  detail: string;
  destinationId?: string;
  overlapStart?: string;
  overlapEnd?: string;
};
