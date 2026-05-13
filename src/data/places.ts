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
  /** Duration label, e.g. "two weeks", "a weekend". Rendered verbatim. */
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
  /** Public phone number for direct contact. Optional. */
  phone?: string;
  /** Reservation / contact URL — `tel:`, `https://wa.me/...`, or external link. */
  reservationUrl?: string;
  /** Hero image (CDN URL). Falls back to a warm-sand gradient on the card. */
  imageUrl?: string;
  /**
   * v0.3 paid-placement flag — true for curated businesses surfaced in the
   * Around me tab. Existing seed places stay false; only the new business
   * directory entries opt in.
   */
  paidPlacement?: boolean;
};
