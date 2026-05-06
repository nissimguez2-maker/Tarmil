/**
 * The user's trip — past line, current location, and the friends they overlap with.
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
 *
 * The user's declared future destinations live in plannedStops.ts now —
 * those are full city/region planning units with exact dates.
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

export const myTrip = {
  past: [
    zones.gigAirport,
    zones.maracana,
    zones.centro,
    zones.santaTeresa,
    zones.copacabana,
  ] as LatLng[],

  /** Where the user is right now — Copacabana centroid, not a specific spot. */
  present: zones.copacabana,
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
  },
];
