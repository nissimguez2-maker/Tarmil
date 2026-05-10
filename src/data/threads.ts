/**
 * Activity feed seed source.
 *
 * SEED ONLY for the array below. Runtime data is read from the `threads` and
 * `thread_replies` tables in Supabase via SupabaseDataProvider; replies are
 * subscribed to via Realtime so new posts appear live during the demo.
 *
 * Each thread is one of three kinds:
 *  - `friend_trip` — a friend declared a future trip; the card surfaces
 *    season+year and the existing friend_overlap link.
 *  - `city` — discussion grounded in a destination the user has visited or is
 *    going to visit.
 *  - `destination` — corridor-wide chat about a popular place. May or may not
 *    align with one of the user's planned stops.
 */

import type { Season } from './places';

export type ThreadKind = 'friend_trip' | 'city' | 'destination';

export type Thread = {
  id: string;
  kind: ThreadKind;
  title: string;
  body: string;
  authorInitial: string;
  authorName: string;
  /** Stop id if this thread is anchored to a planned destination. */
  destinationId?: string;
  /** Hebrew display label for the city/destination. */
  cityLabel?: string;
  /** friend_overlaps.id when kind === 'friend_trip'. */
  friendId?: string;
  /** Season the trip covers — friend_trip only. */
  tripSeason?: Season;
  /** Year the trip covers — friend_trip only. */
  tripYear?: number;
  replyCount: number;
  followCount: number;
  /** ISO timestamp; the seed uses NOW()-N relative offsets. */
  createdAt: string;
};

export type ThreadReply = {
  id: string;
  threadId: string;
  authorInitial: string;
  authorName: string;
  body: string;
  createdAt: string;
};

/**
 * Seed array — kept aligned with the Supabase rows. Re-running the seed
 * script upserts these by id; Hebrew text edits here flow to the DB on the
 * next seed pass. The `createdAt` values in the live DB are calculated
 * relative to seed-time and should not be mirrored verbatim.
 */
export const threads: Thread[] = [
  // ── Friend-trip declared ────────────────────────────────────────────────
  {
    id: 'ft-roi-buzios',
    kind: 'friend_trip',
    title: 'רועי הכריז על בוזיוס',
    body:
      'שלושה ימים בבוזיוס בסוף אוקטובר. מחפש חברים לפראדורה ובארים בלילה. מי מסביב?',
    authorInitial: 'ר',
    authorName: 'רועי בן עמי',
    destinationId: 'buzios',
    cityLabel: 'בוזיוס',
    friendId: 'roi-buzios',
    tripSeason: 'autumn',
    tripYear: 2026,
    replyCount: 2,
    followCount: 0,
    createdAt: '2026-05-08T00:00:00Z',
  },
  {
    id: 'ft-shir-saopaulo',
    kind: 'friend_trip',
    title: 'שיר תכננה סאו פאולו',
    body:
      'חמישה לילות בוילה מדלנה. מחפשת מישהי שתצטרף לאסאדו ראשון בלילה ולגלריות בפאוליסטה.',
    authorInitial: 'ש',
    authorName: 'שיר כהן',
    destinationId: 'sao-paulo',
    cityLabel: 'סאו פאולו',
    friendId: 'shir-saopaulo',
    tripSeason: 'autumn',
    tripYear: 2026,
    replyCount: 0,
    followCount: 0,
    createdAt: '2026-05-06T00:00:00Z',
  },
  {
    id: 'ft-yotam-jeri',
    kind: 'friend_trip',
    title: 'יותם הכריז על ז׳ריקואקוארה',
    body:
      'שבוע בז׳רי בנובמבר — קייטסרף, דיונת השקיעה ופורו עד 4 בבוקר. מי בא?',
    authorInitial: 'ה',
    authorName: 'יותם הררי',
    destinationId: 'jericoacoara',
    cityLabel: 'ז׳ריקואקוארה',
    friendId: 'yotam-jericoacoara',
    tripSeason: 'autumn',
    tripYear: 2026,
    replyCount: 0,
    followCount: 0,
    createdAt: '2026-05-09T00:00:00Z',
  },
  {
    id: 'ft-tom-bsas',
    kind: 'friend_trip',
    title: 'תום בבואנוס לחודש',
    body:
      'שוכר דירה בפאלרמו לחודש שלם. אם אתם בעיר נובמבר–דצמבר, ספרו — אסאדו על האש כל יום שבת.',
    authorInitial: 'ת',
    authorName: 'תום פרידמן',
    destinationId: 'buenos-aires',
    cityLabel: 'בואנוס איירס',
    friendId: 'tom-buenosaires',
    tripSeason: 'autumn',
    tripYear: 2026,
    replyCount: 0,
    followCount: 0,
    createdAt: '2026-05-10T00:00:00Z',
  },

  // ── City discussions ────────────────────────────────────────────────────
  {
    id: 'c-rio-lapa-bar',
    kind: 'city',
    title: 'איפה הקאיפיריניה הכי טובה בלאפה?',
    body:
      'אני בריו עוד שבוע, רוצה להתחיל לילות בלאפה — מקום קטן, לא תיירותי, חי בלילות שלישי?',
    authorInitial: 'מ',
    authorName: 'מאיה לוי',
    destinationId: 'rio-de-janeiro',
    cityLabel: 'ריו דה ז׳ניירו',
    replyCount: 2,
    followCount: 0,
    createdAt: '2026-05-09T16:00:00Z',
  },
  {
    id: 'c-rio-copa-weekend',
    kind: 'city',
    title: 'מי בקופה בסופ״ש?',
    body: 'מתכננת אגן ירוק, אסאי ולשבת על המזרן עד שקיעה. מי מצטרף?',
    authorInitial: 'י',
    authorName: 'יעל אברהם',
    destinationId: 'rio-de-janeiro',
    cityLabel: 'ריו דה ז׳ניירו',
    replyCount: 0,
    followCount: 0,
    createdAt: '2026-05-09T12:00:00Z',
  },
  {
    id: 'c-buzios-ferradura-day',
    kind: 'city',
    title: 'יום בפראדורה בשישי הבא',
    body:
      'יוצא מבוזיוס לפראדורה ביום שישי, יש מקום לעוד שניים באוטו. בואו נחזור לבית עם דגים על הכיריים.',
    authorInitial: 'ר',
    authorName: 'רועי בן עמי',
    destinationId: 'buzios',
    cityLabel: 'בוזיוס',
    replyCount: 0,
    followCount: 0,
    createdAt: '2026-05-07T00:00:00Z',
  },
  {
    id: 'c-saopaulo-vila',
    kind: 'city',
    title: 'המלצות בארים בוילה מדלנה',
    body:
      'מגיעה לסאו פאולו לראשונה. מחפשת בארים שיש בהם גם קוקטיילים אמיתיים וגם מוזיקת חיים.',
    authorInitial: 'ש',
    authorName: 'שיר כהן',
    destinationId: 'sao-paulo',
    cityLabel: 'סאו פאולו',
    replyCount: 0,
    followCount: 0,
    createdAt: '2026-05-08T00:00:00Z',
  },
  {
    id: 'c-jeri-kite',
    kind: 'city',
    title: 'איך מזמינים מורה לקייט בז׳רי?',
    body:
      'נחתי בז׳ריקואקוארה אתמול, רוח מצוינת ועוד אין לי מורה. מי עבד עם בית ספר טוב לאחרונה?',
    authorInitial: 'ה',
    authorName: 'יותם הררי',
    destinationId: 'jericoacoara',
    cityLabel: 'ז׳ריקואקוארה',
    replyCount: 0,
    followCount: 0,
    createdAt: '2026-05-10T00:00:00Z',
  },
  {
    id: 'c-bsas-asado',
    kind: 'city',
    title: 'אסאדו טוב שאינו מלכודת תיירים',
    body:
      'בעיר עוד שבועיים. רוצה אסאדו שכונתי, לא במאיפו ולא בפלאצה דה מאיו. ארגנטינאים בלבד באוויר.',
    authorInitial: 'ד',
    authorName: 'דניאל שמש',
    destinationId: 'buenos-aires',
    cityLabel: 'בואנוס איירס',
    replyCount: 1,
    followCount: 0,
    createdAt: '2026-05-09T00:00:00Z',
  },
  {
    id: 'c-bsas-tango',
    kind: 'city',
    title: 'שיעורי טנגו בפאלרמו',
    body:
      'מחפשת מורה שייקח גם מתחילות שמתביישות. עדיף סטודיו קטן, לא מילונגה ענקית.',
    authorInitial: 'נ',
    authorName: 'נועה גרין',
    destinationId: 'buenos-aires',
    cityLabel: 'בואנוס איירס',
    replyCount: 0,
    followCount: 0,
    createdAt: '2026-05-06T00:00:00Z',
  },
  {
    id: 'c-bsas-coffee',
    kind: 'city',
    title: 'קפה ספציאלטי בפאלרמו — מאיפה מתחילים?',
    body:
      'אני בבואנוס לחודש. מחפש קפיות עם מאפים ביתיים, רצוי בלי תור של תיירים בבוקר.',
    authorInitial: 'א',
    authorName: 'איתי לוטם',
    destinationId: 'buenos-aires',
    cityLabel: 'בואנוס איירס',
    replyCount: 0,
    followCount: 0,
    createdAt: '2026-05-03T00:00:00Z',
  },

  // ── Destination chats ───────────────────────────────────────────────────
  {
    id: 'd-greece-summer',
    kind: 'destination',
    title: 'האיים היווניים קיץ 2026 — מי מצטרף?',
    body:
      'מארגנת קבוצת חברים לקיץ הבא: סנטוריני, מילוס, איוס. שבועיים, גמיש בתאריכים. ספרו אם רלוונטי.',
    authorInitial: 'ש',
    authorName: 'שיר כהן',
    cityLabel: 'יוון',
    replyCount: 3,
    followCount: 0,
    createdAt: '2026-05-04T00:00:00Z',
  },
  {
    id: 'd-thailand-route',
    kind: 'destination',
    title: 'טייל בתאילנד — סדר אופטימלי?',
    body:
      'בנגקוק → צ׳יאנג מאי → איים. שלושה שבועות בידיים. מישהו עשה ב־2025 ויכול להמליץ?',
    authorInitial: 'ר',
    authorName: 'רועי בן עמי',
    cityLabel: 'תאילנד',
    replyCount: 0,
    followCount: 0,
    createdAt: '2026-04-30T00:00:00Z',
  },
  {
    id: 'd-bali-surf',
    kind: 'destination',
    title: 'באלי לסרפינג — איפה הגלים הכי טובים?',
    body:
      'מתכנן באלי בחורף. אובוד יפה אבל באתי לגלים. אורוג׳ק או צ׳נגגו? קורצי גלים יודעים — דברו.',
    authorInitial: 'ה',
    authorName: 'יותם הררי',
    cityLabel: 'באלי',
    replyCount: 0,
    followCount: 0,
    createdAt: '2026-04-25T00:00:00Z',
  },
  {
    id: 'd-mendoza-wine',
    kind: 'destination',
    title: 'מנדוסה — סבב יקבים מתחילים מאיפה?',
    body:
      'מגיע לסוף שבוע ארוך. אהבתי מאלבק בעבר אבל לא מבין. רוצה יקב אחד מסחרי, אחד בוטיק, ועוד אחד גבוה.',
    authorInitial: 'ת',
    authorName: 'תום פרידמן',
    destinationId: 'mendoza',
    cityLabel: 'מנדוסה',
    replyCount: 2,
    followCount: 0,
    createdAt: '2026-05-05T00:00:00Z',
  },
  {
    id: 'd-punta-jan',
    kind: 'destination',
    title: 'פונטה דל אסטה בינואר — בית או הוסטל?',
    body:
      'חצי החברים הולכים על וילה משותפת בלה ברה, חצי מבקשים הוסטל בעיר. מה השיקול שמכריע?',
    authorInitial: 'מ',
    authorName: 'מאיה לוי',
    destinationId: 'punta-del-este',
    cityLabel: 'פונטה דל אסטה',
    replyCount: 0,
    followCount: 0,
    createdAt: '2026-04-26T00:00:00Z',
  },
  {
    id: 'd-cote-train',
    kind: 'destination',
    title: 'קוט ד׳אזור ברכבת — מסלול אופטימלי',
    body:
      'ניס → אנטיב → קאן → מונקו. שלושה לילות בכל אחת? או למקם בניס ולעשות יציאות יומיות?',
    authorInitial: 'נ',
    authorName: 'נועה גרין',
    cityLabel: 'קוט ד׳אזור',
    replyCount: 0,
    followCount: 0,
    createdAt: '2026-04-29T00:00:00Z',
  },
  {
    id: 'd-cusco',
    kind: 'destination',
    title: 'קוסקו ומאצ׳ו פיצ׳ו — שבועיים מספיק?',
    body:
      'איניקה טריילים? סלקנטאי? רכבת ישירה? אני אסטמטי קל אז גובה זה שיקול. תפיוסו אותי.',
    authorInitial: 'ד',
    authorName: 'דניאל שמש',
    cityLabel: 'פרו',
    replyCount: 0,
    followCount: 0,
    createdAt: '2026-04-20T00:00:00Z',
  },
  {
    id: 'd-iguazu',
    kind: 'destination',
    title: 'איגואסו — צד ארגנטינאי או ברזילאי?',
    body:
      'יום אחד לכל אחד? סבב מלא? איזה צד שווה את כניסת הפארק היקרה יותר? מי שעשה — דברו.',
    authorInitial: 'א',
    authorName: 'איתי לוטם',
    cityLabel: 'איגואסו',
    replyCount: 0,
    followCount: 0,
    createdAt: '2026-05-02T00:00:00Z',
  },
  {
    id: 'd-cote-summer-house',
    kind: 'destination',
    title: 'בית קיץ מצרפת — האם משתלם?',
    body:
      'חמישה זוגות חושבים על וילה לשבועיים בקוט ד׳אזור. עיתוי, מחיר, מתי לסגור — בואו נתקדם.',
    authorInitial: 'ת',
    authorName: 'תום פרידמן',
    cityLabel: 'קוט ד׳אזור',
    replyCount: 0,
    followCount: 0,
    createdAt: '2026-04-27T00:00:00Z',
  },
];
