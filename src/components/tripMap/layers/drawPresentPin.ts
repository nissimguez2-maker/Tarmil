import tt from '@tomtom-international/web-sdk-maps';
import type { LatLng } from '../../../data/myTrip';

/**
 * Pulsing copper "you are here" pin. The element is the same `.tarmil-present-pin`
 * markup the Leaflet version used; only the marker host changed.
 */
export function drawPresentPin(map: tt.Map, latlng: LatLng): () => void {
  const el = document.createElement('div');
  el.className = 'tarmil-present-pin';
  el.style.pointerEvents = 'none';
  el.innerHTML =
    '<div class="tarmil-present-ring"></div><div class="tarmil-present-dot"></div>';

  const [lat, lng] = latlng;
  const marker = new tt.Marker({ element: el, anchor: 'center' })
    .setLngLat([lng, lat])
    .addTo(map);

  return () => {
    marker.remove();
  };
}
