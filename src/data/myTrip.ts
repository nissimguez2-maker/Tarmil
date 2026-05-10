/**
 * The user's trip — past line, current location, and the friends they overlap with.
 *
 * SEED ONLY. Runtime data is read from `trip_waypoints` (past + present) and
 * `friend_overlaps` in Supabase via SupabaseDataProvider. The arrays below
 * feed `scripts/seed-supabase.ts`; nothing in `src/` imports them at runtime.
 * The `zones` / `globalZones` constants stay client-side as map geometry —
 * they're not user data, they're centroid coordinates the seeds reference.
 *
 * Per Product Brief §"A note on locations":
 *   "Resolution is capped at the city, always. Never street-level.
 *    The system cannot see further than that, by design and by architecture."
 *
 * That commitment is enforced *visually* in this data:
 *
 *  - Past trip waypoints are at NEIGHBORHOOD CENTROIDS (Rio's neighborhoods
 *    function as Tarmil's "city" unit since the whole metro is one city).
 *  - The user's present is at their neighborhood centroid (Copacabana center).
 *  - Friend overlap bubbles are at NEIGHBORHOOD/TOWN/CITY centroids — never at
 *    specific bars, beaches, or hostels. A soft halo around each bubble in
 *    TripMap.css visually communicates "approximately in this area."
 */

export type LatLng = [number, number];

/** Rio neighborhood centroids — used for past route + Rio friend overlaps. */
export const zones = {
  gigAirport: [-22.815, -43.244] as LatLng,
  maracana: [-22.912, -43.230] as LatLng,
  centro: [-22.91, -43.18] as LatLng,
  santaTeresa: [-22.928, -43.187] as LatLng,
  botafogo: [-22.952, -43.185] as LatLng,
  copacabana: [-22.974, -43.184] as LatLng,
  ipanema: [-22.984, -43.2] as LatLng,
};

/** International city centroids — used for planned stops + global friend overlaps. */
export const globalZones = {
  buzios: [-22.747, -41.881] as LatLng,
  saoPaulo: [-23.5505, -46.6333] as LatLng,
  jericoacoara: [-2.7959, -40.5125] as LatLng,
  buenosAires: [-34.6037, -58.3816] as LatLng,
};

/**
 * Past trip legs — multi-year continent arc, chronological earliest-first.
 * Each leg is a self-contained sequence of city centroids the user passed
 * through. drawTripLine connects waypoints inside a leg and breaks the line
 * between legs (the gap-detection in legBreaks.ts handles this from the
 * flattened array, but the leg shape stays here for seeded clarity).
 */
export const pastLegs = {
  greece2024: [
    [37.9838, 23.7275] as LatLng, // Athens
    [36.4083, 25.4419] as LatLng, // Santorini (Fira)
    [37.4467, 25.3289] as LatLng, // Mykonos
  ],
  coteAzur2025: [
    [43.7102, 7.262] as LatLng, // Nice
    [43.5528, 7.0174] as LatLng, // Cannes
    [43.7384, 7.4246] as LatLng, // Monaco
  ],
  southeastAsia2025: [
    [13.7563, 100.5018] as LatLng, // Bangkok
    [8.0349, 98.8228] as LatLng, // Krabi / Ao Nang
    [18.7883, 98.9853] as LatLng, // Chiang Mai
  ],
  brazil2026: [
    zones.gigAirport,
    zones.maracana,
    zones.centro,
    zones.santaTeresa,
    zones.copacabana,
  ],
} as const;

export const myTrip = {
  past: [
    ...pastLegs.greece2024,
    ...pastLegs.coteAzur2025,
    ...pastLegs.southeastAsia2025,
    ...pastLegs.brazil2026,
  ] as LatLng[],

  /** Where the user is right now — Copacabana centroid, not a specific spot. */
  present: zones.copacabana,
};

/**
 * One past trip a friend has taken, displayed at season+year+duration
 * resolution per the privacy posture (never specific dates, even though the
 * data layer could carry them — it intentionally doesn't).
 */
export type FriendPastTrip = {
  id: string;
  destinationLabel: string;
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  year: number;
  /** Hebrew duration label, e.g. "שבועיים", "שלושה שבועות". */
  durationLabel: string;
  /** City centroids drawn as a polyline on the friend's profile map. */
  waypoints: LatLng[];
};

export type FriendOverlap = {
  /** Stable id, referenced from PlannedStop.friendOverlapIds. */
  id: string;
  friendName: string;
  friendInitial: string;
  /** Centroid of the friend's neighborhood / town / city — never a specific place. */
  lat: number;
  lng: number;
  /** Hebrew zone label shown on the sheet. */
  zoneLabel: string;
  status: 'present' | 'future';
  /** Hebrew detail line shown on tap. */
  detail: string;
  /** Planned stop id this future overlap aligns with. */
  destinationId?: string;
  /** ISO yyyy-mm-dd — exact start of the overlap window. */
  overlapStart?: string;
  /** ISO yyyy-mm-dd — exact end of the overlap window. */
  overlapEnd?: string;
  /** Past trips the friend has taken, season+year+duration resolution only. */
  pastTrips?: FriendPastTrip[];
};

/**
 * Single source of truth for friend overlaps. The Friends tab and the trip
 * map both read this list — keep them in sync by editing here only.
 */
export const friendOverlaps: FriendOverlap[] = [
  {
    id: 'maya-ipanema',
    friendName: 'מאיה לוי',
    friendInitial: 'מ',
    lat: zones.ipanema[0],
    lng: zones.ipanema[1],
    zoneLabel: 'איפנמה',
    status: 'present',
    detail: 'באיפנמה כבר ארבעה ימים, יוצאת בסוף השבוע.',
    pastTrips: [
      {
        id: 'maya-greece-2024',
        destinationLabel: 'איי יוון',
        season: 'summer',
        year: 2024,
        durationLabel: 'שבועיים',
        waypoints: [
          [37.9838, 23.7275],
          [36.4083, 25.4419],
          [37.4467, 25.3289],
        ],
      },
      {
        id: 'maya-cote-2025',
        destinationLabel: 'קוט ד׳אזור',
        season: 'spring',
        year: 2025,
        durationLabel: 'שבוע',
        waypoints: [
          [43.7102, 7.262],
          [43.5528, 7.0174],
          [43.7384, 7.4246],
        ],
      },
    ],
  },
  {
    id: 'yael-botafogo',
    friendName: 'יעל אברהם',
    friendInitial: 'י',
    lat: zones.botafogo[0],
    lng: zones.botafogo[1],
    zoneLabel: 'בוטפוגו',
    status: 'present',
    detail: 'בבוטפוגו הערב, בא לקפוץ אליה לבירה?',
    pastTrips: [
      {
        id: 'yael-thailand-2024',
        destinationLabel: 'תאילנד',
        season: 'winter',
        year: 2024,
        durationLabel: 'שלושה שבועות',
        waypoints: [
          [13.7563, 100.5018],
          [8.0349, 98.8228],
          [18.7883, 98.9853],
        ],
      },
    ],
  },
  {
    id: 'roi-buzios',
    friendName: 'רועי בן עמי',
    friendInitial: 'ר',
    lat: globalZones.buzios[0],
    lng: globalZones.buzios[1],
    zoneLabel: 'בוזיוס',
    status: 'future',
    detail: 'מתכנן בוזיוס סוף אוקטובר, יחפוף איתך 29–31.',
    destinationId: 'buzios',
    overlapStart: '2026-10-29',
    overlapEnd: '2026-10-31',
    pastTrips: [
      {
        id: 'roi-bali-2024',
        destinationLabel: 'באלי',
        season: 'winter',
        year: 2024,
        durationLabel: 'שבועיים',
        waypoints: [
          [-8.4095, 115.1889],
          [-8.65, 115.2167],
          [-8.6905, 115.1729],
        ],
      },
      {
        id: 'roi-greece-2025',
        destinationLabel: 'איי יוון',
        season: 'summer',
        year: 2025,
        durationLabel: 'שבוע',
        waypoints: [
          [37.9838, 23.7275],
          [36.7372, 24.4344],
          [37.4467, 25.3289],
        ],
      },
    ],
  },
  {
    id: 'shir-saopaulo',
    friendName: 'שיר כהן',
    friendInitial: 'ש',
    lat: globalZones.saoPaulo[0],
    lng: globalZones.saoPaulo[1],
    zoneLabel: 'סאו פאולו',
    status: 'future',
    detail: 'בסאו פאולו לסוף שבוע ארוך, מכוונת לוילה מדלנה.',
    destinationId: 'sao-paulo',
    overlapStart: '2026-11-03',
    overlapEnd: '2026-11-05',
    pastTrips: [
      {
        id: 'shir-mendoza-2024',
        destinationLabel: 'מנדוסה',
        season: 'autumn',
        year: 2024,
        durationLabel: 'סוף שבוע',
        waypoints: [
          [-32.8895, -68.8458],
          [-33.4378, -69.083],
          [-32.9442, -68.7656],
        ],
      },
      {
        id: 'shir-punta-2025',
        destinationLabel: 'פונטה דל אסטה',
        season: 'summer',
        year: 2025,
        durationLabel: 'עשרה ימים',
        waypoints: [
          [-34.9591, -54.9472],
          [-34.9214, -54.7569],
        ],
      },
    ],
  },
  {
    id: 'yotam-jericoacoara',
    friendName: 'יותם הררי',
    friendInitial: 'ה',
    lat: globalZones.jericoacoara[0],
    lng: globalZones.jericoacoara[1],
    zoneLabel: 'ז׳ריקואקוארה',
    status: 'future',
    detail: 'בז׳רי לקייטסרף, מחפש שותף לדיונות ושקיעה.',
    destinationId: 'jericoacoara',
    overlapStart: '2026-11-10',
    overlapEnd: '2026-11-13',
    pastTrips: [
      {
        id: 'yotam-bali-2024',
        destinationLabel: 'באלי',
        season: 'summer',
        year: 2024,
        durationLabel: 'שלושה שבועות',
        waypoints: [
          [-8.65, 115.2167],
          [-8.6905, 115.1729],
          [-8.7986, 115.1671],
        ],
      },
      {
        id: 'yotam-bariloche-2025',
        destinationLabel: 'בריצ׳ה',
        season: 'winter',
        year: 2025,
        durationLabel: 'שבוע',
        waypoints: [
          [-41.1335, -71.3103],
          [-41.0833, -71.55],
          [-41.1668, -71.5378],
        ],
      },
    ],
  },
  {
    id: 'tom-buenosaires',
    friendName: 'תום פרידמן',
    friendInitial: 'ת',
    lat: globalZones.buenosAires[0],
    lng: globalZones.buenosAires[1],
    zoneLabel: 'בואנוס איירס',
    status: 'future',
    detail: 'בבואנוס לחודש, גר בפאלרמו, יודע איפה האסאדו הכי טוב.',
    destinationId: 'buenos-aires',
    overlapStart: '2026-11-18',
    overlapEnd: '2026-11-22',
    pastTrips: [
      {
        id: 'tom-patagonia-2024',
        destinationLabel: 'פטגוניה',
        season: 'autumn',
        year: 2024,
        durationLabel: 'חודש',
        waypoints: [
          [-50.9423, -72.8676],
          [-49.3, -72.5],
          [-46.5, -71.7],
        ],
      },
      {
        id: 'tom-cusco-2025',
        destinationLabel: 'קוסקו ומאצ׳ו פיצ׳ו',
        season: 'spring',
        year: 2025,
        durationLabel: 'שבועיים',
        waypoints: [
          [-13.5319, -71.9675],
          [-13.1631, -72.545],
          [-13.5226, -71.545],
        ],
      },
    ],
  },
];
