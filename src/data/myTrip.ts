/**
 * The user's trip through Rio — past line, current location, declared future.
 *
 * Coordinates are [lat, lng]. The story the investor sees:
 *   1. Landed at GIG airport.
 *   2. Watched a match at Maracanã.
 *   3. Spent a night in Lapa.
 *   4. Wandered up to Santa Teresa.
 *   5. Settled into Copacabana (currently here).
 *   6. Cristo planned for tomorrow.
 */

export type LatLng = [number, number];

export const myTrip = {
  past: [
    [-22.815, -43.244], // GIG (Galeão) airport
    [-22.9121, -43.2302], // Maracanã
    [-22.9134, -43.179], // Arcos da Lapa
    [-22.9229, -43.1901], // Santa Teresa
    [-22.9711, -43.1825], // Copacabana — current
  ] as LatLng[],

  /** Where the user is right now. */
  present: [-22.9711, -43.1825] as LatLng, // Copacabana

  /** Declared future, drawn dashed ahead of the present pin. */
  future: [
    [-22.9711, -43.1825], // Copacabana
    [-22.9519, -43.2105], // Cristo Redentor (planned for tomorrow)
  ] as LatLng[],
};

export type FriendOverlap = {
  friendName: string;
  friendInitial: string;
  lat: number;
  lng: number;
  status: 'present' | 'future';
  /** Hebrew detail line shown on tap. */
  detail: string;
};

export const friendOverlaps: FriendOverlap[] = [
  {
    friendName: 'מאיה לוי',
    friendInitial: 'מ',
    lat: -22.9847, // Ipanema
    lng: -43.205,
    status: 'present',
    detail: 'באיפנמה כבר ארבעה ימים, יוצאת בסוף השבוע.',
  },
  {
    friendName: 'יעל אברהם',
    friendInitial: 'י',
    lat: -22.9512, // Mureta da Urca
    lng: -43.1686,
    status: 'present',
    detail: 'באורקה הערב, בא לקפוץ אליה לבירה?',
  },
  {
    friendName: 'דוד כהן',
    friendInitial: 'ד',
    lat: -22.9128, // Lapa
    lng: -43.1797,
    status: 'future',
    detail: 'הצהיר על לפה לשבוע הבא, חופף איתך יומיים.',
  },
  {
    friendName: 'רועי בן עמי',
    friendInitial: 'ר',
    lat: -22.7691, // Búzios
    lng: -41.9485,
    status: 'future',
    detail: 'מתכנן בוזיוס בעוד שבועיים, אם תהיה שם — תקפצו ביחד.',
  },
];
