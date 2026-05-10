import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapColors } from '../utils/mapColors';
import type { FriendPastTrip } from '../data/myTrip';

type Props = {
  trips: FriendPastTrip[];
};

const TRIP_COLORS = [
  mapColors.cocoa,
  mapColors.copper,
  mapColors.cocoa70,
  mapColors.copper70,
];

/**
 * Compact Leaflet map for the FriendProfileScreen — draws each past trip as
 * a polyline through its waypoints + a city dot at every visited centroid.
 * No interactive layers; this is a read-only summary view.
 */
export function FriendMap({ trips }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      minZoom: 2,
      maxZoom: 14,
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

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Redraw layers when trips change.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const layers: L.Layer[] = [];

    trips.forEach((trip, i) => {
      const color = TRIP_COLORS[i % TRIP_COLORS.length];
      if (trip.waypoints.length >= 2) {
        layers.push(
          L.polyline(trip.waypoints, {
            color,
            weight: 2.5,
            opacity: 0.85,
            lineCap: 'round',
            lineJoin: 'round',
            interactive: false,
          }).addTo(map),
        );
      }
      trip.waypoints.forEach((point) => {
        layers.push(
          L.circleMarker(point, {
            radius: 4,
            fillColor: color,
            fillOpacity: 0.95,
            color: mapColors.ivory,
            weight: 1.5,
            interactive: false,
          }).addTo(map),
        );
      });
    });

    const allPoints = trips.flatMap((t) => t.waypoints);
    if (allPoints.length > 0) {
      map.fitBounds(L.latLngBounds(allPoints), {
        paddingTopLeft: [40, 40],
        paddingBottomRight: [40, 40],
        maxZoom: 5,
      });
    }

    return () => {
      layers.forEach((l) => map.removeLayer(l));
    };
  }, [trips]);

  return <div ref={containerRef} className="h-full w-full bg-ivory" />;
}
