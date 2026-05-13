/**
 * Mocked Tarmil-user density per city. Used by the global heat map mode on the
 * Trip tab. Real data would aggregate user check-ins; this list captures the
 * gut feel of where the Israeli backpacker community concentrates in 2026.
 *
 * `intensity` is on a 0–1 scale relative to the hottest hub (Rio).
 */
export type DensityPoint = {
  /** Display name (Hebrew). Used only in the legend tooltip — not rendered on map. */
  nameHe: string;
  lat: number;
  lng: number;
  /** 0–1 relative weight; leaflet.heat normalizes against `max`. */
  intensity: number;
};

export const DENSITY_POINTS: DensityPoint[] = [
  // South America — the densest cluster for the LATAM season
  { nameHe: 'Rio de Janeiro', lat: -22.9068, lng: -43.1729, intensity: 1.0 },
  { nameHe: 'Buenos Aires', lat: -34.6037, lng: -58.3816, intensity: 0.95 },
  { nameHe: 'São Paulo', lat: -23.5505, lng: -46.6333, intensity: 0.82 },
  { nameHe: 'Cusco', lat: -13.5319, lng: -71.9675, intensity: 0.78 },
  { nameHe: 'Medellín', lat: 6.2442, lng: -75.5812, intensity: 0.72 },
  { nameHe: 'Búzios', lat: -22.7469, lng: -41.8819, intensity: 0.55 },
  { nameHe: 'Jericoacoara', lat: -2.7956, lng: -40.5142, intensity: 0.5 },
  { nameHe: 'Cartagena', lat: 10.391, lng: -75.4794, intensity: 0.47 },
  { nameHe: 'La Paz', lat: -16.5, lng: -68.15, intensity: 0.42 },
  { nameHe: 'Florianópolis', lat: -27.5949, lng: -48.548, intensity: 0.35 },
  // Southeast Asia — the off-season magnet
  { nameHe: 'Bangkok', lat: 13.7563, lng: 100.5018, intensity: 0.92 },
  { nameHe: 'Koh Phangan', lat: 9.7349, lng: 100.0252, intensity: 0.7 },
  { nameHe: 'Chiang Mai', lat: 18.7883, lng: 98.9853, intensity: 0.6 },
  { nameHe: 'Phnom Penh', lat: 11.5564, lng: 104.9282, intensity: 0.4 },
  { nameHe: 'Bali', lat: -8.4095, lng: 115.1889, intensity: 0.68 },
  // Other persistent hubs
  { nameHe: 'Tel Aviv', lat: 32.0853, lng: 34.7818, intensity: 0.65 },
  { nameHe: 'Lisbon', lat: 38.7223, lng: -9.1393, intensity: 0.55 },
  { nameHe: 'Berlin', lat: 52.52, lng: 13.405, intensity: 0.48 },
  { nameHe: 'Tokyo', lat: 35.6762, lng: 139.6503, intensity: 0.4 },
  { nameHe: 'New York', lat: 40.7128, lng: -74.006, intensity: 0.5 },
  { nameHe: 'Guatemala City', lat: 14.6349, lng: -90.5069, intensity: 0.3 },
  { nameHe: 'Antigua', lat: 14.5586, lng: -90.7295, intensity: 0.32 },
];
