import mapboxgl from 'mapbox-gl';
import type { LatLng } from '../../../data/myTrip';
import type { PlannedStop } from '../../../data/plannedStops';
import { formatDateRange } from '../utils/formatDateRange';
import { escapeHtml } from '../utils/escapeHtml';

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
  map: mapboxgl.Map,
  _present: LatLng,
  stops: PlannedStop[],
  activeStopId: string | undefined,
  onClickStop: (stop: PlannedStop) => void,
): () => void {
  const markers: mapboxgl.Marker[] = [];

  stops.forEach((stop) => {
    const isActive = stop.id === activeStopId;
    const dates = formatDateRange(stop.arrivalDate, stop.departureDate);

    const el = document.createElement('div');
    el.className = 'tarmil-planned-marker';
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.boxSizing = 'border-box';
    el.style.zIndex = '400';
    el.title = stop.nameEn;
    el.innerHTML = `
      <div class="tarmil-planned-circle${isActive ? ' is-active' : ''}"></div>
      <div class="tarmil-planned-label">
        <span class="tarmil-planned-label-name">${escapeHtml(stop.nameEn)}</span>
        <span class="tarmil-planned-label-dates">${escapeHtml(dates)}</span>
      </div>
    `;
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      onClickStop(stop);
    });

    const marker = new mapboxgl.Marker({ element: el, anchor: 'center' })
      .setLngLat([stop.lng, stop.lat])
      .addTo(map);
    markers.push(marker);
  });

  return () => {
    markers.forEach((marker) => marker.remove());
  };
}
