import type { Map as MapboxMap, LayerSpecification } from 'mapbox-gl';
import type { DensityPoint } from '../../../data/densityCities';

const SOURCE_ID = 'tarmil-density';
const LAYER_ID = 'tarmil-density-heat';

/**
 * Global Tarmil-user density heat layer (native Mapbox GL heatmap).
 *
 * 13-stop green→red ramp. Green = sparse, red = peak (~10k+). Generous,
 * zoom-scaled radius makes the colour bleed across regions instead of
 * dotting the map with discrete hotspots. Inserted beneath the country
 * labels so place names stay readable through the gradient.
 */
export function drawDensityHeat(
  map: MapboxMap,
  points: DensityPoint[],
): () => void {
  const data: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: points.map((p) => ({
      type: 'Feature',
      properties: { weight: p.intensity },
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
    })),
  };

  map.addSource(SOURCE_ID, { type: 'geojson', data });

  const beforeId = map.getLayer('label-country') ? 'label-country' : undefined;

  map.addLayer(
    {
      id: LAYER_ID,
      type: 'heatmap',
      source: SOURCE_ID,
      maxzoom: 8,
      paint: {
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['get', 'weight'],
          0,
          0,
          1,
          1,
        ],
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0,
          0.7,
          5,
          1.3,
          8,
          1.6,
        ],
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0,
          14,
          2,
          26,
          4,
          46,
          6,
          70,
        ],
        'heatmap-opacity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          6,
          0.82,
          8,
          0.5,
        ],
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0,
          'rgba(13,110,46,0)',
          0.08,
          '#0d6e2e',
          0.17,
          '#2c8a3d',
          0.25,
          '#8fbb3a',
          0.33,
          '#b8c734',
          0.42,
          '#d6c92e',
          0.5,
          '#ddb725',
          0.58,
          '#dfa01f',
          0.67,
          '#db811a',
          0.75,
          '#d36316',
          0.83,
          '#c44b14',
          0.92,
          '#b1361c',
          1,
          '#8e2018',
        ],
      },
    } as LayerSpecification,
    beforeId,
  );

  return () => {
    if (map.getLayer(LAYER_ID)) map.removeLayer(LAYER_ID);
    if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
  };
}
