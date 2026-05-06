/**
 * The user's trip — past line, current location, declared future.
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
 *  - Friend overlap bubbles are at NEIGHBORHOOD/TOWN CENTROIDS — never at
 *    specific bars, beaches, or hostels. A soft halo around each bubble in
 *    RioMap.css visually communicates "approximately in this area."
 *  - The user's own declared future trip (Cristo) can use the landmark coord
 *    because that's the user's private intent, not something friends see.
 */

export type LatLng = [number, number];

/** Neighborhood / town centroids — used for friend overlap and own-trip waypoints. */
export const zones = {
  gigAirport: [-22.815, -43.244] as LatLng,
  maracana: [-22.912, -43.230] as LatLng,
  centro: [-22.91, -43.18] as LatLng, // Centro / Lapa area
  santaTeresa: [-22.928, -43.187] as LatLng,
  botafogo: [-22.952, -43.185] as LatLng,
  copacabana: [-22.974, -43.184] as LatLng,
  ipanema: [-22.984, -43.2] as LatLng,
  buzios: [-22.747, -41.881] as LatLng,
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

  /**
   * Declared future. The user's own private intent — Cristo as a sightseeing
   * destination is fine at landmark resolution since it's their plan, not
   * a friend-visible field.
   */
  future: [
    zones.copacabana,
    [-22.9519, -43.2105] as LatLng, // Cristo Redentor (planned for tomorrow)
  ] as LatLng[],
};

export type FriendOverlap = {
  friendName: string;
  friendInitial: string;
  /** Centroid of the friend's neighborhood / town — never a specific place. */
  lat: number;
  lng: number;
  /** Hebrew zone label shown on the sheet (city/neighborhood, not place). */
  zoneLabel: string;
  status: 'present' | 'future';
  /** Hebrew detail line shown on tap. */
  detail: string;
};

export const friendOverlaps: FriendOverlap[] = [
  {
    friendName: 'מאיה לוי',
    friendInitial: 'מ',
    lat: zones.ipanema[0],
    lng: zones.ipanema[1],
    zoneLabel: 'איפנמה',
    status: 'present',
    detail: 'באיפנמה כבר ארבעה ימים, יוצאת בסוף השבוע.',
  },
  {
    friendName: 'יעל אברהם',
    friendInitial: 'י',
    lat: zones.botafogo[0],
    lng: zones.botafogo[1],
    zoneLabel: 'בוטפוגו',
    status: 'present',
    detail: 'בבוטפוגו הערב, בא לקפוץ אליה לבירה?',
  },
  {
    friendName: 'דוד כהן',
    friendInitial: 'ד',
    lat: zones.centro[0],
    lng: zones.centro[1],
    zoneLabel: 'מרכז ריו',
    status: 'future',
    detail: 'הצהיר על מרכז ריו לשבוע הבא, חופף איתך יומיים.',
  },
  {
    friendName: 'רועי בן עמי',
    friendInitial: 'ר',
    lat: zones.buzios[0],
    lng: zones.buzios[1],
    zoneLabel: 'בוזיוס',
    status: 'future',
    detail: 'מתכנן בוזיוס בעוד שבועיים, אם תהיה שם — תקפצו ביחד.',
  },
];
