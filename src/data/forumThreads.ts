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

export type ForumSubject =
  | 'kosher_chabad'
  | 'parties'
  | 'treks_activities'
  | 'restaurants'
  | 'meetups';

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
  subject: ForumSubject;
};

export const forumThreads: ForumThread[] = [
  // =====================================================================
  // RIO — forum-rio (10 threads, 2 per subject)
  // =====================================================================

  // -- kosher_chabad --
  {
    id: 'thread-rio-001',
    forumId: 'forum-rio',
    authorFriendId: 'maya-ipanema',
    title: 'חב״ד קופקבנה — שעות שבת השבוע',
    body: 'אישרו לי שקבלת שבת ב־19:15 ב־Rua Anita Garibaldi. הסעודה בערך 20:00. צריך להירשם דרך האתר עד חמישי 12:00.',
    replyCount: 3,
    followCount: 14,
    pinned: false,
    subject: 'kosher_chabad',
  },
  {
    id: 'thread-rio-002',
    forumId: 'forum-rio',
    authorFriendId: null,
    title: 'איפה קונים בשר כשר בריו?',
    body: 'מארח חבר׳ה ביום ראשון, צריך בשר טחון וכבד עוף. שמעתי על Kosher Rio בקופה אבל לא מצאתי שעות פתיחה. מישהו ניסה Talmud Torah?',
    replyCount: 2,
    followCount: 8,
    pinned: false,
    subject: 'kosher_chabad',
  },

  // -- parties --
  {
    id: 'thread-rio-003',
    forumId: 'forum-rio',
    authorFriendId: 'yael-botafogo',
    title: 'בלוקו ברחוב לפה שישי הזה',
    body: 'יוצאת בלוקו רחוב מ־Largo do Boticário ב־22:00. כניסה חופשית, מביאים בירה משלך. מי בא?',
    replyCount: 3,
    followCount: 16,
    pinned: false,
    subject: 'parties',
  },
  {
    id: 'thread-rio-004',
    forumId: 'forum-rio',
    authorFriendId: 'maya-ipanema',
    title: 'Rio Scenarium — שווה את ה־R$ 60 כניסה?',
    body: 'שמעתי שזה הפך טוריסטי לגמרי. יש מקום סמבה אותנטי יותר באזור Lapa? כנראה רביעי בערב.',
    replyCount: 2,
    followCount: 11,
    pinned: false,
    subject: 'parties',
  },

  // -- treks_activities --
  {
    id: 'thread-rio-005',
    forumId: 'forum-rio',
    authorFriendId: null,
    title: 'מי עולה על Pedra da Gávea השבוע?',
    body: 'מתכנן שני בבוקר, יציאה ב־5:00 מבאר Barra. צריך לפחות עוד אחד, יותר נכון יותר בטוח. רמת הליכה בינונית, יש זחילה בסוף.',
    replyCount: 3,
    followCount: 13,
    pinned: false,
    subject: 'treks_activities',
  },
  {
    id: 'thread-rio-006',
    forumId: 'forum-rio',
    authorFriendId: 'maya-ipanema',
    title: 'גרייסי הומאיתה — אימון אורח?',
    body: 'מאמנת ב־Gracie Humaitá פעמיים בשבוע, אפשר להגיע כאורח? המחיר היומי?',
    replyCount: 2,
    followCount: 9,
    pinned: false,
    subject: 'treks_activities',
  },

  // -- restaurants --
  {
    id: 'thread-rio-007',
    forumId: 'forum-rio',
    authorFriendId: 'yael-botafogo',
    title: 'Aconchego Carioca — שווה את הנסיעה ל־Praça da Bandeira?',
    body: 'שמעתי שהבולינוס שלהם רצח. שווה לחצות חצי עיר בשישי בלילה?',
    replyCount: 3,
    followCount: 12,
    pinned: false,
    subject: 'restaurants',
  },
  {
    id: 'thread-rio-008',
    forumId: 'forum-rio',
    authorFriendId: null,
    title: 'איפה אוכלים אסאי אמיתי בקופה?',
    body: 'לא מהכוסות הקפואות עם גרנולה — אסאי טבעי מהאמזון. שמעתי על מקום קטן ב־Rua Constante Ramos. שם נכון?',
    replyCount: 2,
    followCount: 10,
    pinned: false,
    subject: 'restaurants',
  },

  // -- meetups --
  {
    id: 'thread-rio-009',
    forumId: 'forum-rio',
    authorFriendId: 'yael-botafogo',
    title: 'מי בקופקבנה השבוע?',
    body: 'בבוטפוגו עד יום שישי, אחר כך זזה לקופה. מישהו רוצה לקפוץ ל־Posto 9 ולעשות אקדמיה לערב?',
    replyCount: 3,
    followCount: 15,
    pinned: false,
    subject: 'meetups',
  },
  {
    id: 'thread-rio-010',
    forumId: 'forum-rio',
    authorFriendId: null,
    title: 'מפגש ישראלים שלישי 19:00 בבר Pavão Azul',
    body: 'מנסה לארגן מפגש קבוע אחת לשבועיים. Pavão Azul בקופה, פשוט, בירה זולה. מי בעניין?',
    replyCount: 3,
    followCount: 17,
    pinned: true,
    subject: 'meetups',
  },

  // =====================================================================
  // BÚZIOS — forum-buzios (10 threads, 2 per subject)
  // =====================================================================

  // -- kosher_chabad --
  {
    id: 'thread-buzios-001',
    forumId: 'forum-buzios',
    authorFriendId: null,
    title: 'יש חב״ד בבוזיוס? סוף אוקטובר',
    body: 'מגיע 29–31 לבוזיוס, אני שומר שבת. יש בית חב״ד או מנין מקומי? אם לא, עדיף לחזור לריו לפני שבת?',
    replyCount: 2,
    followCount: 6,
    pinned: false,
    subject: 'kosher_chabad',
  },
  {
    id: 'thread-buzios-002',
    forumId: 'forum-buzios',
    authorFriendId: 'roi-buzios',
    title: 'מנשים אוכל כשר לסופ״ש בבוזיוס',
    body: 'הולך לבוזיוס ל־4 ימים, אביא חלקי עוף קפוא מ־Kosher Rio. מישהו רוצה להתחלק בהוצאות?',
    replyCount: 1,
    followCount: 5,
    pinned: false,
    subject: 'kosher_chabad',
  },

  // -- parties --
  {
    id: 'thread-buzios-003',
    forumId: 'forum-buzios',
    authorFriendId: 'roi-buzios',
    title: 'Rua das Pedras — באיזה בר מתחילים?',
    body: 'מגיע סופ״ש סוף אוקטובר. שמעתי על Pacha חבול, ויש בר ספציפי שכולם מתחילים בו? צריך לקבל המלצות לפני שאלך לעצמי.',
    replyCount: 3,
    followCount: 13,
    pinned: false,
    subject: 'parties',
  },
  {
    id: 'thread-buzios-004',
    forumId: 'forum-buzios',
    authorFriendId: null,
    title: 'מסיבת ירח על Praia da Ferradura',
    body: 'שמעתי על מסיבת חוף בלתי רשמית בלילות מלאי ירח. מישהו יודע אם זה עדיין קורה ב־2026?',
    replyCount: 2,
    followCount: 9,
    pinned: false,
    subject: 'parties',
  },

  // -- treks_activities --
  {
    id: 'thread-buzios-005',
    forumId: 'forum-buzios',
    authorFriendId: 'roi-buzios',
    title: 'סנוקלינג ב־Praia Azeda — תנאים החודש',
    body: 'הייתי שם לפני שבוע — מים שקטים בבוקר, אחר הצהריים סוער. מי שמגיע ב־29–31, נצא יחד?',
    replyCount: 3,
    followCount: 14,
    pinned: true,
    subject: 'treks_activities',
  },
  {
    id: 'thread-buzios-006',
    forumId: 'forum-buzios',
    authorFriendId: null,
    title: 'סיור סירות לאיים — איזו חברה מומלצת?',
    body: 'יש לפחות 4 חברות שמציעות סיורים ל־12 חופים. המחיר נע בין R$ 80 ל־R$ 200. ההבדל אמיתי?',
    replyCount: 2,
    followCount: 8,
    pinned: false,
    subject: 'treks_activities',
  },

  // -- restaurants --
  {
    id: 'thread-buzios-007',
    forumId: 'forum-buzios',
    authorFriendId: 'maya-ipanema',
    title: 'Chez Michou — קרפ ראוי או ציד תיירים?',
    body: 'כל בלוג בוזיוס מזכיר את Chez Michou. עברתי שם בעבר וזה היה בסדר אבל לא ענק. דעות עדכניות?',
    replyCount: 3,
    followCount: 11,
    pinned: false,
    subject: 'restaurants',
  },
  {
    id: 'thread-buzios-008',
    forumId: 'forum-buzios',
    authorFriendId: 'roi-buzios',
    title: 'איפה אוכלים פירות ים אמיתיים בבוזיוס?',
    body: 'מחפש מסעדה של דייגים, לא מקום עם מנעולי גלוויה ותפריט באנגלית. צ׳ירינגיטו פשוט על החוף. רעיונות?',
    replyCount: 2,
    followCount: 9,
    pinned: false,
    subject: 'restaurants',
  },

  // -- meetups --
  {
    id: 'thread-buzios-009',
    forumId: 'forum-buzios',
    authorFriendId: null,
    title: 'מי בבוזיוס סוף אוקטובר?',
    body: 'אני שם 29–31, מתאכסן ב־Manguinhos. רועי גם מגיע. עוד מישהו? נארגן ארוחת ערב משותפת.',
    replyCount: 3,
    followCount: 12,
    pinned: false,
    subject: 'meetups',
  },
  {
    id: 'thread-buzios-010',
    forumId: 'forum-buzios',
    authorFriendId: 'maya-ipanema',
    title: 'יום בבוזיוס מריו — מי בא?',
    body: 'שוקלת לעלות באוטובוס של 7:00, לחזור בערב. רוצה חברה לסנוקלינג בבוקר וצהריים ב־Praia João Fernandes.',
    replyCount: 2,
    followCount: 10,
    pinned: false,
    subject: 'meetups',
  },

  // =====================================================================
  // SÃO PAULO — forum-sao-paulo (10 threads, 2 per subject)
  // =====================================================================

  // -- kosher_chabad --
  {
    id: 'thread-sao-paulo-001',
    forumId: 'forum-sao-paulo',
    authorFriendId: null,
    title: 'חב״ד בז׳ארדינס — שבת בעיר',
    body: 'מישהו הולך לחב״ד בז׳ארדינס לשבת? מחפש שולחן ערב או שתיים, לא ארוחה רשמית. מגיע ב־3 לנובמבר.',
    replyCount: 3,
    followCount: 11,
    pinned: false,
    subject: 'kosher_chabad',
  },
  {
    id: 'thread-sao-paulo-002',
    forumId: 'forum-sao-paulo',
    authorFriendId: 'shir-saopaulo',
    title: 'Kosher Delícia בבום רטירו — שווה את הנסיעה?',
    body: 'גרה בוילה מדלנה. שווה לקחת אובר 25 דקות לבום רטירו לארוחת צהריים כשרה? יש משהו טוב יותר קרוב?',
    replyCount: 2,
    followCount: 7,
    pinned: false,
    subject: 'kosher_chabad',
  },

  // -- parties --
  {
    id: 'thread-sao-paulo-003',
    forumId: 'forum-sao-paulo',
    authorFriendId: 'moshe-buenosaires',
    title: 'באר ראשון בלילה בוילה מדלנה — מקום אהוב?',
    body: 'מגיע לסופ״ש מבואנוס, רוצה משהו שלא דורש הזמנה. עדיפות לבירה טובה, לא לדיג׳יי.',
    replyCount: 3,
    followCount: 10,
    pinned: false,
    subject: 'parties',
  },
  {
    id: 'thread-sao-paulo-004',
    forumId: 'forum-sao-paulo',
    authorFriendId: 'shir-saopaulo',
    title: 'D-Edge שישי בלילה — אזהרת המחיר',
    body: 'הלכתי בחמישי שעבר. כניסה R$ 120, בירה R$ 25, ים של אנשים. הקולות אדירים אבל המחיר מטורף. מי הולך השבוע?',
    replyCount: 2,
    followCount: 13,
    pinned: false,
    subject: 'parties',
  },

  // -- treks_activities --
  {
    id: 'thread-sao-paulo-005',
    forumId: 'forum-sao-paulo',
    authorFriendId: null,
    title: 'פארק איבירפואירה — ריצה בבוקר?',
    body: 'גר ליד הפארק לשבועיים. מחפש שותפי ריצה לשעה 6:30. 8–10 ק״מ, קצב נינוח.',
    replyCount: 2,
    followCount: 8,
    pinned: false,
    subject: 'treks_activities',
  },
  {
    id: 'thread-sao-paulo-006',
    forumId: 'forum-sao-paulo',
    authorFriendId: 'shir-saopaulo',
    title: 'יום טיול לפדרה גרנדה',
    body: 'יציאה שבת ב־6:30 מ־Vila Madalena, 2 שעות נסיעה. נדרשות נעליים סגורות, מים, סנדוויץ׳. 4 מקומות באוטו.',
    replyCount: 3,
    followCount: 12,
    pinned: false,
    subject: 'treks_activities',
  },

  // -- restaurants --
  {
    id: 'thread-sao-paulo-007',
    forumId: 'forum-sao-paulo',
    authorFriendId: 'shir-saopaulo',
    title: 'אסאדו ב־La Cabrera שווה את התור?',
    body: 'שמעתי דעות סותרות. שווה לחכות שעה+ בלי הזמנה, או יש מקום באותה רמה בלי התור?',
    replyCount: 3,
    followCount: 14,
    pinned: false,
    subject: 'restaurants',
  },
  {
    id: 'thread-sao-paulo-008',
    forumId: 'forum-sao-paulo',
    authorFriendId: null,
    title: 'מרקאדאו מוניציפל — מה חובה לאכול?',
    body: 'הולך לראשונה ביום שישי. שמעתי על כריך מורטדלה ועל הפיסטלייס. מה עוד אסור לפספס?',
    replyCount: 2,
    followCount: 9,
    pinned: false,
    subject: 'restaurants',
  },

  // -- meetups --
  {
    id: 'thread-sao-paulo-009',
    forumId: 'forum-sao-paulo',
    authorFriendId: 'shir-saopaulo',
    title: 'מי בסאו פאולו 3–8 בנובמבר?',
    body: 'מארחת ערב פתוח אצלי בוילה מדלנה ביום שישי 7. מי בעיר באותו תאריך? מקסימום 8 אנשים.',
    replyCount: 3,
    followCount: 13,
    pinned: false,
    subject: 'meetups',
  },
  {
    id: 'thread-sao-paulo-010',
    forumId: 'forum-sao-paulo',
    authorFriendId: null,
    title: 'מחפש שותפת/ים לטיול בנדידה לסנטוס',
    body: 'מתכנן יום בסנטוס, יציאה באוטובוס מ־Tietê ב־8:00, חזרה בערב. רוצה לא לבד. מישהו פנוי בשבת הקרובה?',
    replyCount: 2,
    followCount: 7,
    pinned: false,
    subject: 'meetups',
  },

  // =====================================================================
  // JERICOACOARA — forum-jericoacoara (10 threads, 2 per subject)
  // =====================================================================

  // -- kosher_chabad --
  {
    id: 'thread-jericoacoara-001',
    forumId: 'forum-jericoacoara',
    authorFriendId: 'yotam-jericoacoara',
    title: 'אין חב״ד בז׳רי — מה עושים על שבת?',
    body: 'בז׳רי לשבועיים. אין בית חב״ד מקומי. מישהו מארגן מנין/קידוש לא רשמי? אם לא, יש כיוון מי שיוכל להביא חלות מפורטלזה?',
    replyCount: 3,
    followCount: 9,
    pinned: false,
    subject: 'kosher_chabad',
  },
  {
    id: 'thread-jericoacoara-002',
    forumId: 'forum-jericoacoara',
    authorFriendId: null,
    title: 'אוכל כשר בז׳רי — אופציות?',
    body: 'יש אופציות צמחוניות אבל לא כשר רשמי. מישהו מנהל בכלל בז׳רי לפי כשרות? איך אתם מסתדרים?',
    replyCount: 2,
    followCount: 6,
    pinned: false,
    subject: 'kosher_chabad',
  },

  // -- parties --
  {
    id: 'thread-jericoacoara-003',
    forumId: 'forum-jericoacoara',
    authorFriendId: 'yotam-jericoacoara',
    title: 'פורו על החוף — איזה לילה הכי טוב?',
    body: 'יש פורו כל לילה ב־Restaurante Tamandaré, אבל שמעתי שגם בשני וברביעי יש נגנים מקומיים טובים. מתי הכי שווה?',
    replyCount: 3,
    followCount: 11,
    pinned: false,
    subject: 'parties',
  },
  {
    id: 'thread-jericoacoara-004',
    forumId: 'forum-jericoacoara',
    authorFriendId: null,
    title: 'מסיבת שקיעה אחרי הדיונה',
    body: 'שמעתי שאחרי השקיעה בדיונה הגדולה יש המשך לא רשמי על החוף. נכון או אגדה?',
    replyCount: 2,
    followCount: 8,
    pinned: false,
    subject: 'parties',
  },

  // -- treks_activities --
  {
    id: 'thread-jericoacoara-005',
    forumId: 'forum-jericoacoara',
    authorFriendId: 'yotam-jericoacoara',
    title: 'Pure Kite — שיעורים, מחירים, ימים',
    body: 'שיעור פרטי R$ 350 לשעה, חבילה של 3 ימים R$ 1,800. יעקב המדריך הראשי, ישראלי, מצוין עם מתחילים. תזמינו דרך WhatsApp.',
    replyCount: 3,
    followCount: 18,
    pinned: true,
    subject: 'treks_activities',
  },
  {
    id: 'thread-jericoacoara-006',
    forumId: 'forum-jericoacoara',
    authorFriendId: 'roi-buzios',
    title: 'שקיעה בדיונה — מה הכי קלאסי?',
    body: 'הייתי שם שנה שעברה. הדיונה של פור־דו־ז׳רי בערב — כדאי להגיע מוקדם, היא מתמלאת.',
    replyCount: 2,
    followCount: 13,
    pinned: false,
    subject: 'treks_activities',
  },

  // -- restaurants --
  {
    id: 'thread-jericoacoara-007',
    forumId: 'forum-jericoacoara',
    authorFriendId: null,
    title: 'איפה אוכלים דגים טריים?',
    body: 'הייתי ב־Tamandaré וב־Espaço Aberto. שניהם בסדר אבל לא ענק. יש מקום סודי של דייגים בז׳רי?',
    replyCount: 2,
    followCount: 9,
    pinned: false,
    subject: 'restaurants',
  },
  {
    id: 'thread-jericoacoara-008',
    forumId: 'forum-jericoacoara',
    authorFriendId: 'yotam-jericoacoara',
    title: 'ארוחת בוקר בז׳רי — Cantinho do Jeri שווה',
    body: 'טאפיוקה עם פירות בשרות R$ 18, מיץ אקסולה R$ 12. פותח 7:00, ריצוף עץ נחמד. אופציה הכי טובה לפני יציאה לקייט.',
    replyCount: 2,
    followCount: 10,
    pinned: false,
    subject: 'restaurants',
  },

  // -- meetups --
  {
    id: 'thread-jericoacoara-009',
    forumId: 'forum-jericoacoara',
    authorFriendId: null,
    title: 'איך מגיעים לז׳רי בלי לקרוע את התקציב?',
    body: 'טיסה לפורטלזה ואז ג׳יפ־משותף? או יש דרך זולה יותר? עם תרמיל גדול ופחות מ־200 ריאל.',
    replyCount: 3,
    followCount: 11,
    pinned: false,
    subject: 'meetups',
  },
  {
    id: 'thread-jericoacoara-010',
    forumId: 'forum-jericoacoara',
    authorFriendId: 'yotam-jericoacoara',
    title: 'קרו קייט 10–13 בנובמבר — מי איתי?',
    body: 'מגיע ל־3 ימי שיעורים ב־Pure Kite. רועי מגיע אחרי בוזיוס. עוד מתחילים/מתקדמים שמצטרפים? נקבע ארוחת ערב משותפת בלילה הראשון.',
    replyCount: 3,
    followCount: 14,
    pinned: false,
    subject: 'meetups',
  },

  // =====================================================================
  // BUENOS AIRES — forum-buenos-aires (10 threads, 2 per subject)
  // =====================================================================

  // -- kosher_chabad --
  {
    id: 'thread-buenos-aires-001',
    forumId: 'forum-buenos-aires',
    authorFriendId: 'moshe-buenosaires',
    title: 'חב״ד הקהילה היהודית באבסטו',
    body: 'בית חב״ד הראשי באבסטו, סדר פתוח כל שבת. תרשם מראש דרך chabad.org.ar עד יום חמישי. הולכים?',
    replyCount: 3,
    followCount: 12,
    pinned: false,
    subject: 'kosher_chabad',
  },
  {
    id: 'thread-buenos-aires-002',
    forumId: 'forum-buenos-aires',
    authorFriendId: 'dana-punta',
    title: 'בשר כשר בבואנוס — Al Galope או Carnicería Levi?',
    body: 'מתארחת אצל חבר בפאלרמו, רוצה להביא בשר לאסאדו. שני המקומות מומלצים. אחד יותר טוב מהשני?',
    replyCount: 2,
    followCount: 8,
    pinned: false,
    subject: 'kosher_chabad',
  },

  // -- parties --
  {
    id: 'thread-buenos-aires-003',
    forumId: 'forum-buenos-aires',
    authorFriendId: 'moshe-buenosaires',
    title: 'מילונגה La Catedral שישי הזה',
    body: 'שיעור ב־22:00, ריקודים עד 4:00. כניסה AR$ 12,000. אווירה פתוחה למתחילים. אני שם כל שישי, מי בא?',
    replyCount: 3,
    followCount: 15,
    pinned: false,
    subject: 'parties',
  },
  {
    id: 'thread-buenos-aires-004',
    forumId: 'forum-buenos-aires',
    authorFriendId: null,
    title: 'Niceto Club — קרנבל יום חמישי',
    body: 'הולך שם לראשונה. שמעתי שיש קרנבל ביום חמישי עם תזמורת חיה. כניסה? קוד לבוש?',
    replyCount: 2,
    followCount: 11,
    pinned: false,
    subject: 'parties',
  },

  // -- treks_activities --
  {
    id: 'thread-buenos-aires-005',
    forumId: 'forum-buenos-aires',
    authorFriendId: null,
    title: 'אופניים בריזרבה אקולוגית — איפה משכירים?',
    body: 'רוצה רכיבה בוקר בריזרבה. ראיתי שיש EcoBici חינם עם רישום, ובאזור הנמל יש Rent a Bike. מה ההבדל?',
    replyCount: 2,
    followCount: 7,
    pinned: false,
    subject: 'treks_activities',
  },
  {
    id: 'thread-buenos-aires-006',
    forumId: 'forum-buenos-aires',
    authorFriendId: 'neta-mendoza',
    title: 'יום במנדוסה מבואנוס — שווה את 12 השעות באוטובוס?',
    body: 'באה מבואנוס ל־3 ימים, יש כאן יקבים אדירים. ברגע שאתם מגיעים יש סיורי יקבים מאורגנים. אבל הדרך ארוכה.',
    replyCount: 3,
    followCount: 10,
    pinned: false,
    subject: 'treks_activities',
  },

  // -- restaurants --
  {
    id: 'thread-buenos-aires-007',
    forumId: 'forum-buenos-aires',
    authorFriendId: 'moshe-buenosaires',
    title: 'Don Julio או La Cabrera — איזה אסאדו?',
    body: 'בני משפחה מגיעים לארוחה אחת, שואלים אותי. שני המקומות מפורסמים, שניהם בפאלרמו. ההבדל באמת?',
    replyCount: 3,
    followCount: 16,
    pinned: false,
    subject: 'restaurants',
  },
  {
    id: 'thread-buenos-aires-008',
    forumId: 'forum-buenos-aires',
    authorFriendId: null,
    title: 'אמפנדאס — איפה הכי טוב?',
    body: 'יש 800 מקומות שמוכרים אמפנדאס בבואנוס. אני רוצה אחד טוב, לא 6 בינוניים. רחוב Defensa? פאלרמו? סן טלמו?',
    replyCount: 2,
    followCount: 12,
    pinned: false,
    subject: 'restaurants',
  },

  // -- meetups --
  {
    id: 'thread-buenos-aires-009',
    forumId: 'forum-buenos-aires',
    authorFriendId: 'moshe-buenosaires',
    title: 'גר בפאלרמו חודש — מה לעשות אצלי?',
    body: 'יש לי דירה בפאלרמו סוהו עד דצמבר. מקבל אנשים לקפה/אסאדו על הגג. כתבו לי.',
    replyCount: 3,
    followCount: 17,
    pinned: false,
    subject: 'meetups',
  },
  {
    id: 'thread-buenos-aires-010',
    forumId: 'forum-buenos-aires',
    authorFriendId: 'uri-bariloche',
    title: 'מי עובר דרך בריילוצ׳ה לפני בואנוס?',
    body: 'אני בבריילוצ׳ה עד אמצע נובמבר, ממליץ למי שמגיע לארגנטינה לעצור 3 ימים בדרום לפני בואנוס. אם מישהו עובר — דרך הצי לטה גם בטוחה ויפה.',
    replyCount: 2,
    followCount: 9,
    pinned: false,
    subject: 'meetups',
  },
];
