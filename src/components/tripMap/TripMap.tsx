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

import { rioPlaces, type RioPlace } from '../../data/rioPlaces';
import { globalPlaces, type GlobalPlace } from '../../data/globalPlaces';
import { myTrip, friendOverlaps } from '../../data/myTrip';
import type { PlannedStop } from '../../data/plannedStops';
import { drawTripLine } from './layers/drawTripLine';
import { drawPlaceMarkers } from './layers/drawPlaceMarkers';
import { drawFriendBubbles } from './layers/drawFriendBubbles';
import { drawPresentPin } from './layers/drawPresentPin';
import { drawPlannedStops } from './layers/drawPlannedStops';
import { placeMatchesFilters, type FilterId } from './utils/categoryLabel';
import type { SheetState } from './tripReducer';

export type TripMapHandle = {
  /** Current map center as [lat, lng]. Returns null before init. */
  getCenter: () => [number, number] | null;
};

type Props = {
  mode: 'default' | 'pick';
  activeFilters: Set<FilterId>;
  plannedStops: PlannedStop[];
  activeStopId?: string;
  onOpenSheet: (sheet: SheetState) => void;
  onCloseSheet: () => void;
};

/**
 * Trip map — pure controlled component. All state lives in TripScreen and
 * arrives through props. Sheets and floaters are siblings rendered by the
 * parent, not by this component.
 *
 * Two effects:
 *   - one-time map init (creates L.Map, fits initial bounds, attaches click)
 *   - layer-redraw on [mode, activeFilters, plannedStops, activeStopId]
 *     (clears layers and re-runs the pure draw functions)
 *
 * Click handlers reach the parent through a ref so the redraw effect doesn't
 * have to depend on potentially unstable callback identities. The map's
 * center is exposed imperatively so PickOnMapBar in the parent can read it
 * on confirm.
 */
export const TripMap = forwardRef<TripMapHandle, Props>(function TripMap(
  {
    mode,
    activeFilters,
    plannedStops,
    activeStopId,
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

  // One-time map init.
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

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '© OpenStreetMap contributors © CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      },
    ).addTo(map);

    // Frame past + present + planned stops in one shot — global arc.
    // Extra top padding leaves room for the chip rail.
    const allCoords: [number, number][] = [
      ...myTrip.past,
      myTrip.present,
      ...plannedStops.map((s): [number, number] => [s.lat, s.lng]),
    ];
    map.fitBounds(L.latLngBounds(allCoords), {
      paddingTopLeft: [60, 80],
      paddingBottomRight: [60, 60],
      maxZoom: 4,
    });

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

  // Re-run draw layers when state changes. Marker click handlers are no-ops
  // in pick mode so taps go through the map instead of opening sheets.
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const cleanups: Array<() => void> = [];

    const isPick = mode === 'pick';
    const noopPlace = () => {};
    const noopFriend = () => {};
    const noopStop = () => {};

    cleanups.push(drawTripLine(map, myTrip.past));
    cleanups.push(
      drawPlannedStops(
        map,
        myTrip.present,
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

    const visiblePlaces: (RioPlace | GlobalPlace)[] = [
      ...rioPlaces,
      ...globalPlaces,
    ].filter((p) => placeMatchesFilters(p, activeFilters));
    cleanups.push(
      drawPlaceMarkers(
        map,
        visiblePlaces,
        isPick
          ? noopPlace
          : (place) =>
              handlersRef.current.onOpenSheet({ kind: 'place', place }),
      ),
    );

    cleanups.push(
      drawFriendBubbles(
        map,
        friendOverlaps,
        isPick
          ? noopFriend
          : (friend) =>
              handlersRef.current.onOpenSheet({ kind: 'friend', friend }),
      ),
    );

    cleanups.push(drawPresentPin(map, myTrip.present));

    return () => {
      cleanups.reverse().forEach((fn) => fn());
    };
  }, [mode, activeFilters, plannedStops, activeStopId]);

  return <div ref={containerRef} className="tarmil-map h-full w-full" />;
});
