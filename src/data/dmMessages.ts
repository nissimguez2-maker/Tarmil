/**
 * Direct messages — chronological per DM thread.
 *
 * SEED ONLY. Runtime data lives in `dm_messages`.
 *
 * `fromFriend: true` = sent by the friend, `false` = sent by the current
 * user. Each thread has 15–20 messages. The LAST message in each thread
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
  // =====================================================================
  // dm-maya — meet at Posto 9 (ends on friend message → unread)
  // =====================================================================
  { id: 'dm-maya-m01', dmThreadId: 'dm-maya', fromFriend: true, body: 'היי, רואה אותך באיפנמה?' },
  { id: 'dm-maya-m02', dmThreadId: 'dm-maya', fromFriend: false, body: 'כן בקופה. רוצה לקפוץ לפוסטו?' },
  { id: 'dm-maya-m03', dmThreadId: 'dm-maya', fromFriend: true, body: 'בהחלט. שלישי או רביעי טובים לי.' },
  { id: 'dm-maya-m04', dmThreadId: 'dm-maya', fromFriend: false, body: 'שלישי 18:00, נקודת מפגש פוסטו 9 השני מהקצה?' },
  { id: 'dm-maya-m05', dmThreadId: 'dm-maya', fromFriend: true, body: 'סבבה. אביא בירה מ־Pavão Azul, אתה אקדמיה?' },
  { id: 'dm-maya-m06', dmThreadId: 'dm-maya', fromFriend: false, body: 'אקדמיה. אביא גם פלאחס לחלוק.' },
  { id: 'dm-maya-m07', dmThreadId: 'dm-maya', fromFriend: true, body: '🔥' },
  { id: 'dm-maya-m08', dmThreadId: 'dm-maya', fromFriend: true, body: 'אגב — ראית את הפוסט של יעל על הבלוקו בלפה?' },
  { id: 'dm-maya-m09', dmThreadId: 'dm-maya', fromFriend: false, body: 'כן הגבתי. את הולכת?' },
  { id: 'dm-maya-m10', dmThreadId: 'dm-maya', fromFriend: true, body: 'באה אבל מאוחר, יש לי דבר עד 22.' },
  { id: 'dm-maya-m11', dmThreadId: 'dm-maya', fromFriend: false, body: 'איך הולך הג׳יו? עוד ב־Gracie?' },
  { id: 'dm-maya-m12', dmThreadId: 'dm-maya', fromFriend: true, body: 'עברתי ל־Checkmat. אווירה הרבה יותר טובה למתחילים. תבוא לבדוק יום שני?' },
  { id: 'dm-maya-m13', dmThreadId: 'dm-maya', fromFriend: false, body: 'שני 19:00? יכול לקפוץ. כמה היומי?' },
  { id: 'dm-maya-m14', dmThreadId: 'dm-maya', fromFriend: true, body: 'R$ 80. תביא חולצה לבנה אם יש.' },
  { id: 'dm-maya-m15', dmThreadId: 'dm-maya', fromFriend: false, body: 'יש. אגיע ישר אחרי העבודה.' },
  { id: 'dm-maya-m16', dmThreadId: 'dm-maya', fromFriend: true, body: '[הקלטה קולית · 0:42]' },
  { id: 'dm-maya-m17', dmThreadId: 'dm-maya', fromFriend: false, body: 'שמעתי, סבבה לגמרי. נחזור על זה בשלישי בערב על הפוסטו.' },
  { id: 'dm-maya-m18', dmThreadId: 'dm-maya', fromFriend: true, body: 'אז סגרנו, יום שלישי בפוסטו 9. 18:00?' },

  // =====================================================================
  // dm-yael — bar invite (ends on friend message → unread)
  // =====================================================================
  { id: 'dm-yael-m01', dmThreadId: 'dm-yael', fromFriend: false, body: 'איך הולך בבוטפוגו?' },
  { id: 'dm-yael-m02', dmThreadId: 'dm-yael', fromFriend: true, body: 'יושבת על המרפסת, עיניים על הים. אבא של החבר שלי כאן, נורא מצחיק.' },
  { id: 'dm-yael-m03', dmThreadId: 'dm-yael', fromFriend: false, body: 'תפתחי דלת בלילה לבירה?' },
  { id: 'dm-yael-m04', dmThreadId: 'dm-yael', fromFriend: true, body: 'תמיד. אני בבית מ־20.' },
  { id: 'dm-yael-m05', dmThreadId: 'dm-yael', fromFriend: false, body: 'יאלה. אביא משהו לאכול?' },
  { id: 'dm-yael-m06', dmThreadId: 'dm-yael', fromFriend: true, body: 'יש לי לחם וגבינה. הביא יין אם יש לך מצב.' },
  { id: 'dm-yael-m07', dmThreadId: 'dm-yael', fromFriend: false, body: 'יש. אדום או לבן?' },
  { id: 'dm-yael-m08', dmThreadId: 'dm-yael', fromFriend: true, body: 'אדום תמיד 🍷' },
  { id: 'dm-yael-m09', dmThreadId: 'dm-yael', fromFriend: false, body: 'אגב את הולכת לבלוקו של שישי בלפה?' },
  { id: 'dm-yael-m10', dmThreadId: 'dm-yael', fromFriend: true, body: 'אני שמה. את הפוסט שלי? בעיני יהיה אדיר.' },
  { id: 'dm-yael-m11', dmThreadId: 'dm-yael', fromFriend: false, body: 'ראיתי. ממליצה?' },
  { id: 'dm-yael-m12', dmThreadId: 'dm-yael', fromFriend: true, body: 'תבוא. מאיה גם באה, נסגור קבוצה.' },
  { id: 'dm-yael-m13', dmThreadId: 'dm-yael', fromFriend: false, body: 'סגור. אם זה לא יורד גשם.' },
  { id: 'dm-yael-m14', dmThreadId: 'dm-yael', fromFriend: true, body: '😂 אתה כל שיחה אומר את זה. ברזיל לא תל אביב.' },
  { id: 'dm-yael-m15', dmThreadId: 'dm-yael', fromFriend: false, body: 'נשמע הולך. רואה אותך ב־20:30?' },
  { id: 'dm-yael-m16', dmThreadId: 'dm-yael', fromFriend: true, body: '20:00 כבר טוב, אבא הולך לישון מוקדם.' },
  { id: 'dm-yael-m17', dmThreadId: 'dm-yael', fromFriend: false, body: 'אוקיי 20:00. כתובת?' },
  { id: 'dm-yael-m18', dmThreadId: 'dm-yael', fromFriend: true, body: 'Rua General Polidoro 38, קומה 4. הקוד 1834.' },
  { id: 'dm-yael-m19', dmThreadId: 'dm-yael', fromFriend: true, body: 'בא אליי לבירה הערב? פתחתי דלת.' },

  // =====================================================================
  // dm-roi — Búzios logistics (ends on self → no unread)
  // =====================================================================
  { id: 'dm-roi-m01', dmThreadId: 'dm-roi', fromFriend: false, body: 'מתי אתה יוצא לבוזיוס?' },
  { id: 'dm-roi-m02', dmThreadId: 'dm-roi', fromFriend: true, body: '29 בבוקר, אוטובוס 8:00 מ־Novo Rio.' },
  { id: 'dm-roi-m03', dmThreadId: 'dm-roi', fromFriend: false, body: 'אני באוטובוס של 9. ניפגש שם?' },
  { id: 'dm-roi-m04', dmThreadId: 'dm-roi', fromFriend: true, body: 'מעולה. תרשם 1001 חברה, אל תיקח עוסקי טרנספר.' },
  { id: 'dm-roi-m05', dmThreadId: 'dm-roi', fromFriend: false, body: 'כבר הזמנתי. R$ 89 כיוון אחד.' },
  { id: 'dm-roi-m06', dmThreadId: 'dm-roi', fromFriend: true, body: 'סבבה. איפה אתה מתאכסן?' },
  { id: 'dm-roi-m07', dmThreadId: 'dm-roi', fromFriend: false, body: 'Manguinhos hostel. אתה?' },
  { id: 'dm-roi-m08', dmThreadId: 'dm-roi', fromFriend: true, body: 'אזדה. רחוק חצי שעה ברגל אבל יותר זול.' },
  { id: 'dm-roi-m09', dmThreadId: 'dm-roi', fromFriend: true, body: '[תמונה · החוף באזדה לפנות בוקר]' },
  { id: 'dm-roi-m10', dmThreadId: 'dm-roi', fromFriend: false, body: 'וואו 🔥 ראיתי בפורום שיש סנוקלינג בבוקר, אתה בעניין?' },
  { id: 'dm-roi-m11', dmThreadId: 'dm-roi', fromFriend: true, body: 'כן הפוסט שלי 😂 אביא משקפי שחייה לשנינו.' },
  { id: 'dm-roi-m12', dmThreadId: 'dm-roi', fromFriend: false, body: 'אגדי. גם מאיה אמרה שבאה ליום, יצרנו קבוצה?' },
  { id: 'dm-roi-m13', dmThreadId: 'dm-roi', fromFriend: true, body: 'יש קבוצה — chat-buzios-weekend בתוך האפליקציה.' },
  { id: 'dm-roi-m14', dmThreadId: 'dm-roi', fromFriend: false, body: 'נכנסתי. מה עם ארוחת ערב לאחת מהלילות?' },
  { id: 'dm-roi-m15', dmThreadId: 'dm-roi', fromFriend: true, body: 'Chez Michou. הקלאסיקה. נסגור שעה בקבוצה.' },
  { id: 'dm-roi-m16', dmThreadId: 'dm-roi', fromFriend: false, body: 'סגור.' },
  { id: 'dm-roi-m17', dmThreadId: 'dm-roi', fromFriend: true, body: 'שלחתי לך את הקואורדינטות של ההוסטל בבוזיוס.' },
  { id: 'dm-roi-m18', dmThreadId: 'dm-roi', fromFriend: false, body: 'קיבלתי. תודה רועי.' },

  // =====================================================================
  // dm-shir — restaurant booking (ends on friend → unread, count=2)
  // =====================================================================
  { id: 'dm-shir-m01', dmThreadId: 'dm-shir', fromFriend: false, body: 'שיר, אני מגיעה לסאו ב־3 לנובמבר.' },
  { id: 'dm-shir-m02', dmThreadId: 'dm-shir', fromFriend: true, body: 'מעולה! איפה תהיי, וילה?' },
  { id: 'dm-shir-m03', dmThreadId: 'dm-shir', fromFriend: false, body: 'כן, הוסטל בוילה מדלנה.' },
  { id: 'dm-shir-m04', dmThreadId: 'dm-shir', fromFriend: true, body: 'איזה הוסטל? יש כמה טובים שם.' },
  { id: 'dm-shir-m05', dmThreadId: 'dm-shir', fromFriend: false, body: 'O de Casa, R$ 120 ללילה, ביקורות טובות.' },
  { id: 'dm-shir-m06', dmThreadId: 'dm-shir', fromFriend: true, body: 'מכירה. נמצא 4 דקות מהדירה שלי 🎯' },
  { id: 'dm-shir-m07', dmThreadId: 'dm-shir', fromFriend: false, body: 'אגדי. מה התוכנית שלך לסופ״ש?' },
  { id: 'dm-shir-m08', dmThreadId: 'dm-shir', fromFriend: true, body: 'אני מזמינה ל־La Cabrera לחמישי 21:00. תרצי?' },
  { id: 'dm-shir-m09', dmThreadId: 'dm-shir', fromFriend: false, body: 'בטוח. מי עוד בא?' },
  { id: 'dm-shir-m10', dmThreadId: 'dm-shir', fromFriend: true, body: 'יעל אמרה שמצטרפת, יותם אולי.' },
  { id: 'dm-shir-m11', dmThreadId: 'dm-shir', fromFriend: false, body: 'מצוין. שווה להזמין מראש?' },
  { id: 'dm-shir-m12', dmThreadId: 'dm-shir', fromFriend: true, body: 'בחמישי כן. בלי הזמנה תור של שעה.' },
  { id: 'dm-shir-m13', dmThreadId: 'dm-shir', fromFriend: false, body: 'סגור. גם הערב הקודם — יש לך רעיון לאוכל?' },
  { id: 'dm-shir-m14', dmThreadId: 'dm-shir', fromFriend: true, body: 'A Casa do Porco באותו רחוב. שונה לגמרי, ברמה.' },
  { id: 'dm-shir-m15', dmThreadId: 'dm-shir', fromFriend: false, body: 'נשמע. אזמין בעצמי או דרכך?' },
  { id: 'dm-shir-m16', dmThreadId: 'dm-shir', fromFriend: true, body: 'דרכי. אני מארגנת הכול 🙏' },
  { id: 'dm-shir-m17', dmThreadId: 'dm-shir', fromFriend: false, body: 'תודה. אישור?' },
  { id: 'dm-shir-m18', dmThreadId: 'dm-shir', fromFriend: true, body: 'אישור ל־La Cabrera חמישי 21:00 ל־3. אם יותם בא אעדכן.' },
  { id: 'dm-shir-m19', dmThreadId: 'dm-shir', fromFriend: true, body: 'תאשרי לי שמגיעה ב־3, אזמין למסעדה.' },

  // =====================================================================
  // dm-yotam — kite booking (ends on self → no unread)
  // =====================================================================
  { id: 'dm-yotam-m01', dmThreadId: 'dm-yotam', fromFriend: false, body: 'יותם, רשמת את 3 הימים ב־Pure Kite?' },
  { id: 'dm-yotam-m02', dmThreadId: 'dm-yotam', fromFriend: true, body: 'כן, 11–13. שלחתי ליעקב.' },
  { id: 'dm-yotam-m03', dmThreadId: 'dm-yotam', fromFriend: false, body: 'תודה אחי. תעדכן כשתקבל אישור.' },
  { id: 'dm-yotam-m04', dmThreadId: 'dm-yotam', fromFriend: true, body: 'יעקב אישר. R$ 1,800 לחבילה, מקדמה R$ 500.' },
  { id: 'dm-yotam-m05', dmThreadId: 'dm-yotam', fromFriend: false, body: 'איך משלמים?' },
  { id: 'dm-yotam-m06', dmThreadId: 'dm-yotam', fromFriend: true, body: 'PIX. אשלח לך את הקוד.' },
  { id: 'dm-yotam-m07', dmThreadId: 'dm-yotam', fromFriend: false, body: 'סבבה. אגב מה עם ציוד? צריך להביא משהו?' },
  { id: 'dm-yotam-m08', dmThreadId: 'dm-yotam', fromFriend: true, body: 'יש להם הכל. תביא רק קרם הגנה SPF 50 וכובע.' },
  { id: 'dm-yotam-m09', dmThreadId: 'dm-yotam', fromFriend: false, body: 'יש לי. איך עם המגורים?' },
  { id: 'dm-yotam-m10', dmThreadId: 'dm-yotam', fromFriend: true, body: 'אני בפוסדה ארקה דה ז׳רי. R$ 180 ללילה זוגי. רוצה לחלוק?' },
  { id: 'dm-yotam-m11', dmThreadId: 'dm-yotam', fromFriend: false, body: 'נחלק. R$ 90 לאדם מעולה. גם רועי מצטרף ל־3 לילות.' },
  { id: 'dm-yotam-m12', dmThreadId: 'dm-yotam', fromFriend: true, body: 'יש להם חדר שלישי, אבדוק זמינות.' },
  { id: 'dm-yotam-m13', dmThreadId: 'dm-yotam', fromFriend: true, body: '[הקלטה קולית · 0:18]' },
  { id: 'dm-yotam-m14', dmThreadId: 'dm-yotam', fromFriend: false, body: 'שמעתי. נשמע שיש מקום, אגדי.' },
  { id: 'dm-yotam-m15', dmThreadId: 'dm-yotam', fromFriend: true, body: 'אישרו, נסגר. אביא ערקי שעות לחוף.' },
  { id: 'dm-yotam-m16', dmThreadId: 'dm-yotam', fromFriend: false, body: 'מעולה. אגב חב״ד אין שם נכון?' },
  { id: 'dm-yotam-m17', dmThreadId: 'dm-yotam', fromFriend: true, body: 'אין. אבל רועי מביא יין, אם תביא חלות נעשה שבת על החוף.' },
  { id: 'dm-yotam-m18', dmThreadId: 'dm-yotam', fromFriend: false, body: 'בעיניי 🙏 אביא חלות מבית של דודה שלי בפורטלזה. נראה אותך ב־11.' },

  // =====================================================================
  // dm-moshe — Buenos Aires apartment (ends on friend → unread)
  // =====================================================================
  { id: 'dm-moshe-m01', dmThreadId: 'dm-moshe', fromFriend: false, body: 'משה, באתי על האסאדו על הגג בשישי. כתובת?' },
  { id: 'dm-moshe-m02', dmThreadId: 'dm-moshe', fromFriend: true, body: 'מעולה. אני שולח כתובת בעוד דקה.' },
  { id: 'dm-moshe-m03', dmThreadId: 'dm-moshe', fromFriend: false, body: 'מצוין. צריך משהו לפני?' },
  { id: 'dm-moshe-m04', dmThreadId: 'dm-moshe', fromFriend: true, body: 'malbec טוב מ־Vinos Diego, ולחמים מ־Salvaje.' },
  { id: 'dm-moshe-m05', dmThreadId: 'dm-moshe', fromFriend: false, body: 'סגור. ניפגש 20.' },
  { id: 'dm-moshe-m06', dmThreadId: 'dm-moshe', fromFriend: true, body: 'אגב — את מגיע אותך מאוויז׳ה? יש לי מקום בדירה אם צריך.' },
  { id: 'dm-moshe-m07', dmThreadId: 'dm-moshe', fromFriend: false, body: 'יש לי הוסטל בפאלרמו, סבבה. אבל תודה.' },
  { id: 'dm-moshe-m08', dmThreadId: 'dm-moshe', fromFriend: true, body: 'איזה אוסטל?' },
  { id: 'dm-moshe-m09', dmThreadId: 'dm-moshe', fromFriend: false, body: 'America del Sur, על Honduras. AR$ 14,000 ללילה.' },
  { id: 'dm-moshe-m10', dmThreadId: 'dm-moshe', fromFriend: true, body: 'מכיר. 3 דקות ממני. נוח.' },
  { id: 'dm-moshe-m11', dmThreadId: 'dm-moshe', fromFriend: false, body: 'אגדי. כמה אנשים יהיו בשישי?' },
  { id: 'dm-moshe-m12', dmThreadId: 'dm-moshe', fromFriend: true, body: 'מקסימום 10. רובם ישראלים שעוברים. אווירה רגועה.' },
  { id: 'dm-moshe-m13', dmThreadId: 'dm-moshe', fromFriend: false, body: 'נשמע. אגב הוויזה לברזיל — אתה עברת את זה דרך השגרירות פה?' },
  { id: 'dm-moshe-m14', dmThreadId: 'dm-moshe', fromFriend: true, body: 'כן. שבועיים, תור פתוח בבוקר. אם תרצה אעבור איתך, אני יודע את המסדרון.' },
  { id: 'dm-moshe-m15', dmThreadId: 'dm-moshe', fromFriend: false, body: 'בעיני. נדבר אחרי האסאדו.' },
  { id: 'dm-moshe-m16', dmThreadId: 'dm-moshe', fromFriend: true, body: 'סבבה 🙏' },
  { id: 'dm-moshe-m17', dmThreadId: 'dm-moshe', fromFriend: true, body: '[תמונה · הגג מאתמול בלילה]' },
  { id: 'dm-moshe-m18', dmThreadId: 'dm-moshe', fromFriend: false, body: 'וואלה. הנוף מאיר.' },
  { id: 'dm-moshe-m19', dmThreadId: 'dm-moshe', fromFriend: true, body: 'הכתובת: Honduras 5450. קוד בכניסה 4837.' },
];
