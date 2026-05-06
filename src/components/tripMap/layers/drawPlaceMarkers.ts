import tt from '@tomtom-international/web-sdk-maps';
import { mapColors } from '../../../utils/mapColors';
import type { RioPlace } from '../../../data/rioPlaces';

const SOURCE = 'tarmil-places';
const LAYER_CLUSTER = 'tarmil-places-cluster';
const LAYER_CLUSTER_COUNT = 'tarmil-places-cluster-count';
const LAYER_UNCLUSTERED = 'tarmil-places-unclustered';

/**
 * Clustered place markers backed by MapLibre's built-in clustering on a
 * GeoJSON source. Clusters explode at zoom 14 — at that zoom the user
 * sees individual venues rather than one disc. Tarmil Picks render in
 * copper; everything else in cocoa, matching the brand commitment that
 * picks are the "vibrant" accent.
 */
export function drawPlaceMarkers(
  map: tt.Map,
  places: RioPlace[],
  onClickPlace: (place: RioPlace) => void,
): () => void {
  // Index by id so cluster click can resolve back to the RioPlace object.
  const placeById = new Map<string, RioPlace>();
  places.forEach((p) => placeById.set(p.id, p));

  map.addSource(SOURCE, {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: places.map((p) => ({
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
        properties: {
          id: p.id,
          tarmilPick: !!p.tarmilPick,
        },
      })),
    },
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 45,
  });

  map.addLayer({
    id: LAYER_CLUSTER,
    type: 'circle',
    source: SOURCE,
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': mapColors.cocoa,
      'circle-radius': 18,
      'circle-stroke-color': mapColors.ivory,
      'circle-stroke-width': 2.5,
    },
  });

  map.addLayer({
    id: LAYER_CLUSTER_COUNT,
    type: 'symbol',
    source: SOURCE,
    filter: ['has', 'point_count'],
    layout: {
      'text-field': ['get', 'point_count_abbreviated'],
      'text-size': 12,
      'text-allow-overlap': true,
    },
    paint: {
      'text-color': mapColors.ivory,
    },
  });

  map.addLayer({
    id: LAYER_UNCLUSTERED,
    type: 'circle',
    source: SOURCE,
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-color': [
        'case',
        ['get', 'tarmilPick'],
        mapColors.copper,
        mapColors.cocoa,
      ],
      'circle-radius': 7,
      'circle-stroke-color': mapColors.ivory,
      'circle-stroke-width': 2.5,
    },
  });

  // Cluster click → zoom in to spread the cluster.
  const onClusterClick = (e: tt.MapMouseEvent<'click'> & tt.EventData) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: [LAYER_CLUSTER],
    });
    const f = features[0];
    if (!f || !f.properties) return;
    const clusterId = f.properties.cluster_id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const source = map.getSource(SOURCE) as any;
    source.getClusterExpansionZoom(
      clusterId,
      (err: Error | null, zoom: number) => {
        if (err) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const coords = (f.geometry as any).coordinates as [number, number];
        map.easeTo({ center: coords, zoom });
      },
    );
  };

  // Unclustered click → open the place sheet.
  const onPlaceClick = (e: tt.MapMouseEvent<'click'> & tt.EventData) => {
    const f = e.features?.[0];
    if (!f || !f.properties) return;
    const place = placeById.get(f.properties.id);
    if (place) onClickPlace(place);
    e.originalEvent?.stopPropagation();
  };

  // Cursor feedback.
  const onEnter = () => {
    map.getCanvas().style.cursor = 'pointer';
  };
  const onLeave = () => {
    map.getCanvas().style.cursor = '';
  };

  map.on('click', LAYER_CLUSTER, onClusterClick);
  map.on('click', LAYER_UNCLUSTERED, onPlaceClick);
  map.on('mouseenter', LAYER_CLUSTER, onEnter);
  map.on('mouseleave', LAYER_CLUSTER, onLeave);
  map.on('mouseenter', LAYER_UNCLUSTERED, onEnter);
  map.on('mouseleave', LAYER_UNCLUSTERED, onLeave);

  return () => {
    map.off('click', LAYER_CLUSTER, onClusterClick);
    map.off('click', LAYER_UNCLUSTERED, onPlaceClick);
    map.off('mouseenter', LAYER_CLUSTER, onEnter);
    map.off('mouseleave', LAYER_CLUSTER, onLeave);
    map.off('mouseenter', LAYER_UNCLUSTERED, onEnter);
    map.off('mouseleave', LAYER_UNCLUSTERED, onLeave);
    if (map.getLayer(LAYER_UNCLUSTERED)) map.removeLayer(LAYER_UNCLUSTERED);
    if (map.getLayer(LAYER_CLUSTER_COUNT)) map.removeLayer(LAYER_CLUSTER_COUNT);
    if (map.getLayer(LAYER_CLUSTER)) map.removeLayer(LAYER_CLUSTER);
    if (map.getSource(SOURCE)) map.removeSource(SOURCE);
  };
}
