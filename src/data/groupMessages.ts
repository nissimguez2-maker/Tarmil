/**
 * Group chat messages — conversational Hebrew tied to each chat's destination.
 *
 * SEED ONLY. Runtime data lives in `group_messages`.
 *
 * `authorFriendId: null` = sent by the current user (self). Otherwise FK to
 * `friend_overlaps.id`. Messages are listed in chronological order; the
 * seed script inserts them without explicit created_at so Postgres assigns
 * sequential timestamps (close enough for demo).
 *
 * Each chat has 6–10 messages, mix of self and friend authors, ending on a
 * friend message so the chat list shows the latest sender as "not self".
 */

export type GroupMessage = {
  id: string;
  chatId: string;
  /** null = self. FK to friend_overlaps when present. */
  authorFriendId: string | null;
  body: string;
};

export const groupMessages: GroupMessage[] = [
  // chat-buzios-weekend
  {
    id: 'msg-buzios-001',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body: 'יוצא ב-29 לבוזיוס. מי בסוף השבוע איתי?',
  },
  {
    id: 'msg-buzios-002',
    chatId: 'chat-buzios-weekend',
    authorFriendId: null,
    body: 'אני שם 28–31. סגרתי הוסטל ב-Manguinhos. אתה?',
  },
  {
    id: 'msg-buzios-003',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body: 'אני בפראיה דה אזדה. נראה לי שזה רחוק חצי שעה ברגל ביניהם.',
  },
  {
    id: 'msg-buzios-004',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'maya-ipanema',
    body: 'מנסה להגיע בשבת בבוקר רק ליום. סנוקלינג + ארוחת צהריים, חוזרת לריו בלילה.',
  },
  {
    id: 'msg-buzios-005',
    chatId: 'chat-buzios-weekend',
    authorFriendId: null,
    body: 'מאיה אם תגיעי 10:00 לפראיה דה ז׳ואו פרננדס, המים שקטים שם בבוקר.',
  },
  {
    id: 'msg-buzios-006',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'maya-ipanema',
    body: 'מצוין. רועי, יש מקום למסעדה לארוחת צהריים שלושתנו?',
  },
  {
    id: 'msg-buzios-007',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body: 'Chez Michou על ה-Rua das Pedras. קלאסיקה, פתוח כל היום, שווה.',
  },

  // chat-sao-paulo-asado
  {
    id: 'msg-sao-paulo-001',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'shir-saopaulo',
    body: 'הזמנתי את ה-La Cabrera ל-21:00 בחמישי. תהיו שלושה?',
  },
  {
    id: 'msg-sao-paulo-002',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: null,
    body: 'מאשרת. אגיע ישר מהשדה, סנדל וטיסה בעיניים.',
  },
  {
    id: 'msg-sao-paulo-003',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'yael-botafogo',
    body: 'אני בא, אבל כנראה אאחר 15 דקות. תזמיני בלעדיי אם אתם רעבים.',
  },
  {
    id: 'msg-sao-paulo-004',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'shir-saopaulo',
    body: 'יעל, אין בעיה. תוקם רק כשתגיעי. הזמנתי Bife de chorizo, malbec.',
  },
  {
    id: 'msg-sao-paulo-005',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: null,
    body: 'נשמע מצוין. אחרי, יש מקום פתוח לבירה בוילה?',
  },
  {
    id: 'msg-sao-paulo-006',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'shir-saopaulo',
    body: 'Coisa Linda — בערב חמישי קל לקבל שולחן עד 23. נלך משם.',
  },

  // chat-jeri-kite
  {
    id: 'msg-jeri-001',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body: 'נחתי בפורטלזה. ג׳יפ לז׳רי יוצא מחר ב-7. מי איתי?',
  },
  {
    id: 'msg-jeri-002',
    chatId: 'chat-jeri-kite',
    authorFriendId: null,
    body: 'אני מגיע ב-10, אצטרף לג׳יפ של הצהריים. נתראה במלון.',
  },
  {
    id: 'msg-jeri-003',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'roi-buzios',
    body: 'יוצא מבוזיוס בסוף השבוע, אגיע ב-11. כבר רשום ל-Pure Kite?',
  },
  {
    id: 'msg-jeri-004',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body: 'כן, 3 ימים רצופים מ-11. יעקב המדריך עונה מהר ב-DM.',
  },
  {
    id: 'msg-jeri-005',
    chatId: 'chat-jeri-kite',
    authorFriendId: null,
    body: 'אני מתחיל, אז יום שיעור פרטי קודם. אצטרף אליכם מ-12.',
  },
  {
    id: 'msg-jeri-006',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'roi-buzios',
    body: 'מעולה. תזמין שיעור עם רננה אם תפוס — היא הכי טובה עם מתחילים.',
  },

  // chat-buenos-palermo
  {
    id: 'msg-buenos-001',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body: 'הדירה שלי בפאלרמו סוהו פתוחה לאסאדו על הגג בשישי 20. תגיעו?',
  },
  {
    id: 'msg-buenos-002',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'yael-botafogo',
    body: 'נוחתת ב-18. אגיע. אביא יין?',
  },
  {
    id: 'msg-buenos-003',
    chatId: 'chat-buenos-palermo',
    authorFriendId: null,
    body: 'גם אני שם. משה, מה אתה צריך — בשר, פחם, יין?',
  },
  {
    id: 'msg-buenos-004',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body: 'יש לי בשר וגזר על הגריל. תביאו malbec ולחמים מ-Salvaje.',
  },
  {
    id: 'msg-buenos-005',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'yael-botafogo',
    body: 'סגור. אקח גם משהו מתוק לקינוח.',
  },
  {
    id: 'msg-buenos-006',
    chatId: 'chat-buenos-palermo',
    authorFriendId: null,
    body: 'אני אביא malbec טוב. כתובת בDM?',
  },
  {
    id: 'msg-buenos-007',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body: 'שולח את הכתובת והקוד בפרטי.',
  },
];
