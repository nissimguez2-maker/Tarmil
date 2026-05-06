import L from 'leaflet';
import type { LatLng } from '../../../data/myTrip';

export function drawPresentPin(map: L.Map, latlng: LatLng): () => void {
  const icon = L.divIcon({
    className: 'tarmil-present-pin',
    html: '<div class="tarmil-present-ring"></div><div class="tarmil-present-dot"></div>',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
  const marker = L.marker(latlng, {
    icon,
    zIndexOffset: 1000,
    interactive: false,
  }).addTo(map);

  return () => {
    map.removeLayer(marker);
  };
}
