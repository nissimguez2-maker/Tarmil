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
 * Each chat has 15–25 messages, mix of self and friend authors, ending on a
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
  // =====================================================================
  // chat-buzios-weekend (Roi + Maya + self)
  // =====================================================================
  {
    id: 'chat-buzios-weekend-m01',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body: 'יוצא ב־29 לבוזיוס. מי בסוף השבוע איתי?',
  },
  {
    id: 'chat-buzios-weekend-m02',
    chatId: 'chat-buzios-weekend',
    authorFriendId: null,
    body: 'אני שם 28–31. סגרתי הוסטל ב־Manguinhos. אתה?',
  },
  {
    id: 'chat-buzios-weekend-m03',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body: 'אני באזדה. רחוק חצי שעה ברגל אבל יותר זול.',
  },
  {
    id: 'chat-buzios-weekend-m04',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'maya-ipanema',
    body: 'מנסה להגיע בשבת בבוקר רק ליום. סנוקלינג + ארוחת צהריים, חוזרת לריו בלילה.',
  },
  {
    id: 'chat-buzios-weekend-m05',
    chatId: 'chat-buzios-weekend',
    authorFriendId: null,
    body: 'מאיה אם תגיעי 10:00 לפראיה דה ז׳ואו פרננדס, המים שקטים שם בבוקר.',
  },
  {
    id: 'chat-buzios-weekend-m06',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'maya-ipanema',
    body: 'מצוין. רועי, יש מקום למסעדה לארוחת צהריים שלושתנו?',
  },
  {
    id: 'chat-buzios-weekend-m07',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body: 'Chez Michou על ה־Rua das Pedras. קלאסיקה, פתוח כל היום, שווה.',
  },
  {
    id: 'chat-buzios-weekend-m08',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'maya-ipanema',
    body: 'אגב יעל אמרה שאולי גם היא באה לשבת. אצרף אותה לקבוצה?',
  },
  {
    id: 'chat-buzios-weekend-m09',
    chatId: 'chat-buzios-weekend',
    authorFriendId: null,
    body: 'תצרפי. יותר נחמד.' ,
  },
  {
    id: 'chat-buzios-weekend-m10',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body: '🔥',
  },
  {
    id: 'chat-buzios-weekend-m11',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body: 'אגב מי מביא משקפי שחייה? יש לי שני זוגות.',
  },
  {
    id: 'chat-buzios-weekend-m12',
    chatId: 'chat-buzios-weekend',
    authorFriendId: null,
    body: 'מצוין אני אקח אחד מהשלך. מאיה את?' ,
  },
  {
    id: 'chat-buzios-weekend-m13',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'maya-ipanema',
    body: 'יש לי משלי. אביא גם סנובל לזוג שלישי אם צריך.',
  },
  {
    id: 'chat-buzios-weekend-m14',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body: 'אגדי. אז בשבת 10:00 בז׳ואו פרננדס. אביא בירה.',
  },
  {
    id: 'chat-buzios-weekend-m15',
    chatId: 'chat-buzios-weekend',
    authorFriendId: null,
    body: 'בירה ב־10 בבוקר אחי? 😂',
  },
  {
    id: 'chat-buzios-weekend-m16',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body: 'אנחנו בחופש. הכל מותר. ברזיל פטור ממוסר.',
  },
  {
    id: 'chat-buzios-weekend-m17',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'maya-ipanema',
    body: 'מצטרפת 🍺 אגב Chez Michou לארוחת צהריים — אזמין ל־14?',
  },
  {
    id: 'chat-buzios-weekend-m18',
    chatId: 'chat-buzios-weekend',
    authorFriendId: null,
    body: 'תזמיני. R$ 150 לאדם בערך, יש לדעת.',
  },
  {
    id: 'chat-buzios-weekend-m19',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'maya-ipanema',
    body: 'הזמנתי ל־14:30 לשלושה. אם יעל באה אעדכן.',
  },
  {
    id: 'chat-buzios-weekend-m20',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body: '[הקלטה קולית · 0:23]',
  },
  {
    id: 'chat-buzios-weekend-m21',
    chatId: 'chat-buzios-weekend',
    authorFriendId: null,
    body: 'שמעתי. נשמע שאתה כבר בנוף. תיהנה!',
  },
  {
    id: 'chat-buzios-weekend-m22',
    chatId: 'chat-buzios-weekend',
    authorFriendId: 'roi-buzios',
    body: 'אגב הוסטל ביקש מקדמה. שתביאו מזומן.',
  },

  // =====================================================================
  // chat-sao-paulo-asado (Shir + Yael + self)
  // =====================================================================
  {
    id: 'chat-sao-paulo-asado-m01',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'shir-saopaulo',
    body: 'הזמנתי את ה־La Cabrera ל־21:00 בחמישי. תהיו שלושה?',
  },
  {
    id: 'chat-sao-paulo-asado-m02',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: null,
    body: 'מאשרת. אגיע ישר מהשדה, סנדל וטיסה בעיניים.',
  },
  {
    id: 'chat-sao-paulo-asado-m03',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'yael-botafogo',
    body: 'אני בא, אבל כנראה אאחר 15 דקות. תזמיני בלעדיי אם אתם רעבים.',
  },
  {
    id: 'chat-sao-paulo-asado-m04',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'shir-saopaulo',
    body: 'יעל, אין בעיה. תוקם רק כשתגיעי. הזמנתי Bife de chorizo, malbec.',
  },
  {
    id: 'chat-sao-paulo-asado-m05',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: null,
    body: 'נשמע מצוין. אחרי, יש מקום פתוח לבירה בוילה?',
  },
  {
    id: 'chat-sao-paulo-asado-m06',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'shir-saopaulo',
    body: 'Coisa Linda — בערב חמישי קל לקבל שולחן עד 23. נלך משם.',
  },
  {
    id: 'chat-sao-paulo-asado-m07',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'yael-botafogo',
    body: 'אני שמעתי שיש פסטיבל מוזיקה בוילה במקביל. מישהו ראה?',
  },
  {
    id: 'chat-sao-paulo-asado-m08',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'shir-saopaulo',
    body: 'כן ב־SESC Pompeia. אבל זה רחוק 20 דקות באובר.',
  },
  {
    id: 'chat-sao-paulo-asado-m09',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: null,
    body: 'נשאיר את זה ליום אחר. אחרי La Cabrera הכי טוב להישאר באזור.',
  },
  {
    id: 'chat-sao-paulo-asado-m10',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'yael-botafogo',
    body: 'מסכימה. אגב מה לבוש? היה לי דאון שאני לא יודעת מה ללבוש לסאו.',
  },
  {
    id: 'chat-sao-paulo-asado-m11',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'shir-saopaulo',
    body: 'La Cabrera קז׳ואל סמרט. ג׳ינס ועליונית סבבה. אתה לא חייב צ׳ינוס.',
  },
  {
    id: 'chat-sao-paulo-asado-m12',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: null,
    body: 'תודה. הגענו עם תרמיל אחד, אין לי מה ללבוש מסודר 😂',
  },
  {
    id: 'chat-sao-paulo-asado-m13',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'yael-botafogo',
    body: '[תמונה · הלקח שלי לסופ״ש מסאו פאולו]',
  },
  {
    id: 'chat-sao-paulo-asado-m14',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'shir-saopaulo',
    body: 'יעל זה הרבה מדי. את לא הולכת לחתונה.',
  },
  {
    id: 'chat-sao-paulo-asado-m15',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'yael-botafogo',
    body: '😂 תמיד יותר טוב לקחת יותר.',
  },
  {
    id: 'chat-sao-paulo-asado-m16',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: null,
    body: 'שיר אגב — חמישי בבוקר אני פנוי. רוצה להראות לי משהו לפני הארוחה?',
  },
  {
    id: 'chat-sao-paulo-asado-m17',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'shir-saopaulo',
    body: 'איבירפואירה ריצה ב־7? אחרי המרקאדאו לארוחת בוקר.',
  },
  {
    id: 'chat-sao-paulo-asado-m18',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: null,
    body: 'סבבה לגמרי. נצא יחד.',
  },
  {
    id: 'chat-sao-paulo-asado-m19',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'yael-botafogo',
    body: 'אגיע ל־La Cabrera ישר מהפסטיבל אם יוצא. אבל אישור — 21:00 ל־3.',
  },
  {
    id: 'chat-sao-paulo-asado-m20',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'shir-saopaulo',
    body: 'אישור ניתן. אם יותם מגיע אעדכן בקבוצה.',
  },
  {
    id: 'chat-sao-paulo-asado-m21',
    chatId: 'chat-sao-paulo-asado',
    authorFriendId: 'yael-botafogo',
    body: 'מתרגשת 🔥 רואה אותכם בחמישי.',
  },

  // =====================================================================
  // chat-jeri-kite (Yotam + Roi + self)
  // =====================================================================
  {
    id: 'chat-jeri-kite-m01',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body: 'נחתי בפורטלזה. ג׳יפ לז׳רי יוצא מחר ב־7. מי איתי?',
  },
  {
    id: 'chat-jeri-kite-m02',
    chatId: 'chat-jeri-kite',
    authorFriendId: null,
    body: 'אני מגיע ב־10, אצטרף לג׳יפ של הצהריים. נתראה במלון.',
  },
  {
    id: 'chat-jeri-kite-m03',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'roi-buzios',
    body: 'יוצא מבוזיוס בסוף השבוע, אגיע ב־11. כבר רשום ל־Pure Kite?',
  },
  {
    id: 'chat-jeri-kite-m04',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body: 'כן, 3 ימים רצופים מ־11. יעקב המדריך עונה מהר ב־DM.',
  },
  {
    id: 'chat-jeri-kite-m05',
    chatId: 'chat-jeri-kite',
    authorFriendId: null,
    body: 'אני מתחיל, אז יום שיעור פרטי קודם. אצטרף אליכם מ־12.',
  },
  {
    id: 'chat-jeri-kite-m06',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'roi-buzios',
    body: 'מעולה. תזמין שיעור עם רננה אם תפוס — היא הכי טובה עם מתחילים.',
  },
  {
    id: 'chat-jeri-kite-m07',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body: 'אגב — ארוחת ערב באותו ערב ב־Tamandaré 20:30?',
  },
  {
    id: 'chat-jeri-kite-m08',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'roi-buzios',
    body: 'אני בעניין. מקום לפורו אחרי?',
  },
  {
    id: 'chat-jeri-kite-m09',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body: 'שלישי בערב הכי טוב לפורו. נראה איפה לפי הקבוצות שמנגנות.',
  },
  {
    id: 'chat-jeri-kite-m10',
    chatId: 'chat-jeri-kite',
    authorFriendId: null,
    body: 'סבבה. אגב חב״ד שם נכון אין?',
  },
  {
    id: 'chat-jeri-kite-m11',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body: 'אין. אני הצעתי בפורום שנעשה שבת על החוף. אתה מביא חלות?',
  },
  {
    id: 'chat-jeri-kite-m12',
    chatId: 'chat-jeri-kite',
    authorFriendId: null,
    body: 'אביא מבית של דודה שלי בפורטלזה. מסורת מקומית.',
  },
  {
    id: 'chat-jeri-kite-m13',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'roi-buzios',
    body: 'אני אביא יין ומפה לבנה. דגים ואורז מי על האש?',
  },
  {
    id: 'chat-jeri-kite-m14',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body: 'אני. דונה זלמירה מבשלת לנו אם נזמין מראש.',
  },
  {
    id: 'chat-jeri-kite-m15',
    chatId: 'chat-jeri-kite',
    authorFriendId: null,
    body: 'אגדי 🙏 שבת בז׳רי. מי היה חושב.',
  },
  {
    id: 'chat-jeri-kite-m16',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'roi-buzios',
    body: 'אגב הזיהוי שלי לאוטובוס מבוזיוס לפורטלזה — 18 שעות. בלאגן.',
  },
  {
    id: 'chat-jeri-kite-m17',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body: '😅 קח כרית. אגב יש לי מקום בחדר בפוסדה ארקה.',
  },
  {
    id: 'chat-jeri-kite-m18',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'roi-buzios',
    body: 'לוקח. R$ 90 לאדם בערב? נסים גם?',
  },
  {
    id: 'chat-jeri-kite-m19',
    chatId: 'chat-jeri-kite',
    authorFriendId: null,
    body: 'גם אני. 3 לחדר, יותר זול ויותר חברתי.',
  },
  {
    id: 'chat-jeri-kite-m20',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body: 'אישרתי עם הבעלים. שלושה לחדר עם 3 מיטות. נסים שלם ב־PIX?',
  },
  {
    id: 'chat-jeri-kite-m21',
    chatId: 'chat-jeri-kite',
    authorFriendId: null,
    body: 'אשלם בהגעה. R$ 90 ל־3 לילות = R$ 270.' ,
  },
  {
    id: 'chat-jeri-kite-m22',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'roi-buzios',
    body: '[תמונה · הים בבוזיוס לפנות בוקר]',
  },
  {
    id: 'chat-jeri-kite-m23',
    chatId: 'chat-jeri-kite',
    authorFriendId: 'yotam-jericoacoara',
    body: 'מקנא. כאן הרוח אגרסיבית מאתמול 🌬️',
  },

  // =====================================================================
  // chat-buenos-palermo (Moshe + Yael + self)
  // =====================================================================
  {
    id: 'chat-buenos-palermo-m01',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body: 'הדירה שלי בפאלרמו סוהו פתוחה לאסאדו על הגג בשישי 20. תגיעו?',
  },
  {
    id: 'chat-buenos-palermo-m02',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'yael-botafogo',
    body: 'נוחתת ב־18. אגיע. אביא יין?',
  },
  {
    id: 'chat-buenos-palermo-m03',
    chatId: 'chat-buenos-palermo',
    authorFriendId: null,
    body: 'גם אני שם. משה, מה אתה צריך — בשר, פחם, יין?',
  },
  {
    id: 'chat-buenos-palermo-m04',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body: 'יש לי בשר וגזר על הגריל. תביאו malbec ולחמים מ־Salvaje.',
  },
  {
    id: 'chat-buenos-palermo-m05',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'yael-botafogo',
    body: 'סגור. אקח גם משהו מתוק לקינוח.',
  },
  {
    id: 'chat-buenos-palermo-m06',
    chatId: 'chat-buenos-palermo',
    authorFriendId: null,
    body: 'אני אביא malbec טוב. כתובת בDM?',
  },
  {
    id: 'chat-buenos-palermo-m07',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body: 'שולח את הכתובת והקוד בפרטי.',
  },
  {
    id: 'chat-buenos-palermo-m08',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'yael-botafogo',
    body: 'אגב — מילונגה La Catedral בלילה? סוף האסאדו, אם יש כוח?',
  },
  {
    id: 'chat-buenos-palermo-m09',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body: 'כן! אני שם כל שישי. פותח 22:30, אנשים מגיעים מ־23.',
  },
  {
    id: 'chat-buenos-palermo-m10',
    chatId: 'chat-buenos-palermo',
    authorFriendId: null,
    body: 'אגיע. צריך נעליים מיוחדות?',
  },
  {
    id: 'chat-buenos-palermo-m11',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body: 'סוליה חלקה מספיק. אל תבוא בנעלי ספורט.',
  },
  {
    id: 'chat-buenos-palermo-m12',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'yael-botafogo',
    body: 'אני מביאה גם נעליים סגורות וגם עקבים, נראה איך אני מרגישה.',
  },
  {
    id: 'chat-buenos-palermo-m13',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body: '🙏',
  },
  {
    id: 'chat-buenos-palermo-m14',
    chatId: 'chat-buenos-palermo',
    authorFriendId: null,
    body: 'משה אגב — אסאדו זה מסיבה רגועה או יותר תוסס?',
  },
  {
    id: 'chat-buenos-palermo-m15',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body: 'מתחיל רגוע, מסביב 23 כבר אנשים פתוחים. תלוי מי בא. השבוע יש 8 אנשים.',
  },
  {
    id: 'chat-buenos-palermo-m16',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'yael-botafogo',
    body: 'נשמע. אגב חב״ד אבסטו — אתם הולכים שבת אחרי?',
  },
  {
    id: 'chat-buenos-palermo-m17',
    chatId: 'chat-buenos-palermo',
    authorFriendId: null,
    body: 'אני נרשמתי לשבת 21. את?',
  },
  {
    id: 'chat-buenos-palermo-m18',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'yael-botafogo',
    body: 'גם אני. משה מצטרף?',
  },
  {
    id: 'chat-buenos-palermo-m19',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body: 'כן. אאסוף אתכם בדרך, אני גר 8 דקות משם.',
  },
  {
    id: 'chat-buenos-palermo-m20',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'yael-botafogo',
    body: '[תמונה · הנוף מהמרפסת בריו לפני הטיסה]',
  },
  {
    id: 'chat-buenos-palermo-m21',
    chatId: 'chat-buenos-palermo',
    authorFriendId: null,
    body: 'וואלה ❤️ נסיעה טובה.',
  },
  {
    id: 'chat-buenos-palermo-m22',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'yael-botafogo',
    body: 'תודה. נראה אותכם בבואנוס 🇦🇷',
  },
  {
    id: 'chat-buenos-palermo-m23',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body: 'אגב — Don Julio אם תרצו לארוחה אחת איכותית. שולחנות 3 שבועות מראש.',
  },
  {
    id: 'chat-buenos-palermo-m24',
    chatId: 'chat-buenos-palermo',
    authorFriendId: 'moshe-buenosaires',
    body: 'אזמין ל־19 לחודש. רוצים שאוסיף עוד מקום?',
  },
];
