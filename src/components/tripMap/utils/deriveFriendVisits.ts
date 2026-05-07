import type { RioPlace, RioPlaceCategory } from '../../../data/rioPlaces';

export type FriendVisit = {
  friendName: string;
  friendInitial: string;
  /** Pravatar URL (200×200, deterministic). */
  photoUrl: string;
  /** 1–5. */
  rating: number;
  /** Single line of Hebrew. */
  comment: string;
};

/** Friend pool for deterministic place reviews — overlaps the friendOverlaps roster. */
const POOL: Array<{ name: string; initial: string; photoUrl: string }> = [
  {
    name: 'מאיה לוי',
    initial: 'מ',
    photoUrl: 'https://i.pravatar.cc/200?img=47',
  },
  {
    name: 'יעל אברהם',
    initial: 'י',
    photoUrl: 'https://i.pravatar.cc/200?img=44',
  },
  {
    name: 'רועי בן עמי',
    initial: 'ר',
    photoUrl: 'https://i.pravatar.cc/200?img=33',
  },
  { name: 'שיר כהן', initial: 'ש', photoUrl: 'https://i.pravatar.cc/200?img=49' },
  {
    name: 'יותם הררי',
    initial: 'ה',
    photoUrl: 'https://i.pravatar.cc/200?img=68',
  },
  {
    name: 'משה פרידמן',
    initial: 'מ',
    photoUrl: 'https://i.pravatar.cc/200?img=51',
  },
  {
    name: 'אביב גוטמן',
    initial: 'א',
    photoUrl: 'https://i.pravatar.cc/200?img=12',
  },
  {
    name: 'דניאל לוי',
    initial: 'ד',
    photoUrl: 'https://i.pravatar.cc/200?img=53',
  },
];

const COMMENTS: Record<RioPlaceCategory, string[]> = {
  beach: [
    'חוף בלי גמר, חבר׳ה, וים שמרגיש כאילו הוא רק שלך.',
    'הגענו עם מטקות, יצאנו עם שקיעה ועוד שני חברים חדשים.',
    'נקי, רגוע ביום חול, בערב הופך לאלף אנשים על הטיילת.',
    'הים לפעמים פראי, אבל החול עצמו מושלם להתחפר עם ספר.',
  ],
  hostel: [
    'חצר עם ערסלים והרבה ישראלים, אווירה משפחתית מההתחלה.',
    'חדרים סבירים, מטבח עובד, אנשים נוחים — בדיוק מה שצריך.',
    'מיקום מצוין, חמש דקות הליכה לכל מה שחשוב.',
    'קצת עמוס בקיץ, אבל הצוות תמיד עוזרים לסדר משהו.',
  ],
  cafe: [
    'קפה כיף, ויי-פיי טוב לסידור טיסות והיסטריות.',
    'אסאי מטורף, ישבתי שעה והשארתי גם לצהריים.',
    'מקום שקט באמצע הבלגן, כיף לעצור ולשבת לבד.',
    'בריסטה אדיר, הסביר לי הכל ועדיין הזמנתי את הרגיל.',
  ],
  restaurant: [
    'מנה אחת הספיקה לשניים, אכלנו עד שלא יכולנו לקום.',
    'אוכל ביתי טעים, יחס חמים, ירדנו מהמחירים של הטיולים.',
    'תפריט קצת מבלבל, סמכנו על המלצרית והיא צדקה.',
    'הכי קרוב לארוחה של אמא בלי לעלות על טיסה.',
  ],
  bar: [
    'בירה זולה, מוזיקה מתאימה, ולא צריך הרבה כדי להתחיל לרקוד.',
    'מקום קטן, ישראלים על אותו השולחן בתוך עשר דקות.',
    'בירת מקומית מצוינת, סנדוויץ׳ חם בעצם הלילה.',
    'אווירה רגועה לפני שיוצאים למועדון, התחלה טובה.',
  ],
  club: [
    'רחבה לוהטת, סאונד טוב, יצאנו ב־5 וחצי שמחים.',
    'תור מטורף בכניסה אבל בפנים נסחפנו לגמרי.',
    'שתי קומות, מוזיקות שונות, כל אחד מצא את שלו.',
    'ערב פתיחה גבוה, חבר׳ה מקומיים נחמדים והכי לא קלאסיים.',
  ],
  chabad: [
    'שולחן שבת עם ישראלים מכל העולם, הרגשנו בבית מיד.',
    'הרב סבבה, הסביר את האזור, חיבר אותנו לעוד תרמילאים.',
    'אוכל ביתי, פתרון מושלם אחרי שבוע רץ של אטרקציות.',
    'כיף שיש את זה רחוק מהבית, ההזמנה קמה כמעט מאליה.',
  ],
  kosher: [
    'אוכל כשר ביתי, מחיר סביר, ויש גם תוספות לקחת.',
    'שניצל ופירה אחרי שבוע פיג׳מות — חוויה מטהרת.',
    'התור זז מהר, דיברו איתנו עברית, ההמלצות היו זהב.',
    'אופים על המקום, ריח של בית סבתא בלי להישבר.',
  ],
  landmark: [
    'נקודה חובה לפעם אחת, צילמנו והמשכנו הלאה רגועים.',
    'שווה את ההליכה, האווירה דווקא מורגשת בערב.',
    'כיכר חיה, מוזיקאים, הרבה צבע, מתאים לבוקר עצלן.',
    'תצפית שמשגעת, באים בשקיעה אם אפשר ולא מתחרטים.',
  ],
};

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/**
 * Deterministic 1–3 friend reviews for a place. Uses `friendsKnow` to bound
 * the visible count and the place id as a seed so the demo data stays stable
 * across renders. Returns [] when no friends know the place.
 */
export function deriveFriendVisits(place: {
  id: string;
  category: RioPlaceCategory;
  friendsKnow: number;
}): FriendVisit[] {
  if (place.friendsKnow <= 0) return [];
  const count = Math.min(3, place.friendsKnow);
  const seed = hashStr(place.id);
  const comments = COMMENTS[place.category];
  const used = new Set<number>();
  const out: FriendVisit[] = [];
  for (let i = 0; i < count; i++) {
    let friendIdx = (seed + i * 17) % POOL.length;
    while (used.has(friendIdx)) friendIdx = (friendIdx + 1) % POOL.length;
    used.add(friendIdx);
    const commentIdx = (seed + i * 13) % comments.length;
    const rating = 3 + ((seed + i * 7) % 3); // 3, 4, or 5
    out.push({
      friendName: POOL[friendIdx].name,
      friendInitial: POOL[friendIdx].initial,
      photoUrl: POOL[friendIdx].photoUrl,
      rating,
      comment: comments[commentIdx],
    });
  }
  return out;
}

/** Friendly export so PlaceSheet can call this without re-importing the type. */
export type { RioPlace };
