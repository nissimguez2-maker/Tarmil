import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import './TripMap.css';

import { rioPlaces, type RioPlace } from '../../data/rioPlaces';
import { globalPlaces, type GlobalPlace } from '../../data/globalPlaces';
import { myTrip, friendOverlaps, type LatLng } from '../../data/myTrip';
import type { PlannedStop } from '../../data/plannedStops';
import { drawTripLine } from './layers/drawTripLine';
import { drawPlaceMarkers } from './layers/drawPlaceMarkers';
import { drawFriendBubbles } from './layers/drawFriendBubbles';
import { drawPresentPin } from './layers/drawPresentPin';
import { drawPlannedStops } from './layers/drawPlannedStops';
import { placeMatchesFilters, type FilterId } from './utils/categoryLabel';
import type { SheetState } from './tripReducer';

const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY;

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

/** Compute LngLatBoundsLike from a list of [lat, lng] coords. */
function boundsFromLatLngs(
  coords: LatLng[],
): [[number, number], [number, number]] | null {
  if (coords.length === 0) return null;
  let minLat = Infinity,
    maxLat = -Infinity,
    minLng = Infinity,
    maxLng = -Infinity;
  coords.forEach(([lat, lng]) => {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  });
  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

/**
 * Trip map — TomTom Maps SDK v6 backend, controlled component.
 *
 * Two effects:
 *   - one-time map init (creates `tt.map`, fits initial bounds, attaches
 *     a click-to-close handler). Sets `mapReady` after the style loads so
 *     downstream layer effects can safely call `addSource`/`addLayer`.
 *   - layer-redraw on [mapReady, mode, activeFilters, plannedStops,
 *     activeStopId] — clears layers and re-runs the pure draw functions.
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
  const mapRef = useRef<tt.Map | null>(null);
  const handlersRef = useRef({ onOpenSheet, onCloseSheet });
  const [mapReady, setMapReady] = useState(false);

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

    if (!TOMTOM_API_KEY) {
      // eslint-disable-next-line no-console
      console.error(
        '[TripMap] VITE_TOMTOM_API_KEY is missing. Set it in .env.local for dev or in Netlify env vars for the deployed build.',
      );
      return;
    }

    const initialCenter: LatLng = myTrip.present;
    // Style is left to the SDK default — TomTom v6 builds the right URL with
    // the API key. Passing an explicit `tomtom://...` value caused tiles to
    // never resolve in the deployed build.
    const map = tt.map({
      key: TOMTOM_API_KEY,
      container: containerRef.current,
      center: [initialCenter[1], initialCenter[0]],
      zoom: 4,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    });

    const handleMapClick = () => handlersRef.current.onCloseSheet();
    map.on('click', handleMapClick);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    map.on('error' as any, (ev: any) => {
      // eslint-disable-next-line no-console
      console.error('[TripMap] TomTom map error:', ev?.error ?? ev);
    });

    const handleLoad = () => {
      const allCoords: LatLng[] = [
        ...myTrip.past,
        myTrip.present,
        ...plannedStops.map((s): LatLng => [s.lat, s.lng]),
      ];
      const bounds = boundsFromLatLngs(allCoords);
      if (bounds) {
        map.fitBounds(bounds, {
          padding: 70,
          maxZoom: 4,
        });
      }
      setMapReady(true);
    };
    map.once('load', handleLoad);

    mapRef.current = map;

    return () => {
      map.off('click', handleMapClick);
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-run draw layers when state changes. Marker click handlers are no-ops
  // in pick mode so taps go through the map instead of opening sheets.
  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
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
  }, [mapReady, mode, activeFilters, plannedStops, activeStopId]);

  return <div ref={containerRef} className="tarmil-map h-full w-full" />;
});
