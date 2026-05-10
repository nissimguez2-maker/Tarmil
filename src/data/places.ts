/**
 * Place — a curated venue (beach, hostel, café, bar, etc.) anchored to one
 * destination (city or region). Mirrors the `places` table in Supabase.
 *
 * Every place belongs to exactly one destination. Today's destinations are
 * `rio-de-janeiro`, `sao-paulo`, `buenos-aires`, `jericoacoara`, `buzios`.
 * `destination_id` matches `planned_stops.id` for cities the user plans to
 * visit; for the user's *current* city (Rio) it's a free-standing string.
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

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/**
 * One friend's past visit to this place, displayed at season+year+duration
 * resolution per the privacy posture (never specific dates).
 */
export type FriendVisit = {
  friendInitial: string;
  friendName: string;
  season: Season;
  year: number;
  /** Hebrew duration label, e.g. "שבועיים", "סוף שבוע". Rendered verbatim. */
  durationLabel: string;
};

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
  /** Tarmil community rating, 1–5. */
  rating: number;
  /** Friends of the user who've been here. */
  friendsKnow: number;
  /** Hand-picked Tarmil recommendation badge. */
  tarmilPick?: boolean;
  /** Friends' past visits, season+year+duration only. Default empty. */
  friendVisits?: FriendVisit[];
};
