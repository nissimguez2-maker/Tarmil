import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import './TripMap.css';

import type { FriendOverlap, LatLng } from '../../data/myTrip';
import type { PlannedStop } from '../../data/plannedStops';
import { drawFriendBubbles } from './layers/drawFriendBubbles';
import { drawPresentPin } from './layers/drawPresentPin';
import { drawPlannedStops } from './layers/drawPlannedStops';
import { drawDensityHeat } from './layers/drawDensityHeat';
import { DENSITY_POINTS } from '../../data/densityCities';
import type { SheetState } from './tripReducer';
import { getBasemap } from '../../lib/basemap';

export type TripMapHandle = {
  /** Current map center as [lat, lng]. Returns null before init. */
  getCenter: () => [number, number] | null;
};

type Props = {
  mode: 'default' | 'pick' | 'mapOnly';
  /** Already filtered by friendsView upstream — drawn as-is. */
  friendOverlaps: FriendOverlap[];
  /**
   * Derived per-friend relationship to the user's trip. Drives the
   * three bubble styles in drawFriendBubbles. Computed once in
   * TripScreen and threaded through so map + sheet stay in sync.
   */
  getFriendRelationship: (
    friend: FriendOverlap,
  ) => import('./utils/relateFriend').FriendRelationship;
  presentLocation: LatLng;
  plannedStops: PlannedStop[];
  activeStopId?: string;
  /** When true, hide the regular layers and render the density heat instead. */
  heatmapEnabled: boolean;
  onOpenSheet: (sheet: SheetState) => void;
  onCloseSheet: () => void;
};

/**
 * Trip map — pure controlled component. All state and data lives in TripScreen
 * and arrives through props. Sheets and floaters are siblings rendered by the
 * parent, not by this component.
 */
export const TripMap = forwardRef<TripMapHandle, Props>(function TripMap(
  {
    mode,
    friendOverlaps,
    getFriendRelationship,
    presentLocation,
    plannedStops,
    activeStopId,
    heatmapEnabled,
    onOpenSheet,
    onCloseSheet,
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const handlersRef = useRef({ onOpenSheet, onCloseSheet });

  useEffect(() => {
    handlersRef.current = { onOpenSheet, onCloseSheet };
  });

  useImperativeHandle(
    ref,
    () => ({
      getCenter: () => {
        const c = mapRef.current?.getCenter();
        return c ? [c.lat, c.lng] : null;
      },
    }),
    [],
  );

  // One-time map init. Initial bounds use the data available at first render
  // — subsequent stop add/remove won't auto-refit, by design (jarring on a
  // shared real-time demo).
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      minZoom: 2,
      maxZoom: 17,
      zoomControl: false,
      attributionControl: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
      worldCopyJump: false,
    });

    // Premium basemap: Mapbox (brand-tinted) → TomTom → CARTO. See
    // src/lib/basemap.ts. The warm tint is applied via the
    // `.tarmil-basemap--mapbox` class below.
    const basemap = getBasemap();
    L.tileLayer(basemap.url, basemap.options).addTo(map);
    if (basemap.provider === 'mapbox' && containerRef.current) {
      containerRef.current.classList.add('tarmil-basemap--mapbox');
    }

    // v0.3: bounds derive from the social canvas (present + planned stops),
    // not the past polyline (which v0.3 stopped rendering). Falls back to
    // present-only when there are no planned stops yet.
    const focusCoords: [number, number][] = [
      presentLocation,
      ...plannedStops.map((s): [number, number] => [s.lat, s.lng]),
    ];
    if (focusCoords.length === 1) {
      map.setView(focusCoords[0], 4);
    } else {
      map.fitBounds(L.latLngBounds(focusCoords), {
        // Stop labels float to the right of each bubble, so reserve extra
        // room on that edge — otherwise the easternmost label clips off-screen.
        paddingTopLeft: [70, 80],
        paddingBottomRight: [150, 70],
        maxZoom: 4,
      });
    }

    const handleMapClick = () => handlersRef.current.onCloseSheet();
    map.on('click', handleMapClick);
    mapRef.current = map;

    return () => {
      map.off('click', handleMapClick);
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-run draw layers when state or data changes. Density-heat mode replaces
  // the regular layers wholesale — we don't draw the trip line, planned stops,
  // places, friends, or present pin while heat is on. Max zoom is also clamped
  // to 5 so the gradient doesn't magnify into giant blobs at street-level.
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const cleanups: Array<() => void> = [];

    if (heatmapEnabled) {
      const prevMax = map.getMaxZoom();
      map.setMaxZoom(5);
      if (map.getZoom() > 5) map.setZoom(5);
      cleanups.push(drawDensityHeat(map, DENSITY_POINTS));
      cleanups.push(() => {
        map.setMaxZoom(prevMax);
      });
      return () => {
        cleanups.reverse().forEach((fn) => fn());
      };
    }

    const isPick = mode === 'pick';
    const noopFriend = () => {};
    const noopStop = () => {};

    cleanups.push(
      drawPlannedStops(
        map,
        presentLocation,
        plannedStops,
        activeStopId,
        isPick
          ? noopStop
          : (stop) =>
              handlersRef.current.onOpenSheet({
                kind: 'plannedStop',
                stopId: stop.id,
              }),
      ),
    );

    cleanups.push(
      drawFriendBubbles(
        map,
        friendOverlaps,
        getFriendRelationship,
        isPick
          ? noopFriend
          : (friend) =>
              handlersRef.current.onOpenSheet({ kind: 'friend', friend }),
      ),
    );

    cleanups.push(drawPresentPin(map, presentLocation));

    return () => {
      cleanups.reverse().forEach((fn) => fn());
    };
  }, [
    mode,
    friendOverlaps,
    getFriendRelationship,
    presentLocation,
    plannedStops,
    activeStopId,
    heatmapEnabled,
  ]);

  return <div ref={containerRef} className="tarmil-map h-full w-full" />;
});
