import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../tripMap/TripMap.css';
import type { LatLng } from '../../data/myTrip';
import { globalZones } from '../../data/myTrip';

/**
 * Lookup of `destinationId` → city centroid. Mirrors the planned-stop ids
 * the rest of the app uses (`buzios`, `sao-paulo`, etc.). The activity-card
 * mini-map frames around this single point — v0.3 trip declarations are
 * city-first, not polyline-first.
 *
 * Extend this table whenever a new destination is introduced. Returning
 * `null` means "fall back to a default" — the world-zoom Tel Aviv fallback
 * below keeps the card from going blank.
 */
const CITY_CENTROIDS: Record<string, LatLng> = {
  buzios: globalZones.buzios,
  'sao-paulo': globalZones.saoPaulo,
  jericoacoara: globalZones.jericoacoara,
  'buenos-aires': globalZones.buenosAires,
  rio: [-22.9068, -43.1729],
  'rio-de-janeiro': [-22.9068, -43.1729],
  'punta-del-este': [-34.9633, -54.9476],
};

const FALLBACK_CENTROID: LatLng = [0, 0];
const FALLBACK_ZOOM = 1;
const CITY_ZOOM = 11;

type Props = {
  /** `activity_post.destination_id` — the city this trip declaration is for. */
  destinationId?: string;
  /** Accessible label for screen readers. Defaults to a generic. */
  ariaLabel?: string;
};

/**
 * Non-interactive TomTom mini-map for activity feed trip declarations.
 * Mirrors the tile-layer setup in `TripMap.tsx` (TomTom basic, CartoDB
 * Positron fallback when `VITE_TOMTOM_API_KEY` is absent). Drops one
 * copper bubble at the destination centroid — same `.tarmil-planned-circle`
 * styling used on the main trip map after the v0.3 polyline removal.
 */
export function TripMapPreview({ destinationId, ariaLabel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const centroid =
      (destinationId && CITY_CENTROIDS[destinationId]) || FALLBACK_CENTROID;
    const zoom = destinationId && CITY_CENTROIDS[destinationId]
      ? CITY_ZOOM
      : FALLBACK_ZOOM;

    const map = L.map(containerRef.current, {
      center: centroid,
      zoom,
      minZoom: 1,
      maxZoom: 13,
      zoomControl: false,
      attributionControl: false,
      dragging: false,
      scrollWheelZoom: false,
      touchZoom: false,
      boxZoom: false,
      keyboard: false,
      doubleClickZoom: false,
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
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        {
          attribution: '© OpenStreetMap contributors © CARTO',
          subdomains: 'abcd',
          maxZoom: 19,
        },
      ).addTo(map);
    }

    L.marker(centroid, {
      icon: L.divIcon({
        className: 'tarmil-planned-marker',
        html: '<div class="tarmil-planned-circle"></div>',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      }),
      interactive: false,
      keyboard: false,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [destinationId]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={ariaLabel ?? 'Trip preview map'}
      className="tarmil-map h-24 w-full overflow-hidden rounded-xl"
    />
  );
}
