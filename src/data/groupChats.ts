/**
 * Group chats — small trip crews around each LATAM destination.
 *
 * SEED ONLY. Runtime data lives in `group_chats` + `group_chat_members`.
 *
 * Membership rows reference friend_overlaps; the current user ("self") is
 * implicit and is not a row in group_chat_members. The UI renders the user
 * as a member of every chat in the seed.
 *
 * Each chat is anchored to one of the 4 planned stops so the demo flow
 * "Trip detail → suggested group chat" feels coherent.
 */

export type GroupChat = {
  id: string;
  nameHe: string;
  /** Short city tag shown under the name. */
  cityLabel?: string;
  /** Matches places.destination_id. */
  destinationId?: string;
};

export type GroupChatMember = {
  chatId: string;
  /** FK to friend_overlaps.id. Self is implicit (not in this table). */
  friendId: string;
};

export const groupChats: GroupChat[] = [
  {
    id: 'chat-buzios-weekend',
    nameHe: 'בוזיוס סופ״ש',
    cityLabel: 'בוזיוס · 29–31.10',
    destinationId: 'buzios',
  },
  {
    id: 'chat-sao-paulo-asado',
    nameHe: 'סאו פאולו אסאדו 11/26',
    cityLabel: 'סאו פאולו · 03–05.11',
    destinationId: 'sao-paulo',
  },
  {
    id: 'chat-jeri-kite',
    nameHe: 'ז׳רי קייטסרף קרו',
    cityLabel: 'ז׳ריקואקוארה · 10–13.11',
    destinationId: 'jericoacoara',
  },
  {
    id: 'chat-buenos-palermo',
    nameHe: 'בואנוס פאלרמו',
    cityLabel: 'בואנוס איירס · נובמבר',
    destinationId: 'buenos-aires',
  },
];

export const groupChatMembers: GroupChatMember[] = [
  // chat-buzios-weekend: Roi (going) + Maya (visiting from Rio)
  { chatId: 'chat-buzios-weekend', friendId: 'roi-buzios' },
  { chatId: 'chat-buzios-weekend', friendId: 'maya-ipanema' },

  // chat-sao-paulo-asado: Shir (going) + Yael (joining from Rio)
  { chatId: 'chat-sao-paulo-asado', friendId: 'shir-saopaulo' },
  { chatId: 'chat-sao-paulo-asado', friendId: 'yael-botafogo' },

  // chat-jeri-kite: Yotam (going) + Roi (kitesurfer)
  { chatId: 'chat-jeri-kite', friendId: 'yotam-jericoacoara' },
  { chatId: 'chat-jeri-kite', friendId: 'roi-buzios' },

  // chat-buenos-palermo: Tom (in BA) + Yael (visiting)
  { chatId: 'chat-buenos-palermo', friendId: 'moshe-buenosaires' },
  { chatId: 'chat-buenos-palermo', friendId: 'yael-botafogo' },
];
