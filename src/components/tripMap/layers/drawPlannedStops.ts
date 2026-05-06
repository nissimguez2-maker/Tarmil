import tt from '@tomtom-international/web-sdk-maps';
import { mapColors } from '../../../utils/mapColors';
import type { LatLng } from '../../../data/myTrip';
import type { PlannedStop } from '../../../data/plannedStops';

const SOURCE_FUTURE = 'tarmil-future-line';
const LAYER_FUTURE = 'tarmil-future-line-layer';

/**
 * Hollow copper rings at each planned stop, plus a dashed connector
 * present → stop[0] → … → stop[N]. The active stop (when the planned-route
 * sheet highlights one) gets a halo via .is-active CSS.
 */
export function drawPlannedStops(
  map: tt.Map,
  present: LatLng,
  stops: PlannedStop[],
  activeStopId: string | undefined,
  onClickStop: (stop: PlannedStop) => void,
): () => void {
  const markers: tt.Marker[] = [];

  // Dashed connector from present through every stop (in date order).
  if (stops.length > 0) {
    const lineCoords: [number, number][] = [
      [present[1], present[0]],
      ...stops.map((s): [number, number] => [s.lng, s.lat]),
    ];
    map.addSource(SOURCE_FUTURE, {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: lineCoords },
        properties: {},
      },
    });
    map.addLayer({
      id: LAYER_FUTURE,
      type: 'line',
      source: SOURCE_FUTURE,
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': mapColors.cocoa,
        'line-width': 1.5,
        'line-opacity': 0.35,
        'line-dasharray': [2, 3],
      },
    });
  }

  // Hollow ring marker per stop — HTMLElement marker so existing CSS reuses.
  stops.forEach((stop) => {
    const isActive = stop.id === activeStopId;
    const el = document.createElement('div');
    el.className = 'tarmil-planned-marker';
    el.title = stop.nameEn;
    el.innerHTML = `<div class="tarmil-planned-circle${
      isActive ? ' is-active' : ''
    }"></div>`;

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      onClickStop(stop);
    });

    const marker = new tt.Marker({ element: el, anchor: 'center' })
      .setLngLat([stop.lng, stop.lat])
      .addTo(map);
    markers.push(marker);
  });

  return () => {
    markers.forEach((m) => m.remove());
    if (map.getLayer(LAYER_FUTURE)) map.removeLayer(LAYER_FUTURE);
    if (map.getSource(SOURCE_FUTURE)) map.removeSource(SOURCE_FUTURE);
  };
}
