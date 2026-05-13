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

import type { Place } from '../../data/places';
import type { FriendOverlap, LatLng } from '../../data/myTrip';
import type { PlannedStop } from '../../data/plannedStops';
import { drawTripLine } from './layers/drawTripLine';
import { drawPlaceMarkers } from './layers/drawPlaceMarkers';
import { drawFriendBubbles } from './layers/drawFriendBubbles';
import { drawPresentPin } from './layers/drawPresentPin';
import { drawPlannedStops } from './layers/drawPlannedStops';
import { drawDensityHeat } from './layers/drawDensityHeat';
import { placeMatchesFilters, type FilterId } from './utils/categoryLabel';
import { DENSITY_POINTS } from '../../data/densityCities';
import type { SheetState } from './tripReducer';

export type TripMapHandle = {
  /** Current map center as [lat, lng]. Returns null before init. */
  getCenter: () => [number, number] | null;
};

type Props = {
  mode: 'default' | 'pick' | 'mapOnly';
  activeFilters: Set<FilterId>;
  places: Place[];
  /** Already filtered by friendsView upstream — drawn as-is. */
  friendOverlaps: FriendOverlap[];
  pastTrip: LatLng[];
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
    activeFilters,
    places,
    friendOverlaps,
    pastTrip,
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

    const tomtomKey = import.meta.env.VITE_TOMTOM_API_KEY;
    if (tomtomKey) {
      L.tileLayer(
        `https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=${tomtomKey}&tileSize=512`,
        {
          attribution: '© TomTom',
          maxZoom: 19,
          tileSize: 512,
          zoomOffset: -1,
        },
      ).addTo(map);
    } else {
      // Build-time fallback so a deploy without VITE_TOMTOM_API_KEY still ships a map.
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '© OpenStreetMap contributors © CARTO',
          subdomains: 'abcd',
          maxZoom: 19,
        },
      ).addTo(map);
    }

    const allCoords: [number, number][] = [
      ...pastTrip,
      presentLocation,
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

  // Re-run draw layers when state or data changes. Density-heat mode replaces
  // the regular layers wholesale — we don't draw the trip line, planned stops,
  // places, friends, or present pin while heat is on.
  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const cleanups: Array<() => void> = [];

    if (heatmapEnabled) {
      cleanups.push(drawDensityHeat(map, DENSITY_POINTS));
      return () => {
        cleanups.reverse().forEach((fn) => fn());
      };
    }

    const isPick = mode === 'pick';
    const noopPlace = () => {};
    const noopFriend = () => {};
    const noopStop = () => {};

    cleanups.push(drawTripLine(map, pastTrip));
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

    const visiblePlaces = places.filter((p) =>
      placeMatchesFilters(p, activeFilters),
    );
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

    cleanups.push(drawPresentPin(map, presentLocation));

    return () => {
      cleanups.reverse().forEach((fn) => fn());
    };
  }, [
    mode,
    activeFilters,
    places,
    friendOverlaps,
    pastTrip,
    presentLocation,
    plannedStops,
    activeStopId,
    heatmapEnabled,
  ]);

  return <div ref={containerRef} className="tarmil-map h-full w-full" />;
});
