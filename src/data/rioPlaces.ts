/**
 * Rio de Janeiro places — investor-demo mock data.
 *
 * 8 hand-picked landmarks that work as a starter set. Will be replaced /
 * augmented with the curated list from the Perplexity research the founder
 * is running in parallel.
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
  /** How many of the user's friends know this place. */
  friendsKnow: number;
  /** Hand-picked Tarmil recommendation badge. */
  tarmilPick?: boolean;
};

export const rioPlaces: RioPlace[] = [
  {
    id: 'copacabana',
    hebrewName: 'חוף קופקבנה',
    englishName: 'Copacabana Beach',
    category: 'beach',
    lat: -22.9711,
    lng: -43.1822,
    hebrewDescription: 'החוף האייקוני של ריו, הבסיס של כל מטייל ישראלי שמגיע.',
    englishDescription: "Rio's iconic beach, every Israeli traveler's home base.",
    rating: 4.6,
    friendsKnow: 12,
    tarmilPick: true,
  },
  {
    id: 'ipanema',
    hebrewName: 'חוף איפנמה',
    englishName: 'Ipanema Beach',
    category: 'beach',
    lat: -22.9847,
    lng: -43.1982,
    hebrewDescription: 'חוף יותר רגוע, פוסטו 9 הוא המפגש של הצעירים בסוף השבוע.',
    englishDescription: 'Calmer beach, Posto 9 is where young crowds meet on weekends.',
    rating: 4.7,
    friendsKnow: 9,
    tarmilPick: true,
  },
  {
    id: 'arpoador',
    hebrewName: 'פדרה דו ארפואדור',
    englishName: 'Pedra do Arpoador',
    category: 'landmark',
    lat: -22.9889,
    lng: -43.1925,
    hebrewDescription: 'נקודת התצפית של ריו לשקיעה. קהל מוחא כפיים לשמש כל ערב.',
    englishDescription: 'Rio\'s sunset viewpoint. The crowd applauds the sun every evening.',
    rating: 4.8,
    friendsKnow: 7,
    tarmilPick: true,
  },
  {
    id: 'cristo',
    hebrewName: 'הקריסטו',
    englishName: 'Cristo Redentor',
    category: 'landmark',
    lat: -22.9519,
    lng: -43.2105,
    hebrewDescription: 'הפסל הענק על ההר. מומלץ ללכת מוקדם בבוקר לפני העננים.',
    englishDescription: 'The giant statue on the mountain. Go early before the clouds roll in.',
    rating: 4.5,
    friendsKnow: 11,
  },
  {
    id: 'pao-de-acucar',
    hebrewName: 'פאו דה אסוקר',
    englishName: 'Sugarloaf Mountain',
    category: 'landmark',
    lat: -22.9489,
    lng: -43.1565,
    hebrewDescription: 'רכבל עד הפסגה, נוף של כל ריו. שעת השקיעה היא הזמן הנכון.',
    englishDescription: 'Cable car to the summit, view of all of Rio. Sunset is the right time.',
    rating: 4.6,
    friendsKnow: 8,
  },
  {
    id: 'lapa',
    hebrewName: 'לאפה',
    englishName: 'Lapa',
    category: 'club',
    lat: -22.9128,
    lng: -43.1797,
    hebrewDescription: 'לב הלילה של ריו. סמבה, פורו, רחובות שמתפקעים בסופי שבוע.',
    englishDescription: "Rio's nightlife heart. Samba, forró, streets bursting on weekends.",
    rating: 4.4,
    friendsKnow: 10,
    tarmilPick: true,
  },
  {
    id: 'santa-teresa',
    hebrewName: 'סנטה טרזה',
    englishName: 'Santa Teresa',
    category: 'cafe',
    lat: -22.9216,
    lng: -43.1819,
    hebrewDescription: 'שכונה אומנותית עם בתי קפה, גלריות ונוף לעיר. קצב לאט יותר.',
    englishDescription: 'Artsy hilltop neighborhood with cafés, galleries, city views. Slower pace.',
    rating: 4.5,
    friendsKnow: 6,
  },
  {
    id: 'maracana',
    hebrewName: 'אצטדיון מרקנה',
    englishName: 'Maracanã Stadium',
    category: 'landmark',
    lat: -22.9121,
    lng: -43.2302,
    hebrewDescription: 'אם יש משחק כשאתה כאן — לך. אטמוספרה שלא דומה לכלום.',
    englishDescription: "If there's a match while you're here — go. Atmosphere unlike anything.",
    rating: 4.7,
    friendsKnow: 5,
  },
];

export function getPlaceById(id: string): RioPlace | undefined {
  return rioPlaces.find((p) => p.id === id);
}
