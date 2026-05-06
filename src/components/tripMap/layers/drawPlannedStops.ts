import L from 'leaflet';
import { mapColors } from '../../../utils/mapColors';
import type { LatLng } from '../../../data/myTrip';
import type { PlannedStop } from '../../../data/plannedStops';

/**
 * Hollow copper rings at each planned stop, plus the dashed connector
 * present → stop[0] → stop[1] → … → stop[N]. The active stop (when the
 * planned-route sheet highlights one) gets a halo via .is-active.
 *
 * Returns a cleanup that removes everything from the map.
 */
export function drawPlannedStops(
  map: L.Map,
  present: LatLng,
  stops: PlannedStop[],
  activeStopId: string | undefined,
  onClickStop: (stop: PlannedStop) => void,
): () => void {
  const layers: L.Layer[] = [];

  if (stops.length > 0) {
    const lineCoords: LatLng[] = [
      present,
      ...stops.map((s): LatLng => [s.lat, s.lng]),
    ];
    layers.push(
      L.polyline(lineCoords, {
        color: mapColors.cocoa,
        weight: 1.5,
        opacity: 0.35,
        dashArray: '3 5',
        lineCap: 'round',
      }).addTo(map),
    );
  }

  stops.forEach((stop) => {
    const isActive = stop.id === activeStopId;
    const icon = L.divIcon({
      className: 'tarmil-planned-marker',
      html: `<div class="tarmil-planned-circle${
        isActive ? ' is-active' : ''
      }"></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
    const marker = L.marker([stop.lat, stop.lng], {
      icon,
      title: stop.nameEn,
      zIndexOffset: 400,
    }).addTo(map);
    marker.on('click', () => onClickStop(stop));
    layers.push(marker);
  });

  return () => {
    layers.forEach((layer) => map.removeLayer(layer));
  };
}
