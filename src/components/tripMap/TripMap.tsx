import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './TripMap.css';

import type { FriendOverlap, LatLng } from '../../data/myTrip';
import type { PlannedStop } from '../../data/plannedStops';
import { drawFriendBubbles } from './layers/drawFriendBubbles';
import { drawPresentPin } from './layers/drawPresentPin';
import { drawPlannedStops } from './layers/drawPlannedStops';
import { drawDensityHeat } from './layers/drawDensityHeat';
import { DENSITY_POINTS } from '../../data/densityCities';
import {
  MAPBOX_TOKEN,
  hasMapboxToken,
  buildAppleMapStyle,
} from './appleMapStyle';
import { MapTokenNotice } from './ui/MapTokenNotice';
import type { SheetState } from './tripReducer';

mapboxgl.accessToken = MAPBOX_TOKEN;

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
 *
 * Renders an Apple-Maps-like Mapbox GL vector basemap (see appleMapStyle). The
 * brand overlays (friend bubbles, planned stays, present pin, density heat)
 * are drawn as HTML markers / a native heatmap layer so they stay pixel-
 * identical to the previous Leaflet implementation.
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
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [styleLoaded, setStyleLoaded] = useState(false);
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
    if (!containerRef.current || mapRef.current || !hasMapboxToken) return;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: buildAppleMapStyle(),
      minZoom: 2,
      maxZoom: 17,
      attributionControl: false,
      doubleClickZoom: false,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
      renderWorldCopies: false,
    });
    map.touchZoomRotate.disableRotation();
    // Mapbox attribution is required by ToS; keep it compact + unobtrusive.
    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      'bottom-right',
    );

    // v0.3: bounds derive from the social canvas (present + planned stops),
    // not the past polyline (which v0.3 stopped rendering). Falls back to
    // present-only when there are no planned stops yet. NB: Mapbox is [lng,lat].
    const focusCoords: LatLng[] = [
      presentLocation,
      ...plannedStops.map((s): LatLng => [s.lat, s.lng]),
    ];
    if (focusCoords.length === 1) {
      map.setCenter([focusCoords[0][1], focusCoords[0][0]]);
      map.setZoom(4);
    } else {
      const bounds = new mapboxgl.LngLatBounds();
      focusCoords.forEach(([lat, lng]) => bounds.extend([lng, lat]));
      map.fitBounds(bounds, {
        padding: { top: 80, left: 60, right: 60, bottom: 60 },
        maxZoom: 4,
        duration: 0,
      });
    }

    const handleMapClick = () => handlersRef.current.onCloseSheet();
    map.on('click', handleMapClick);
    map.on('load', () => setStyleLoaded(true));
    mapRef.current = map;

    return () => {
      map.off('click', handleMapClick);
      map.remove();
      mapRef.current = null;
      setStyleLoaded(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-run draw layers when state or data changes. Gated on styleLoaded so
  // source/layer ops (the heatmap) never race the async style load. Density-
  // heat mode replaces the regular layers wholesale — we don't draw planned
  // stops, friends, or the present pin while heat is on. Max zoom is clamped
  // to 5 so the gradient doesn't magnify into giant blobs at street-level.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleLoaded) return;
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
    styleLoaded,
  ]);

  if (!hasMapboxToken) return <MapTokenNotice />;

  return <div ref={containerRef} className="tarmil-map h-full w-full" />;
});
