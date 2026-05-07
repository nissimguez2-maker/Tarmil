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

import type {
  FriendOverlap,
  LatLng,
  Place,
} from '../../data/types';
import type { PlannedStop } from '../../data/plannedStops';
import { drawTripLine } from './layers/drawTripLine';
import { drawPlaceMarkers } from './layers/drawPlaceMarkers';
import { drawFriendBubbles } from './layers/drawFriendBubbles';
import { drawPresentPin } from './layers/drawPresentPin';
import { drawPlannedStops } from './layers/drawPlannedStops';
import { placeMatchesFilters, type FilterId } from './utils/categoryLabel';
import type { SheetState } from './tripReducer';

const TOMTOM_API_KEY = import.meta.env.VITE_TOMTOM_API_KEY;

// The user's current city. Places at this destination_id are always visible
// regardless of planned stops; future-only places are gated by what's planned.
const CURRENT_DESTINATION_ID = 'rio-de-janeiro';

export type TripMapHandle = {
  getCenter: () => [number, number] | null;
};

type Props = {
  mode: 'default' | 'pick';
  activeFilters: Set<FilterId>;
  /** All places from Supabase. Filtered to current city + planned stops. */
  places: Place[];
  /** All friend overlaps. Future-status filtered by planned stops. */
  friendOverlaps: FriendOverlap[];
  /** Past trip waypoints (centroids). */
  pastTrip: LatLng[];
  /** Current user position. */
  presentLocation: LatLng;
  plannedStops: PlannedStop[];
  activeStopId?: string;
  onOpenSheet: (sheet: SheetState) => void;
  onCloseSheet: () => void;
};

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

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    if (!TOMTOM_API_KEY) {
      // eslint-disable-next-line no-console
      console.error(
        '[TripMap] VITE_TOMTOM_API_KEY is missing. Set it in .env.local for dev or in Netlify env vars for the deployed build.',
      );
      return;
    }

    const initialCenter = presentLocation;
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
        ...pastTrip,
        presentLocation,
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
      try {
        map.off('click', handleMapClick);
        map.remove();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[TripMap] cleanup threw, continuing:', e);
      }
      mapRef.current = null;
      setMapReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    const map = mapRef.current;
    const cleanups: Array<() => void> = [];

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

    // A place is visible if it's in the user's current city OR its destination
    // is currently in the planned route. This is what makes "stuff appears /
    // disappears" feel live when the founder picks or removes a city in front
    // of investors.
    const plannedDestIds = new Set(plannedStops.map((s) => s.id));
    const isPlaceLive = (p: Place) =>
      p.destinationId === CURRENT_DESTINATION_ID ||
      plannedDestIds.has(p.destinationId);

    const visiblePlaces = places.filter(
      (p) => isPlaceLive(p) && placeMatchesFilters(p, activeFilters),
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

    if (activeFilters.has('friendBubbles')) {
      // Present-status friends always show (they're "with you here"). Future
      // friends only render if their destination is on the route.
      const visibleFriends = friendOverlaps.filter((f) => {
        if (f.status === 'present') return true;
        return f.destinationId ? plannedDestIds.has(f.destinationId) : false;
      });
      cleanups.push(
        drawFriendBubbles(
          map,
          visibleFriends,
          isPick
            ? noopFriend
            : (friend) =>
                handlersRef.current.onOpenSheet({ kind: 'friend', friend }),
        ),
      );
    }

    cleanups.push(drawPresentPin(map, presentLocation));

    return () => {
      cleanups.reverse().forEach((fn) => {
        try {
          fn();
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn('[TripMap] layer cleanup threw, continuing:', e);
        }
      });
    };
  }, [
    mapReady,
    mode,
    activeFilters,
    places,
    friendOverlaps,
    pastTrip,
    presentLocation,
    plannedStops,
    activeStopId,
  ]);

  return <div ref={containerRef} className="tarmil-map h-full w-full" />;
});
