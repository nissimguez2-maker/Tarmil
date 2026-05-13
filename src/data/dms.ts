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
    lastMessagePreviewHe: 'אז סגרנו, יום שלישי בפוסטו 9. 18:00?',
    unreadCount: 1,
  },
  {
    id: 'dm-yael',
    friendId: 'yael-botafogo',
    lastMessagePreviewHe: 'בא אליי לבירה הערב? פתחתי דלת.',
    unreadCount: 1,
  },
  {
    id: 'dm-roi',
    friendId: 'roi-buzios',
    lastMessagePreviewHe: 'קיבלתי. תודה רועי.',
    unreadCount: 0,
  },
  {
    id: 'dm-shir',
    friendId: 'shir-saopaulo',
    lastMessagePreviewHe: 'תאשרי לי שמגיעה ב-3, אזמין למסעדה.',
    unreadCount: 2,
  },
  {
    id: 'dm-yotam',
    friendId: 'yotam-jericoacoara',
    lastMessagePreviewHe: 'בעיניי 🙏 אביא חלות מבית של דודה שלי בפורטלזה. נראה אותך ב־11.',
    unreadCount: 0,
  },
  {
    id: 'dm-moshe',
    friendId: 'moshe-buenosaires',
    lastMessagePreviewHe: 'הכתובת: Honduras 5450. קוד בכניסה 4837.',
    unreadCount: 1,
  },
];
