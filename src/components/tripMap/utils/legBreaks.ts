import type { LatLng } from '../../../data/myTrip';

const EARTH_RADIUS_KM = 6371;
const toRadians = (deg: number) => (deg * Math.PI) / 180;

/**
 * Great-circle distance between two latlng points, in kilometers.
 */
export function distanceKm(a: LatLng, b: LatLng): number {
  const dLat = toRadians(b[0] - a[0]);
  const dLng = toRadians(b[1] - a[1]);
  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);
  const h =
    sinLat * sinLat +
    Math.cos(toRadians(a[0])) * Math.cos(toRadians(b[0])) * sinLng * sinLng;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/**
 * Split a flat sequence of past waypoints into legs whenever consecutive
 * points are farther apart than `thresholdKm`. Each leg becomes its own
 * polyline so the map doesn't draw a 9000-km line across the ocean between
 * a Greek-islands trip and a Côte d'Azur trip.
 *
 * Default 1500km threshold separates inter-continental hops from
 * within-region city-to-city moves (Athens→Mykonos ≈ 250km stays connected;
 * Mykonos→Nice ≈ 1700km breaks).
 */
export function groupIntoLegs(
  points: LatLng[],
  thresholdKm = 1500,
): LatLng[][] {
  if (points.length === 0) return [];
  const legs: LatLng[][] = [];
  let current: LatLng[] = [points[0]];

  for (let i = 1; i < points.length; i++) {
    if (distanceKm(points[i - 1], points[i]) > thresholdKm) {
      legs.push(current);
      current = [points[i]];
    } else {
      current.push(points[i]);
    }
  }
  legs.push(current);
  return legs;
}
