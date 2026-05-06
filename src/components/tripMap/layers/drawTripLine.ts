import type tt from '@tomtom-international/web-sdk-maps';
import { mapColors } from '../../../utils/mapColors';
import type { LatLng } from '../../../data/myTrip';

const SOURCE_PAST = 'tarmil-past-line';
const LAYER_PAST_LINE = 'tarmil-past-line-layer';
const LAYER_PAST_DOTS = 'tarmil-past-dots-layer';

/**
 * Past trip polyline (solid cocoa) plus small waypoint dots at each city
 * stop. Skips the last point — the present is owned by drawPresentPin.
 *
 * Returns a cleanup that removes the source + layers from the map.
 */
export function drawTripLine(map: tt.Map, past: LatLng[]): () => void {
  if (past.length < 2) return () => {};

  // Convert [lat, lng] → [lng, lat] for GeoJSON.
  const lineCoords = past.map(([lat, lng]) => [lng, lat]);
  // Waypoint dots — skip the final point (the present, owned by drawPresentPin).
  const dotFeatures = past.slice(0, -1).map(([lat, lng]) => ({
    type: 'Feature' as const,
    geometry: { type: 'Point' as const, coordinates: [lng, lat] },
    properties: {},
  }));

  map.addSource(SOURCE_PAST, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: lineCoords },
          properties: {},
        },
        ...dotFeatures,
      ],
    },
  });

  map.addLayer({
    id: LAYER_PAST_LINE,
    type: 'line',
    source: SOURCE_PAST,
    filter: ['==', ['geometry-type'], 'LineString'],
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
    paint: {
      'line-color': mapColors.cocoa,
      'line-width': 2,
      'line-opacity': 0.6,
    },
  });

  map.addLayer({
    id: LAYER_PAST_DOTS,
    type: 'circle',
    source: SOURCE_PAST,
    filter: ['==', ['geometry-type'], 'Point'],
    paint: {
      'circle-color': mapColors.cocoa,
      'circle-opacity': 0.9,
      'circle-radius': 4,
      'circle-stroke-color': mapColors.ivory,
      'circle-stroke-width': 1.5,
    },
  });

  return () => {
    if (map.getLayer(LAYER_PAST_DOTS)) map.removeLayer(LAYER_PAST_DOTS);
    if (map.getLayer(LAYER_PAST_LINE)) map.removeLayer(LAYER_PAST_LINE);
    if (map.getSource(SOURCE_PAST)) map.removeSource(SOURCE_PAST);
  };
}
