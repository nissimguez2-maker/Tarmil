/**
 * Place saves — the spine of the Plan tab.
 *
 * One row per (friend, place) save. The demo "self" user uses
 * `friendId: null`; friend saves carry a real friend_overlaps id. Three
 * statuses cover the full lifecycle:
 *
 *   wishlist  — starred, want to do, no commitment
 *   reserved  — booked, has dates / reservation
 *   visited   — actually went (auto-suggested after the trip ends,
 *               user confirms)
 *
 * Public to direct friends by default (private=false). Long-press the
 * star to opt-out per save.
 *
 * SEED ONLY. Runtime data lives in `place_saves`.
 */

export type PlaceSaveStatus = 'wishlist' | 'reserved' | 'visited';

export type PlaceSave = {
  id: string;
  /** null = self (the demo user). FK to friend_overlaps otherwise. */
  friendId: string | null;
  placeId: string;
  status: PlaceSaveStatus;
  /** Attached to a planned stop, or null = Saved (unsorted bucket). */
  plannedStopId: string | null;
  private: boolean;
  createdAt: string;
};
