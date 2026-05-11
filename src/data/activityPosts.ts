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

export type ActivityPost = {
  id: string;
  kind: ActivityPostKind;
  /** null = system-generated (overlap_notification). FK otherwise. */
  authorFriendId: string | null;
  destinationId?: string;
  bodyHe: string;
  /** Kind-specific extras. See JSDoc for shape per kind. */
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
    bodyHe: 'רועי יהיה בבוזיוס בזמן שלך · התחפפו 3 ימים',
    payload: { overlapDays: 3, dateLabel: '29–31.10', friendId: 'roi-buzios' },
    replyCount: 0,
  },
  {
    id: 'act-overlap-shir-saopaulo',
    kind: 'overlap_notification',
    authorFriendId: 'shir-saopaulo',
    destinationId: 'sao-paulo',
    bodyHe: 'שיר תהיה בסאו פאולו בזמן שלך · התחפפו 3 ימים',
    payload: { overlapDays: 3, dateLabel: '03–05.11', friendId: 'shir-saopaulo' },
    replyCount: 0,
  },
  {
    id: 'act-overlap-yotam-jeri',
    kind: 'overlap_notification',
    authorFriendId: 'yotam-jericoacoara',
    destinationId: 'jericoacoara',
    bodyHe: 'יותם יהיה בז׳ריקואקוארה בזמן שלך · התחפפו 4 ימים',
    payload: { overlapDays: 4, dateLabel: '10–13.11', friendId: 'yotam-jericoacoara' },
    replyCount: 0,
  },

  // Trip declarations
  {
    id: 'act-decl-roi-buzios',
    kind: 'trip_declaration',
    authorFriendId: 'roi-buzios',
    destinationId: 'buzios',
    bodyHe: 'רועי הכריז על טיול חדש · בוזיוס · אוקטובר 2026',
    payload: {
      season: 'autumn',
      year: 2026,
      durationLabel: '3 לילות',
      routeThumbnailKey: 'buzios-coast',
    },
    replyCount: 1,
  },
  {
    id: 'act-decl-shir-saopaulo',
    kind: 'trip_declaration',
    authorFriendId: 'shir-saopaulo',
    destinationId: 'sao-paulo',
    bodyHe: 'שיר הכריזה על טיול חדש · סאו פאולו · נובמבר 2026',
    payload: {
      season: 'spring',
      year: 2026,
      durationLabel: 'סופ״ש ארוך',
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
    bodyHe: 'מי בא לאסאדו על הגג שלי בפאלרמו ב-20 בערב? יש בשר, יש יין, יש מקום.',
    payload: { dateLabel: '20.11 · 20:00', placeHe: 'פאלרמו סוהו' },
    replyCount: 4,
  },
  {
    id: 'act-whosdown-jeri-kite',
    kind: 'whos_down',
    authorFriendId: 'yotam-jericoacoara',
    destinationId: 'jericoacoara',
    bodyHe: 'חבר׳ה לקייטסרף בז׳רי בין 10–14 לנובמבר? שלושה ימי שיעורים יחד, יוצא יותר זול.',
    payload: { dateLabel: '10–14.11' },
    replyCount: 3,
  },
  {
    id: 'act-whosdown-patagonia',
    kind: 'whos_down',
    authorFriendId: 'roi-buzios',
    destinationId: null,
    bodyHe: 'טיול דרום פטגוניה — מי בעניין דצמבר? חושב על שבועיים, ארקעדה ועד קלפטה.',
    payload: { dateLabel: 'דצמבר 2026' },
    replyCount: 2,
  },
];
