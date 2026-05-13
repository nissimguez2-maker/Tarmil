import L from 'leaflet';
import 'leaflet.heat';
import type { DensityPoint } from '../../../data/densityCities';

/**
 * Global Tarmil-user density heat layer. Replaces the regular pin layers when
 * the user toggles density mode on. Green → yellow → red gradient tuned to feel
 * editorial against the warm Tarmil palette.
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
      radius: 38,
      blur: 28,
      maxZoom: 6,
      minOpacity: 0.35,
      gradient: {
        0.0: '#1d7a3e', // green
        0.35: '#86a52a',
        0.55: '#d6b423', // yellow
        0.75: '#d97a2a', // copper-ish
        1.0: '#c44321', // red
      },
    },
  );

  heatLayer.addTo(map);

  return () => {
    map.removeLayer(heatLayer);
  };
}
