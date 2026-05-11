/**
 * Forum thread replies — seeded responses on the threads in `forumThreads.ts`.
 *
 * SEED ONLY. Runtime data lives in `forum_thread_replies`.
 *
 * Distribution is uneven — busy threads get 3–4 replies, sleeper threads get
 * 1–2. Authors mix friend personas and self (`authorFriendId: null`). All
 * Hebrew is idiomatic backpacker speech.
 *
 * Reply IDs use the parent thread id + `-r{N}` so they're stable across reseeds.
 */

export type ForumThreadReply = {
  id: string;
  threadId: string;
  /** null = self. FK to friend_overlaps when present. */
  authorFriendId: string | null;
  body: string;
};

export const forumThreadReplies: ForumThreadReply[] = [
  // thread-rio-001 — קופקבנה השבוע
  {
    id: 'thread-rio-001-r1',
    threadId: 'thread-rio-001',
    authorFriendId: 'maya-ipanema',
    body: 'אני באיפנמה, מגיעה לפוסטו 9 רביעי בערב. שם.',
  },
  {
    id: 'thread-rio-001-r2',
    threadId: 'thread-rio-001',
    authorFriendId: null,
    body: 'אם זה לא יורד גשם, אני בא. תגידו על הקבוצה בוואטסאפ.',
  },
  {
    id: 'thread-rio-001-r3',
    threadId: 'thread-rio-001',
    authorFriendId: 'roi-buzios',
    body: 'אני יוצא לבוזיוס בסוף השבוע, אבל אם זה ביום שני־שלישי אני בעניין.',
  },
  {
    id: 'thread-rio-001-r4',
    threadId: 'thread-rio-001',
    authorFriendId: 'yael-botafogo',
    body: 'מעולה. אני יוצרת קבוצה ושולחת קישור בDM למי שהגיב.',
  },

  // thread-rio-002 — הוסטל בלפה
  {
    id: 'thread-rio-002-r1',
    threadId: 'thread-rio-002',
    authorFriendId: 'moshe-buenosaires',
    body: 'הייתי שם בינואר. אווירה בסדר, הצוות נחמד, אבל בלילה רעש מהבר ממול עד 3.',
  },
  {
    id: 'thread-rio-002-r2',
    threadId: 'thread-rio-002',
    authorFriendId: 'maya-ipanema',
    body: 'לא מסוכן כמו שאומרים. תיק על הגב, לא בכיסים. אני יוצאת שמה לערב מדי שבוע.',
  },
  {
    id: 'thread-rio-002-r3',
    threadId: 'thread-rio-002',
    authorFriendId: null,
    body: 'תודה. נראה לי שאזמין משם, פחות אטרקטיבי באיפנמה במחירים כאלה.',
  },

  // thread-rio-003 — ג׳יו־ז׳יטסו
  {
    id: 'thread-rio-003-r1',
    threadId: 'thread-rio-003',
    authorFriendId: 'roi-buzios',
    body: 'Checkmat Ipanema. הקבוצה לטירונים בערב, מאמן ישראלי בכלל. תשובה.',
  },
  {
    id: 'thread-rio-003-r2',
    threadId: 'thread-rio-003',
    authorFriendId: null,
    body: 'תודה רועי, אני אכנס מחר. יכול להיות שניפגש שם?',
  },

  // thread-buzios-001 — סנוקלינג
  {
    id: 'thread-buzios-001-r1',
    threadId: 'thread-buzios-001',
    authorFriendId: null,
    body: 'אני שם 29–31, מצטרף. יש לך משקפי שחייה לתת בהשאלה? שכחתי בריו.',
  },
  {
    id: 'thread-buzios-001-r2',
    threadId: 'thread-buzios-001',
    authorFriendId: 'shir-saopaulo',
    body: 'אם המים שקטים בבוקר, גם פראיה דה ז׳ואו פרננדס יפה. שווה לבדוק.',
  },
  {
    id: 'thread-buzios-001-r3',
    threadId: 'thread-buzios-001',
    authorFriendId: 'roi-buzios',
    body: 'יש לי שני זוגות משקפי שחייה. נסגור פרטים בDM.',
  },

  // thread-buzios-002 — איך להגיע
  {
    id: 'thread-buzios-002-r1',
    threadId: 'thread-buzios-002',
    authorFriendId: 'moshe-buenosaires',
    body: 'אוטובוס מ-Novo Rio — 1001 חברה טובה. שעתיים וחצי, נוח, חצי מהמחיר של טרנספר.',
  },
  {
    id: 'thread-buzios-002-r2',
    threadId: 'thread-buzios-002',
    authorFriendId: 'roi-buzios',
    body: 'אם אתה מגיע משדה התעופה — טרנספר יותר נוח. מ-Novo Rio, אוטובוס לגמרי.',
  },

  // thread-sao-paulo-001 — La Cabrera
  {
    id: 'thread-sao-paulo-001-r1',
    threadId: 'thread-sao-paulo-001',
    authorFriendId: 'shir-saopaulo',
    body: 'שווה — אבל רק אם אתה אוהב Bife de chorizo. הגעתי 18:30 בלי תור, נכנסתי תוך 20 דקות.',
  },
  {
    id: 'thread-sao-paulo-001-r2',
    threadId: 'thread-sao-paulo-001',
    authorFriendId: 'moshe-buenosaires',
    body: 'לי דווקא Don Julio (אם תהיה בבואנוס) יותר מרשים. אבל בסאו פאולו, La Cabrera טוב.',
  },
  {
    id: 'thread-sao-paulo-001-r3',
    threadId: 'thread-sao-paulo-001',
    authorFriendId: null,
    body: 'אז אני מנסה. שיר תודה על הטיפ עם השעה.',
  },
  {
    id: 'thread-sao-paulo-001-r4',
    threadId: 'thread-sao-paulo-001',
    authorFriendId: 'yotam-jericoacoara',
    body: 'תלך גם ל-A Casa do Porco באותו רחוב. שונה, אבל ברמה.',
  },

  // thread-sao-paulo-002 — באר ראשון
  {
    id: 'thread-sao-paulo-002-r1',
    threadId: 'thread-sao-paulo-002',
    authorFriendId: 'shir-saopaulo',
    body: 'Coisa Linda בוילה. בירה מקומית, אוכל פשוט, בלי דיג׳יי. בערב חמישי-שישי מתמלא.',
  },
  {
    id: 'thread-sao-paulo-002-r2',
    threadId: 'thread-sao-paulo-002',
    authorFriendId: null,
    body: 'גם Veloso טוב — אבל יותר עמוס. תלוי אם אתה רוצה לפגוש מקומיים או רגוע.',
  },
  {
    id: 'thread-sao-paulo-002-r3',
    threadId: 'thread-sao-paulo-002',
    authorFriendId: 'yael-botafogo',
    body: 'Coisa Linda. אני חוזרת שמה כל פעם.',
  },

  // thread-sao-paulo-003 — חבד
  {
    id: 'thread-sao-paulo-003-r1',
    threadId: 'thread-sao-paulo-003',
    authorFriendId: 'shir-saopaulo',
    body: 'בית חב״ד ז׳ארדינס מארח שולחנות פתוחים. מומלץ לאשר מראש דרך האתר.',
  },
  {
    id: 'thread-sao-paulo-003-r2',
    threadId: 'thread-sao-paulo-003',
    authorFriendId: null,
    body: 'תודה. אשלח מייל בשבוע הבא.',
  },

  // thread-jericoacoara-001 — קייטסרף
  {
    id: 'thread-jericoacoara-001-r1',
    threadId: 'thread-jericoacoara-001',
    authorFriendId: 'yotam-jericoacoara',
    body: 'Pure Kite — מדריך ישראלי, יעקב. סבלני עם מתחילים, ובטוח עם הציוד.',
  },
  {
    id: 'thread-jericoacoara-001-r2',
    threadId: 'thread-jericoacoara-001',
    authorFriendId: 'roi-buzios',
    body: 'תאשר את התאריכים מראש, בשיא העונה הוא ממולא.',
  },
  {
    id: 'thread-jericoacoara-001-r3',
    threadId: 'thread-jericoacoara-001',
    authorFriendId: null,
    body: 'אני שולח לו מייל הערב. תודה יותם.',
  },

  // thread-jericoacoara-002 — איך להגיע
  {
    id: 'thread-jericoacoara-002-r1',
    threadId: 'thread-jericoacoara-002',
    authorFriendId: 'yotam-jericoacoara',
    body: 'טיסה לפורטלזה ואז ג׳יפ-משותף לג׳יז׳וקה ומשם ג׳יפ לז׳רי. כ-180 ריאל סהכ אם תזמן לבד.',
  },
  {
    id: 'thread-jericoacoara-002-r2',
    threadId: 'thread-jericoacoara-002',
    authorFriendId: 'shir-saopaulo',
    body: 'אופציה זולה יותר: אוטובוס לילה מפורטלזה ל-Jijoca, ואז ג׳יפ. ארוך אבל פחות מ-100 ריאל.',
  },
  {
    id: 'thread-jericoacoara-002-r3',
    threadId: 'thread-jericoacoara-002',
    authorFriendId: null,
    body: 'נראה לי שאני הולך על ג׳יפ-משותף, לא אקח את הסיכון של אוטובוס לילה עם תרמיל גדול.',
  },

  // thread-jericoacoara-003 — שקיעה בדיונה
  {
    id: 'thread-jericoacoara-003-r1',
    threadId: 'thread-jericoacoara-003',
    authorFriendId: 'yotam-jericoacoara',
    body: 'תגיע 40 דקות לפני, תקנה קוקטייל מהבר בתחילת הדיונה. שיא של הטיול.',
  },
  {
    id: 'thread-jericoacoara-003-r2',
    threadId: 'thread-jericoacoara-003',
    authorFriendId: null,
    body: 'נשמע אגדי. תודה רועי.',
  },

  // thread-latam-001 — פסח
  {
    id: 'thread-latam-001-r1',
    threadId: 'thread-latam-001',
    authorFriendId: 'maya-ipanema',
    body: 'חבד בקופה עושה סדר ענק לכל הישראלים. תרשם מראש דרך האתר שלהם.',
  },
  {
    id: 'thread-latam-001-r2',
    threadId: 'thread-latam-001',
    authorFriendId: 'moshe-buenosaires',
    body: 'אם תהיה בבואנוס — סדר אצל קהילת אם״י קלאסי, אבל יש גם סדר ישראלי באבסטו.',
  },
  {
    id: 'thread-latam-001-r3',
    threadId: 'thread-latam-001',
    authorFriendId: null,
    body: 'אני בריו לפסח. אלך לחבד בקופה. תודה.',
  },

  // thread-latam-002 — ביטוח
  {
    id: 'thread-latam-002-r1',
    threadId: 'thread-latam-002',
    authorFriendId: 'roi-buzios',
    body: 'PassportCard. הייתי צריך רופא בקיטו, סידרו לי תוך שעה. שווה כל שקל.',
  },
  {
    id: 'thread-latam-002-r2',
    threadId: 'thread-latam-002',
    authorFriendId: 'shir-saopaulo',
    body: 'Travel Secure זול יותר, גם עבד לי בארגנטינה. אבל הכיסוי לציוד נמוך.',
  },
  {
    id: 'thread-latam-002-r3',
    threadId: 'thread-latam-002',
    authorFriendId: 'yael-botafogo',
    body: 'תיזהר עם החריגים — קייטסרף וצניחה בדרך כלל בתשלום נפרד. תקרא לפני.',
  },
  {
    id: 'thread-latam-002-r4',
    threadId: 'thread-latam-002',
    authorFriendId: null,
    body: 'תודה כולם. נראה לי PassportCard לחודש, וזהו.',
  },

  // thread-latam-003 — ויזה לברזיל
  {
    id: 'thread-latam-003-r1',
    threadId: 'thread-latam-003',
    authorFriendId: 'moshe-buenosaires',
    body: 'שבועיים. אפשרי לקבוע תור באתר, או להופיע בבוקר ולחכות. הביצוע לרוב פחות מהזמן המוצהר.',
  },
  {
    id: 'thread-latam-003-r2',
    threadId: 'thread-latam-003',
    authorFriendId: 'shir-saopaulo',
    body: 'אני קיבלתי תוך 9 ימים. תור מראש, הגעתי 8:30 בבוקר, יצאתי תוך שעה.',
  },
  {
    id: 'thread-latam-003-r3',
    threadId: 'thread-latam-003',
    authorFriendId: null,
    body: 'מעולה. אני קובע תור לשבוע הבא.',
  },

  // thread-buenos-aires-001 — פאלרמו
  {
    id: 'thread-buenos-aires-001-r1',
    threadId: 'thread-buenos-aires-001',
    authorFriendId: 'yael-botafogo',
    body: 'אני נוחתת ב-18 לחודש. אקפוץ אליך לקפה.',
  },
  {
    id: 'thread-buenos-aires-001-r2',
    threadId: 'thread-buenos-aires-001',
    authorFriendId: null,
    body: 'גם אני שם ב-16–25. נסגור אסאדו אחד בטח.',
  },
  {
    id: 'thread-buenos-aires-001-r3',
    threadId: 'thread-buenos-aires-001',
    authorFriendId: 'roi-buzios',
    body: 'אני מגיע רק בדצמבר, אבל נשמור על הזמנה.',
  },
  {
    id: 'thread-buenos-aires-001-r4',
    threadId: 'thread-buenos-aires-001',
    authorFriendId: 'moshe-buenosaires',
    body: 'מעולה. אני שולח קישור לקבוצת וואטסאפ ב-DM למי שכתב.',
  },

  // thread-buenos-aires-002 — טנגו
  {
    id: 'thread-buenos-aires-002-r1',
    threadId: 'thread-buenos-aires-002',
    authorFriendId: 'moshe-buenosaires',
    body: 'La Catedral בשישי בלילה. אווירה פתוחה, מקובל לבקש לרקוד גם בלי שיעור מוקדם.',
  },
  {
    id: 'thread-buenos-aires-002-r2',
    threadId: 'thread-buenos-aires-002',
    authorFriendId: null,
    body: 'תודה. אצטרך נעליים מיוחדות, או מספיק לי משהו עם סוליה חלקה?',
  },

  // thread-buenos-aires-003 — חום בנובמבר
  {
    id: 'thread-buenos-aires-003-r1',
    threadId: 'thread-buenos-aires-003',
    authorFriendId: 'moshe-buenosaires',
    body: 'סייסטה אמיתית מ-13 עד 17. אחר כך יוצאים, אסאדו מאוחר, הולכים לישון מאוחר. זה הקצב.',
  },
  {
    id: 'thread-buenos-aires-003-r2',
    threadId: 'thread-buenos-aires-003',
    authorFriendId: null,
    body: 'בסדר. דירה עם מזגן ספרתי בעדיפות גבוהה.',
  },
];
