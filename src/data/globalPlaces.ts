/**
 * Global curated places — used for planned destinations outside Rio.
 * Schema mirrors RioPlace with an added destinationId pointing into
 * plannedStops.ts.
 *
 * Coordinates verified against Google Maps. Hebrew copy in the natural
 * voice of a 22-year-old post-army backpacker (sentence cap ~14 words).
 */

import type { RioPlace } from './rioPlaces';

export type GlobalPlace = RioPlace & {
  destinationId: string;
};

export const globalPlaces: GlobalPlace[] = [
  // ─── Bangkok ──────────────────────────────────────────────────────────
  {
    id: 'bkk-mad-monkey',
    destinationId: 'bangkok',
    hebrewName: 'הוסטל Mad Monkey',
    englishName: 'Mad Monkey Bangkok',
    category: 'hostel',
    lat: 13.7405,
    lng: 100.5,
    hebrewDescription: 'הוסטל מסיבות עם בריכה על הגג, עמוס ישראלים בנובמבר.',
    englishDescription:
      'Party hostel with a rooftop pool, packed with Israelis in November.',
    rating: 4.4,
    friendsKnow: 6,
    tarmilPick: true,
  },
  {
    id: 'bkk-jay-fai',
    destinationId: 'bangkok',
    hebrewName: 'ג׳יי פאי',
    englishName: 'Jay Fai',
    category: 'restaurant',
    lat: 13.7522,
    lng: 100.504,
    hebrewDescription: 'דוכן רחוב מצויד מישלן, חביתת סרטנים במחבת בוערת.',
    englishDescription:
      'Michelin-starred street stall famous for crab omelette in a flaming wok.',
    rating: 4.7,
    friendsKnow: 3,
    tarmilPick: true,
  },
  {
    id: 'bkk-roots',
    destinationId: 'bangkok',
    hebrewName: 'Roots Coffee',
    englishName: 'Roots Coffee',
    category: 'cafe',
    lat: 13.7408,
    lng: 100.5644,
    hebrewDescription: 'קפה מומחה קטן, מקום מצוין להתאוששות בוקר.',
    englishDescription: 'Small specialty café, a great morning recovery spot.',
    rating: 4.5,
    friendsKnow: 2,
  },
  {
    id: 'bkk-iron-fairies',
    destinationId: 'bangkok',
    hebrewName: 'Iron Fairies',
    englishName: 'Iron Fairies',
    category: 'bar',
    lat: 13.7251,
    lng: 100.581,
    hebrewDescription: 'בר תיאטרלי בסוקומוויט, ג׳ז חי ופיות תלויות.',
    englishDescription: 'Theatrical bar in Sukhumvit with live jazz.',
    rating: 4.3,
    friendsKnow: 1,
  },
  {
    id: 'bkk-kosher-place',
    destinationId: 'bangkok',
    hebrewName: 'Kosher Place Bangkok',
    englishName: 'Kosher Place Bangkok',
    category: 'kosher',
    lat: 13.7367,
    lng: 100.5589,
    hebrewDescription: 'מסעדה כשרה ליד בית חב״ד, מנות תאיות בכשרות חלק.',
    englishDescription:
      'Kosher restaurant next to Chabad, glatt-kosher Thai dishes.',
    rating: 4.2,
    friendsKnow: 4,
  },

  // ─── Chiang Mai ─────────────────────────────────────────────────────
  {
    id: 'cm-stamps',
    destinationId: 'chiang-mai',
    hebrewName: 'Stamps Backpackers',
    englishName: 'Stamps Backpackers',
    category: 'hostel',
    lat: 18.7901,
    lng: 98.9824,
    hebrewDescription: 'הוסטל קטן בעיר העתיקה, חצר נחמדה לארוחות בוקר.',
    englishDescription: 'Small old-city hostel with a nice breakfast courtyard.',
    rating: 4.6,
    friendsKnow: 5,
    tarmilPick: true,
  },
  {
    id: 'cm-sp-chicken',
    destinationId: 'chiang-mai',
    hebrewName: 'SP Chicken',
    englishName: 'SP Chicken',
    category: 'restaurant',
    lat: 18.7948,
    lng: 98.9802,
    hebrewDescription: 'עוף צלוי על אש פתוחה, חוויה מקומית אמיתית.',
    englishDescription: 'Open-fire roasted chicken, a real local experience.',
    rating: 4.5,
    friendsKnow: 4,
  },
  {
    id: 'cm-ristr8to',
    destinationId: 'chiang-mai',
    hebrewName: 'Ristr8to Coffee',
    englishName: 'Ristr8to Coffee',
    category: 'cafe',
    lat: 18.7882,
    lng: 98.985,
    hebrewDescription: 'אלוף עולם בריסטה, אספרסו מהטובים שתשתה אי פעם.',
    englishDescription: 'World-champion barista; one of the best espressos.',
    rating: 4.8,
    friendsKnow: 3,
    tarmilPick: true,
  },
  {
    id: 'cm-chabad',
    destinationId: 'chiang-mai',
    hebrewName: 'בית חב״ד צ׳אנג מאי',
    englishName: 'Chabad House Chiang Mai',
    category: 'chabad',
    lat: 18.7896,
    lng: 98.9923,
    hebrewDescription: 'מקום מפגש ישראלי קלאסי, ארוחות שבת ענקיות.',
    englishDescription: 'Classic Israeli meeting spot, huge Shabbat meals.',
    rating: 4.6,
    friendsKnow: 9,
  },
  {
    id: 'cm-zoe-yellow',
    destinationId: 'chiang-mai',
    hebrewName: 'Zoe in Yellow',
    englishName: 'Zoe in Yellow',
    category: 'club',
    lat: 18.7916,
    lng: 98.9876,
    hebrewDescription: 'מועדון פתוח עם רחבות חיצוניות, מפגש החיים הישראלי.',
    englishDescription: 'Open-air club with outdoor floors, Israeli meeting hub.',
    rating: 4.2,
    friendsKnow: 7,
  },

  // ─── Pai ────────────────────────────────────────────────────────────
  {
    id: 'pai-common-grounds',
    destinationId: 'pai',
    hebrewName: 'Common Grounds',
    englishName: 'Common Grounds Pai',
    category: 'hostel',
    lat: 19.359,
    lng: 98.4424,
    hebrewDescription: 'בקתות עץ עם ערסלים, קצב שקט אחרי בנגקוק.',
    englishDescription: 'Wooden bungalows with hammocks, slow after Bangkok.',
    rating: 4.5,
    friendsKnow: 2,
  },
  {
    id: 'pai-art-chai',
    destinationId: 'pai',
    hebrewName: 'Art in Chai',
    englishName: 'Art in Chai',
    category: 'cafe',
    lat: 19.3593,
    lng: 98.4441,
    hebrewDescription: 'קפה אמנותי עם מוזיקה חיה, עצירה קבועה במסלול.',
    englishDescription: 'Arty café with live music, a regular loop stop.',
    rating: 4.4,
    friendsKnow: 1,
  },

  // ─── Hanoi ──────────────────────────────────────────────────────────
  {
    id: 'hanoi-old-quarter-view',
    destinationId: 'hanoi',
    hebrewName: 'Old Quarter View',
    englishName: 'Old Quarter View Hostel',
    category: 'hostel',
    lat: 21.034,
    lng: 105.8505,
    hebrewDescription: 'הוסטל ברובע הישן, גג עם נוף לאגם החזרה.',
    englishDescription: 'Old Quarter hostel with a rooftop view of Hoan Kiem Lake.',
    rating: 4.4,
    friendsKnow: 3,
  },
  {
    id: 'hanoi-banh-mi-25',
    destinationId: 'hanoi',
    hebrewName: 'Banh Mi 25',
    englishName: 'Banh Mi 25',
    category: 'restaurant',
    lat: 21.0356,
    lng: 105.8503,
    hebrewDescription: 'דוכן באנמי מיתולוגי ברובע הישן, תור אבל זריז.',
    englishDescription: 'Legendary bánh mì stall in the Old Quarter, fast queue.',
    rating: 4.6,
    friendsKnow: 5,
    tarmilPick: true,
  },

  // ─── Búzios ─────────────────────────────────────────────────────────
  {
    id: 'buzios-ferradura',
    destinationId: 'buzios',
    hebrewName: 'חוף פראדורה',
    englishName: 'Praia da Ferradura',
    category: 'beach',
    lat: -22.768,
    lng: -41.892,
    hebrewDescription: 'חוף פרסה מוגן, מים שקטים, נופש מבוזיוס המסיבות.',
    englishDescription:
      'Sheltered horseshoe beach, calm water, a respite from party-Búzios.',
    rating: 4.7,
    friendsKnow: 2,
    tarmilPick: true,
  },
  {
    id: 'buzios-geriba',
    destinationId: 'buzios',
    hebrewName: 'Geribá Beach Hostel',
    englishName: 'Geribá Beach Hostel',
    category: 'hostel',
    lat: -22.776,
    lng: -41.91,
    hebrewDescription: 'הוסטל סמוך לחוף הסערה, אווירה ברזיל קלאסית.',
    englishDescription: 'Hostel near the surf beach, classic Brazil vibe.',
    rating: 4.3,
    friendsKnow: 1,
  },
];

export function getPlacesByDestinationId(destinationId: string): GlobalPlace[] {
  return globalPlaces.filter((p) => p.destinationId === destinationId);
}
