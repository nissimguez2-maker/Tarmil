/**
 * One-shot seed-SQL generator. Reads the existing TS data files (still on
 * disk pending deletion) and the 3 new candidate cities authored inline
 * below, and emits a single SQL migration file that seeds the places /
 * friend_overlaps / trip_waypoints tables.
 *
 * Run: npx tsx scripts/build-seed-sql.ts > supabase/migrations/0003_seed_static_data.sql
 *
 * Hebrew copy is dollar-quoted ($txt$…$txt$) so it stays readable inline
 * and survives any single quotes in the source.
 *
 * After this seed lands in the DB, the TS data files (rioPlaces.ts,
 * globalPlaces.ts, myTrip.ts) are deleted; runtime reads from Supabase.
 */

import { rioPlaces } from '../src/data/rioPlaces';
import { globalPlaces } from '../src/data/globalPlaces';
import {
  friendOverlaps,
  myTrip,
  globalZones as oldGlobalZones,
} from '../src/data/myTrip';

// ─── New candidate cities ────────────────────────────────────────────────

const CANDIDATE_ZONES = {
  mendoza: [-32.8908, -68.8272] as [number, number],
  bariloche: [-41.1335, -71.3103] as [number, number],
  'punta-del-este': [-34.9591, -54.9472] as [number, number],
};

type SeedPlace = {
  id: string;
  destinationId: string;
  hebrewName: string;
  englishName: string;
  category:
    | 'beach'
    | 'hostel'
    | 'cafe'
    | 'restaurant'
    | 'bar'
    | 'club'
    | 'chabad'
    | 'kosher'
    | 'landmark';
  lat: number;
  lng: number;
  hebrewDescription: string;
  englishDescription: string;
  rating: number;
  friendsKnow: number;
  tarmilPick?: boolean;
};

const MENDOZA_PLACES: SeedPlace[] = [
  {
    id: 'mendoza-catena-zapata',
    destinationId: 'mendoza',
    hebrewName: 'יקב קאטנה זאפאטה',
    englishName: 'Bodega Catena Zapata',
    category: 'landmark',
    lat: -33.0378,
    lng: -68.8842,
    hebrewDescription:
      'יקב פירמידה אייקוני, סיורים בעברית בערך, מלבק שמשנה לך את החיים.',
    englishDescription:
      'Iconic pyramid winery; loose Hebrew tours, malbec that changes your life.',
    rating: 4.8,
    friendsKnow: 4,
    tarmilPick: true,
  },
  {
    id: 'mendoza-lagarde',
    destinationId: 'mendoza',
    hebrewName: 'יקב לגארדה',
    englishName: 'Bodega Lagarde',
    category: 'landmark',
    lat: -33.0118,
    lng: -68.8642,
    hebrewDescription:
      'יקב משפחתי משנת 1897, אחלה ארוחת צהריים עם זיווגי יין על הגינה.',
    englishDescription:
      'Family winery from 1897, lunch with wine pairings out on the lawn.',
    rating: 4.7,
    friendsKnow: 3,
  },
  {
    id: 'mendoza-inn-hostel',
    destinationId: 'mendoza',
    hebrewName: 'הוסטל מנדוסה אין',
    englishName: 'Mendoza Inn Hostel',
    category: 'hostel',
    lat: -32.8869,
    lng: -68.8513,
    hebrewDescription:
      'הוסטל ישראלי כבד במרכז, מארגנים סיורי יקבים ואופניים יחד.',
    englishDescription:
      'Heavy Israeli hostel downtown, organizes joint winery + bike tours.',
    rating: 4.5,
    friendsKnow: 7,
    tarmilPick: true,
  },
  {
    id: 'mendoza-lagares',
    destinationId: 'mendoza',
    hebrewName: 'הוסטל לגארס',
    englishName: 'Hostel Lagares',
    category: 'hostel',
    lat: -32.8923,
    lng: -68.8447,
    hebrewDescription:
      'הוסטל קטן ושקט עם בריכה, חצר מלאה ערסלים אחרי יום בשמש.',
    englishDescription:
      'Small quiet hostel with pool, courtyard full of hammocks after a sunny day.',
    rating: 4.4,
    friendsKnow: 2,
  },
  {
    id: 'mendoza-cafe-brod',
    destinationId: 'mendoza',
    hebrewName: 'קפה ברוד',
    englishName: 'Café Bröd',
    category: 'cafe',
    lat: -32.8881,
    lng: -68.8372,
    hebrewDescription:
      'מאפייה–קפה אמיתית, מאפים נהדרים ויי-פיי טוב לתכנן את הימים הבאים.',
    englishDescription:
      'Proper bakery-cafe, great pastries and good wifi to plan the next days.',
    rating: 4.6,
    friendsKnow: 3,
  },
  {
    id: 'mendoza-maria-antonieta',
    destinationId: 'mendoza',
    hebrewName: 'מריה אנטואנטה',
    englishName: 'María Antonieta',
    category: 'cafe',
    lat: -32.8896,
    lng: -68.8416,
    hebrewDescription:
      'בראנץ׳ צפוף בסופי שבוע, אסאי אמיתי וביצים בנדיקט מצוינים.',
    englishDescription:
      'Brunch packed on weekends, real açaí bowls and excellent eggs benedict.',
    rating: 4.5,
    friendsKnow: 2,
  },
  {
    id: 'mendoza-don-mario-kosher',
    destinationId: 'mendoza',
    hebrewName: 'דון מריו כשר',
    englishName: 'Don Mario Kosher',
    category: 'kosher',
    lat: -32.8917,
    lng: -68.8482,
    hebrewDescription:
      'מסעדה כשרה במרכז, אסאדו ארגנטינאי מלא בלי דאגות, בדיוק מה שצריך.',
    englishDescription:
      'Kosher steakhouse downtown, full Argentinian asado without the stress.',
    rating: 4.6,
    friendsKnow: 5,
    tarmilPick: true,
  },
  {
    id: 'mendoza-anna-bistro',
    destinationId: 'mendoza',
    hebrewName: 'אנא ביסטרו',
    englishName: 'Anna Bistró',
    category: 'restaurant',
    lat: -32.8966,
    lng: -68.8527,
    hebrewDescription:
      'ביסטרו מודרני עם מרפסת ענקית, סטייקים מצוינים וקהל מקומי.',
    englishDescription:
      'Modern bistro with a huge terrace, excellent steaks, local crowd.',
    rating: 4.5,
    friendsKnow: 2,
  },
  {
    id: 'mendoza-la-reserva',
    destinationId: 'mendoza',
    hebrewName: 'בר לה רזרבה',
    englishName: 'La Reserva',
    category: 'bar',
    lat: -32.8893,
    lng: -68.8403,
    hebrewDescription:
      'בר אפלולי עם הופעות דראג, אווירה מקומית, אחלה לקפיצה אחרי ארוחה.',
    englishDescription:
      'Dim bar with drag shows, local vibe, perfect post-dinner stop.',
    rating: 4.3,
    friendsKnow: 2,
  },
  {
    id: 'mendoza-chabad',
    destinationId: 'mendoza',
    hebrewName: 'חב״ד מנדוסה',
    englishName: 'Chabad Mendoza',
    category: 'chabad',
    lat: -32.8946,
    lng: -68.8501,
    hebrewDescription:
      'חב״ד חם, ארוחות שבת לישראלים שטסו מבואנוס, סיפורים על יקבים עד מאוחר.',
    englishDescription:
      'Warm Chabad, Shabbat meals for Israelis off the BA bus, stories about wineries late.',
    rating: 4.7,
    friendsKnow: 4,
    tarmilPick: true,
  },
  {
    id: 'mendoza-plaza-independencia',
    destinationId: 'mendoza',
    hebrewName: 'פלאזה אינדפנדנסיה',
    englishName: 'Plaza Independencia',
    category: 'landmark',
    lat: -32.8895,
    lng: -68.8458,
    hebrewDescription:
      'הכיכר הראשית, פעילויות בסופי שבוע, נקודת מפגש לפני יציאות בערב.',
    englishDescription:
      "Main square, weekend events, the city's evening meeting point.",
    rating: 4.4,
    friendsKnow: 4,
  },
  {
    id: 'mendoza-cerro-de-la-gloria',
    destinationId: 'mendoza',
    hebrewName: 'תצפית סרו דה לה גלוריה',
    englishName: 'Cerro de la Gloria viewpoint',
    category: 'landmark',
    lat: -32.8862,
    lng: -68.8722,
    hebrewDescription:
      'תצפית על העיר עם רקע האנדים, יפה במיוחד שעה לפני שקיעה.',
    englishDescription:
      'City viewpoint with the Andes in the back, magic an hour before sunset.',
    rating: 4.6,
    friendsKnow: 3,
    tarmilPick: true,
  },
];

const BARILOCHE_PLACES: SeedPlace[] = [
  {
    id: 'bariloche-cerro-catedral',
    destinationId: 'bariloche',
    hebrewName: 'סרו קתדרל',
    englishName: 'Cerro Catedral',
    category: 'landmark',
    lat: -41.1758,
    lng: -71.4722,
    hebrewDescription:
      'הר הסקי הגדול בדרום, בקיץ טרקים ובחורף מסיבות סקי ישראליות בלי סוף.',
    englishDescription:
      "South's biggest ski hill, treks in summer, endless Israeli ski parties in winter.",
    rating: 4.7,
    friendsKnow: 5,
    tarmilPick: true,
  },
  {
    id: 'bariloche-cerro-campanario',
    destinationId: 'bariloche',
    hebrewName: 'סרו קמפנריו',
    englishName: 'Cerro Campanario',
    category: 'landmark',
    lat: -41.0939,
    lng: -71.5258,
    hebrewDescription:
      'התצפית הכי מפורסמת בארגנטינה, רכבל קצר ופנורמה של אגמים והרים.',
    englishDescription:
      "Argentina's most famous viewpoint, short cable car, lakes and peaks panorama.",
    rating: 4.8,
    friendsKnow: 6,
    tarmilPick: true,
  },
  {
    id: 'bariloche-llao-llao-area',
    destinationId: 'bariloche',
    hebrewName: 'אזור ליאו ליאו',
    englishName: 'Llao Llao area',
    category: 'landmark',
    lat: -41.0517,
    lng: -71.5436,
    hebrewDescription:
      'מלון אגדי, יער מסביב וטרקים קצרים בין שני אגמים, נופים סינמטיים.',
    englishDescription:
      'Legendary hotel, forest around it, short hikes between two lakes, cinematic views.',
    rating: 4.7,
    friendsKnow: 3,
  },
  {
    id: 'bariloche-perikos',
    destinationId: 'bariloche',
    hebrewName: 'הוסטל פריקוס',
    englishName: "Periko's Hostel",
    category: 'hostel',
    lat: -41.1326,
    lng: -71.3032,
    hebrewDescription:
      'הוסטל קלאסי לתרמילאים, מטבח חברתי, מארגנים יומית טרקים וטיולי שלגים.',
    englishDescription:
      'Classic backpacker hostel, social kitchen, daily treks + ski trips on the board.',
    rating: 4.6,
    friendsKnow: 5,
    tarmilPick: true,
  },
  {
    id: 'bariloche-41-below',
    destinationId: 'bariloche',
    hebrewName: 'הוסטל 41 בילו',
    englishName: '41 Below Hostel',
    category: 'hostel',
    lat: -41.1331,
    lng: -71.2989,
    hebrewDescription:
      'הוסטל קטן וחם, אחלה בסיס בין טרקים, סלון עם אח לערבים קרים.',
    englishDescription:
      'Small warm hostel, great base between treks, fireplace lounge for cold nights.',
    rating: 4.5,
    friendsKnow: 3,
  },
  {
    id: 'bariloche-familia-weiss',
    destinationId: 'bariloche',
    hebrewName: 'קפה משפחת וייס',
    englishName: 'Familia Weiss Café',
    category: 'cafe',
    lat: -41.1353,
    lng: -71.3068,
    hebrewDescription:
      'קפה מבית הברירה ויינים מקומיים, ארוחת בוקר חמה אחרי בוקר קר.',
    englishDescription:
      'Café from the same brewery group, hot breakfast after a frozen morning.',
    rating: 4.4,
    friendsKnow: 2,
  },
  {
    id: 'bariloche-mamuschka',
    destinationId: 'bariloche',
    hebrewName: 'שוקולדים מאמושקה',
    englishName: 'Mamuschka',
    category: 'cafe',
    lat: -41.1346,
    lng: -71.3051,
    hebrewDescription:
      'הסמל של בריצ׳ה, שוקולדים אומנותיים וחם עם מרשמלו לסגור יום.',
    englishDescription:
      "Bariloche's icon, artisanal chocolates and hot cocoa with marshmallows.",
    rating: 4.7,
    friendsKnow: 8,
    tarmilPick: true,
  },
  {
    id: 'bariloche-berlina',
    destinationId: 'bariloche',
    hebrewName: 'מבשלת ברלינה',
    englishName: 'Berlina Brewery',
    category: 'bar',
    lat: -41.0764,
    lng: -71.5021,
    hebrewDescription:
      'מבשלה משפחתית בקולוניה סוויסה, IPA רצינית ושולחנות עץ ארוכים.',
    englishDescription:
      'Family brewery in Colonia Suiza, serious IPAs, long wooden tables.',
    rating: 4.6,
    friendsKnow: 3,
    tarmilPick: true,
  },
  {
    id: 'bariloche-kraken',
    destinationId: 'bariloche',
    hebrewName: 'בר קרקן',
    englishName: 'Kraken Cervecería',
    category: 'bar',
    lat: -41.1334,
    lng: -71.3062,
    hebrewDescription:
      'בר במרכז עם 12 ברזים, ערבי קרהוקי ישראלי ויחס חם לתרמילאים.',
    englishDescription:
      'Downtown 12-tap bar, Israeli karaoke nights, warm to backpackers.',
    rating: 4.5,
    friendsKnow: 4,
  },
  {
    id: 'bariloche-la-cantina',
    destinationId: 'bariloche',
    hebrewName: 'לה קנטינה',
    englishName: 'La Cantina',
    category: 'restaurant',
    lat: -41.1351,
    lng: -71.3073,
    hebrewDescription:
      'מסעדת שולחנות משותפים עם שלוש קומות, טרוטה מקומית מצוינת.',
    englishDescription:
      'Three-floor shared-tables joint, excellent local trout, full all night.',
    rating: 4.4,
    friendsKnow: 2,
  },
  {
    id: 'bariloche-chabad',
    destinationId: 'bariloche',
    hebrewName: 'חב״ד בריצ׳ה',
    englishName: 'Chabad Bariloche',
    category: 'chabad',
    lat: -41.1342,
    lng: -71.3094,
    hebrewDescription:
      'בית חב״ד עם נוף לאגם, ארוחות שבת מלאות מטיילים אחרי טרקים.',
    englishDescription:
      'Lakefront Chabad, Shabbat tables packed with backpackers post-trek.',
    rating: 4.7,
    friendsKnow: 5,
    tarmilPick: true,
  },
  {
    id: 'bariloche-circuito-chico',
    destinationId: 'bariloche',
    hebrewName: 'מסלול סירקויטו צ׳יקו',
    englishName: 'Circuito Chico',
    category: 'landmark',
    lat: -41.0682,
    lng: -71.5417,
    hebrewDescription:
      'מסלול אופניים של 27 ק״מ סביב אגמים, עוצרים בכל תצפית, חוזרים שטופים מאושר.',
    englishDescription:
      '27km bike loop around lakes, stop at every viewpoint, come back glowing.',
    rating: 4.7,
    friendsKnow: 4,
  },
];

const PUNTA_PLACES: SeedPlace[] = [
  {
    id: 'punta-la-mano',
    destinationId: 'punta-del-este',
    hebrewName: 'פסל היד · פלאיה ברווה',
    englishName: 'La Mano · Playa Brava',
    category: 'landmark',
    lat: -34.9648,
    lng: -54.9385,
    hebrewDescription:
      'הפסל המפורסם של היד שצומחת מהחול, חובה לתמונה גם אם זה קלישה.',
    englishDescription:
      'The famous hand sculpture rising from the sand, mandatory photo even if cliché.',
    rating: 4.6,
    friendsKnow: 7,
    tarmilPick: true,
  },
  {
    id: 'punta-playa-mansa',
    destinationId: 'punta-del-este',
    hebrewName: 'חוף מנסה',
    englishName: 'Playa Mansa',
    category: 'beach',
    lat: -34.9527,
    lng: -54.9494,
    hebrewDescription:
      'חוף שקט בצד המפרץ, מים רגועים ושקיעות כתומות חזקות.',
    englishDescription:
      'Calm bay-side beach, gentle water and intense orange sunsets.',
    rating: 4.7,
    friendsKnow: 4,
    tarmilPick: true,
  },
  {
    id: 'punta-playa-bikini',
    destinationId: 'punta-del-este',
    hebrewName: 'חוף ביקיני',
    englishName: 'Playa Bikini',
    category: 'beach',
    lat: -34.8806,
    lng: -55.0247,
    hebrewDescription:
      'חוף צעיר ויפה צפונית מהעיר, גלים סבירים וקזונים על החול.',
    englishDescription:
      'Young pretty beach north of town, decent waves and casinos on the sand.',
    rating: 4.5,
    friendsKnow: 3,
  },
  {
    id: 'punta-jose-ignacio',
    destinationId: 'punta-del-este',
    hebrewName: 'חוסה איגנסיו',
    englishName: 'José Ignacio',
    category: 'beach',
    lat: -34.8458,
    lng: -54.6383,
    hebrewDescription:
      'כפר דייגים שהפך לאיביזה של אורוגוואי, חוף מושלם ומסעדות גורמה.',
    englishDescription:
      "Fishing village turned Uruguay's Ibiza, perfect beach and gourmet kitchens.",
    rating: 4.8,
    friendsKnow: 5,
    tarmilPick: true,
  },
  {
    id: 'punta-el-viajero',
    destinationId: 'punta-del-este',
    hebrewName: 'הוסטל אל ויאחרו',
    englishName: 'El Viajero Hostel',
    category: 'hostel',
    lat: -34.9646,
    lng: -54.9442,
    hebrewDescription:
      'הוסטל מסיבות מהשרשרת, מטרים מהחוף, ערבים פתוחים על הפטיו.',
    englishDescription:
      'Chain party hostel, meters from the beach, open patio nights.',
    rating: 4.4,
    friendsKnow: 4,
  },
  {
    id: 'punta-1949-hostel',
    destinationId: 'punta-del-este',
    hebrewName: 'הוסטל 1949',
    englishName: '1949 Hostel',
    category: 'hostel',
    lat: -34.9628,
    lng: -54.9468,
    hebrewDescription:
      'הוסטל בוטיק במרכז, אווירה רגועה ומרפסת גג עם נוף לים.',
    englishDescription:
      'Boutique downtown hostel, calmer vibe and a rooftop with sea view.',
    rating: 4.6,
    friendsKnow: 3,
    tarmilPick: true,
  },
  {
    id: 'punta-medialunas',
    destinationId: 'punta-del-este',
    hebrewName: 'מדיאלונאס קלנטיטס',
    englishName: 'Medialunas Calentitas',
    category: 'cafe',
    lat: -34.9609,
    lng: -54.9436,
    hebrewDescription:
      'מאפייה אגדית, קרואסון אורוגוואי חם ב־3 לפנות בוקר אחרי מסיבה.',
    englishDescription:
      'Legendary bakery, hot Uruguayan croissants at 3am after a party.',
    rating: 4.7,
    friendsKnow: 5,
    tarmilPick: true,
  },
  {
    id: 'punta-la-huella',
    destinationId: 'punta-del-este',
    hebrewName: 'לה אואייה',
    englishName: 'La Huella',
    category: 'restaurant',
    lat: -34.8482,
    lng: -54.6358,
    hebrewDescription:
      'פרדור מיתולוגי בחוסה איגנסיו, דגים על האש בחוף, שווה את הנסיעה.',
    englishDescription:
      'Mythical parador in José Ignacio, fire-grilled fish on the beach, worth the drive.',
    rating: 4.8,
    friendsKnow: 4,
    tarmilPick: true,
  },
  {
    id: 'punta-la-bourgogne',
    destinationId: 'punta-del-este',
    hebrewName: 'לה בורגון',
    englishName: 'La Bourgogne',
    category: 'restaurant',
    lat: -34.9523,
    lng: -54.9354,
    hebrewDescription:
      'מסעדה צרפתית קלאסית, חצר ירוקה רומנטית, בחירה מצוינת לערב יוקרה.',
    englishDescription:
      'Classic French place, romantic garden, solid pick for a fancier night.',
    rating: 4.6,
    friendsKnow: 2,
  },
  {
    id: 'punta-soho-bar',
    destinationId: 'punta-del-este',
    hebrewName: 'בר סוהו פונטה',
    englishName: 'Soho Bar Punta',
    category: 'bar',
    lat: -34.9617,
    lng: -54.9479,
    hebrewDescription:
      'בר עירוני עם מרפסת רחוב, קוקטיילים יצירתיים וקהל אורוגוואי וארגנטינאי.',
    englishDescription:
      'Urban bar with a sidewalk patio, creative cocktails, mixed Uruguay-Argentina crowd.',
    rating: 4.4,
    friendsKnow: 3,
  },
  {
    id: 'punta-ovo-club',
    destinationId: 'punta-del-este',
    hebrewName: 'מועדון אובו ביץ׳',
    englishName: 'Ovo Beach Club',
    category: 'club',
    lat: -34.9603,
    lng: -54.9341,
    hebrewDescription:
      'מועדון חוף סמוך לקזינו, סטים בינלאומיים בקיץ הדרומי, עד הזריחה.',
    englishDescription:
      'Casino-adjacent beach club, international DJ sets in southern summer, till sunrise.',
    rating: 4.4,
    friendsKnow: 3,
  },
  {
    id: 'punta-chabad',
    destinationId: 'punta-del-este',
    hebrewName: 'חב״ד פונטה דל אסטה',
    englishName: 'Chabad Punta del Este',
    category: 'chabad',
    lat: -34.9532,
    lng: -54.9477,
    hebrewDescription:
      'בית חב״ד תוסס בקיץ, מארגנים ערבי שבת על החוף עם ישראלים מבואנוס.',
    englishDescription:
      'Lively Chabad in the summer, beach Shabbat dinners with Israelis from BA.',
    rating: 4.6,
    friendsKnow: 5,
    tarmilPick: true,
  },
];

// ─── New friend overlaps for the candidates ──────────────────────────────

type SeedFriend = {
  id: string;
  friendName: string;
  friendInitial: string;
  photoUrl: string;
  lat: number;
  lng: number;
  zoneLabel: string;
  status: 'present' | 'future';
  detail: string;
  destinationId?: string;
  overlapStart?: string;
  overlapEnd?: string;
};

const CANDIDATE_FRIENDS: SeedFriend[] = [
  {
    id: 'neta-mendoza',
    friendName: 'נטע ביטון',
    friendInitial: 'נ',
    photoUrl: 'https://i.pravatar.cc/200?img=29',
    lat: CANDIDATE_ZONES.mendoza[0],
    lng: CANDIDATE_ZONES.mendoza[1],
    zoneLabel: 'מנדוסה',
    status: 'future',
    detail: 'במנדוסה לסיורי יקבים, חופפת איתך 26–30 בנובמבר.',
    destinationId: 'mendoza',
    overlapStart: '2026-11-26',
    overlapEnd: '2026-11-30',
  },
  {
    id: 'uri-bariloche',
    friendName: 'אורי דהן',
    friendInitial: 'א',
    photoUrl: 'https://i.pravatar.cc/200?img=12',
    lat: CANDIDATE_ZONES.bariloche[0],
    lng: CANDIDATE_ZONES.bariloche[1],
    zoneLabel: 'בריצ׳ה',
    status: 'future',
    detail: 'בבריצ׳ה לטרק 4 ימי הרים, מחפש שותפים לקמפינג.',
    destinationId: 'bariloche',
    overlapStart: '2026-12-01',
    overlapEnd: '2026-12-06',
  },
  {
    id: 'dana-punta',
    friendName: 'דנה ארזי',
    friendInitial: 'ד',
    photoUrl: 'https://i.pravatar.cc/200?img=45',
    lat: CANDIDATE_ZONES['punta-del-este'][0],
    lng: CANDIDATE_ZONES['punta-del-este'][1],
    zoneLabel: 'פונטה דל אסטה',
    status: 'future',
    detail: 'בפונטה לחוף ומסיבות, חופפת 7–11 בדצמבר אם מצליחה לעוף בזמן.',
    destinationId: 'punta-del-este',
    overlapStart: '2026-12-07',
    overlapEnd: '2026-12-11',
  },
];

// ─── SQL emit helpers ────────────────────────────────────────────────────

function dq(s: string | null | undefined): string {
  if (s == null) return 'NULL';
  return `$txt$${s}$txt$`;
}

function num(n: number): string {
  return Number.isFinite(n) ? n.toString() : 'NULL';
}

function bool(b: boolean | undefined): string {
  return b ? 'true' : 'false';
}

// ─── Build the seed ───────────────────────────────────────────────────────

// Resolve buzios-geriba duplicate by suffixing per region (rio = beach, global
// = hostel). Matches the resolution we used in PR #7.
const COLLIDING = 'buzios-geriba';

const allPlaces: SeedPlace[] = [
  // 52 Rio places — append destination_id 'rio-de-janeiro' since the TS type
  // doesn't carry it.
  ...rioPlaces.map((p) => ({
    id: p.id === COLLIDING ? `${COLLIDING}-beach` : p.id,
    destinationId: 'rio-de-janeiro',
    hebrewName: p.hebrewName,
    englishName: p.englishName,
    category: p.category,
    lat: p.lat,
    lng: p.lng,
    hebrewDescription: p.hebrewDescription,
    englishDescription: p.englishDescription,
    rating: p.rating,
    friendsKnow: p.friendsKnow,
    tarmilPick: p.tarmilPick,
  })),
  // 79 existing global places — destinationId already set.
  ...globalPlaces.map((p) => ({
    id: p.id === COLLIDING ? `${COLLIDING}-hostel` : p.id,
    destinationId: p.destinationId,
    hebrewName: p.hebrewName,
    englishName: p.englishName,
    category: p.category,
    lat: p.lat,
    lng: p.lng,
    hebrewDescription: p.hebrewDescription,
    englishDescription: p.englishDescription,
    rating: p.rating,
    friendsKnow: p.friendsKnow,
    tarmilPick: p.tarmilPick,
  })),
  // 36 new candidate places.
  ...MENDOZA_PLACES,
  ...BARILOCHE_PLACES,
  ...PUNTA_PLACES,
];

const allFriends: SeedFriend[] = [
  ...friendOverlaps.map((f) => ({
    id: f.id,
    friendName: f.friendName,
    friendInitial: f.friendInitial,
    photoUrl: f.photoUrl,
    lat: f.lat,
    lng: f.lng,
    zoneLabel: f.zoneLabel,
    status: f.status,
    detail: f.detail,
    destinationId: f.destinationId,
    overlapStart: f.overlapStart,
    overlapEnd: f.overlapEnd,
  })),
  ...CANDIDATE_FRIENDS,
];

// 5 past + 1 present, derived from myTrip
const allWaypoints = [
  ...myTrip.past.map((coord, i) => ({
    id: `past-${i}`,
    lat: coord[0],
    lng: coord[1],
    kind: 'past' as const,
    order_index: i,
  })),
  {
    id: 'present',
    lat: myTrip.present[0],
    lng: myTrip.present[1],
    kind: 'present' as const,
    order_index: 0,
  },
];

// Touch unused export so the linter doesn't complain about partial imports.
void oldGlobalZones;

// ─── Emit ────────────────────────────────────────────────────────────────

const lines: string[] = [
  '-- Seed for places, friend_overlaps, trip_waypoints. Generated by',
  '-- scripts/build-seed-sql.ts from src/data/{rioPlaces,globalPlaces,myTrip}.ts',
  '-- + the 3 candidate cities (Mendoza, Bariloche, Punta del Este) authored',
  "-- inline in that script. Hebrew dollar-quoted ($txt$…$txt$).",
  '',
  '-- Wipe before re-seeding (the script is idempotent in spirit; rerunning',
  '-- will produce the same end state).',
  'truncate table public.places, public.friend_overlaps, public.trip_waypoints;',
  '',
];

// places
lines.push(
  'insert into public.places (id, destination_id, hebrew_name, english_name, category, lat, lng, hebrew_description, english_description, rating, friends_know, tarmil_pick) values',
);
const placeRows = allPlaces.map((p, i) => {
  const trailing = i === allPlaces.length - 1 ? ';' : ',';
  return `  (${dq(p.id)}, ${dq(p.destinationId)}, ${dq(p.hebrewName)}, ${dq(p.englishName)}, ${dq(p.category)}, ${num(p.lat)}, ${num(p.lng)}, ${dq(p.hebrewDescription)}, ${dq(p.englishDescription)}, ${num(p.rating)}, ${num(p.friendsKnow)}, ${bool(p.tarmilPick)})${trailing}`;
});
lines.push(...placeRows);
lines.push('');

// friend_overlaps
lines.push(
  'insert into public.friend_overlaps (id, friend_name, friend_initial, photo_url, lat, lng, zone_label, status, detail, destination_id, overlap_start, overlap_end) values',
);
const friendRows = allFriends.map((f, i) => {
  const trailing = i === allFriends.length - 1 ? ';' : ',';
  return `  (${dq(f.id)}, ${dq(f.friendName)}, ${dq(f.friendInitial)}, ${dq(f.photoUrl)}, ${num(f.lat)}, ${num(f.lng)}, ${dq(f.zoneLabel)}, ${dq(f.status)}, ${dq(f.detail)}, ${dq(f.destinationId)}, ${dq(f.overlapStart)}, ${dq(f.overlapEnd)})${trailing}`;
});
lines.push(...friendRows);
lines.push('');

// trip_waypoints
lines.push(
  'insert into public.trip_waypoints (id, lat, lng, kind, order_index) values',
);
const wpRows = allWaypoints.map((w, i) => {
  const trailing = i === allWaypoints.length - 1 ? ';' : ',';
  return `  (${dq(w.id)}, ${num(w.lat)}, ${num(w.lng)}, ${dq(w.kind)}, ${num(w.order_index)})${trailing}`;
});
lines.push(...wpRows);

// Stats summary footer (comment).
lines.push('');
lines.push(`-- ${allPlaces.length} places (52 rio + ${globalPlaces.length} global + 36 candidates)`);
lines.push(`-- ${allFriends.length} friend overlaps (${friendOverlaps.length} existing + 3 candidates)`);
lines.push(`-- ${allWaypoints.length} trip waypoints (${myTrip.past.length} past + 1 present)`);

// eslint-disable-next-line no-console
console.log(lines.join('\n'));
