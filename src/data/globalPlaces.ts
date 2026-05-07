/**
 * Curated places outside the user's current city — for planned destinations.
 *
 * SEED ONLY. Runtime data is read from the `places` table in Supabase. This
 * array feeds `scripts/seed-supabase.ts`; nothing in `src/` imports it at
 * runtime.
 *
 * Each entry's `destinationId` points to a `planned_stops.id`. Coordinates
 * verified against Google Maps. Kept as a separate file from rioPlaces.ts
 * for curator convenience — runtime treats them as one unified `places` set.
 */

import type { Place } from './places';

export const globalPlaces: Place[] = [
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
    id: 'buzios-geriba-hostel',
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

  // ─── São Paulo ───────────────────────────────────────────────────────
  {
    id: 'o-de-casa-hostel',
    destinationId: 'sao-paulo',
    hebrewName: 'הוסטל או דה קזה',
    englishName: 'Ô de Casa Hostel',
    category: 'hostel',
    lat: -23.5558422,
    lng: -46.6939196,
    hebrewDescription:
      'הוסטל התרמילאים הקלאסי בוילה מדלנה, מלא ישראלים לפני הצפון.',
    englishDescription:
      'Classic Vila Madalena backpacker hostel, loaded with Israelis pre-north trip.',
    rating: 4.5,
    friendsKnow: 7,
    tarmilPick: true,
  },
  {
    id: 'soul-hostel',
    destinationId: 'sao-paulo',
    hebrewName: 'סול הוסטל',
    englishName: 'Soul Hostel',
    category: 'hostel',
    lat: -23.5585757,
    lng: -46.6527892,
    hebrewDescription:
      'קרוב לפאוליסטה ומטרו, בסיס זול ונוח לסידורים בעיר.',
    englishDescription:
      'Close to Paulista and metro, cheap comfortable base for errands in the city.',
    rating: 4.2,
    friendsKnow: 3,
  },
  {
    id: 'brazilodge-hostel',
    destinationId: 'sao-paulo',
    hebrewName: "ברזילודג' הוסטל",
    englishName: 'Brazilodge All Suites Hostel',
    category: 'hostel',
    lat: -23.5870006,
    lng: -46.6404154,
    hebrewDescription:
      'הוסטל מסודר בווילה מריאנה, פחות מסיבות יותר מנוחה וסופרמרקטים.',
    englishDescription:
      'Organized Vila Mariana hostel, less party, more rest and supermarkets.',
    rating: 4.3,
    friendsKnow: 2,
  },
  {
    id: 'casa-azul-hostel',
    destinationId: 'sao-paulo',
    hebrewName: 'קזה אזול הוסטל',
    englishName: 'Hostel Casa Azul São Paulo',
    category: 'hostel',
    lat: -23.5896517,
    lng: -46.6401486,
    hebrewDescription:
      'אחלה אופציה שקטה, חדרים נוחים אחרי לילה כבד בפאוליסטה.',
    englishDescription:
      'Quieter option with comfy rooms after a heavy Paulista night.',
    rating: 4.4,
    friendsKnow: 1,
  },
  {
    id: 'sova-rest',
    destinationId: 'sao-paulo',
    hebrewName: 'סובה אוכל יהודי',
    englishName: 'Sová Comida Judaica',
    category: 'restaurant',
    lat: -23.5683922,
    lng: -46.6586425,
    hebrewDescription:
      'מסעדה–מאפייה עם אוכל יהודי וישראלי, מרגיש כמו מדרחוב דיזינגוף.',
    englishDescription:
      'Jewish-Israeli food spot and bakery, gives strong Dizengoff pedestrian vibes.',
    rating: 4.5,
    friendsKnow: 5,
    tarmilPick: true,
  },
  {
    id: 'beit-cafe',
    destinationId: 'sao-paulo',
    hebrewName: 'בית קפה בומ רטירו',
    englishName: 'Beit Café',
    category: 'cafe',
    lat: -23.524751,
    lng: -46.6334203,
    hebrewDescription:
      'קפה–מסעדה עם אוכל בסגנון ישראל, מלא עברית בבומ רטירו.',
    englishDescription:
      'Cafe restaurant with Israel style food, Hebrew everywhere in Bom Retiro.',
    rating: 4.4,
    friendsKnow: 4,
  },
  {
    id: 'emporium-brasil-israel',
    destinationId: 'sao-paulo',
    hebrewName: 'אמפוריום ברזיל ישראל',
    englishName: 'Emporium Brasil Israel',
    category: 'restaurant',
    lat: -23.5242507,
    lng: -46.6362702,
    hebrewDescription:
      'מעדנייה כשרה–סטייל, שניצל, חלות ושוקולדים ישראליים למדף בתיק.',
    englishDescription:
      'Kosher style deli with schnitzel, challahs and Israeli snacks for the backpack.',
    rating: 4.3,
    friendsKnow: 3,
  },
  {
    id: 'bubbeleh-delishop',
    destinationId: 'sao-paulo',
    hebrewName: 'באבעלע דלישופ',
    englishName: 'Bubbeleh Delishop',
    category: 'restaurant',
    lat: -23.5668962,
    lng: -46.6902668,
    hebrewDescription:
      'מסעדה ישראלית בפיניירוס, חומוס, פלאפל וסביח לוייב תל אביבי.',
    englishDescription:
      'Israeli spot in Pinheiros serving hummus, falafel and sabich with Tel Aviv vibe.',
    rating: 4.6,
    friendsKnow: 6,
  },
  {
    id: 'armazem-muszkat',
    destinationId: 'sao-paulo',
    hebrewName: 'ארמזם מוסקאט',
    englishName: 'Armazém Muszkat',
    category: 'restaurant',
    lat: -23.5876151,
    lng: -46.6778192,
    hebrewDescription:
      'מטבח יהודי משפחתי, מרגיש כמו לבוא לארוחת שישי אצל דודה.',
    englishDescription:
      "Family style Jewish kitchen, feels like dropping into a Friday dinner at your aunt's.",
    rating: 4.5,
    friendsKnow: 2,
  },
  {
    id: 'jardins-cafe',
    destinationId: 'sao-paulo',
    hebrewName: "קפה בג'רדינס",
    englishName: 'Café Girondino Jardins',
    category: 'cafe',
    lat: -23.5654028,
    lng: -46.6598287,
    hebrewDescription:
      'קפה נעים ליד פאוליסטה, אחלה ויי-פיי לתכנן המשך טיסות ואוטובוסים.',
    englishDescription:
      'Chill cafe near Paulista with good wifi to sort flights and bus chaos.',
    rating: 4.2,
    friendsKnow: 2,
  },
  {
    id: 'vila-madalena-cafe',
    destinationId: 'sao-paulo',
    hebrewName: 'קפה וילה מדלנה',
    englishName: 'Coffee Lab Vila Madalena',
    category: 'cafe',
    lat: -23.555085,
    lng: -46.6909603,
    hebrewDescription:
      'קפה היפסטרי, ברזילאים ותרמילאים על אותו בר, קפה ברמה משוגעת.',
    englishDescription:
      'Hipster cafe where locals and backpackers share the bar and absurdly good coffee.',
    rating: 4.7,
    friendsKnow: 4,
    tarmilPick: true,
  },
  {
    id: 'boteco-belmonte-sp',
    destinationId: 'sao-paulo',
    hebrewName: 'בוטקו שכונתי פינייירוס',
    englishName: 'Boteco São Conrado Pinheiros',
    category: 'restaurant',
    lat: -23.5678129,
    lng: -46.6942112,
    hebrewDescription:
      'בוטקו ברזילאי טיפוסי, בירות קרות ופסטלים אחרי סיבוב בפיניירוס.',
    englishDescription:
      'Typical Brazilian boteco with cold beers and pastéis after wandering Pinheiros.',
    rating: 4.3,
    friendsKnow: 3,
  },
  {
    id: 'bar-samba',
    destinationId: 'sao-paulo',
    hebrewName: 'בר סמבה',
    englishName: 'Bar Samba',
    category: 'bar',
    lat: -23.5592179,
    lng: -46.6917343,
    hebrewDescription:
      'בר סמבה חי בווילה מדלנה, ישראלים מנסים לעקוב אחרי הצעדים.',
    englishDescription:
      'Lively Vila Madalena samba bar where Israelis try to keep up with the steps.',
    rating: 4.6,
    friendsKnow: 5,
    tarmilPick: true,
  },
  {
    id: 'vila-do-samba',
    destinationId: 'sao-paulo',
    hebrewName: 'וילה דו סמבה',
    englishName: 'Vila do Samba',
    category: 'club',
    lat: -23.508894,
    lng: -46.6634272,
    hebrewDescription:
      'מועדון סמבה ענק, שולחנות, הופעות, הרגשה של קרנבל גם בלי ריו.',
    englishDescription:
      'Huge samba venue with tables and shows, Carnival feeling without leaving São Paulo.',
    rating: 4.5,
    friendsKnow: 3,
  },
  {
    id: 'batman-alley',
    destinationId: 'sao-paulo',
    hebrewName: 'בקו דו באטמן',
    englishName: 'Beco do Batman',
    category: 'landmark',
    lat: -23.5579407,
    lng: -46.6894228,
    hebrewDescription:
      'סמטת גרפיטי צבעונית, תרמילאים עושים פה צילומי אינסטה בלי הפסקה.',
    englishDescription:
      'Colorful graffiti alley where backpackers grind endless Instagram shoots.',
    rating: 4.5,
    friendsKnow: 8,
    tarmilPick: true,
  },
  {
    id: 'avenida-paulista',
    destinationId: 'sao-paulo',
    hebrewName: 'השדרה פאוליסטה',
    englishName: 'Avenida Paulista',
    category: 'landmark',
    lat: -23.561414,
    lng: -46.6558817,
    hebrewDescription:
      'השדרה המרכזית, מוזיאונים, הופעות רחוב וערבים שלמים סתם להסתובב.',
    englishDescription:
      'Main avenue with museums, street shows and whole evenings of just wandering.',
    rating: 4.4,
    friendsKnow: 9,
  },
  {
    id: 'masp-museum',
    destinationId: 'sao-paulo',
    hebrewName: 'מוזיאון MASP',
    englishName: 'MASP Art Museum',
    category: 'landmark',
    lat: -23.5614145,
    lng: -46.6558817,
    hebrewDescription:
      'המוזיאון עם הבניין המרחף, שוק עתיקות מתחתיו בסופי שבוע.',
    englishDescription:
      'Museum with the floating building and weekend antique market underneath.',
    rating: 4.6,
    friendsKnow: 5,
    tarmilPick: true,
  },
  {
    id: 'ibirapuera-park',
    destinationId: 'sao-paulo',
    hebrewName: 'פארק איבירפוארה',
    englishName: 'Ibirapuera Park',
    category: 'landmark',
    lat: -23.5874166,
    lng: -46.6576342,
    hebrewDescription:
      'הפארק של העיר, ריצה, האמקה, פיקניקים וסתם לשכב על הדשא.',
    englishDescription:
      "City's main park for runs, hammocks, picnics and just collapsing on the grass.",
    rating: 4.7,
    friendsKnow: 6,
  },
  {
    id: 'se-cathedral',
    destinationId: 'sao-paulo',
    hebrewName: 'קתדרלת סה',
    englishName: 'Catedral da Sé',
    category: 'landmark',
    lat: -23.550305,
    lng: -46.6342493,
    hebrewDescription:
      'כיכר מרכזית, תחנה טובה להבין קצת את הצד היותר קשוח של העיר.',
    englishDescription:
      "Central square stop to feel the city's rougher side for a bit.",
    rating: 4.0,
    friendsKnow: 2,
  },
  {
    id: 'municipal-market',
    destinationId: 'sao-paulo',
    hebrewName: 'שוק מרקדו מוניסיפל',
    englishName: 'Mercadão Municipal',
    category: 'landmark',
    lat: -23.5436867,
    lng: -46.6293688,
    hebrewDescription:
      "שוק ענק עם מיצי פירות וסנדוויץ' מורטדלה אייקוני לטעימה חד פעמית.",
    englishDescription:
      'Huge market with fruit juices and the iconic mortadella sandwich sample stop.',
    rating: 4.4,
    friendsKnow: 3,
  },
  {
    id: 'pinacoteca',
    destinationId: 'sao-paulo',
    hebrewName: 'הפינאקוטקה של סאו פאולו',
    englishName: 'Pinacoteca de São Paulo',
    category: 'landmark',
    lat: -23.5343013,
    lng: -46.6338655,
    hebrewDescription:
      'מוזיאון אומנות רגוע ליד תחנה מרכזית, טוב לברייק מהרחוב.',
    englishDescription:
      'Chill art museum near Luz station, decent break from the street noise.',
    rating: 4.5,
    friendsKnow: 1,
  },
  {
    id: 'copan-building',
    destinationId: 'sao-paulo',
    hebrewName: 'בניין קופאן',
    englishName: 'Edifício Copan',
    category: 'landmark',
    lat: -23.5499196,
    lng: -46.645118,
    hebrewDescription:
      'בניין גלים אייקוני, ישראלים עולים לגג לראות שקיעה על הדאון טאון.',
    englishDescription:
      'Iconic wavy building where Israelis hit the rooftop for downtown sunsets.',
    rating: 4.6,
    friendsKnow: 4,
    tarmilPick: true,
  },
  {
    id: 'mirante-9dejulho',
    destinationId: 'sao-paulo',
    hebrewName: "מירנטה 9 דה ז'וליו",
    englishName: 'Mirante 9 de Julho',
    category: 'landmark',
    lat: -23.5612117,
    lng: -46.6533337,
    hebrewDescription:
      'תצפית אורבנית ליד פאוליסטה, גרפיטי, קפה ואירועים מדי פעם.',
    englishDescription:
      'Urban viewpoint just off Paulista with graffiti, coffee and occasional events.',
    rating: 4.4,
    friendsKnow: 2,
  },
  {
    id: 'altino-arantes',
    destinationId: 'sao-paulo',
    hebrewName: 'בניין אלטינו ארנטס',
    englishName: 'Farol Santander (Altino Arantes)',
    category: 'landmark',
    lat: -23.5452848,
    lng: -46.6346822,
    hebrewDescription:
      'תצפית מקומה גבוהה, נוף 360 על כל מרכז העיר, שווה בוקר מעונן.',
    englishDescription:
      'High floor viewpoint with 360 downtown views, perfect on a cloudy morning.',
    rating: 4.5,
    friendsKnow: 3,
  },
  {
    id: 'liberdade-gates',
    destinationId: 'sao-paulo',
    hebrewName: "שכונת ליברדאצ'ה",
    englishName: 'Liberdade Japanese District Gate',
    category: 'landmark',
    lat: -23.5564657,
    lng: -46.6352804,
    hebrewDescription:
      'שער השכונה היפנית, דוכני רחוב, מלא פאסט פוד אסייתי זול.',
    englishDescription:
      'Gate into the Japanese neighborhood with street stalls and cheap Asian fast food.',
    rating: 4.3,
    friendsKnow: 4,
  },
  {
    id: 'chabad-israelis-sp',
    destinationId: 'sao-paulo',
    hebrewName: 'חב״ד לישראלים גואראראפס',
    englishName: 'Chabad for Israelis Rua Guararapes',
    category: 'chabad',
    lat: -23.6027566,
    lng: -46.6733152,
    hebrewDescription:
      'בית חב״ד לישראלים, דרשות בעברית ושאלות נצחיות על מה עושים אחרי הטיול.',
    englishDescription:
      "Chabad for Israelis with Hebrew talks and classic 'what after the trip' debates.",
    rating: 4.5,
    friendsKnow: 4,
  },
  {
    id: 'beit-chabad-brasil',
    destinationId: 'sao-paulo',
    hebrewName: "בית חב״ד ג'רדינס",
    englishName: 'Beit Chabad do Brasil Jardins',
    category: 'chabad',
    lat: -23.5628386,
    lng: -46.6691717,
    hebrewDescription:
      'בית חב״ד מרכזי, קידוש ענק בשישי ומלא הזמנות לסעודות.',
    englishDescription:
      'Central Chabad house with huge Friday kiddush and endless Shabbat meal invites.',
    rating: 4.6,
    friendsKnow: 6,
    tarmilPick: true,
  },
  {
    id: 'beit-menachem',
    destinationId: 'sao-paulo',
    hebrewName: 'בית מנחם חב״ד',
    englishName: 'Beit Menachem Chabad Center',
    category: 'chabad',
    lat: -23.5578697,
    lng: -46.7046206,
    hebrewDescription:
      'קהילה דתית רגועה יותר, טוב למי שרוצה מניין ואווירה משפחתית.',
    englishDescription:
      'More chilled religious community, good if you want a minyan and family vibe.',
    rating: 4.4,
    friendsKnow: 1,
  },
  {
    id: 'kosher-bom-retiro',
    destinationId: 'sao-paulo',
    hebrewName: 'מסעדה כשרה בומ רטירו',
    englishName: 'Casa Kosher Bom Retiro',
    category: 'kosher',
    lat: -23.5252129,
    lng: -46.6380537,
    hebrewDescription:
      'אזור יהודי קלאסי, אוכל כשר ביתי במחיר סביר לתרמילאי רעב.',
    englishDescription:
      'Classic Jewish area joint, homestyle kosher food priced fine for hungry backpackers.',
    rating: 4.3,
    friendsKnow: 2,
  },
  {
    id: 'sova-kosher',
    destinationId: 'sao-paulo',
    hebrewName: "סובה כשר ג'רדינס",
    englishName: 'Sová Kosher Jardins',
    category: 'kosher',
    lat: -23.5683923,
    lng: -46.6586426,
    hebrewDescription:
      'גרסה כשרה של סובה, מושלם לשניצל ופירה אחרי קרנבל או טיסת לילה.',
    englishDescription:
      'Kosher Sová version, ideal for schnitzel and mash after Carnival or red eye.',
    rating: 4.5,
    friendsKnow: 4,
  },
  {
    id: 'emporium-kosher',
    destinationId: 'sao-paulo',
    hebrewName: 'אמפוריום כשר ברזיל ישראל',
    englishName: 'Emporium Brasil Israel Kosher',
    category: 'kosher',
    lat: -23.5242508,
    lng: -46.6362703,
    hebrewDescription:
      'מעדנייה כשרה עם אוכל מוכן לדרך, ממלאים קופסאות לפני אוטובוס לילה.',
    englishDescription:
      'Kosher deli with takeaway dishes, everyone fills boxes before long night buses.',
    rating: 4.4,
    friendsKnow: 3,
  },

  // ─── Jericoacoara ────────────────────────────────────────────────────
  {
    id: 'jeri-hostel',
    destinationId: 'jericoacoara',
    hebrewName: "הוסטל ז'ריקואקוארה",
    englishName: 'Hostel Jericoacoara',
    category: 'hostel',
    lat: -2.7959621,
    lng: -40.5124022,
    hebrewDescription:
      "הוסטל במרכז ז'רי, חצר עם ערסלים וישראלים שמחליפים סיפורי צבא.",
    englishDescription:
      'Central Jeri hostel with hammocks and Israelis swapping army stories.',
    rating: 4.4,
    friendsKnow: 5,
    tarmilPick: true,
  },
  {
    id: 'mandala-jeri',
    destinationId: 'jericoacoara',
    hebrewName: "מנדלה הוסטל ז'רי",
    englishName: 'Mandala Hostel Jeri',
    category: 'hostel',
    lat: -2.7965011,
    lng: -40.5130896,
    hebrewDescription:
      'הוסטל חברתי, בר קטן בחצר, יוצאים מכאן לטיולי דיונות וסנדבאגי.',
    englishDescription:
      'Social hostel with a small yard bar, base for dune and sandbuggy missions.',
    rating: 4.5,
    friendsKnow: 4,
  },
  {
    id: 'raiz-hostel-jeri',
    destinationId: 'jericoacoara',
    hebrewName: "ראיז הוסטל ז'רי",
    englishName: 'Raiz Hostel',
    category: 'hostel',
    lat: -2.7972488,
    lng: -40.5131588,
    hebrewDescription:
      'הוסטל יותר מסיבות, מוזיקה עד מאוחר, מושלם למי שבא לזוז.',
    englishDescription:
      'More party oriented hostel, music late, perfect if you came to move.',
    rating: 4.3,
    friendsKnow: 3,
  },
  {
    id: 'latapera-jeri',
    destinationId: 'jericoacoara',
    hebrewName: "לה טאפרה ז'רי",
    englishName: 'LaTaperaJeri',
    category: 'hostel',
    lat: -2.7960993,
    lng: -40.5128843,
    hebrewDescription:
      'הוסטל נעים, קצת יותר רגוע, טוב לכמה לילות התאוששות מהרוח.',
    englishDescription:
      'Chilled hostel, slightly calmer, good for a few nights recovering from the wind.',
    rating: 4.4,
    friendsKnow: 2,
  },
  {
    id: 'jeri-main-beach',
    destinationId: 'jericoacoara',
    hebrewName: "חוף ז'ריקואקוארה",
    englishName: 'Praia de Jericoacoara',
    category: 'beach',
    lat: -2.7959542,
    lng: -40.5122577,
    hebrewDescription:
      'החוף הראשי, קייטסרף, כיסאות, קאיְפִירינות וישראלים עם מנדולינה.',
    englishDescription:
      'Main beach with kitesurf, chairs, caipirinhas and Israelis with mandolins.',
    rating: 4.8,
    friendsKnow: 9,
    tarmilPick: true,
  },
  {
    id: 'duna-por-do-sol',
    destinationId: 'jericoacoara',
    hebrewName: 'דיונת השקיעה',
    englishName: 'Duna do Pôr do Sol',
    category: 'landmark',
    lat: -2.7928708,
    lng: -40.5182913,
    hebrewDescription:
      'מטפסים יחפים לדיונה, כולם מוחאים כפיים כשהשמש נעלמת.',
    englishDescription:
      'Climb barefoot to the dune, everyone claps when the sun disappears.',
    rating: 4.8,
    friendsKnow: 8,
    tarmilPick: true,
  },
  {
    id: 'pedra-furada',
    destinationId: 'jericoacoara',
    hebrewName: 'פדרה פוראדה',
    englishName: 'Pedra Furada',
    category: 'landmark',
    lat: -2.7999422,
    lng: -40.4891377,
    hebrewDescription:
      'קשת האבן המפורסמת, תור לתמונות זוגיות קיטשיות בשקיעה.',
    englishDescription:
      'Famous rock arch with a queue for cheesy couple sunset photos.',
    rating: 4.6,
    friendsKnow: 5,
  },
  {
    id: 'lagoon-paradise',
    destinationId: 'jericoacoara',
    hebrewName: 'לגואון פרדיזו',
    englishName: 'Lagoa do Paraíso',
    category: 'landmark',
    lat: -2.8377854,
    lng: -40.4018151,
    hebrewDescription:
      'לגונה טורקיז עם ערסלים במים, יום שלם של ציל ותמונות.',
    englishDescription:
      'Turquoise lagoon with hammocks in the water, full day of chilling and photos.',
    rating: 4.7,
    friendsKnow: 6,
    tarmilPick: true,
  },
  {
    id: 'jeri-center-square',
    destinationId: 'jericoacoara',
    hebrewName: "כיכר המרכז של ז'רי",
    englishName: 'Praça Principal Jericoacoara',
    category: 'landmark',
    lat: -2.7949082,
    lng: -40.5121409,
    hebrewDescription:
      'כיכר חולית עם ברים ודוכנים, כולם עוברים פה לפחות חמש פעמים בערב.',
    englishDescription:
      'Sandy square of bars and stalls everyone crosses like five times a night.',
    rating: 4.4,
    friendsKnow: 3,
  },
  {
    id: 'minha-moca-cafe',
    destinationId: 'jericoacoara',
    hebrewName: 'מיניה מוסה קפה',
    englishName: 'Minha Moça Café & Bistrô',
    category: 'cafe',
    lat: -2.7961645,
    lng: -40.5129733,
    hebrewDescription:
      "בראנץ' מפנק, טוסטים, קפה טוב ואינטרנט שפוי להזמין את הטיסה הבאה.",
    englishDescription:
      'Comfort brunch spot with toasts, good coffee and decent wifi for booking next flights.',
    rating: 4.5,
    friendsKnow: 2,
  },
  {
    id: 'jeri-ju-cafe',
    destinationId: 'jericoacoara',
    hebrewName: "ז'רי ז'ו קפה",
    englishName: 'Jeri Ju Café',
    category: 'cafe',
    lat: -2.7965452,
    lng: -40.5126408,
    hebrewDescription:
      'קפה קטן ברחוב הראשי, שייקים, אסאי וישראלים על הלפטופים.',
    englishDescription:
      'Small main street cafe with smoothies, açaí and Israelis glued to laptops.',
    rating: 4.3,
    friendsKnow: 1,
  },
  {
    id: 'cocoanuts-jeri',
    destinationId: 'jericoacoara',
    hebrewName: "קוקואנאטס ז'רי",
    englishName: "Cocoa'nuts Jeri",
    category: 'cafe',
    lat: -2.7967645,
    lng: -40.5124272,
    hebrewDescription:
      'קערות אסאי מוגזמות, פינוקים אחרי יום של רוח וחול בעיניים.',
    englishDescription:
      'Over the top açaí bowls, perfect reward after a windy sand-in-eyes day.',
    rating: 4.4,
    friendsKnow: 2,
  },
  {
    id: 'naturalmente-creperia',
    destinationId: 'jericoacoara',
    hebrewName: 'נאטורלמנטה קרפריה',
    englishName: 'Naturalmente Creperia',
    category: 'restaurant',
    lat: -2.7969214,
    lng: -40.5127604,
    hebrewDescription:
      'קרפים ענקיים על החול, נוף לים ומוזיקה רגועה עד הלילה.',
    englishDescription:
      'Huge crepes right on the sand, sea view and mellow tunes into the night.',
    rating: 4.5,
    friendsKnow: 3,
  },
  {
    id: 'do-bem-jeri',
    destinationId: 'jericoacoara',
    hebrewName: "דו בם ז'רי",
    englishName: 'Do Bem Restaurante',
    category: 'restaurant',
    lat: -2.7963628,
    lng: -40.5125087,
    hebrewDescription:
      'אוכל בריא יותר, קערות, דגים, טוב כשמתגעגעים לירקות נורמליים.',
    englishDescription:
      'Slightly healthier spot with bowls and fish for when you miss real veggies.',
    rating: 4.4,
    friendsKnow: 2,
  },
  {
    id: 'nomads-jeri',
    destinationId: 'jericoacoara',
    hebrewName: 'נומאדס רסטו בר',
    englishName: "Nomad's Jeri",
    category: 'bar',
    lat: -2.796611,
    lng: -40.5130402,
    hebrewDescription:
      "רסטו-בר עם מוזיקה וחבר'ה, בסיס קלאסי לפני קפיצה למסיבות.",
    englishDescription:
      'Restobar with music and crowd, classic base before heading to the parties.',
    rating: 4.3,
    friendsKnow: 3,
  },
  {
    id: 'maui-restobar',
    destinationId: 'jericoacoara',
    hebrewName: 'מאויי רסטו בר',
    englishName: 'Maui Restobar',
    category: 'bar',
    lat: -2.7962322,
    lng: -40.5122937,
    hebrewDescription:
      "בר על החוף, קוקטיילים בג'ארים, רוקדים יחפים בחול.",
    englishDescription:
      'Beachfront bar with jar cocktails and barefoot dancing in the sand.',
    rating: 4.4,
    friendsKnow: 2,
  },
  {
    id: 'forro-de-jangada',
    destinationId: 'jericoacoara',
    hebrewName: "פורו דה ז'נגדה",
    englishName: 'Forró da Jangada',
    category: 'club',
    lat: -2.7969833,
    lng: -40.5129451,
    hebrewDescription:
      'מסיבת פורו עם להקה חיה, כולם מנסים ללמוד צעדים עם מקומיים.',
    englishDescription:
      'Forró party with live band, everyone learning steps from smiling locals.',
    rating: 4.6,
    friendsKnow: 4,
    tarmilPick: true,
  },
  {
    id: 'caipi-street',
    destinationId: 'jericoacoara',
    hebrewName: 'רחוב הקאיפיריניה',
    englishName: 'Caipirinha Street Jeri',
    category: 'bar',
    lat: -2.7954774,
    lng: -40.5123338,
    hebrewDescription:
      'שורה של ברי רחוב, המשקה זול, הווליום גבוה, מכירה קשה לסרבים.',
    englishDescription:
      'Line of street bars, cheap drinks, loud volume and hard sell to random Serbians.',
    rating: 4.2,
    friendsKnow: 5,
  },
  {
    id: 'jeri-kite-point',
    destinationId: 'jericoacoara',
    hebrewName: "נקודת הקייטסרף ז'רי",
    englishName: 'Jericoacoara Kitesurf Spot',
    category: 'landmark',
    lat: -2.7949174,
    lng: -40.5115971,
    hebrewDescription:
      'קטע חוף עם מלא קייטים באוויר, סשן צפייה מושלם לשקיעה.',
    englishDescription:
      'Beach stretch full of kites in the sky, perfect sunset watching session.',
    rating: 4.7,
    friendsKnow: 4,
  },
  {
    id: 'jeri-main-drag',
    destinationId: 'jericoacoara',
    hebrewName: "הרחוב הראשי בז'רי",
    englishName: 'Rua Principal Jericoacoara',
    category: 'landmark',
    lat: -2.7962975,
    lng: -40.5126416,
    hebrewDescription:
      'רחוב חול עם מסעדות וברים, הכל חמש דקות הליכה מהחדר.',
    englishDescription:
      'Sandy street lined with bars and restaurants, everything five minutes from your bed.',
    rating: 4.4,
    friendsKnow: 6,
  },
  {
    id: 'jeri-lighthouse',
    destinationId: 'jericoacoara',
    hebrewName: "המגדלור של ז'רי",
    englishName: 'Farol de Jericoacoara',
    category: 'landmark',
    lat: -2.7915102,
    lng: -40.5052323,
    hebrewDescription:
      'עלייה קלה, נוף 360 על הדיונות, הים והכפר הקטן.',
    englishDescription:
      'Easy climb with 360 views over dunes, sea and the tiny village.',
    rating: 4.5,
    friendsKnow: 2,
  },

  // ─── Buenos Aires ───────────────────────────────────────────────────
  {
    id: 'iaacob-house',
    destinationId: 'buenos-aires',
    hebrewName: 'איאקוב האוס הוסטל',
    englishName: 'Iaacob House Hostel',
    category: 'hostel',
    lat: -34.588755,
    lng: -58.4305307,
    hebrewDescription:
      'בית ישראלי בפאלרמו, הכל בעברית, מרגיש כמו דירה משותפת בתל אביב.',
    englishDescription:
      'Israeli house in Palermo, everything in Hebrew, feels like a Tel Aviv flatshare.',
    rating: 4.6,
    friendsKnow: 5,
    tarmilPick: true,
  },
  {
    id: 'america-del-sur',
    destinationId: 'buenos-aires',
    hebrewName: 'אמריקה דל סור הוסטל',
    englishName: 'America del Sur Hostel Buenos Aires',
    category: 'hostel',
    lat: -34.617047,
    lng: -58.373967,
    hebrewDescription:
      'הוסטל גדול בסן תלמו, מלא תרמילאים, מפה מתחילים לטייל בעיר.',
    englishDescription:
      'Big San Telmo hostel full of backpackers, classic starting point for city exploring.',
    rating: 4.5,
    friendsKnow: 7,
  },
  {
    id: 'milhouse-avenida',
    destinationId: 'buenos-aires',
    hebrewName: 'מילהאוס אבנידה',
    englishName: 'Milhouse Hostel Avenida',
    category: 'hostel',
    lat: -34.608909,
    lng: -58.3845742,
    hebrewDescription:
      'הוסטל מסיבות במרכז, טורים, בר בפנים, ישראלים מתאהבים בבואנוס.',
    englishDescription:
      'Downtown party hostel with tours and bar, Israelis instantly fall for Buenos Aires.',
    rating: 4.4,
    friendsKnow: 8,
    tarmilPick: true,
  },
  {
    id: 'rayuela-hostel',
    destinationId: 'buenos-aires',
    hebrewName: 'ראיואלה הוסטל',
    englishName: 'Rayuela Hostel Boutique',
    category: 'hostel',
    lat: -34.6142093,
    lng: -58.3769714,
    hebrewDescription:
      'הוסטל קטן וביתי, יותר אינטימי, יושבים במטבח עד שלוש בבוקר.',
    englishDescription:
      'Smaller homely hostel, more intimate, kitchen chats run until 3am.',
    rating: 4.5,
    friendsKnow: 3,
  },
  {
    id: 'obelisco-ba',
    destinationId: 'buenos-aires',
    hebrewName: 'האובליסקו',
    englishName: 'Obelisco de Buenos Aires',
    category: 'landmark',
    lat: -34.6037389,
    lng: -58.3815704,
    hebrewDescription:
      'נקודת ציון מרכזית, כולם קובעים פה מפגש לפני שממשיכים לפלורידה.',
    englishDescription:
      'Central meeting point where everyone meets up before heading to Florida Street.',
    rating: 4.5,
    friendsKnow: 9,
  },
  {
    id: 'plaza-de-mayo',
    destinationId: 'buenos-aires',
    hebrewName: 'כיכר דה מאיו',
    englishName: 'Plaza de Mayo',
    category: 'landmark',
    lat: -34.6080687,
    lng: -58.371029,
    hebrewDescription:
      'כיכר ליד הקאסה רוסדה, הפגנות, פוליטיקה והיסטוריה בכל פינה.',
    englishDescription:
      'Square by Casa Rosada with protests, politics and history in every corner.',
    rating: 4.4,
    friendsKnow: 6,
  },
  {
    id: 'puerto-madero',
    destinationId: 'buenos-aires',
    hebrewName: 'פוארטו מדרו',
    englishName: 'Puerto Madero Waterfront',
    category: 'landmark',
    lat: -34.6075688,
    lng: -58.3627257,
    hebrewDescription:
      'טיילת מודרנית על הנהר, ריצה, צילומים וגשר האישה לקלישאות.',
    englishDescription:
      'Modern riverfront for runs, photos and Puente de la Mujer cliché shots.',
    rating: 4.5,
    friendsKnow: 5,
  },
  {
    id: 'san-telmo-market',
    destinationId: 'buenos-aires',
    hebrewName: 'שוק סן תלמו',
    englishName: 'San Telmo Market',
    category: 'landmark',
    lat: -34.6171935,
    lng: -58.3737575,
    hebrewDescription:
      'שוק עתיקות ביום ראשון, מוזיקה ברחוב, מיליוני סטיקרים לתיק.',
    englishDescription:
      'Sunday antique market with street music and endless stickers for your backpack.',
    rating: 4.7,
    friendsKnow: 7,
    tarmilPick: true,
  },
  {
    id: 'la-boca',
    destinationId: 'buenos-aires',
    hebrewName: 'לה בוקה קמיניטו',
    englishName: 'Caminito La Boca',
    category: 'landmark',
    lat: -34.6356129,
    lng: -58.3648435,
    hebrewDescription:
      'רחוב צבעוני, טנגו, יותר תיירותי אבל אחלה תמונות לצבא.',
    englishDescription:
      'Colorful street with tango shows, super touristy but great photos for army WhatsApp.',
    rating: 4.3,
    friendsKnow: 8,
  },
  {
    id: 'recoleta-cemetery',
    destinationId: 'buenos-aires',
    hebrewName: 'בית קברות רקולטה',
    englishName: 'Recoleta Cemetery',
    category: 'landmark',
    lat: -34.5881979,
    lng: -58.3922895,
    hebrewDescription:
      'קברים בסגנון עיר קטנה, מלא סיפורים הזויים, שווה סיבוב עם מדריך.',
    englishDescription:
      'Cemetery like a mini city, packed with wild stories, best done with a guide.',
    rating: 4.6,
    friendsKnow: 5,
  },
  {
    id: 'palermo-parks',
    destinationId: 'buenos-aires',
    hebrewName: 'הפארקים של פאלרמו',
    englishName: 'Bosques de Palermo',
    category: 'landmark',
    lat: -34.5692177,
    lng: -58.4146783,
    hebrewDescription:
      'אגמים, דשא, ריצה, מאטה, מרגיש קצת כמו הירקון עם יותר טנגו.',
    englishDescription:
      'Lakes and lawns for runs and mate, feels like Park Hayarkon with extra tango.',
    rating: 4.7,
    friendsKnow: 4,
    tarmilPick: true,
  },
  {
    id: 'plaza-serrano',
    destinationId: 'buenos-aires',
    hebrewName: 'פלאסה סראנו',
    englishName: 'Plaza Serrano (Plazoleta Cortázar)',
    category: 'landmark',
    lat: -34.5884091,
    lng: -58.4319339,
    hebrewDescription:
      'כיכר מרכזית בפאלרמו, מסביב ברים וחנויות וינטג׳, כולם מתחילים פה.',
    englishDescription:
      'Central Palermo square ringed by bars and vintage shops, everyone starts nights here.',
    rating: 4.4,
    friendsKnow: 6,
  },
  {
    id: 'avenida-corrientes',
    destinationId: 'buenos-aires',
    hebrewName: 'שדרת קוריינטס',
    englishName: 'Avenida Corrientes',
    category: 'landmark',
    lat: -34.6033272,
    lng: -58.3894077,
    hebrewDescription:
      'שדרה של תיאטראות ופיצות, הליכה לילית אחרי הופעה או משחק.',
    englishDescription:
      'Theater and pizza avenue, classic night walk after a show or football match.',
    rating: 4.3,
    friendsKnow: 3,
  },
  {
    id: 'floralis-generica',
    destinationId: 'buenos-aires',
    hebrewName: 'הפרח המתכת',
    englishName: 'Floralis Genérica',
    category: 'landmark',
    lat: -34.5838726,
    lng: -58.3921822,
    hebrewDescription:
      'פסל פרח ענק שנפתח ביום, אחלה פיקניק וקפיצה למוזיאון ליד.',
    englishDescription:
      'Giant metal flower that opens by day, nice picnic plus quick museum hop.',
    rating: 4.5,
    friendsKnow: 3,
  },
  {
    id: 'palacio-barolo',
    destinationId: 'buenos-aires',
    hebrewName: 'פלאסיו בארולו',
    englishName: 'Palacio Barolo',
    category: 'landmark',
    lat: -34.6083272,
    lng: -58.3861246,
    hebrewDescription:
      'בניין ישן עם תצפית לילה, מדריך מקשר הכל לדנטה אליגיירי.',
    englishDescription:
      'Old building with night viewpoint where the guide ties everything to Dante.',
    rating: 4.6,
    friendsKnow: 2,
  },
  {
    id: 'palermo-soho-streets',
    destinationId: 'buenos-aires',
    hebrewName: 'רחובות פאלרמו סוהו',
    englishName: 'Palermo Soho Streets',
    category: 'landmark',
    lat: -34.5875653,
    lng: -58.4347911,
    hebrewDescription:
      'גרפיטי, חנויות מעצבים וברי קוקטיילים, אווירה של פלורנטין משודרג.',
    englishDescription:
      'Graffiti, designer shops and cocktail bars, basically Florentin on steroids.',
    rating: 4.6,
    friendsKnow: 7,
  },
  {
    id: 'avenida-9dejulio',
    destinationId: 'buenos-aires',
    hebrewName: 'אבן נואבה דה חוליו',
    englishName: 'Avenida 9 de Julio',
    category: 'landmark',
    lat: -34.6039323,
    lng: -58.3815703,
    hebrewDescription:
      'השדרה הרחבה עם האובליסקו, מרגיש כאילו העיר לא נגמרת לעומק.',
    englishDescription:
      'Super wide avenue with the Obelisk, feels like the city never ends in depth.',
    rating: 4.4,
    friendsKnow: 4,
  },
  {
    id: 'chabad-recoleta',
    destinationId: 'buenos-aires',
    hebrewName: 'חב״ד רקולטה',
    englishName: 'Chabad Recoleta Buenos Aires',
    category: 'chabad',
    lat: -34.5889386,
    lng: -58.3939241,
    hebrewDescription:
      'חב״ד ליד רקולטה, סעודות שבת מלאות ישראלים וסטודנטים דוברי ספרדית.',
    englishDescription:
      'Chabad by Recoleta with Shabbat meals full of Israelis and Spanish speaking students.',
    rating: 4.6,
    friendsKnow: 5,
  },
  {
    id: 'chabad-palermo',
    destinationId: 'buenos-aires',
    hebrewName: 'חב״ד פאלרמו',
    englishName: 'Chabad Palermo Buenos Aires',
    category: 'chabad',
    lat: -34.583861,
    lng: -58.432774,
    hebrewDescription:
      'חב״ד שכונתי, מניינים, ארוחות ביתיות והזמנות לחגים בלי סוף.',
    englishDescription:
      'Neighborhood Chabad with minyanim, homely meals and endless invites for chagim.',
    rating: 4.5,
    friendsKnow: 6,
    tarmilPick: true,
  },
  {
    id: 'chabad-downtown',
    destinationId: 'buenos-aires',
    hebrewName: 'חב״ד מיקרוסנטרו',
    englishName: 'Chabad Microcentro Buenos Aires',
    category: 'chabad',
    lat: -34.6030183,
    lng: -58.3768422,
    hebrewDescription:
      'חב״ד במרכז, נוח לקפוץ לפני/אחרי טיול רגלי בעיר.',
    englishDescription:
      'Central Chabad spot, easy to pop in before or after walking the city.',
    rating: 4.4,
    friendsKnow: 3,
  },
  {
    id: 'eretz-cantina',
    destinationId: 'buenos-aires',
    hebrewName: 'ארץ קנטינה ישראלית',
    englishName: 'Eretz Cantina Israelí',
    category: 'kosher',
    lat: -34.5885669,
    lng: -58.4328682,
    hebrewDescription:
      'מסעדה ישראלית בפאלרמו, חומוס, שווארמה, מוזיקה מזרחית ברקע.',
    englishDescription:
      'Israeli Palermo restaurant with hummus, shawarma and Mizrahi music in the background.',
    rating: 4.5,
    friendsKnow: 4,
  },
  {
    id: 'hola-jacoba',
    destinationId: 'buenos-aires',
    hebrewName: 'הולה יעקובה',
    englishName: 'Hola Jacoba',
    category: 'kosher',
    lat: -34.6030554,
    lng: -58.4074125,
    hebrewDescription:
      'מסעדה יהודית מודרנית, פסטרמי, קוקטיילים וקהל מקומי מתעניין בישראל.',
    englishDescription:
      'Modern Jewish bistro with pastrami, cocktails and locals curious about Israel.',
    rating: 4.4,
    friendsKnow: 2,
  },
  {
    id: 'murcielaga-kosher',
    destinationId: 'buenos-aires',
    hebrewName: "מסעדת אל מורצ'יאלגה",
    englishName: 'Al Galope / Murciélaga Kosher',
    category: 'kosher',
    lat: -34.5952153,
    lng: -58.3877842,
    hebrewDescription:
      'סטייק כשר בסגנון ארגנטינה, סוף סוף אסאדו בלי רגשות אשם.',
    englishDescription:
      'Argentinian style kosher steak, finally proper asado without guilt.',
    rating: 4.6,
    friendsKnow: 4,
    tarmilPick: true,
  },
  {
    id: 'tucuman-kosher',
    destinationId: 'buenos-aires',
    hebrewName: 'פיצריית טוקומן כשר',
    englishName: 'Pizzería Tucumán Kosher',
    category: 'kosher',
    lat: -34.6037746,
    lng: -58.4089151,
    hebrewDescription:
      'פיצה כשרה במרכז, פתרון מושלם לערב זול אחרי יום מוזיאונים.',
    englishDescription:
      'Central kosher pizza, perfect cheap dinner solution after a museum marathon.',
    rating: 4.3,
    friendsKnow: 3,
  },
  {
    id: 'sucath-david',
    destinationId: 'buenos-aires',
    hebrewName: 'סוכת דוד קונדיטוריה',
    englishName: 'Sucath David Bakery',
    category: 'kosher',
    lat: -34.6049089,
    lng: -58.402963,
    hebrewDescription:
      'מאפייה כשרה, בורקסים, חלות ועוגות לקחת חזרה להוסטל.',
    englishDescription:
      'Kosher bakery with burekas, challahs and cakes to haul back to the hostel.',
    rating: 4.5,
    friendsKnow: 2,
  },
];
