/**
 * Forum thread replies — seeded responses on the threads in `forumThreads.ts`.
 *
 * SEED ONLY. Runtime data lives in `forum_thread_replies`.
 *
 * Distribution is uneven — busy threads get 3 replies, sleeper threads get
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
  // =====================================================================
  // RIO
  // =====================================================================

  // thread-rio-001 — חב״ד קופקבנה שבת (3 replies)
  {
    id: 'thread-rio-001-r1',
    threadId: 'thread-rio-001',
    authorFriendId: null,
    body: 'תודה מאיה. נרשמתי דרך הקישור. שלך לסעודה?',
  },
  {
    id: 'thread-rio-001-r2',
    threadId: 'thread-rio-001',
    authorFriendId: 'yael-botafogo',
    body: 'אני באה. סבבה לאסוף אותך מ־Posto 6 ב־18:30?',
  },
  {
    id: 'thread-rio-001-r3',
    threadId: 'thread-rio-001',
    authorFriendId: 'maya-ipanema',
    body: 'יעל מצוין 🙏 ניפגש שם. נסים שווה לבוא אם אתה עדיין בעיר.',
  },

  // thread-rio-002 — בשר כשר בריו (2 replies)
  {
    id: 'thread-rio-002-r1',
    threadId: 'thread-rio-002',
    authorFriendId: 'maya-ipanema',
    body: 'Kosher Rio פתוח 9:00–18:00 חוץ משבת. ברחוב Anita Garibaldi 49. יש להם גם המבורגרים קפואים, חבל לפספס.',
  },
  {
    id: 'thread-rio-002-r2',
    threadId: 'thread-rio-002',
    authorFriendId: 'yael-botafogo',
    body: 'Talmud Torah רחוק יותר אבל המחירים סבירים. אם מזמינים מראש הם מארגנים משלוח לקופה.',
  },

  // thread-rio-003 — בלוקו רחוב (3 replies)
  {
    id: 'thread-rio-003-r1',
    threadId: 'thread-rio-003',
    authorFriendId: 'maya-ipanema',
    body: 'אני באה! אבל מ־23:00, יש לי דבר לפני. תחכי לי?',
  },
  {
    id: 'thread-rio-003-r2',
    threadId: 'thread-rio-003',
    authorFriendId: null,
    body: 'וואלה בא לי. צריך להביא משהו ספציפי או רק בירה?',
  },
  {
    id: 'thread-rio-003-r3',
    threadId: 'thread-rio-003',
    authorFriendId: 'yael-botafogo',
    body: 'מאיה אני שם עד 1:00 מקסימום, מחר בוקר אקדמיה. נסים בירה ופלפל, מים אם תזכור 🔥',
  },

  // thread-rio-004 — Rio Scenarium (2 replies)
  {
    id: 'thread-rio-004-r1',
    threadId: 'thread-rio-004',
    authorFriendId: 'roi-buzios',
    body: 'תנסי Pedra do Sal יום שני בערב, סמבה אמיתית, חינם, מקומיים בלבד. Rio Scenarium כבר לא מה שהיה.',
  },
  {
    id: 'thread-rio-004-r2',
    threadId: 'thread-rio-004',
    authorFriendId: 'yael-botafogo',
    body: 'גם Carioca da Gema ברחוב Mem de Sá. R$ 30 כניסה, סמבה לכל הערב, אווירה הכי לאפה.',
  },

  // thread-rio-005 — Pedra da Gávea (3 replies)
  {
    id: 'thread-rio-005-r1',
    threadId: 'thread-rio-005',
    authorFriendId: 'maya-ipanema',
    body: 'אני בעניין. שעה אגרסיבית אבל מצוין. צריך מדריך לחלק הזחילה האחרון?',
  },
  {
    id: 'thread-rio-005-r2',
    threadId: 'thread-rio-005',
    authorFriendId: null,
    body: 'מאיה אחרון פעם עליתי בלי מדריך, יש חבלים קבועים. אבל אם את לא בטוחה, יש לי מספר של מדריך מקומי R$ 80.',
  },
  {
    id: 'thread-rio-005-r3',
    threadId: 'thread-rio-005',
    authorFriendId: 'roi-buzios',
    body: 'אחי תקפיד על נעלי הליכה אמיתיות, לא ספורט. הסלעים חלקלקים בבוקר.',
  },

  // thread-rio-006 — Gracie Humaitá (2 replies)
  {
    id: 'thread-rio-006-r1',
    threadId: 'thread-rio-006',
    authorFriendId: null,
    body: 'הייתי שם פעמיים. R$ 90 ליום, מחייב חולצת לבן ובטיחות עצמית. עדיף להתקשר יום קודם.',
  },
  {
    id: 'thread-rio-006-r2',
    threadId: 'thread-rio-006',
    authorFriendId: 'roi-buzios',
    body: 'אם את רוצה משהו פחות פורמלי תנסי Checkmat ב־Ipanema. אווירה ישראלית, מדריך עברית, פחות שיפוט.',
  },

  // thread-rio-007 — Aconchego Carioca (3 replies)
  {
    id: 'thread-rio-007-r1',
    threadId: 'thread-rio-007',
    authorFriendId: 'maya-ipanema',
    body: 'שווה כל דקת נסיעה 🔥 הבולינוס של חצי שמינית R$ 35, והוא ענק. תזמיני מקום מראש לשישי.',
  },
  {
    id: 'thread-rio-007-r2',
    threadId: 'thread-rio-007',
    authorFriendId: null,
    body: 'אני בא איתך! מתי את חושבת?',
  },
  {
    id: 'thread-rio-007-r3',
    threadId: 'thread-rio-007',
    authorFriendId: 'yael-botafogo',
    body: 'תזמינו ב־OpenTable, הם לא עונים בוואטסאפ. שישי 20:00 הכי טוב.',
  },

  // thread-rio-008 — אסאי אמיתי (2 replies)
  {
    id: 'thread-rio-008-r1',
    threadId: 'thread-rio-008',
    authorFriendId: 'maya-ipanema',
    body: 'BB Lanches על Rainha Elizabeth, פינת R. Almirante Gonçalves. R$ 18 לקערה. אמיתי, סמיך, בלי סוכר אם תבקש.',
  },
  {
    id: 'thread-rio-008-r2',
    threadId: 'thread-rio-008',
    authorFriendId: 'yael-botafogo',
    body: 'מסכימה עם מאיה. גם Polis Sucos בבוטפוגו אם את עוברת ⭐',
  },

  // thread-rio-009 — מי בקופקבנה (3 replies)
  {
    id: 'thread-rio-009-r1',
    threadId: 'thread-rio-009',
    authorFriendId: 'maya-ipanema',
    body: 'אני באיפנמה, מגיעה ל־Posto 9 רביעי בערב. שם.',
  },
  {
    id: 'thread-rio-009-r2',
    threadId: 'thread-rio-009',
    authorFriendId: null,
    body: 'אם זה לא יורד גשם, אני בא. תגידו על הקבוצה בוואטסאפ.',
  },
  {
    id: 'thread-rio-009-r3',
    threadId: 'thread-rio-009',
    authorFriendId: 'roi-buzios',
    body: 'אני יוצא לבוזיוס בסוף השבוע, אבל אם זה ביום שני־שלישי אני בעניין.',
  },

  // thread-rio-010 — מפגש Pavão Azul (3 replies)
  {
    id: 'thread-rio-010-r1',
    threadId: 'thread-rio-010',
    authorFriendId: 'maya-ipanema',
    body: 'אין מצב, רעיון מעולה 🙏 אני באה. מציעה גם להוסיף קבוצת ווצאפ לתיאומים.',
  },
  {
    id: 'thread-rio-010-r2',
    threadId: 'thread-rio-010',
    authorFriendId: 'yael-botafogo',
    body: 'בעיני שלישי 19:00 מוקדם, אנשים יושבים על העבודה. 20:30 יותר ריאלי. אבל אני באה בכל מקרה.',
  },
  {
    id: 'thread-rio-010-r3',
    threadId: 'thread-rio-010',
    authorFriendId: 'roi-buzios',
    body: 'אני אעבור כשאחזור מבוזיוס. שמרו מקום.',
  },

  // =====================================================================
  // BÚZIOS
  // =====================================================================

  // thread-buzios-001 — חב״ד בבוזיוס (2 replies)
  {
    id: 'thread-buzios-001-r1',
    threadId: 'thread-buzios-001',
    authorFriendId: 'roi-buzios',
    body: 'אין חב״ד בבוזיוס. הקרוב ברצי״ו, שעתיים נסיעה. אם זה שבת חשוב לך, באמת עדיף לחזור.',
  },
  {
    id: 'thread-buzios-001-r2',
    threadId: 'thread-buzios-001',
    authorFriendId: 'maya-ipanema',
    body: 'אופציה: לקבל שבת בבוזיוס בעצמך, להביא חלות מ־Kosher Rio. אווירה אחרת אבל אם זה רק 24 שעות זה אפשרי.',
  },

  // thread-buzios-002 — בשר כשר (1 reply)
  {
    id: 'thread-buzios-002-r1',
    threadId: 'thread-buzios-002',
    authorFriendId: null,
    body: 'אחי אני מצטרף. אביא ירקות, יין, ולחם פיתה. נסגור בDM.',
  },

  // thread-buzios-003 — Rua das Pedras (3 replies)
  {
    id: 'thread-buzios-003-r1',
    threadId: 'thread-buzios-003',
    authorFriendId: 'maya-ipanema',
    body: 'מתחילים ב־Privilege על הרוע, סמוך לים. הפצה של אנשים אחרי 23:00. כניסה R$ 50, יחסית סביר.',
  },
  {
    id: 'thread-buzios-003-r2',
    threadId: 'thread-buzios-003',
    authorFriendId: null,
    body: 'אני אהיה שם 29–31, נצא יחד? מסכים על Privilege להתחלה.',
  },
  {
    id: 'thread-buzios-003-r3',
    threadId: 'thread-buzios-003',
    authorFriendId: 'roi-buzios',
    body: 'סבבה. גם Anexo Bar טוב, יותר רגוע, יותר זול. נתחיל שם, נעבור ל־Privilege לחצות.',
  },

  // thread-buzios-004 — מסיבת ירח (2 replies)
  {
    id: 'thread-buzios-004-r1',
    threadId: 'thread-buzios-004',
    authorFriendId: 'roi-buzios',
    body: 'עדיין קורה אבל פחות עניין, יותר תיירים. אם זה חופף ל־30 בחודש זה היום המלא. תביא רמקול ובירה.',
  },
  {
    id: 'thread-buzios-004-r2',
    threadId: 'thread-buzios-004',
    authorFriendId: 'maya-ipanema',
    body: 'הייתי לפני שנתיים, היה אגדי. עכשיו פחות אותנטי אבל עדיין שווה את ההליכה לחוף.',
  },

  // thread-buzios-005 — סנוקלינג Praia Azeda (3 replies)
  {
    id: 'thread-buzios-005-r1',
    threadId: 'thread-buzios-005',
    authorFriendId: null,
    body: 'אני שם 29–31, מצטרף. יש לך משקפי שחייה לתת בהשאלה? שכחתי בריו.',
  },
  {
    id: 'thread-buzios-005-r2',
    threadId: 'thread-buzios-005',
    authorFriendId: 'shir-saopaulo',
    body: 'אם המים שקטים בבוקר, גם Praia João Fernandes יפה. שווה לבדוק.',
  },
  {
    id: 'thread-buzios-005-r3',
    threadId: 'thread-buzios-005',
    authorFriendId: 'roi-buzios',
    body: 'יש לי שני זוגות משקפי שחייה. נסגור פרטים בDM 🤿',
  },

  // thread-buzios-006 — סיור סירות (2 replies)
  {
    id: 'thread-buzios-006-r1',
    threadId: 'thread-buzios-006',
    authorFriendId: 'roi-buzios',
    body: 'R$ 80 זה Schooner ענק עם 80 אנשים, R$ 200 זה לאנצ׳ה פרטית קטנה. ההבדל אמיתי לגמרי. תפזרו על 4–6 אנשים את העלות.',
  },
  {
    id: 'thread-buzios-006-r2',
    threadId: 'thread-buzios-006',
    authorFriendId: null,
    body: 'תודה. מחפש קבוצה לחלוק לאנצ׳ה. 29 בבוקר. כתבו לי בDM אם בא לכם.',
  },

  // thread-buzios-007 — Chez Michou (3 replies)
  {
    id: 'thread-buzios-007-r1',
    threadId: 'thread-buzios-007',
    authorFriendId: 'roi-buzios',
    body: 'בעיני עדיין שווה — אבל לקח אחרי 23:00. בצהריים תור מטורף, אחרי חצות יותר רגוע ויותר טוב.',
  },
  {
    id: 'thread-buzios-007-r2',
    threadId: 'thread-buzios-007',
    authorFriendId: null,
    body: 'מאיה תני לי דעה לאחרונה? אני שוקלת להחליף ל־Bananaland או משהו אחר.',
  },
  {
    id: 'thread-buzios-007-r3',
    threadId: 'thread-buzios-007',
    authorFriendId: 'maya-ipanema',
    body: 'הייתי שם בקיץ, היה בסדר. אבל Bananaland יותר טוב לארוחת בוקר. Chez Michou רק בלילה.',
  },

  // thread-buzios-008 — פירות ים (2 replies)
  {
    id: 'thread-buzios-008-r1',
    threadId: 'thread-buzios-008',
    authorFriendId: 'maya-ipanema',
    body: 'Cigalon ב־Ferradurinha. שולחנות על החול, ארוחה R$ 90 לאדם, דייגים מקומיים מביאים בבוקר. הזהרה: סגור בשני.',
  },
  {
    id: 'thread-buzios-008-r2',
    threadId: 'thread-buzios-008',
    authorFriendId: 'roi-buzios',
    body: 'גם Sawasdee חזק. שניהם לא תיירותיים. תזמין מראש לסופ״ש.',
  },

  // thread-buzios-009 — מי בבוזיוס (3 replies)
  {
    id: 'thread-buzios-009-r1',
    threadId: 'thread-buzios-009',
    authorFriendId: 'roi-buzios',
    body: 'אני שם, נסים. נסגור ארוחת ערב ב־Chez Michou לאחת מהלילות. סבבה?',
  },
  {
    id: 'thread-buzios-009-r2',
    threadId: 'thread-buzios-009',
    authorFriendId: 'maya-ipanema',
    body: 'אגיע ליום אחד בשבת, אחרי הסנוקלינג של הבוקר. אצטרף לארוחה אם זה בצהריים.',
  },
  {
    id: 'thread-buzios-009-r3',
    threadId: 'thread-buzios-009',
    authorFriendId: 'shir-saopaulo',
    body: 'מקנאה. תיהנו 🙏 שלחו תמונות.',
  },

  // thread-buzios-010 — יום בבוזיוס מריו (2 replies)
  {
    id: 'thread-buzios-010-r1',
    threadId: 'thread-buzios-010',
    authorFriendId: 'yael-botafogo',
    body: 'אני נכנסת. סנוקלינג בבוקר נשמע מושלם. אאסוף אותך ב־Novo Rio ב־6:45?',
  },
  {
    id: 'thread-buzios-010-r2',
    threadId: 'thread-buzios-010',
    authorFriendId: 'maya-ipanema',
    body: 'יעל מעולה. שתינו בקבוצת ווצאפ קטנה? אשלח קישור בDM.',
  },

  // =====================================================================
  // SÃO PAULO
  // =====================================================================

  // thread-sao-paulo-001 — חב״ד ז׳ארדינס (3 replies)
  {
    id: 'thread-sao-paulo-001-r1',
    threadId: 'thread-sao-paulo-001',
    authorFriendId: 'shir-saopaulo',
    body: 'בית חב״ד ז׳ארדינס מארח שולחנות פתוחים. מומלץ לאשר מראש דרך האתר. הרב מאיר מארח, אווירה ישראלית.',
  },
  {
    id: 'thread-sao-paulo-001-r2',
    threadId: 'thread-sao-paulo-001',
    authorFriendId: null,
    body: 'תודה שיר. אשלח מייל בשבוע הבא.',
  },
  {
    id: 'thread-sao-paulo-001-r3',
    threadId: 'thread-sao-paulo-001',
    authorFriendId: 'moshe-buenosaires',
    body: 'אם תפספס שולחן, גם בית כנסת Cong. Israelita מארח לשבת. פחות חב״די, יותר מסורתי.',
  },

  // thread-sao-paulo-002 — Kosher Delícia (2 replies)
  {
    id: 'thread-sao-paulo-002-r1',
    threadId: 'thread-sao-paulo-002',
    authorFriendId: null,
    body: 'הייתי שם פעמיים — שווה הנסיעה. הצלעות שלהם מצוינות, R$ 95 ליחיד עם תוספות.',
  },
  {
    id: 'thread-sao-paulo-002-r2',
    threadId: 'thread-sao-paulo-002',
    authorFriendId: 'moshe-buenosaires',
    body: 'יש גם Kosher Express בז׳ארדינס יותר קרוב אליך. פחות מרשים אבל נוח.',
  },

  // thread-sao-paulo-003 — באר בוילה (3 replies)
  {
    id: 'thread-sao-paulo-003-r1',
    threadId: 'thread-sao-paulo-003',
    authorFriendId: 'shir-saopaulo',
    body: 'Coisa Linda בוילה. בירה מקומית, אוכל פשוט, בלי דיג׳יי. בערב חמישי־שישי מתמלא.',
  },
  {
    id: 'thread-sao-paulo-003-r2',
    threadId: 'thread-sao-paulo-003',
    authorFriendId: null,
    body: 'גם Veloso טוב — אבל יותר עמוס. תלוי אם אתה רוצה לפגוש מקומיים או רגוע.',
  },
  {
    id: 'thread-sao-paulo-003-r3',
    threadId: 'thread-sao-paulo-003',
    authorFriendId: 'yael-botafogo',
    body: 'Coisa Linda. אני חוזרת שמה כל פעם 🍻',
  },

  // thread-sao-paulo-004 — D-Edge (2 replies)
  {
    id: 'thread-sao-paulo-004-r1',
    threadId: 'thread-sao-paulo-004',
    authorFriendId: 'moshe-buenosaires',
    body: 'אחי R$ 120 לכניסה זה שוד 😂 אבל הקולות שם הכי טובים בעיר. אם זה DJ ספציפי שאתה אוהב, שווה. אחרת — Mirante 9 de Julho חינם.',
  },
  {
    id: 'thread-sao-paulo-004-r2',
    threadId: 'thread-sao-paulo-004',
    authorFriendId: 'yael-botafogo',
    body: 'אני הולכת שישי. רוצה להצטרף? נחלק טקסי, יוצא יותר זול.',
  },

  // thread-sao-paulo-005 — איבירפואירה ריצה (2 replies)
  {
    id: 'thread-sao-paulo-005-r1',
    threadId: 'thread-sao-paulo-005',
    authorFriendId: 'shir-saopaulo',
    body: 'אני רצה שם כל שני וחמישי 7:00. תוסיף 30 דקות ונוכל לרוץ יחד. נפגשים ב־Portão 7?',
  },
  {
    id: 'thread-sao-paulo-005-r2',
    threadId: 'thread-sao-paulo-005',
    authorFriendId: null,
    body: 'שיר מצוין. שני 7:00 ב־Portão 7. אביא מים אקסטרה.',
  },

  // thread-sao-paulo-006 — פדרה גרנדה (3 replies)
  {
    id: 'thread-sao-paulo-006-r1',
    threadId: 'thread-sao-paulo-006',
    authorFriendId: null,
    body: 'אני בעניין! יש לי תיק יומי וקנקן מים גדול. צריך להביא משהו לאוטו?',
  },
  {
    id: 'thread-sao-paulo-006-r2',
    threadId: 'thread-sao-paulo-006',
    authorFriendId: 'yael-botafogo',
    body: 'אני באה. שיר אם נשארים 4 מקומות אני שני מתוכם — מביאה את החברה שלי טל.',
  },
  {
    id: 'thread-sao-paulo-006-r3',
    threadId: 'thread-sao-paulo-006',
    authorFriendId: 'shir-saopaulo',
    body: 'מצוין שניכם. אחד מקום פנוי. נחלק 70 ריאל לאדם לדלק. אשלח כתובת בDM בחמישי.',
  },

  // thread-sao-paulo-007 — La Cabrera (3 replies)
  {
    id: 'thread-sao-paulo-007-r1',
    threadId: 'thread-sao-paulo-007',
    authorFriendId: 'shir-saopaulo',
    body: 'שווה — אבל רק אם אתה אוהב Bife de chorizo. הגעתי 18:30 בלי תור, נכנסתי תוך 20 דקות.',
  },
  {
    id: 'thread-sao-paulo-007-r2',
    threadId: 'thread-sao-paulo-007',
    authorFriendId: 'moshe-buenosaires',
    body: 'לי דווקא Don Julio (אם תהיה בבואנוס) יותר מרשים. אבל בסאו פאולו, La Cabrera טוב.',
  },
  {
    id: 'thread-sao-paulo-007-r3',
    threadId: 'thread-sao-paulo-007',
    authorFriendId: 'yotam-jericoacoara',
    body: 'תלך גם ל־A Casa do Porco באותו רחוב. שונה, אבל ברמה 🔥',
  },

  // thread-sao-paulo-008 — מרקאדאו (2 replies)
  {
    id: 'thread-sao-paulo-008-r1',
    threadId: 'thread-sao-paulo-008',
    authorFriendId: 'shir-saopaulo',
    body: 'כריך מורטדלה ב־Hocca Bar (R$ 65 גדול), פסטל בקלאו ב־Bar do Mané. שתי הקלאסיקות.',
  },
  {
    id: 'thread-sao-paulo-008-r2',
    threadId: 'thread-sao-paulo-008',
    authorFriendId: 'moshe-buenosaires',
    body: 'גם פירות אקזוטיים בקומה הראשונה. תבקש לטעום cupuaçu לפני שאתה קונה — לא לכל אחד.',
  },

  // thread-sao-paulo-009 — ערב פתוח (3 replies)
  {
    id: 'thread-sao-paulo-009-r1',
    threadId: 'thread-sao-paulo-009',
    authorFriendId: null,
    body: 'אני בעיר 3–5. בא לערב 7. צריך להביא משהו?',
  },
  {
    id: 'thread-sao-paulo-009-r2',
    threadId: 'thread-sao-paulo-009',
    authorFriendId: 'yael-botafogo',
    body: 'גם אני! מתי אתם נכנסים? אביא קאיפיריניות מוכנות מהבית.',
  },
  {
    id: 'thread-sao-paulo-009-r3',
    threadId: 'thread-sao-paulo-009',
    authorFriendId: 'shir-saopaulo',
    body: 'מצוין שניכם. נסים אם תוכל להביא יין אדום וגבינה זה יושלם. יעל קאיפיריניות מקובלות 🍹',
  },

  // thread-sao-paulo-010 — סנטוס (2 replies)
  {
    id: 'thread-sao-paulo-010-r1',
    threadId: 'thread-sao-paulo-010',
    authorFriendId: 'shir-saopaulo',
    body: 'הייתי שם פעם, האקווריום מצוין, החוף בינוני. אם אתה מעוניין בכדורגל יש מוזיאון פלה. יום מלא.',
  },
  {
    id: 'thread-sao-paulo-010-r2',
    threadId: 'thread-sao-paulo-010',
    authorFriendId: 'moshe-buenosaires',
    body: 'אני מצטרף אם אני עוד פה בשבת. תשלח שעות, אשלים מאוחר יותר.',
  },

  // =====================================================================
  // JERICOACOARA
  // =====================================================================

  // thread-jericoacoara-001 — אין חב״ד (3 replies)
  {
    id: 'thread-jericoacoara-001-r1',
    threadId: 'thread-jericoacoara-001',
    authorFriendId: null,
    body: 'יותם אני יכול להביא חלות אם אגיע ב־9. תאשר תאריך ואסדר.',
  },
  {
    id: 'thread-jericoacoara-001-r2',
    threadId: 'thread-jericoacoara-001',
    authorFriendId: 'roi-buzios',
    body: 'מגיע ב־11 בנובמבר אחרי בוזיוס. אביא יין ומפה לבנה. נעשה קידוש על החוף, יהיה בלאגן.',
  },
  {
    id: 'thread-jericoacoara-001-r3',
    threadId: 'thread-jericoacoara-001',
    authorFriendId: 'yotam-jericoacoara',
    body: 'אגדי 🙏 נסים אם תביא חלות, רועי יין ומפה, אני מסדר דגים ואורז על האש. שבת בז׳רי.',
  },

  // thread-jericoacoara-002 — אוכל כשר ז׳רי (2 replies)
  {
    id: 'thread-jericoacoara-002-r1',
    threadId: 'thread-jericoacoara-002',
    authorFriendId: 'yotam-jericoacoara',
    body: 'אני מסתדר עם דגים טריים מהדייגים (כשר אחרי בדיקה), ירקות, ביצים, ולחם פיתה שאני אופה במיני־תנור. אפשר.',
  },
  {
    id: 'thread-jericoacoara-002-r2',
    threadId: 'thread-jericoacoara-002',
    authorFriendId: null,
    body: 'תודה. נראה לי שאקנה משהו בפורטלזה ואביא איתי. הדגים זה רעיון טוב.',
  },

  // thread-jericoacoara-003 — פורו (3 replies)
  {
    id: 'thread-jericoacoara-003-r1',
    threadId: 'thread-jericoacoara-003',
    authorFriendId: null,
    body: 'הייתי שם בשני בערב חודש שעבר — היה אדיר. רביעי גם טוב, פחות אנשים.',
  },
  {
    id: 'thread-jericoacoara-003-r2',
    threadId: 'thread-jericoacoara-003',
    authorFriendId: 'roi-buzios',
    body: 'שלישי הוא היום של הזקנים המקומיים. נגנים אמיתיים, פחות תיירים. הכי טוב בעיני.',
  },
  {
    id: 'thread-jericoacoara-003-r3',
    threadId: 'thread-jericoacoara-003',
    authorFriendId: 'yotam-jericoacoara',
    body: 'מסכים עם רועי. שלישי גם פתוח עד 2:00 בלי קונפליקטים עם קייט בבוקר.',
  },

  // thread-jericoacoara-004 — מסיבת שקיעה (2 replies)
  {
    id: 'thread-jericoacoara-004-r1',
    threadId: 'thread-jericoacoara-004',
    authorFriendId: 'yotam-jericoacoara',
    body: 'אמיתי לחלוטין. אחרי שכולם זזים מהדיונה, נשארים כ־40 אנשים, מישהו מוציא רמקול. עד 22:00 בערך.',
  },
  {
    id: 'thread-jericoacoara-004-r2',
    threadId: 'thread-jericoacoara-004',
    authorFriendId: 'maya-ipanema',
    body: 'הייתי לפני חצי שנה, אגדי. תביאו בירה משלכם, אין חנות קרובה.',
  },

  // thread-jericoacoara-005 — Pure Kite (3 replies)
  {
    id: 'thread-jericoacoara-005-r1',
    threadId: 'thread-jericoacoara-005',
    authorFriendId: 'roi-buzios',
    body: 'תאשר את התאריכים מראש, בשיא העונה הוא ממולא. הזמנתי כבר ל־11 בנובמבר.',
  },
  {
    id: 'thread-jericoacoara-005-r2',
    threadId: 'thread-jericoacoara-005',
    authorFriendId: null,
    body: 'אני שולח לו מייל הערב. תודה יותם 🙏',
  },
  {
    id: 'thread-jericoacoara-005-r3',
    threadId: 'thread-jericoacoara-005',
    authorFriendId: 'shir-saopaulo',
    body: 'מקנאה. בעוד 3 חודשים אגיע גם, רושמת אצלכם 🪁',
  },

  // thread-jericoacoara-006 — שקיעה בדיונה (2 replies)
  {
    id: 'thread-jericoacoara-006-r1',
    threadId: 'thread-jericoacoara-006',
    authorFriendId: 'yotam-jericoacoara',
    body: 'תגיע 40 דקות לפני, תקנה קוקטייל מהבר בתחילת הדיונה. שיא של הטיול.',
  },
  {
    id: 'thread-jericoacoara-006-r2',
    threadId: 'thread-jericoacoara-006',
    authorFriendId: null,
    body: 'נשמע אגדי. תודה רועי 🙏',
  },

  // thread-jericoacoara-007 — דגים טריים (2 replies)
  {
    id: 'thread-jericoacoara-007-r1',
    threadId: 'thread-jericoacoara-007',
    authorFriendId: 'yotam-jericoacoara',
    body: 'תגיע לחוף הדייגים ב־17:00 כשהסירות חוזרות. אישה בשם דונה זלמירה מבשלת בבית שלה — R$ 45 לאדם, צריך לתאם יום קודם.',
  },
  {
    id: 'thread-jericoacoara-007-r2',
    threadId: 'thread-jericoacoara-007',
    authorFriendId: 'roi-buzios',
    body: 'אישרתי 🐟 דונה זלמירה הכי טובה בז׳רי. תזכיר את יותם, היא יודעת.',
  },

  // thread-jericoacoara-008 — ארוחת בוקר (2 replies)
  {
    id: 'thread-jericoacoara-008-r1',
    threadId: 'thread-jericoacoara-008',
    authorFriendId: null,
    body: 'יותם תודה — נרשם. שמעתי גם על Camões, מה דעתך?',
  },
  {
    id: 'thread-jericoacoara-008-r2',
    threadId: 'thread-jericoacoara-008',
    authorFriendId: 'yotam-jericoacoara',
    body: 'Camões יקר יותר, אוכל בסדר. אם אתה רעב באמת תלך ל־Cantinho. אם רוצה אקסטרה תפנוקים, Camões.',
  },

  // thread-jericoacoara-009 — איך להגיע (3 replies)
  {
    id: 'thread-jericoacoara-009-r1',
    threadId: 'thread-jericoacoara-009',
    authorFriendId: 'yotam-jericoacoara',
    body: 'טיסה לפורטלזה ואז ג׳יפ־משותף ל־Jijoca ומשם ג׳יפ לז׳רי. כ־180 ריאל סה״כ אם תזמן לבד.',
  },
  {
    id: 'thread-jericoacoara-009-r2',
    threadId: 'thread-jericoacoara-009',
    authorFriendId: 'shir-saopaulo',
    body: 'אופציה זולה יותר: אוטובוס לילה מפורטלזה ל־Jijoca, ואז ג׳יפ. ארוך אבל פחות מ־100 ריאל.',
  },
  {
    id: 'thread-jericoacoara-009-r3',
    threadId: 'thread-jericoacoara-009',
    authorFriendId: null,
    body: 'נראה לי שאני הולך על ג׳יפ־משותף, לא אקח את הסיכון של אוטובוס לילה עם תרמיל גדול.',
  },

  // thread-jericoacoara-010 — קרו קייט (3 replies)
  {
    id: 'thread-jericoacoara-010-r1',
    threadId: 'thread-jericoacoara-010',
    authorFriendId: 'roi-buzios',
    body: 'אני בעניין 100%. נוחת ב־11 ב־14:00. נארגן ארוחת ערב באותו ערב ב־Tamandaré? 20:30?',
  },
  {
    id: 'thread-jericoacoara-010-r2',
    threadId: 'thread-jericoacoara-010',
    authorFriendId: null,
    body: 'גם אני בא. עוד מתחיל. נסגור Tamandaré 20:30 ב־11. שיר ועוד יבואו בנובמבר הבא ✓',
  },
  {
    id: 'thread-jericoacoara-010-r3',
    threadId: 'thread-jericoacoara-010',
    authorFriendId: 'yotam-jericoacoara',
    body: 'מושלם. אזמין שולחן ל־3 ב־Tamandaré. אם מישהו עוד מצטרף — תכתבו עד יום קודם.',
  },

  // =====================================================================
  // BUENOS AIRES
  // =====================================================================

  // thread-buenos-aires-001 — חב״ד אבסטו (3 replies)
  {
    id: 'thread-buenos-aires-001-r1',
    threadId: 'thread-buenos-aires-001',
    authorFriendId: null,
    body: 'משה תודה. נרשמתי לשבת 21 בנובמבר. תפגוש אותי שם?',
  },
  {
    id: 'thread-buenos-aires-001-r2',
    threadId: 'thread-buenos-aires-001',
    authorFriendId: 'yael-botafogo',
    body: 'גם אני באה לשבת ההיא. אאסוף אותך נסים מהאוסטל אם תרצה?',
  },
  {
    id: 'thread-buenos-aires-001-r3',
    threadId: 'thread-buenos-aires-001',
    authorFriendId: 'moshe-buenosaires',
    body: 'מצוין שניכם. הסעודה ב־20:30, אנשים מתחילים להגיע מ־19:30. תגיעו עם תיק קטן, אסור עם כבדים אצלם.',
  },

  // thread-buenos-aires-002 — בשר כשר (2 replies)
  {
    id: 'thread-buenos-aires-002-r1',
    threadId: 'thread-buenos-aires-002',
    authorFriendId: 'moshe-buenosaires',
    body: 'Al Galope. צ׳וריסו ופיקנייה ברמה אחרת. R$ קצת יותר אבל שווה. Levi בסדר אבל פחות בחירה.',
  },
  {
    id: 'thread-buenos-aires-002-r2',
    threadId: 'thread-buenos-aires-002',
    authorFriendId: 'dana-punta',
    body: 'תודה משה. אעבור שם מחר. את הצ׳וריסו אני אוהבת כבר 🥩',
  },

  // thread-buenos-aires-003 — La Catedral מילונגה (3 replies)
  {
    id: 'thread-buenos-aires-003-r1',
    threadId: 'thread-buenos-aires-003',
    authorFriendId: null,
    body: 'משה אני בעיר עד 25. אבוא לשישי הקרוב. נעליים מיוחדות חובה או רק סוליה חלקה?',
  },
  {
    id: 'thread-buenos-aires-003-r2',
    threadId: 'thread-buenos-aires-003',
    authorFriendId: 'moshe-buenosaires',
    body: 'סוליה חלקה מספיק לטירונים. אל תבוא בנעלי ספורט, ירשו אותך לרקוד אבל זה לא נעים.',
  },
  {
    id: 'thread-buenos-aires-003-r3',
    threadId: 'thread-buenos-aires-003',
    authorFriendId: 'yael-botafogo',
    body: 'אני באה גם 🙋‍♀️ פעם ראשונה במילונגה, פוחדת קצת. אבל בא לי.',
  },

  // thread-buenos-aires-004 — Niceto (2 replies)
  {
    id: 'thread-buenos-aires-004-r1',
    threadId: 'thread-buenos-aires-004',
    authorFriendId: 'moshe-buenosaires',
    body: 'Club 69 קרנבל ב־Niceto, רביעי בלילה. כניסה AR$ 15,000, פותח 1:00. לבוש: שחור, יותר חופשי יותר טוב 🔥',
  },
  {
    id: 'thread-buenos-aires-004-r2',
    threadId: 'thread-buenos-aires-004',
    authorFriendId: null,
    body: 'משה איך אני נכנס בלי שיכמת אותי? יש רשימה?',
  },

  // thread-buenos-aires-005 — אופניים (2 replies)
  {
    id: 'thread-buenos-aires-005-r1',
    threadId: 'thread-buenos-aires-005',
    authorFriendId: 'moshe-buenosaires',
    body: 'EcoBici חינם אבל הרישום מסובך לתיירים, צריך מסמך מקומי. Rent a Bike AR$ 8,000 ליום, שווה ללא הכאב ראש.',
  },
  {
    id: 'thread-buenos-aires-005-r2',
    threadId: 'thread-buenos-aires-005',
    authorFriendId: 'dana-punta',
    body: 'גם BA Bikes על Sarmiento. R$ 6,000 ליום, יותר זול ופחות עומס.',
  },

  // thread-buenos-aires-006 — מנדוסה (3 replies)
  {
    id: 'thread-buenos-aires-006-r1',
    threadId: 'thread-buenos-aires-006',
    authorFriendId: null,
    body: 'נטע איך הסיורים? יש סיור ספציפי שאת ממליצה? איזה יקבים?',
  },
  {
    id: 'thread-buenos-aires-006-r2',
    threadId: 'thread-buenos-aires-006',
    authorFriendId: 'neta-mendoza',
    body: 'Trout & Wine סיור ביום מצוין. 4 יקבים, ארוחת צהריים, AR$ 35,000. Catena Zapata חובה, Bodega Lagarde יותר אישי.',
  },
  {
    id: 'thread-buenos-aires-006-r3',
    threadId: 'thread-buenos-aires-006',
    authorFriendId: 'moshe-buenosaires',
    body: 'אם זה רק 3 ימים — תטוס לא תיסע. טיסה AR$ 60,000, ה־12 שעות באוטו לא שווה.',
  },

  // thread-buenos-aires-007 — Don Julio או La Cabrera (3 replies)
  {
    id: 'thread-buenos-aires-007-r1',
    threadId: 'thread-buenos-aires-007',
    authorFriendId: 'moshe-buenosaires',
    body: 'Don Julio. נקודה. La Cabrera נחמד אבל Don Julio אסאדו אמיתי. תזמין שולחן 3 שבועות מראש דרך CoverManager.',
  },
  {
    id: 'thread-buenos-aires-007-r2',
    threadId: 'thread-buenos-aires-007',
    authorFriendId: null,
    body: 'תודה. אבל מה אם אין תור? La Cabrera גיבוי או יש משהו אחר?',
  },
  {
    id: 'thread-buenos-aires-007-r3',
    threadId: 'thread-buenos-aires-007',
    authorFriendId: 'dana-punta',
    body: 'אם Don Julio תפוס, El Pobre Luis. פחות מפורסם, יותר מקומי, בשר ברמה. אני עבדה בארגנטינה והייתי שם 5 פעמים.',
  },

  // thread-buenos-aires-008 — אמפנדאס (2 replies)
  {
    id: 'thread-buenos-aires-008-r1',
    threadId: 'thread-buenos-aires-008',
    authorFriendId: 'moshe-buenosaires',
    body: 'La Cocina ברחוב Pueyrredón. אמפנדאס מסלטה אמיתיים, R$ 2,800 לאחד. שווה הנסיעה.',
  },
  {
    id: 'thread-buenos-aires-008-r2',
    threadId: 'thread-buenos-aires-008',
    authorFriendId: 'neta-mendoza',
    body: 'אחי תאמין לי — La Mexicana ב־San Telmo, R$ 1,200 לאחד, מטוגנים בבית. הולכת לשם כל יום שישי 🙏',
  },

  // thread-buenos-aires-009 — פאלרמו אסאדו (3 replies)
  {
    id: 'thread-buenos-aires-009-r1',
    threadId: 'thread-buenos-aires-009',
    authorFriendId: 'yael-botafogo',
    body: 'אני נוחתת ב־18 לחודש. אקפוץ אליך לקפה.',
  },
  {
    id: 'thread-buenos-aires-009-r2',
    threadId: 'thread-buenos-aires-009',
    authorFriendId: null,
    body: 'גם אני שם ב־16–25. נסגור אסאדו אחד בטח.',
  },
  {
    id: 'thread-buenos-aires-009-r3',
    threadId: 'thread-buenos-aires-009',
    authorFriendId: 'moshe-buenosaires',
    body: 'מעולה. אני שולח קישור לקבוצת וואטסאפ ב־DM למי שכתב.',
  },

  // thread-buenos-aires-010 — בריילוצ׳ה (2 replies)
  {
    id: 'thread-buenos-aires-010-r1',
    threadId: 'thread-buenos-aires-010',
    authorFriendId: null,
    body: 'אורי קורא לזה תוספת של 3 ימים, אבל זה טיסה שלישית בארץ. תקציב מתפוצץ.',
  },
  {
    id: 'thread-buenos-aires-010-r2',
    threadId: 'thread-buenos-aires-010',
    authorFriendId: 'uri-bariloche',
    body: 'אחי אוטובוס לילה מ־Retiro AR$ 45,000, 22 שעות אבל נחמד. תיסע לפחות פעם אחת בחיים. הקצי לטה מטורף.',
  },
];
