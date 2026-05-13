import L from 'leaflet';
import type { LatLng } from '../../../data/myTrip';
import type { PlannedStop } from '../../../data/plannedStops';
import { formatDateRange } from '../utils/formatDateRange';

/**
 * Stay-bubbles for the user's planned stops. Each bubble is the copper
 * hollow ring (`tarmil-planned-circle`) plus a side label chip showing
 * the city name and date range — e.g., "São Paulo · Nov 1–6". Tapping
 * the bubble opens the planned-stop sheet.
 *
 * No connector line: v0.3 removed the personal polyline so the map
 * reads as a who-and-where canvas, not a drawn itinerary. The
 * `present` argument is kept on the signature for compatibility but
 * intentionally unused.
 *
 * Returns a cleanup that removes the markers from the map.
 */
export function drawPlannedStops(
  map: L.Map,
  _present: LatLng,
  stops: PlannedStop[],
  activeStopId: string | undefined,
  onClickStop: (stop: PlannedStop) => void,
): () => void {
  const layers: L.Layer[] = [];

  stops.forEach((stop) => {
    const isActive = stop.id === activeStopId;
    const dates = formatDateRange(stop.arrivalDate, stop.departureDate);

    const icon = L.divIcon({
      className: 'tarmil-planned-marker',
      html: `
        <div class="tarmil-planned-circle${isActive ? ' is-active' : ''}"></div>
        <div class="tarmil-planned-label">
          <span class="tarmil-planned-label-name">${escapeHtml(stop.nameEn)}</span>
          <span class="tarmil-planned-label-dates">${escapeHtml(dates)}</span>
        </div>
      `,
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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
