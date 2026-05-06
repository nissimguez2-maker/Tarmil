/**
 * Rio de Janeiro places — curated set for the investor demo.
 *
 * Sourced from a Perplexity research pass on places Israeli backpackers
 * actually go to in the Rio metro area + Búzios. Hebrew copy in the natural
 * voice of a 22-year-old post-army backpacker (sentence cap ~14 words).
 *
 * Coordinates verified against Google Maps. Categories drive marker styling
 * in RioMap.css.
 */

export type RioPlaceCategory =
  | 'beach'
  | 'hostel'
  | 'cafe'
  | 'restaurant'
  | 'bar'
  | 'club'
  | 'chabad'
  | 'kosher'
  | 'landmark';

export type RioPlace = {
  id: string;
  hebrewName: string;
  englishName: string;
  category: RioPlaceCategory;
  lat: number;
  lng: number;
  hebrewDescription: string;
  englishDescription: string;
  /** Tarmil community rating, 1–5. */
  rating: number;
  /** Friends of the user who've been here. */
  friendsKnow: number;
  /** Hand-picked Tarmil recommendation badge. */
  tarmilPick?: boolean;
};

export const rioPlaces: RioPlace[] = [
  // ─── Beaches ──────────────────────────────────────────────────────────
  {
    id: 'copa-beach',
    hebrewName: 'חוף קופקבנה',
    englishName: 'Copacabana Beach',
    category: 'beach',
    lat: -22.9711779,
    lng: -43.1825439,
    hebrewDescription: 'חוף ענק, מלא דוכנים, כדורגל וחיים שלמים על הטיילת.',
    englishDescription:
      'Huge beach with stalls, football games and nonstop life on the promenade.',
    rating: 4.7,
    friendsKnow: 12,
    tarmilPick: true,
  },
  {
    id: 'ipanema-beach',
    hebrewName: 'חוף איפנמה',
    englishName: 'Ipanema Beach',
    category: 'beach',
    lat: -22.9868585,
    lng: -43.2059651,
    hebrewDescription:
      'חוף יותר רגוע ומצוחצח, שקיעות פסיכיות וים קצת יותר פראי.',
    englishDescription:
      'Slightly calmer, cleaner beach with crazy sunsets and a slightly wilder sea.',
    rating: 4.8,
    friendsKnow: 11,
    tarmilPick: true,
  },
  {
    id: 'leblon-beach',
    hebrewName: 'חוף לבלאון',
    englishName: 'Leblon Beach',
    category: 'beach',
    lat: -22.9876212,
    lng: -43.2195852,
    hebrewDescription:
      'חוף יוקרתי יותר, שקט, מרגיש כמו שכונת צפון תל אביב על הים.',
    englishDescription:
      'More upscale and quiet, feels like a north Tel Aviv neighborhood on the sea.',
    rating: 4.5,
    friendsKnow: 6,
  },
  {
    id: 'barra-beach',
    hebrewName: 'חוף ברה דה טיז׳וקה',
    englishName: 'Barra da Tijuca Beach',
    category: 'beach',
    lat: -23.012043,
    lng: -43.365414,
    hebrewDescription:
      'רצועת חוף אינסופית, גלים טובים לגלישה, מרגיש פחות תיירותי.',
    englishDescription:
      'Endless stretch of sand with good surf waves, feels less touristy.',
    rating: 4.4,
    friendsKnow: 4,
  },
  {
    id: 'praia-vermelha',
    hebrewName: 'חוף ורמליה',
    englishName: 'Praia Vermelha',
    category: 'beach',
    lat: -22.9531023,
    lng: -43.1663914,
    hebrewDescription:
      'חוף קטן מתחת לשוגרלוף, מים רגועים, אחלה צ׳יל מההמולה.',
    englishDescription:
      'Small beach under Sugarloaf with calm water, perfect chill escape from the crowds.',
    rating: 4.5,
    friendsKnow: 3,
  },
  {
    id: 'arpoador-beach',
    hebrewName: 'חוף ארפואדור',
    englishName: 'Arpoador Beach',
    category: 'beach',
    lat: -22.9884128,
    lng: -43.2006988,
    hebrewDescription:
      'הנקודה הכי חזקה לשקיעה, כולם מוחאים כפיים כשהשמש נעלמת.',
    englishDescription:
      "Strongest sunset spot, everyone claps when the sun disappears.",
    rating: 4.8,
    friendsKnow: 9,
    tarmilPick: true,
  },
  {
    id: 'botafogo-beach',
    hebrewName: 'חוף בוטפוגו',
    englishName: 'Botafogo Beach',
    category: 'beach',
    lat: -22.9448788,
    lng: -43.1828477,
    hebrewDescription:
      'לא לשחייה, אבל נוף מטורף למפרץ ולשוגרלוף לצילומי אינסטה.',
    englishDescription:
      'Not for swimming but insane bay and Sugarloaf views for Instagram shots.',
    rating: 4.3,
    friendsKnow: 5,
  },
  {
    id: 'flamengo-beach',
    hebrewName: 'חוף פלמנגו',
    englishName: 'Praia do Flamengo',
    category: 'beach',
    lat: -22.9369924,
    lng: -43.1706352,
    hebrewDescription:
      'פארק ענק ליד החוף, ברזילאים עושים על האש, אחלה לריצה בוקר.',
    englishDescription:
      'Huge park by the beach with locals barbecuing, great for a morning run.',
    rating: 4.4,
    friendsKnow: 4,
  },
  {
    id: 'grumari-beach',
    hebrewName: 'חוף גרומארי',
    englishName: 'Praia de Grumari',
    category: 'beach',
    lat: -23.0470477,
    lng: -43.5264265,
    hebrewDescription:
      'שמורת טבע עם חוף פראי, מרגיש כמו ברזיל לפני אינסטגרם.',
    englishDescription:
      'Nature reserve with wild beach, feels like Brazil before Instagram.',
    rating: 4.7,
    friendsKnow: 2,
    tarmilPick: true,
  },
  {
    id: 'joatinga-beach',
    hebrewName: 'חוף ז׳ואטינגה',
    englishName: 'Praia da Joatinga',
    category: 'beach',
    lat: -23.0103152,
    lng: -43.2968764,
    hebrewDescription:
      'מסתתרים בין הצוקים, חוף קטן שמרגיש סודי למרות שכולם מכירים.',
    englishDescription:
      'Hidden between cliffs, small beach that feels secret even though everyone knows it.',
    rating: 4.5,
    friendsKnow: 3,
  },
  {
    id: 'niteroi-icarai',
    hebrewName: 'חוף איקראי ניטרוי',
    englishName: 'Praia de Icaraí',
    category: 'beach',
    lat: -22.9077803,
    lng: -43.1116486,
    hebrewDescription:
      'חוף עירוני בניטרוי, נוף מעולה לריו מהצד השני של המפרץ.',
    englishDescription:
      'City beach in Niterói with great views of Rio from across the bay.',
    rating: 4.2,
    friendsKnow: 2,
  },
  {
    id: 'buzios-geriba',
    hebrewName: 'חוף ז׳ריבה בוזיוס',
    englishName: 'Praia de Geribá',
    category: 'beach',
    lat: -22.7691753,
    lng: -41.9485308,
    hebrewDescription:
      'החוף של הצעירים בבוזיוס, גלים, מוזיקה ואווירת מסיבה כל היום.',
    englishDescription:
      'Youthful Búzios beach with waves, music and all-day party vibes.',
    rating: 4.7,
    friendsKnow: 5,
    tarmilPick: true,
  },

  // ─── Hostels ──────────────────────────────────────────────────────────
  {
    id: 'discovery-hostel',
    hebrewName: 'דיסקאברי הוסטל',
    englishName: 'Discovery Hostel',
    category: 'hostel',
    lat: -22.9192053,
    lng: -43.177984,
    hebrewDescription:
      'הוסטל ביתי בגלוריה, מלא ישראלים בתקציב נמוך וקבוצות וואטסאפ לכל טיול.',
    englishDescription:
      'Homey hostel in Glória packed with Israelis on a budget and WhatsApp trip groups.',
    rating: 4.6,
    friendsKnow: 14,
    tarmilPick: true,
  },
  {
    id: 'lemix-hostel',
    hebrewName: 'למיקס הוסטל',
    englishName: 'Lemix Hostel',
    category: 'hostel',
    lat: -22.9789846,
    lng: -43.189884,
    hebrewDescription:
      'הוסטל קטן באיפנמה, מרחק דקה מהים, כולם חולקים סיפורי צבא בלובי.',
    englishDescription:
      'Small Ipanema hostel a minute from the beach, lobby full of army stories.',
    rating: 4.5,
    friendsKnow: 8,
  },
  {
    id: 'cabana-copa',
    hebrewName: 'קבנה קופה הוסטל',
    englishName: 'CabanaCopa Hostel',
    category: 'hostel',
    lat: -22.9675353,
    lng: -43.181306,
    hebrewDescription:
      'הוסטל קלאסי לקופקבנה, מטבח גדול, תמיד מישהו שמכיר עוד טרק שווה.',
    englishDescription:
      'Classic Copacabana hostel with big kitchen and someone always knows another good trek.',
    rating: 4.5,
    friendsKnow: 11,
    tarmilPick: true,
  },
  {
    id: 'leblon-beach-hostel',
    hebrewName: 'לבלאון ביץ׳ הוסטל',
    englishName: 'Leblon Beach Hostel',
    category: 'hostel',
    lat: -22.9857573,
    lng: -43.2262613,
    hebrewDescription:
      'אזור מפונק יותר, מרגיש בטוח, מושלם להתחלה רגועה בריו.',
    englishDescription:
      'More pampered area, feels safe, perfect for a soft landing in Rio.',
    rating: 4.4,
    friendsKnow: 4,
  },
  {
    id: 'mojo-hostel',
    hebrewName: 'מוג׳ו הוסטל ריו',
    englishName: 'Mojo Hostel & Lounge',
    category: 'hostel',
    lat: -22.9822157,
    lng: -43.1984707,
    hebrewDescription:
      'הוסטל חברתית באיפנמה, בר למטה, ישראלים מתארגנים שם ליציאות.',
    englishDescription:
      'Social Ipanema hostel with downstairs bar where Israelis team up for nights out.',
    rating: 4.4,
    friendsKnow: 7,
  },
  {
    id: 'walk-on-beach',
    hebrewName: 'ווק און דה ביץ׳',
    englishName: 'Walk On The Beach Hostel',
    category: 'hostel',
    lat: -22.9696407,
    lng: -43.1829379,
    hebrewDescription:
      'הוסטל פשוט אבל חי, קרוב לים, אחלה בסיס לפני טיולים ארוכים.',
    englishDescription:
      'Simple but lively hostel near the sea, solid base before longer trips.',
    rating: 4.3,
    friendsKnow: 6,
  },

  // ─── Cafés ────────────────────────────────────────────────────────────
  {
    id: 'confeitaria-colombo',
    hebrewName: 'קונפייטריה קולומבו',
    englishName: 'Confeitaria Colombo',
    category: 'cafe',
    lat: -22.9056931,
    lng: -43.1794736,
    hebrewDescription:
      'בית קפה עתיק במרכז, מרגיש כמו לחזור בזמן עם עוגה ביד.',
    englishDescription:
      'Old-school downtown cafe, feels like time travel while you smash cake.',
    rating: 4.7,
    friendsKnow: 7,
    tarmilPick: true,
  },
  {
    id: 'cafe-seu-jorge',
    hebrewName: 'קפה דו סאו ז׳ורז׳',
    englishName: 'Café do Seu Jorge Santa Teresa',
    category: 'cafe',
    lat: -22.9206463,
    lng: -43.1894906,
    hebrewDescription:
      'קפה קטן בסנטה תרזה, נוף ירוק, מושלם לשבת עם מחברת ויומני מסע.',
    englishDescription:
      'Tiny Santa Teresa cafe with green views, perfect for journaling backpack drama.',
    rating: 4.6,
    friendsKnow: 4,
  },
  {
    id: 'curto-cafe',
    hebrewName: 'קורטו קפה',
    englishName: 'Curto Café',
    category: 'cafe',
    lat: -22.9096614,
    lng: -43.1917843,
    hebrewDescription:
      'קפה מגניב בלי מחיר קבוע, אתה משלם כמה שבא לך על האספרסו.',
    englishDescription:
      'Cool pay-what-you-want spot where you decide how much your espresso costs.',
    rating: 4.5,
    friendsKnow: 3,
    tarmilPick: true,
  },
  {
    id: 'cafe-seleto-lapa',
    hebrewName: 'קפה סלייטו לאפה',
    englishName: 'Café Seleto Lapa',
    category: 'cafe',
    lat: -22.9124491,
    lng: -43.178564,
    hebrewDescription:
      'עצירת קפה לפני או אחרי המסיבות בלפה, מלא תרמילאים מכל העולם.',
    englishDescription:
      'Pre or post party coffee stop in Lapa full of backpackers from everywhere.',
    rating: 4.3,
    friendsKnow: 5,
  },
  {
    id: 'brooklyn-cafe',
    hebrewName: 'ברוקלין קפה ריו',
    englishName: 'Brooklyn Café',
    category: 'cafe',
    lat: -22.9828879,
    lng: -43.1941013,
    hebrewDescription:
      'קפה שכונתי באיפנמה, וייב ניו יורקי, אחלה ויי-פיי לתכנון המשך הטיול.',
    englishDescription:
      'Neighborhood Ipanema cafe with New York vibe and solid wifi for planning routes.',
    rating: 4.5,
    friendsKnow: 4,
  },
  {
    id: 'bibi-sucos',
    hebrewName: 'ביבי סוקוס',
    englishName: 'Bibi Sucos Copacabana',
    category: 'cafe',
    lat: -22.9680897,
    lng: -43.1808652,
    hebrewDescription:
      'מיצים טבעיים, אסאי וסנדביצ׳ים, פתרון מהיר אחרי ים כשמתים מרעב.',
    englishDescription:
      'Natural juices, açaí and sandwiches, quick fix after the beach hunger hits.',
    rating: 4.5,
    friendsKnow: 9,
  },

  // ─── Restaurants ──────────────────────────────────────────────────────
  {
    id: 'cafe-lamas',
    hebrewName: 'קפה לאמס',
    englishName: 'Café Lamas',
    category: 'restaurant',
    lat: -22.9317031,
    lng: -43.1819892,
    hebrewDescription:
      'מוסד ברזילאי קלאסי, ישראלים באים לטעום פז׳ואדה ולדבר פוליטיקה.',
    englishDescription:
      'Classic Brazilian joint where Israelis try feijoada and end up debating politics.',
    rating: 4.5,
    friendsKnow: 4,
  },
  {
    id: 'boteco-belmonte',
    hebrewName: 'בוטקו בלמונטה',
    englishName: 'Boteco Belmonte Flamengo',
    category: 'restaurant',
    lat: -22.9364568,
    lng: -43.1769614,
    hebrewDescription:
      'בר ומסעדה ברזילאית, בירות קרות ופסטלים, ישראלים יושבים פה שעות.',
    englishDescription:
      'Brazilian bar restaurant with cold beers and pastéis where Israelis linger for hours.',
    rating: 4.4,
    friendsKnow: 6,
  },

  // ─── Bars ─────────────────────────────────────────────────────────────
  {
    id: 'sindicato-chopp',
    hebrewName: 'סינדיקטו דו צ׳ופ',
    englishName: 'Sindicato do Chopp Ipanema',
    category: 'bar',
    lat: -22.9834044,
    lng: -43.2055577,
    hebrewDescription:
      'בר צ׳ופ קלאסי, מוזיקה חיה לפעמים, מקום טוב להתחיל ערב.',
    englishDescription:
      "Classic draft beer bar with occasional live music, good place to kick off the night.",
    rating: 4.3,
    friendsKnow: 5,
  },
  {
    id: 'bar-astor-ipanema',
    hebrewName: 'בר אסטור איפנמה',
    englishName: 'Bar Astor Ipanema',
    category: 'bar',
    lat: -22.9853562,
    lng: -43.2046247,
    hebrewDescription:
      'בר על החוף עם נוף לשקיעה, קוקטיילים קצת יקרים אבל שווה לאווירה.',
    englishDescription:
      'Beachfront bar with sunset views, cocktails pricey but the vibe pays for it.',
    rating: 4.4,
    friendsKnow: 6,
  },
  {
    id: 'lapa-steps-bar',
    hebrewName: 'בר המדרגות בלפה',
    englishName: 'Bar da Boa Lapa',
    category: 'bar',
    lat: -22.9133971,
    lng: -43.1787404,
    hebrewDescription:
      'מקום קלאסי לפני קפיצה לרחוב, מוזיקה, בירות וזרים מכל מקום.',
    englishDescription:
      'Classic warmup spot before the street parties with music, beers and random foreigners.',
    rating: 4.3,
    friendsKnow: 7,
  },
  {
    id: 'leviano-bar',
    hebrewName: 'לביאנו בר',
    englishName: 'Leviano Bar',
    category: 'bar',
    lat: -22.9123283,
    lng: -43.1784319,
    hebrewDescription:
      'בר עם הופעות חיות וסמבה בלפה, נוח להכיר אנשים ורקדנים.',
    englishDescription:
      'Lapa bar with live bands and samba, easy place to meet people and dancers.',
    rating: 4.5,
    friendsKnow: 8,
  },
  {
    id: 'mureta-urca',
    hebrewName: 'מורטה דה אורקה',
    englishName: 'Mureta da Urca',
    category: 'bar',
    lat: -22.9512391,
    lng: -43.1686204,
    hebrewDescription:
      'יושבים על החומה עם בירה מהקיוסק, נוף מושלם לשקיעה במפרץ.',
    englishDescription:
      'Sit on the wall with kiosk beer and perfect bay sunset views.',
    rating: 4.7,
    friendsKnow: 6,
    tarmilPick: true,
  },
  {
    id: 'canastra-bar',
    hebrewName: 'קנסטרא בר',
    englishName: 'Canastra Bar',
    category: 'bar',
    lat: -22.9841219,
    lng: -43.2051636,
    hebrewDescription:
      'בר יין באיפנמה, ימי שלישי מתפוצצים בישראלים ובלוקאלים אחרי החוף.',
    englishDescription:
      'Ipanema wine bar, Tuesdays packed with Israelis and locals fresh from the beach.',
    rating: 4.6,
    friendsKnow: 9,
    tarmilPick: true,
  },

  // ─── Clubs ────────────────────────────────────────────────────────────
  {
    id: 'rio-scenarium',
    hebrewName: 'ריו סצנריום',
    englishName: 'Rio Scenarium',
    category: 'club',
    lat: -22.9127148,
    lng: -43.1830503,
    hebrewDescription:
      'מועדון סמבה ענק בשלוש קומות, גם תיירים וגם מקומיים רוקדים עד מאוחר.',
    englishDescription:
      "Huge three-floor samba club mixing tourists and locals dancing until stupid o'clock.",
    rating: 4.6,
    friendsKnow: 8,
    tarmilPick: true,
  },
  {
    id: 'circo-voador',
    hebrewName: 'סרקו וואדור',
    englishName: 'Circo Voador',
    category: 'club',
    lat: -22.9131533,
    lng: -43.1800298,
    hebrewDescription:
      'מקום הופעות פתוח, ליינים של רוק, רגאיי ואלקטרוני, קהל צעיר בטירוף.',
    englishDescription:
      'Open-air concert venue with rock, reggae and electronic nights, super young crowd.',
    rating: 4.5,
    friendsKnow: 7,
  },
  {
    id: 'fundicao-progresso',
    hebrewName: 'פונדיסאו פרוגרסו',
    englishName: 'Fundição Progresso',
    category: 'club',
    lat: -22.9135688,
    lng: -43.1793293,
    hebrewDescription:
      'האנגר ענק למסיבות והופעות, קופצים שם כל קרנבל וכל סוף שבוע.',
    englishDescription:
      'Massive warehouse for parties and shows, explodes every Carnival and most weekends.',
    rating: 4.4,
    friendsKnow: 6,
  },
  {
    id: 'fosfobox',
    hebrewName: 'פוספובוקס קלאב',
    englishName: 'Fosfobox',
    category: 'club',
    lat: -22.9691156,
    lng: -43.1812892,
    hebrewDescription:
      'מועדון אנדרגראונדי בקופקבנה, טכנו ואינדית, מרגיש קצת כמו דרום תל אביב.',
    englishDescription:
      'Underground Copacabana club with techno and indie, feels a bit like south Tel Aviv.',
    rating: 4.4,
    friendsKnow: 5,
  },

  // ─── Chabad ───────────────────────────────────────────────────────────
  {
    id: 'chabad-leblon',
    hebrewName: 'חב״ד לבלאון',
    englishName: 'Beit Lubavitch Chabad Rio De Janeiro',
    category: 'chabad',
    lat: -22.9837226,
    lng: -43.2195597,
    hebrewDescription:
      'בית חב״ד המרכזי, ארוחות שבת מלאות ישראלים וסטודנטים מכל העולם.',
    englishDescription:
      'Main Chabad house, Shabbat meals packed with Israelis and students from everywhere.',
    rating: 4.7,
    friendsKnow: 9,
    tarmilPick: true,
  },
  {
    id: 'chabad-copa',
    hebrewName: 'חב״ד קופקבנה',
    englishName: 'Beit Lubavitch Copacabana',
    category: 'chabad',
    lat: -22.9673023,
    lng: -43.1866841,
    hebrewDescription:
      'חב״ד על יד החוף, אחלה מקום לנשום יהדות אחרי שבוע של מסיבות.',
    englishDescription:
      'Chabad near the beach, good spot to breathe some Judaism after a week of parties.',
    rating: 4.6,
    friendsKnow: 6,
  },

  // ─── Kosher ───────────────────────────────────────────────────────────
  {
    id: 'shaq-shuq',
    hebrewName: 'שק שוק',
    englishName: 'Shaq Shuq',
    category: 'kosher',
    lat: -22.9686483,
    lng: -43.1861939,
    hebrewDescription:
      'מסעדה כשרה בקופקבנה, אוכל ביתי בסגנון ישראלי כשמתגעגעים לאוכל של אמא.',
    englishDescription:
      'Kosher Copacabana spot with Israeli style home food for when you miss mom.',
    rating: 4.5,
    friendsKnow: 7,
    tarmilPick: true,
  },
  {
    id: 'cib-kosher-bistro',
    hebrewName: 'ביסטרו כשר סי איי בי',
    englishName: 'CIB Kosher Bistro',
    category: 'kosher',
    lat: -22.968587,
    lng: -43.186254,
    hebrewDescription:
      'ביסטרו כשר במועדון היהודי, אחלה לפגוש עוד ישראלים ומשפחות מקומיות.',
    englishDescription:
      'Kosher bistro inside the Jewish club, easy place to meet Israelis and local families.',
    rating: 4.4,
    friendsKnow: 5,
  },

  // ─── Landmarks ────────────────────────────────────────────────────────
  {
    id: 'cristo-redentor',
    hebrewName: 'ישו הגואל',
    englishName: 'Christ the Redeemer',
    category: 'landmark',
    lat: -22.951916,
    lng: -43.2104872,
    hebrewDescription:
      'האייקון של ריו, תמונה חובה עם הידיים פרושות כמו פסל.',
    englishDescription:
      "Rio's main icon, mandatory photo with arms stretched like the statue.",
    rating: 4.7,
    friendsKnow: 13,
    tarmilPick: true,
  },
  {
    id: 'sugarloaf',
    hebrewName: 'שוגרלוף',
    englishName: 'Sugarloaf Mountain',
    category: 'landmark',
    lat: -22.9493486,
    lng: -43.1563408,
    hebrewDescription:
      'הר עם נוף 360, עולים ברכבל, שקיעות שנראות כמו מסך ירוק.',
    englishDescription:
      'A 360-degree view mountain with a cable car ride and sunsets that look CGI fake.',
    rating: 4.7,
    friendsKnow: 9,
  },
  {
    id: 'lapa-arches',
    hebrewName: 'קשתות לפה',
    englishName: 'Arcos da Lapa',
    category: 'landmark',
    lat: -22.91358,
    lng: -43.17902,
    hebrewDescription:
      'אקוודוקט לבן באמצע לפה, נקודת מפגש לכל המסיבות והבלוקים.',
    englishDescription:
      'White aqueduct in Lapa that doubles as the meeting point for parties and blocos.',
    rating: 4.5,
    friendsKnow: 8,
  },
  {
    id: 'selaron-steps',
    hebrewName: 'מדרגות סלרון',
    englishName: 'Escadaria Selarón',
    category: 'landmark',
    lat: -22.9134394,
    lng: -43.179456,
    hebrewDescription:
      'גרפיטי של אריחים צבעוניים, כולם מחפשים אריח של ישראל לצילום.',
    englishDescription:
      'Colorful tiled steps where everyone hunts for the Israel tile photo.',
    rating: 4.6,
    friendsKnow: 10,
    tarmilPick: true,
  },
  {
    id: 'parque-lage',
    hebrewName: 'פארקי לאז׳י',
    englishName: 'Parque Lage',
    category: 'landmark',
    lat: -22.9682391,
    lng: -43.2102638,
    hebrewDescription:
      'ארמון ישן עם בריכה מול היער, צילומי אינסטה ברמה של קליפ.',
    englishDescription:
      'Old mansion with a pool facing the forest, Instagram shots on full music-video level.',
    rating: 4.6,
    friendsKnow: 5,
  },
  {
    id: 'pedra-gavea',
    hebrewName: 'פדרה דה גאבה',
    englishName: 'Pedra da Gávea',
    category: 'landmark',
    lat: -23.0019858,
    lng: -43.2922647,
    hebrewDescription:
      'טרק קשה אבל נוף פסיכי על העיר, הישראלים תמיד עולים מהר מדי.',
    englishDescription:
      'Hard hike with insane views of the city, Israelis always power up too fast.',
    rating: 4.7,
    friendsKnow: 4,
  },
  {
    id: 'dois-irmaos',
    hebrewName: 'מורו דויס אירמאוס',
    englishName: 'Morro Dois Irmãos',
    category: 'landmark',
    lat: -22.9994517,
    lng: -43.2341364,
    hebrewDescription:
      'עלייה יחסית קצרה מעל ווידיגל, נוף משוגע על איפנמה ולבלאון.',
    englishDescription:
      'Relatively short hike above Vidigal with crazy views over Ipanema and Leblon.',
    rating: 4.7,
    friendsKnow: 6,
  },
  {
    id: 'santa-teresa',
    hebrewName: 'שכונת סנטה תרזה',
    englishName: 'Santa Teresa neighborhood',
    category: 'landmark',
    lat: -22.9229157,
    lng: -43.1901305,
    hebrewDescription:
      'שכונה בוהמית על הגבעה, ברים, גרפיטי וחשמלית צהובה לקטע.',
    englishDescription:
      'Bohemian hill neighborhood with bars, graffiti and a cute yellow tram.',
    rating: 4.5,
    friendsKnow: 7,
  },
  {
    id: 'museu-amanha',
    hebrewName: 'מוזיאון המחר',
    englishName: 'Museu do Amanhã',
    category: 'landmark',
    lat: -22.8930924,
    lng: -43.1796111,
    hebrewDescription:
      'מבנה עתידני על המים, אזור נייס להסתובב בו בשקיעה בנמל.',
    englishDescription:
      'Futuristic building on the water, chill sunset walk area by the port.',
    rating: 4.4,
    friendsKnow: 3,
  },
  {
    id: 'mac-niteroi',
    hebrewName: 'מוזיאון ניטרוי',
    englishName: 'MAC Niterói',
    category: 'landmark',
    lat: -22.907042,
    lng: -43.1255708,
    hebrewDescription:
      'מוזיאון בצורת צלחת מעופפת, נוף חזרה לריו פשוט מפחיד.',
    englishDescription:
      "UFO-looking museum with ridiculous views back toward Rio's skyline.",
    rating: 4.5,
    friendsKnow: 3,
  },
  {
    id: 'mirante-dona-marta',
    hebrewName: 'מירנטה דונה מרטה',
    englishName: 'Mirante Dona Marta',
    category: 'landmark',
    lat: -22.9404395,
    lng: -43.1964393,
    hebrewDescription:
      'תצפית זולה מהכריסטו, פחות תורים, נוף דומה ואפילו יותר יפה.',
    englishDescription:
      'Cheaper Cristo-style viewpoint with fewer lines and arguably better views.',
    rating: 4.6,
    friendsKnow: 5,
  },
  {
    id: 'pedra-telegrafo',
    hebrewName: 'פדרה דו טלגרפו',
    englishName: 'Pedra do Telégrafo',
    category: 'landmark',
    lat: -23.0539217,
    lng: -43.0606362,
    hebrewDescription:
      'הסלע המפורסם לתמונות "נפילה מצוק", תור של אינסטה ווריורס.',
    englishDescription:
      'Famous rock for fake cliff-hanging photos, queue of hardcore Instagram warriors.',
    rating: 4.4,
    friendsKnow: 4,
  },
];

export function getPlaceById(id: string): RioPlace | undefined {
  return rioPlaces.find((p) => p.id === id);
}
