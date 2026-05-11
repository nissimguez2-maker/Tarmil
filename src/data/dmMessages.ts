/**
 * Direct messages — chronological per DM thread.
 *
 * SEED ONLY. Runtime data lives in `dm_messages`.
 *
 * `fromFriend: true` = sent by the friend, `false` = sent by the current
 * user. Each thread has 5–8 messages. The LAST message in each thread
 * matches the `lastMessagePreviewHe` in `dms.ts`.
 *
 * Threads ending on a friend message (fromFriend: true) keep an unread
 * indicator on the inbox row.
 */

export type DMMessage = {
  id: string;
  dmThreadId: string;
  fromFriend: boolean;
  body: string;
};

export const dmMessages: DMMessage[] = [
  // dm-maya — meet at Posto 9 (ends on friend message → unread)
  { id: 'dm-maya-001', dmThreadId: 'dm-maya', fromFriend: true, body: 'היי, רואה אותך באיפנמה?' },
  { id: 'dm-maya-002', dmThreadId: 'dm-maya', fromFriend: false, body: 'כן, בקופה. רוצה לקפוץ לפוסטו?' },
  { id: 'dm-maya-003', dmThreadId: 'dm-maya', fromFriend: true, body: 'בהחלט. שלישי או רביעי טובים לי.' },
  { id: 'dm-maya-004', dmThreadId: 'dm-maya', fromFriend: false, body: 'שלישי 18:00. נקודת מפגש פוסטו 9, השני מהקצה.' },
  { id: 'dm-maya-005', dmThreadId: 'dm-maya', fromFriend: true, body: 'אז סגרנו, יום שלישי בפוסטו 9. 18:00?' },

  // dm-yael — bar invite (ends on friend message → unread)
  { id: 'dm-yael-001', dmThreadId: 'dm-yael', fromFriend: false, body: 'איך הולך בבוטפוגו?' },
  { id: 'dm-yael-002', dmThreadId: 'dm-yael', fromFriend: true, body: 'יושבת על המרפסת, עיניים על הים. אבא של החבר שלי כאן, נורא מצחיק.' },
  { id: 'dm-yael-003', dmThreadId: 'dm-yael', fromFriend: false, body: 'תפתחי דלת בלילה לבירה?' },
  { id: 'dm-yael-004', dmThreadId: 'dm-yael', fromFriend: true, body: 'תמיד. אני בבית מ-20.' },
  { id: 'dm-yael-005', dmThreadId: 'dm-yael', fromFriend: true, body: 'בא אליי לבירה הערב? פתחתי דלת.' },

  // dm-roi — Búzios logistics (ends on self → no unread)
  { id: 'dm-roi-001', dmThreadId: 'dm-roi', fromFriend: false, body: 'מתי אתה יוצא לבוזיוס?' },
  { id: 'dm-roi-002', dmThreadId: 'dm-roi', fromFriend: true, body: '29 בבוקר, אוטובוס 8:00 מ-Novo Rio.' },
  { id: 'dm-roi-003', dmThreadId: 'dm-roi', fromFriend: false, body: 'אני באוטובוס של 9. ניפגש שם?' },
  { id: 'dm-roi-004', dmThreadId: 'dm-roi', fromFriend: true, body: 'מעולה. אני שולח לך את הקואורדינטות של ההוסטל.' },
  { id: 'dm-roi-005', dmThreadId: 'dm-roi', fromFriend: true, body: 'שלחתי לך את הקואורדינטות של ההוסטל בבוזיוס.' },
  { id: 'dm-roi-006', dmThreadId: 'dm-roi', fromFriend: false, body: 'קיבלתי. תודה רועי.' },

  // dm-shir — restaurant booking (ends on friend → unread, count=2)
  { id: 'dm-shir-001', dmThreadId: 'dm-shir', fromFriend: false, body: 'שיר, אני מגיעה לסאו ב-3 לנובמבר.' },
  { id: 'dm-shir-002', dmThreadId: 'dm-shir', fromFriend: true, body: 'מעולה! איפה תהיי, וילה?' },
  { id: 'dm-shir-003', dmThreadId: 'dm-shir', fromFriend: false, body: 'כן, הוסטל בוילה מדלנה.' },
  { id: 'dm-shir-004', dmThreadId: 'dm-shir', fromFriend: true, body: 'אני מזמינה ל-La Cabrera לחמישי 21:00. תרצי?' },
  { id: 'dm-shir-005', dmThreadId: 'dm-shir', fromFriend: true, body: 'תאשרי לי שמגיעה ב-3, אזמין למסעדה.' },

  // dm-yotam — kite booking (ends on self → no unread)
  { id: 'dm-yotam-001', dmThreadId: 'dm-yotam', fromFriend: false, body: 'יותם, רשמת את 3 הימים ב-Pure Kite?' },
  { id: 'dm-yotam-002', dmThreadId: 'dm-yotam', fromFriend: true, body: 'כן, 11–13. שלחתי ליעקב.' },
  { id: 'dm-yotam-003', dmThreadId: 'dm-yotam', fromFriend: false, body: 'תודה אחי. תעדכן כשתקבל אישור.' },
  { id: 'dm-yotam-004', dmThreadId: 'dm-yotam', fromFriend: true, body: 'יעקב אישר 3 ימים. נשלח לי קישור בקרוב.' },

  // dm-tom — Buenos Aires apartment (ends on friend → unread)
  { id: 'dm-moshe-001', dmThreadId: 'dm-moshe', fromFriend: false, body: 'משה, באתי על האסאדו על הגג בשישי. כתובת?' },
  { id: 'dm-moshe-002', dmThreadId: 'dm-moshe', fromFriend: true, body: 'מעולה. אני שולח כתובת בעוד דקה.' },
  { id: 'dm-moshe-003', dmThreadId: 'dm-moshe', fromFriend: false, body: 'מצוין. צריך משהו לפני?' },
  { id: 'dm-moshe-004', dmThreadId: 'dm-moshe', fromFriend: true, body: 'malbec טוב מ-Vinos Diego, ולחמים מ-Salvaje.' },
  { id: 'dm-moshe-005', dmThreadId: 'dm-moshe', fromFriend: false, body: 'סגור. ניפגש 20.' },
  { id: 'dm-moshe-006', dmThreadId: 'dm-moshe', fromFriend: true, body: 'הכתובת: Honduras 5450. קוד בכניסה 4837.' },
];
