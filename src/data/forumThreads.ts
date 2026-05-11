/**
 * Forum threads — original posts inside each forum.
 *
 * SEED ONLY. Runtime data lives in `forum_threads`.
 *
 * Authors reference existing `friend_overlaps.id` values. Some threads are
 * authored by "self" (current user) via `authorFriendId: null` — the UI
 * renders these with the user's own avatar/name placeholder until auth lands.
 *
 * Replies are seeded in `forumThreadReplies.ts`; `replyCount` here is set to
 * match the row count there to avoid the UI showing a stale number.
 */

export type ForumThread = {
  id: string;
  forumId: string;
  /** null = self (current user). FK to friend_overlaps when present. */
  authorFriendId: string | null;
  title: string;
  body: string;
  replyCount: number;
  followCount: number;
  pinned: boolean;
};

export const forumThreads: ForumThread[] = [
  // Rio — current city, busiest forum
  {
    id: 'thread-rio-001',
    forumId: 'forum-rio',
    authorFriendId: 'yael-botafogo',
    title: 'מי בקופקבנה השבוע?',
    body: 'בבוטפוגו עד יום שישי, אחר כך זזה לקופה. מישהו רוצה לקפוץ לפוסטו 9 ולעשות אקדמיה לערב?',
    replyCount: 4,
    followCount: 12,
    pinned: false,
  },
  {
    id: 'thread-rio-002',
    forumId: 'forum-rio',
    authorFriendId: null,
    title: 'הוסטל בלפה — שווה?',
    body: 'שמעתי שעכשיו לפה נהיה הוסטל-מרכזי של ריו. מישהו ישן שם ב-2026? יקר? בטוח? רעיל?',
    replyCount: 3,
    followCount: 7,
    pinned: false,
  },
  {
    id: 'thread-rio-003',
    forumId: 'forum-rio',
    authorFriendId: 'maya-ipanema',
    title: 'אקדמיה דה ז׳יו-ז׳יטסו לטירונים בריו — איפה?',
    body: 'מתחילה ב-Gracie Humaitá, אבל שמעתי שיש מקום באיפנמה שיותר נחמד למתחילים. המלצות?',
    replyCount: 2,
    followCount: 5,
    pinned: false,
  },

  // Búzios — sleeper forum but seasonal spike
  {
    id: 'thread-buzios-001',
    forumId: 'forum-buzios',
    authorFriendId: 'roi-buzios',
    title: 'סנוקלינג בפראיה דה אזדה — תנאים החודש',
    body: 'הייתי שם לפני שבוע — מים שקטים בבוקר, אחר הצהריים סוער. מי שמגיע ב-29–31, נצא יחד?',
    replyCount: 3,
    followCount: 9,
    pinned: true,
  },
  {
    id: 'thread-buzios-002',
    forumId: 'forum-buzios',
    authorFriendId: null,
    title: 'מאיפה הכי טוב להגיע לבוזיוס מריו?',
    body: 'אוטובוס מהריו דה ז׳נרו (Novo Rio) או טרנספר משותף? יש מי שניסה את שניהם?',
    replyCount: 2,
    followCount: 4,
    pinned: false,
  },

  // São Paulo — restaurant + nightlife heavy
  {
    id: 'thread-sao-paulo-001',
    forumId: 'forum-sao-paulo',
    authorFriendId: 'shir-saopaulo',
    title: 'אסאדו ב-La Cabrera שווה את התור?',
    body: 'שמעתי דעות סותרות. שווה לחכות שעה+ בלי הזמנה, או יש מקום באותה רמה בלי התור?',
    replyCount: 4,
    followCount: 11,
    pinned: false,
  },
  {
    id: 'thread-sao-paulo-002',
    forumId: 'forum-sao-paulo',
    authorFriendId: 'moshe-buenosaires',
    title: 'באר ראשון בלילה בוילה מדלנה — מקום אהוב?',
    body: 'מגיע לסופ״ש מבואנוס, רוצה משהו שלא דורש הזמנה. עדיפות לבירה טובה, לא לדיג׳יי.',
    replyCount: 3,
    followCount: 6,
    pinned: false,
  },
  {
    id: 'thread-sao-paulo-003',
    forumId: 'forum-sao-paulo',
    authorFriendId: null,
    title: 'חבד בסאו פאולו — שבת בעיר',
    body: 'מישהו הולך לחבד בז׳ארדינס לשבת? מחפש שולחן ערב או שתיים, לא ארוחה רשמית.',
    replyCount: 2,
    followCount: 5,
    pinned: false,
  },

  // Jericoacoara — kitesurf + logistics
  {
    id: 'thread-jericoacoara-001',
    forumId: 'forum-jericoacoara',
    authorFriendId: 'yotam-jericoacoara',
    title: 'קייטסרף בז׳רי — איזה בית ספר?',
    body: 'בא בנובמבר, מתחיל. שמעתי על Kite School Jeri ועל Pure Kite. למישהו יש המלצה?',
    replyCount: 3,
    followCount: 8,
    pinned: false,
  },
  {
    id: 'thread-jericoacoara-002',
    forumId: 'forum-jericoacoara',
    authorFriendId: null,
    title: 'איך מגיעים לז׳רי בלי לקרוע את התקציב?',
    body: 'טיסה לפורטלזה ואז ג׳יפ-משותף? או יש דרך זולה יותר? עם תרמיל גדול ופחות מ-200 ריאל.',
    replyCount: 3,
    followCount: 7,
    pinned: false,
  },
  {
    id: 'thread-jericoacoara-003',
    forumId: 'forum-jericoacoara',
    authorFriendId: 'roi-buzios',
    title: 'שקיעה בדיונה — מה הכי קלאסי?',
    body: 'הייתי שם שנה שעברה. הדיונה של פור-דו-ז׳רי בערב — כדאי להגיע מוקדם, היא מתמלאת.',
    replyCount: 2,
    followCount: 6,
    pinned: false,
  },

  // LATAM Israelis — cross-cutting interest
  {
    id: 'thread-latam-001',
    forumId: 'forum-latam-israelis',
    authorFriendId: null,
    title: 'באים לפסח בדרום אמריקה — סדרים פתוחים?',
    body: 'בריו לפסח 2026. חבד בקופה מארח? יש סדר ישראלי פחות פורמלי בסביבה?',
    replyCount: 3,
    followCount: 10,
    pinned: false,
  },
  {
    id: 'thread-latam-002',
    forumId: 'forum-latam-israelis',
    authorFriendId: 'moshe-buenosaires',
    title: 'ביטוח רפואי בלאטם — מה אתם לוקחים?',
    body: 'חודש בארגנטינה ועוד שבועיים בצ׳ילה. PassportCard, Travel Secure, או משהו אחר?',
    replyCount: 4,
    followCount: 11,
    pinned: false,
  },
  {
    id: 'thread-latam-003',
    forumId: 'forum-latam-israelis',
    authorFriendId: 'shir-saopaulo',
    title: 'ויזה לברזיל מהשגרירות בבואנוס — תהליך?',
    body: 'מי שעבר את זה לאחרונה — כמה ימים? צריך תור מראש? תור פתוח בבוקר עובד?',
    replyCount: 3,
    followCount: 9,
    pinned: false,
  },

  // Buenos Aires — recommended forum, lighter activity in seed (not joined yet)
  {
    id: 'thread-buenos-aires-001',
    forumId: 'forum-buenos-aires',
    authorFriendId: 'moshe-buenosaires',
    title: 'גר בפאלרמו חודש — מה לעשות אצלי?',
    body: 'יש לי דירה בפאלרמו סוהו עד דצמבר. מקבל אנשים לקפה/אסאדו על הגג. כתבו לי.',
    replyCount: 4,
    followCount: 14,
    pinned: false,
  },
  {
    id: 'thread-buenos-aires-002',
    forumId: 'forum-buenos-aires',
    authorFriendId: null,
    title: 'טנגו לטירונים — שיעור פתוח?',
    body: 'מגיעה לבואנוס לעשרה ימים. מחפשת מילונגה חברתית, לא תחרותית. המלצות לסוף שבוע?',
    replyCount: 2,
    followCount: 5,
    pinned: false,
  },
  {
    id: 'thread-buenos-aires-003',
    forumId: 'forum-buenos-aires',
    authorFriendId: 'yael-botafogo',
    title: 'איך עוברים את החום באמצע נובמבר?',
    body: 'אומרים שגל חום צפוי בדיוק בתקופה שלי. מה הקצב שלכם — סייסטה ארוכה, או דוחפים?',
    replyCount: 2,
    followCount: 6,
    pinned: false,
  },
];
