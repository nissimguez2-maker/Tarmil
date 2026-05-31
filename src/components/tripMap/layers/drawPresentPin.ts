import mapboxgl from 'mapbox-gl';
import type { LatLng } from '../../../data/myTrip';

export function drawPresentPin(map: mapboxgl.Map, latlng: LatLng): () => void {
  const el = document.createElement('div');
  el.className = 'tarmil-present-pin';
  // Explicit box so the absolutely-positioned ring/dot centre on the point.
  el.style.width = '40px';
  el.style.height = '40px';
  el.style.position = 'relative';
  el.style.pointerEvents = 'none';
  el.style.zIndex = '1000';
  el.setAttribute('aria-label', 'You are here');
  el.title = 'You are here';
  el.innerHTML =
    '<div class="tarmil-present-ring"></div><div class="tarmil-present-dot"></div>';

  const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
    .setLngLat([latlng[1], latlng[0]])
    .addTo(map);

  return () => {
    marker.remove();
  };
}
