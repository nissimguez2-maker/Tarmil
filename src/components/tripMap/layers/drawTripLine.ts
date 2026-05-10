import L from 'leaflet';
import { mapColors } from '../../../utils/mapColors';
import type { LatLng } from '../../../data/myTrip';
import { groupIntoLegs } from '../utils/legBreaks';

/**
 * Past trip polylines (one per leg) plus the small waypoint dots at each city
 * stop. The flattened past array can span multiple continents and years —
 * `groupIntoLegs` breaks the line at >1500km jumps so the map shows distinct
 * trips instead of one giant ocean-crossing zigzag. Skips the very last dot —
 * the present is owned by drawPresentPin. The future is owned by
 * drawPlannedStops.
 *
 * Returns a cleanup that removes everything from the map.
 */
export function drawTripLine(map: L.Map, past: LatLng[]): () => void {
  const layers: L.Layer[] = [];

  for (const leg of groupIntoLegs(past)) {
    if (leg.length < 2) continue;
    layers.push(
      L.polyline(leg, {
        color: mapColors.cocoa,
        weight: 2,
        opacity: 0.6,
        lineCap: 'round',
        lineJoin: 'round',
        interactive: false,
      }).addTo(map),
    );
  }

  past.forEach((point, i) => {
    if (i === past.length - 1) return;
    layers.push(
      L.circleMarker(point, {
        radius: 4,
        fillColor: mapColors.cocoa,
        fillOpacity: 0.9,
        color: mapColors.ivory,
        weight: 1.5,
        interactive: false,
      }).addTo(map),
    );
  });

  return () => {
    layers.forEach((layer) => map.removeLayer(layer));
  };
}
