/**
 * Friend 1–5 star reviews for places — Around-me's social signal.
 *
 * SEED ONLY. Runtime data lives in the `place_reviews` table in Supabase
 * (`SupabaseDataProvider.placeReviews`). One row per (place, reviewer).
 * The demo user's own review is stored with `reviewerFriendId = null` —
 * the seed below only writes friend reviews.
 *
 * No text bodies, only star ratings — by design.
 */

export type PlaceReview = {
  placeId: string;
  /** null = demo user (the person looking at the screen). */
  reviewerFriendId: string | null;
  /** Integer 1–5. */
  rating: number;
};
