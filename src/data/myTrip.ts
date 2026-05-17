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

export type FriendOverlap = {
  /** Stable id, referenced from PlannedStop.friendOverlapIds. */
  id: string;
  friendName: string;
  friendInitial: string;
  /** Avatar URL. Placeholder (pravatar) until we have real headshots. */
  photoUrl: string;
  /** Centroid of the friend's neighborhood / town / city — never a specific place. */
  lat: number;
  lng: number;
  /** Zone label (city / neighborhood) shown on the sheet. */
  zoneLabel: string;
  status: 'present' | 'future';
  /** Detail line shown on tap. */
  detail: string;
  /** Planned stop id this future overlap aligns with. */
  destinationId?: string;
  /** ISO yyyy-mm-dd — exact start of the overlap window. */
  overlapStart?: string;
  /** ISO yyyy-mm-dd — exact end of the overlap window. */
  overlapEnd?: string;
};

/**
 * Single source of truth for friend overlaps. The Friends tab and the trip
 * map both read this list — keep them in sync by editing here only.
 *
 * Detail copy follows the v0.7 content voice: concise, capitalised, real-
 * person — short enough never to truncate inside the FriendSheet width.
 */
export const friendOverlaps: FriendOverlap[] = [
  {
    id: 'maya-ipanema',
    friendName: 'Maya Levi',
    friendInitial: 'M',
    photoUrl: 'https://i.pravatar.cc/200?img=47',
    lat: zones.ipanema[0],
    lng: zones.ipanema[1],
    zoneLabel: 'Ipanema',
    status: 'present',
    detail: 'Four days into Ipanema, flying home Sunday.',
  },
  {
    id: 'yael-botafogo',
    friendName: 'Yael Abraham',
    friendInitial: 'Y',
    photoUrl: 'https://i.pravatar.cc/200?img=44',
    lat: zones.botafogo[0],
    lng: zones.botafogo[1],
    zoneLabel: 'Botafogo',
    status: 'present',
    detail: 'Free tonight in Botafogo — anyone around?',
  },
  {
    id: 'roi-buzios',
    friendName: 'Roi Ben Ami',
    friendInitial: 'R',
    photoUrl: 'https://i.pravatar.cc/200?img=33',
    lat: globalZones.buzios[0],
    lng: globalZones.buzios[1],
    zoneLabel: 'Búzios',
    status: 'future',
    detail: '3 nights in Búzios end of October. Splitting the drive from Rio.',
    destinationId: 'buzios',
    overlapStart: '2026-10-29',
    overlapEnd: '2026-10-31',
  },
  {
    id: 'shir-saopaulo',
    friendName: 'Shir Cohen',
    friendInitial: 'S',
    photoUrl: 'https://i.pravatar.cc/200?img=49',
    lat: globalZones.saoPaulo[0],
    lng: globalZones.saoPaulo[1],
    zoneLabel: 'São Paulo',
    status: 'future',
    detail: 'Long weekend in São Paulo, staying in Vila Madalena.',
    destinationId: 'sao-paulo',
    overlapStart: '2026-11-03',
    overlapEnd: '2026-11-05',
  },
  {
    id: 'yotam-jericoacoara',
    friendName: 'Yotam Harari',
    friendInitial: 'H',
    photoUrl: 'https://i.pravatar.cc/200?img=68',
    lat: globalZones.jericoacoara[0],
    lng: globalZones.jericoacoara[1],
    zoneLabel: 'Jericoacoara',
    status: 'future',
    detail: '5 days in Jeri for kitesurf. Looking for a sunset crew.',
    destinationId: 'jericoacoara',
    overlapStart: '2026-11-10',
    overlapEnd: '2026-11-13',
  },
  {
    id: 'moshe-buenosaires',
    friendName: 'Moshe Friedman',
    friendInitial: 'M',
    photoUrl: 'https://i.pravatar.cc/200?img=50',
    lat: globalZones.buenosAires[0],
    lng: globalZones.buenosAires[1],
    zoneLabel: 'Buenos Aires',
    status: 'future',
    detail: 'A month in Buenos. Based in Palermo, asado most Fridays.',
    destinationId: 'buenos-aires',
    overlapStart: '2026-11-15',
    overlapEnd: '2026-11-19',
  },
  {
    id: 'dana-punta',
    friendName: 'Dana Arzi',
    friendInitial: 'D',
    photoUrl: 'https://i.pravatar.cc/200?img=45',
    lat: -34.9633,
    lng: -54.9476,
    zoneLabel: 'Punta del Este',
    status: 'future',
    detail: 'Punta del Este first week of December. Beach days, late nights.',
    destinationId: 'punta-del-este',
    overlapStart: '2026-11-21',
    overlapEnd: '2026-11-23',
  },
  {
    id: 'neta-mendoza',
    friendName: 'Neta Biton',
    friendInitial: 'N',
    photoUrl: 'https://i.pravatar.cc/200?img=48',
    lat: -32.8908,
    lng: -68.8272,
    zoneLabel: 'Mendoza',
    status: 'future',
    detail: 'Mendoza for wine tours end of November.',
  },
  {
    id: 'uri-bariloche',
    friendName: 'Uri Dahan',
    friendInitial: 'U',
    photoUrl: 'https://i.pravatar.cc/200?img=60',
    lat: -41.1335,
    lng: -71.3103,
    zoneLabel: 'Bariloche',
    status: 'future',
    detail: 'Bariloche end of November — doing a 4-day trek. Spots open.',
  },
];
