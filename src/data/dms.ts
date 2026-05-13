/**
 * Direct message threads — one per friend persona.
 *
 * SEED ONLY. Runtime data lives in `dm_threads`.
 *
 * Each row pairs `self` (implicit) with one friend via `friend_id`. The
 * `friend_id` column has a UNIQUE constraint at the DB level so there's
 * exactly one DM thread per friend.
 *
 * `lastMessagePreviewHe` is the short string the inbox shows next to the
 * friend's name; it should match the most recent body in `dmMessages.ts`
 * (the seed script keeps them in sync). `unreadCount` > 0 marks the row
 * with a copper unread dot in the UI.
 */

export type DM = {
  id: string;
  /** FK to friend_overlaps.id (unique). */
  friendId: string;
  lastMessagePreviewHe: string;
  unreadCount: number;
};

export const dms: DM[] = [
  {
    id: 'dm-maya',
    friendId: 'maya-ipanema',
    lastMessagePreviewHe:"Locked in then, Tuesday at Posto 9. 18:00?",
    unreadCount: 1,
  },
  {
    id: 'dm-yael',
    friendId: 'yael-botafogo',
    lastMessagePreviewHe: 'Come over for a beer tonight? Door is open.',
    unreadCount: 1,
  },
  {
    id: 'dm-roi',
    friendId: 'roi-buzios',
    lastMessagePreviewHe: 'Got it. Thanks Roi.',
    unreadCount: 0,
  },
  {
    id: 'dm-shir',
    friendId: 'shir-saopaulo',
    lastMessagePreviewHe:"Confirm you're arriving the 3rd and I'll book the restaurant.",
    unreadCount: 2,
  },
  {
    id: 'dm-yotam',
    friendId: 'yotam-jericoacoara',
    lastMessagePreviewHe:"Down  I'll bring challot from my aunt's place in Fortaleza. See you on the 11th.",
    unreadCount: 0,
  },
  {
    id: 'dm-moshe',
    friendId: 'moshe-buenosaires',
    lastMessagePreviewHe: 'Address: Honduras 5450. Entry code 4837.',
    unreadCount: 1,
  },
];
