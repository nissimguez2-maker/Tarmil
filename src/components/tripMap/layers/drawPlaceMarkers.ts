import L from 'leaflet';
import 'leaflet.markercluster';
import type { RioPlace } from '../../../data/rioPlaces';

/**
 * Clustered place markers. Tapping a marker invokes onClickPlace.
 *
 * Clusters explode at zoom 14 — at that level the user has zoomed in enough
 * that the Lapa-area density reads as individual venues rather than one disc.
 */
export function drawPlaceMarkers(
  map: L.Map,
  places: RioPlace[],
  onClickPlace: (place: RioPlace) => void,
): () => void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clusterGroup = (L as any).markerClusterGroup({
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
    zoomToBoundsOnClick: true,
    disableClusteringAtZoom: 14,
    maxClusterRadius: 45,
    iconCreateFunction: (cluster: L.MarkerCluster) => {
      const count = cluster.getChildCount();
      return L.divIcon({
        className: 'tarmil-cluster',
        html: `<div class="tarmil-cluster-dot">${count}</div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });
    },
  });

  places.forEach((place) => {
    const icon = L.divIcon({
      className: 'tarmil-place-marker',
      html: `<div class="tarmil-place-dot tarmil-place-${place.category}${
        place.tarmilPick ? ' tarmil-place-pick' : ''
      }"></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
    const marker = L.marker([place.lat, place.lng], {
      icon,
      title: place.englishName,
    });
    marker.on('click', () => onClickPlace(place));
    clusterGroup.addLayer(marker);
  });

  clusterGroup.addTo(map);

  return () => {
    map.removeLayer(clusterGroup);
  };
}
