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
 *    carry destinationId + dateLabel. Optional `poll` lives in its own
 *    column (jsonb).
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
  /** Kind-specific extras. See JSDoc for shape per kind. May carry
   * `parent_id` for replies (flat one-level threading until a dedicated
   * replies table lands). Polls now live in a sibling `poll` column.
   */
  payload: Record<string, unknown>;
  replyCount: number;
};

export const activityPosts: ActivityPost[] = [
  // Overlap notifications — most demo-impactful, surface near the top.
  {
    id: 'act-overlap-roi-buzios',
    kind: 'overlap_notification',
    authorFriendId: 'roi-buzios',
    destinationId: 'buzios',
    bodyHe: 'Roi will be in Búzios when you are · 3 nights overlap',
    payload: { overlapDays: 3, dateLabel: 'Oct 29–31', friendId: 'roi-buzios' },
    replyCount: 0,
  },
  {
    id: 'act-overlap-shir-saopaulo',
    kind: 'overlap_notification',
    authorFriendId: 'shir-saopaulo',
    destinationId: 'sao-paulo',
    bodyHe: 'Shir will be in São Paulo when you are · 3 nights overlap',
    payload: { overlapDays: 3, dateLabel: 'Nov 3–5', friendId: 'shir-saopaulo' },
    replyCount: 0,
  },
  {
    id: 'act-overlap-yotam-jeri',
    kind: 'overlap_notification',
    authorFriendId: 'yotam-jericoacoara',
    destinationId: 'jericoacoara',
    bodyHe: 'Yotam will be in Jericoacoara when you are · 4 nights overlap',
    payload: { overlapDays: 4, dateLabel: 'Nov 10–13', friendId: 'yotam-jericoacoara' },
    replyCount: 0,
  },

  // Trip declarations — short, human, drop the "new trip" filler.
  {
    id: 'act-decl-roi-buzios',
    kind: 'trip_declaration',
    authorFriendId: 'roi-buzios',
    destinationId: 'buzios',
    bodyHe: 'Roi declared a trip · Búzios · 3 nights end of October',
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
    bodyHe: 'Shir declared a trip · São Paulo · long weekend in November',
    payload: {
      season: 'spring',
      year: 2026,
      durationLabel: 'Long weekend',
      routeThumbnailKey: 'sao-paulo-vila-madalena',
    },
    replyCount: 2,
  },

  // Who's-down invites — concise, decision-flavored, real people talking.
  {
    id: 'act-whosdown-asado',
    kind: 'whos_down',
    authorFriendId: 'moshe-buenosaires',
    destinationId: 'buenos-aires',
    bodyHe:
      'Hosting an asado at my place in Palermo, Friday 8pm. Bring wine if you can. Reply by Thursday.',
    payload: { dateLabel: 'Fri Nov 20 · 8pm', placeHe: 'Palermo Soho' },
    replyCount: 4,
  },
  {
    id: 'act-whosdown-buzios-party',
    kind: 'whos_down',
    authorFriendId: 'roi-buzios',
    destinationId: 'buzios',
    bodyHe:
      'Throwing a small party in Búzios end of October. Trying to land on a night that works for most.',
    payload: { dateLabel: 'End of October', placeHe: 'Búzios' },
    replyCount: 3,
  },
  {
    id: 'act-whosdown-jeri-kite',
    kind: 'whos_down',
    authorFriendId: 'yotam-jericoacoara',
    destinationId: 'jericoacoara',
    bodyHe:
      'Splitting a kitesurf course in Jeri, Nov 10–14. Cheaper for 3 — anyone in?',
    payload: { dateLabel: 'Nov 10–14' },
    replyCount: 3,
  },
  {
    id: 'act-whosdown-patagonia',
    kind: 'whos_down',
    authorFriendId: 'roi-buzios',
    bodyHe:
      'Patagonia mid-December for two weeks. Calafate → Chaltén → maybe Puerto Natales. Who is in?',
    payload: { dateLabel: 'Mid-December' },
    replyCount: 2,
  },
];
