/**
 * Activity feed posts — three kinds shown on the Activity tab.
 *
 * SEED ONLY. Runtime data lives in `activity_posts`.
 *
 * Kinds:
 *  - `trip_declaration`: a friend announces a new trip. `payload` carries
 *    season/year/durationLabel + an optional `routeThumbnailKey` the UI
 *    can use to look up a thumbnail.
 *  - `whos_down`: open invitation ("who wants to join me?"). `payload` may
 *    carry destinationId + dateLabel.
 *  - `overlap_notification`: system-generated when a friend's plan overlaps
 *    the user's. `authorFriendId` is the OTHER friend; the user is the
 *    receiver. `payload.overlapDays` is the count of days that match.
 *  - `place_review`: friend posts a review of a place. `payload.placeId`
 *    references the places table.
 *
 * Order in array is newest-first (the UI reverses created_at desc anyway,
 * but keeping it readable here helps).
 */

export type ActivityPostKind =
  | 'trip_declaration'
  | 'whos_down'
  | 'overlap_notification'
  | 'place_review';

export type PollOption = {
  text: string;
  voteCount: number;
};

export type Poll = {
  question: string;
  options: PollOption[];
  multipleChoice: boolean;
  /** Map of friendId (or 'self') → indices the actor has voted for. */
  votes?: Record<string, number[]>;
};

export type ActivityPost = {
  id: string;
  kind: ActivityPostKind;
  /** null = system-generated (overlap_notification). FK otherwise. */
  authorFriendId: string | null;
  destinationId?: string;
  bodyHe: string;
  /** Kind-specific extras. See JSDoc for shape per kind. May carry an
   * optional `poll` object today (chunk 4 promotes this to a first-class
   * column on activity_posts). May also carry `parent_id` for replies,
   * which is how flat one-level threading is modelled until a dedicated
   * replies table lands.
   */
  payload: Record<string, unknown>;
  replyCount: number;
};

export const activityPosts: ActivityPost[] = [
  // Overlap notifications — most demo-impactful, surface near the top
  {
    id: 'act-overlap-roi-buzios',
    kind: 'overlap_notification',
    authorFriendId: 'roi-buzios',
    destinationId: 'buzios',
    bodyHe: "Roi will be in Búzios at the same time as you · 3-day overlap",
    payload: { overlapDays: 3, dateLabel: 'Oct 29–31', friendId: 'roi-buzios' },
    replyCount: 0,
  },
  {
    id: 'act-overlap-shir-saopaulo',
    kind: 'overlap_notification',
    authorFriendId: 'shir-saopaulo',
    destinationId: 'sao-paulo',
    bodyHe: "Shir will be in São Paulo at the same time as you · 3-day overlap",
    payload: { overlapDays: 3, dateLabel: 'Nov 3–5', friendId: 'shir-saopaulo' },
    replyCount: 0,
  },
  {
    id: 'act-overlap-yotam-jeri',
    kind: 'overlap_notification',
    authorFriendId: 'yotam-jericoacoara',
    destinationId: 'jericoacoara',
    bodyHe: "Yotam will be in Jericoacoara at the same time as you · 4-day overlap",
    payload: { overlapDays: 4, dateLabel: 'Nov 10–13', friendId: 'yotam-jericoacoara' },
    replyCount: 0,
  },

  // Trip declarations
  {
    id: 'act-decl-roi-buzios',
    kind: 'trip_declaration',
    authorFriendId: 'roi-buzios',
    destinationId: 'buzios',
    bodyHe: 'Roi declared a new trip · Búzios · October 2026',
    payload: {
      season: 'autumn',
      year: 2026,
      durationLabel: '3 nights',
      routeThumbnailKey: 'buzios-coast',
    },
    replyCount: 1,
  },
  {
    id: 'act-decl-shir-saopaulo',
    kind: 'trip_declaration',
    authorFriendId: 'shir-saopaulo',
    destinationId: 'sao-paulo',
    bodyHe: 'Shir declared a new trip · São Paulo · November 2026',
    payload: {
      season: 'spring',
      year: 2026,
      durationLabel: 'Long weekend',
      routeThumbnailKey: 'sao-paulo-vila-madalena',
    },
    replyCount: 2,
  },

  // Who's-down invites
  {
    id: 'act-whosdown-asado',
    kind: 'whos_down',
    authorFriendId: 'moshe-buenosaires',
    destinationId: 'buenos-aires',
    bodyHe: "Who's down for the rooftop asado at my place in Palermo on the 20th, 8pm? Meat, wine, room for everyone.",
    payload: { dateLabel: 'Nov 20 · 8pm', placeHe: 'Palermo Soho' },
    replyCount: 4,
  },
  {
    id: 'act-whosdown-jeri-kite',
    kind: 'whos_down',
    authorFriendId: 'yotam-jericoacoara',
    destinationId: 'jericoacoara',
    bodyHe: "Anyone want to kitesurf in Jeri Nov 10–14? Three days of lessons together, comes out cheaper.",
    payload: { dateLabel: 'Nov 10–14' },
    replyCount: 3,
  },
  {
    id: 'act-whosdown-patagonia',
    kind: 'whos_down',
    authorFriendId: 'roi-buzios',
    bodyHe: "Southern Patagonia trip — who's in for December? Thinking two weeks, El Calafate to El Chaltén.",
    payload: { dateLabel: 'December 2026' },
    replyCount: 2,
  },
];
