import L from 'leaflet';
import { mapColors } from '../../../utils/mapColors';
import type { LatLng } from '../../../data/myTrip';

/**
 * Past trip polyline (solid cocoa) plus the small waypoint dots at each city
 * stop. Skips the last point — the present is owned by drawPresentPin. The
 * future is owned by drawPlannedStops.
 *
 * Returns a cleanup that removes everything from the map.
 */
export function drawTripLine(map: L.Map, past: LatLng[]): () => void {
  const layers: L.Layer[] = [];

  layers.push(
    L.polyline(past, {
      color: mapColors.cocoa,
      weight: 2,
      opacity: 0.6,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map),
  );

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
