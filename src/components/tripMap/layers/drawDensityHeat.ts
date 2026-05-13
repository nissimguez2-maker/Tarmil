import L from 'leaflet';
import 'leaflet.heat';
import type { DensityPoint } from '../../../data/densityCities';

/**
 * Global Tarmil-user density heat layer.
 *
 * 13-stop green→red gradient. Green = 0 backpackers, red = peak (~10k+).
 * Even a single backpacker in a city tints the area — wide radius +
 * generous blur make the colors bleed across regions instead of dotting
 * the map with discrete hotspots.
 */
export function drawDensityHeat(
  map: L.Map,
  points: DensityPoint[],
): () => void {
  // leaflet.heat doesn't ship TS types out of the box; cast through the
  // augmented L namespace.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const heatLayer: L.Layer = (L as any).heatLayer(
    points.map((p) => [p.lat, p.lng, p.intensity]),
    {
      radius: 58,
      blur: 48,
      maxZoom: 8,
      minOpacity: 0.42,
      max: 1.0,
      gradient: {
        0.0: '#0d6e2e', // deep green — no presence
        0.08: '#2c8a3d',
        0.17: '#5fa53e',
        0.25: '#8fbb3a',
        0.33: '#b8c734',
        0.42: '#d6c92e', // yellow
        0.5: '#ddb725',
        0.58: '#dfa01f',
        0.67: '#db811a',
        0.75: '#d36316',
        0.83: '#c44b14',
        0.92: '#b1361c',
        1.0: '#8e2018', // red — peak density
      },
    },
  );

  heatLayer.addTo(map);

  return () => {
    map.removeLayer(heatLayer);
  };
}
