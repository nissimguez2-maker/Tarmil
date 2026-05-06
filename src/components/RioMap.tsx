import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { useNavigate } from 'react-router-dom';
import { Star, X, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import './RioMap.css';

import { rioPlaces, type RioPlace } from '../data/rioPlaces';
import {
  myTrip,
  friendOverlaps,
  type FriendOverlap,
} from '../data/myTrip';
import { mapColors } from '../utils/mapColors';

// Bounds expanded east to include Búzios and west to include Grumari.
const RIO_BOUNDS = L.latLngBounds([-23.2, -44.0], [-22.55, -41.7]);

type SheetTarget =
  | { kind: 'place'; place: RioPlace }
  | { kind: 'friend'; friend: FriendOverlap }
  | null;

/**
 * Rio de Janeiro map.
 *
 * Core decisions:
 *  - CartoDB Positron tiles + warm Tarmil tint via CSS filter.
 *  - fitBounds on initial load to frame the user's whole trip in one shot —
 *    investor sees the past + future arc immediately.
 *  - Place markers clustered (leaflet.markercluster) so the Lapa-area density
 *    reads as one disc with a count rather than a pile-up. Clusters explode
 *    above zoom 14.
 *  - Friend bubbles at neighborhood / town centroids (not specific places)
 *    with a soft halo — visually enforces the brand commitment that
 *    resolution is city-level, never street-level.
 *  - Trip line drawn thin (2px past, 1.5px future) at reduced opacity with
 *    waypoint circles at each city stop — reads as a travel diary trail
 *    rather than a highway.
 */
export function RioMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [target, setTarget] = useState<SheetTarget>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      maxBounds: RIO_BOUNDS,
      maxBoundsViscosity: 1.0,
      minZoom: 10,
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

    // ─── Trip line — past ──────────────────────────────────────────────
    L.polyline(myTrip.past, {
      color: mapColors.cocoa,
      weight: 2,
      opacity: 0.6,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    // Past waypoint dots (each city stop) — small filled cocoa circles
    myTrip.past.forEach((point, i) => {
      // Skip the last point (it's the present, which gets its own pulsing pin)
      if (i === myTrip.past.length - 1) return;
      L.circleMarker(point, {
        radius: 4,
        fillColor: mapColors.cocoa,
        fillOpacity: 0.9,
        color: mapColors.ivory,
        weight: 1.5,
        interactive: false,
      }).addTo(map);
    });

    // ─── Trip line — future ─────────────────────────────────────────────
    L.polyline(myTrip.future, {
      color: mapColors.cocoa,
      weight: 1.5,
      opacity: 0.35,
      dashArray: '3 5',
      lineCap: 'round',
    }).addTo(map);

    // Future waypoint (the Cristo destination) — hollow circle for "not yet"
    L.circleMarker(myTrip.future[myTrip.future.length - 1], {
      radius: 4,
      fillColor: mapColors.ivory,
      fillOpacity: 1,
      color: mapColors.cocoa,
      weight: 1.5,
      opacity: 0.5,
      interactive: false,
    }).addTo(map);

    // ─── Place markers (clustered) ──────────────────────────────────────
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

    rioPlaces.forEach((place) => {
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
      marker.on('click', () => setTarget({ kind: 'place', place }));
      clusterGroup.addLayer(marker);
    });

    clusterGroup.addTo(map);

    // ─── Friend overlap bubbles (always visible, never clustered) ───────
    friendOverlaps.forEach((friend) => {
      const icon = L.divIcon({
        className: 'tarmil-friend-bubble',
        html: `<div class="tarmil-friend-circle ${
          friend.status === 'present' ? 'is-present' : 'is-future'
        }">${friend.friendInitial}</div>`,
        iconSize: [56, 56],
        iconAnchor: [28, 28],
      });
      const marker = L.marker([friend.lat, friend.lng], {
        icon,
        title: friend.friendName,
        zIndexOffset: 500,
      }).addTo(map);
      marker.on('click', () => setTarget({ kind: 'friend', friend }));
    });

    // ─── Present pin (pulsing copper) ───────────────────────────────────
    const presentIcon = L.divIcon({
      className: 'tarmil-present-pin',
      html: '<div class="tarmil-present-ring"></div><div class="tarmil-present-dot"></div>',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
    L.marker(myTrip.present, {
      icon: presentIcon,
      zIndexOffset: 1000,
      interactive: false,
    }).addTo(map);

    // ─── Frame the trip in one shot ─────────────────────────────────────
    // fitBounds on past + future so the user's whole arc is visible immediately.
    const tripBounds = L.latLngBounds([
      ...myTrip.past,
      ...myTrip.future,
    ]);
    map.fitBounds(tripBounds, {
      padding: [60, 60],
      maxZoom: 13,
    });

    mapRef.current = map;

    // dismiss bottom sheet on map click outside markers
    map.on('click', () => setTarget(null));

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div ref={containerRef} className="tarmil-map h-full w-full" />

      {/* bottom sheet */}
      <div
        className={clsx(
          'absolute inset-x-md bottom-md z-[1000] origin-bottom rounded-md border border-rope bg-ivory transition-all duration-300',
          target
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-[120%] opacity-0',
        )}
        style={{ boxShadow: '0 -10px 30px -10px rgba(53, 40, 24, 0.25)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {target?.kind === 'place' && (
          <PlaceSheet
            place={target.place}
            onClose={() => setTarget(null)}
            onOpen={() => navigate(`/place/${target.place.id}`)}
          />
        )}
        {target?.kind === 'friend' && (
          <FriendSheet
            friend={target.friend}
            onClose={() => setTarget(null)}
          />
        )}
      </div>
    </div>
  );
}

function PlaceSheet({
  place,
  onClose,
  onOpen,
}: {
  place: RioPlace;
  onClose: () => void;
  onOpen: () => void;
}) {
  return (
    <div className="flex flex-col gap-sm p-md">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-2">
            <h3 className="font-serif text-lede leading-tight">
              {place.hebrewName}
            </h3>
            {place.tarmilPick && (
              <span className="meta-caps text-copper">בחירת תרמיל</span>
            )}
          </div>
          <span className="text-[10pt] text-cocoa-55">
            {categoryLabel(place.category)}
          </span>
        </div>
        <button
          type="button"
          aria-label="סגור"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-cocoa-55 hover:bg-cocoa-8 active:bg-cocoa-15"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <p className="text-body text-cocoa-70">{place.hebrewDescription}</p>

      <div className="flex items-center gap-md">
        <span className="inline-flex items-center gap-1 text-[10pt] text-cocoa">
          <Star
            className="h-3.5 w-3.5 fill-copper text-copper"
            strokeWidth={0}
            aria-hidden
          />
          <span className="tnum">{place.rating.toFixed(1)}</span>
        </span>
        {place.friendsKnow > 0 && (
          <span className="text-[10pt] text-cocoa-70">
            <span className="tnum">{place.friendsKnow}</span> חברים מכירים
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onOpen}
        className="mt-1 inline-flex h-10 items-center justify-between gap-2 rounded-full bg-cocoa px-4 text-[11pt] font-medium text-ivory active:bg-cocoa-70"
      >
        <span>פרטים מלאים</span>
        <ChevronLeft className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

function FriendSheet({
  friend,
  onClose,
}: {
  friend: FriendOverlap;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col gap-sm p-md">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex items-center gap-md">
          <span
            className={clsx(
              'inline-flex h-12 w-12 items-center justify-center rounded-full font-serif text-lede',
              friend.status === 'present'
                ? 'bg-copper text-ivory'
                : 'border-2 border-dashed border-copper text-copper bg-ivory',
            )}
            aria-hidden
          >
            {friend.friendInitial}
          </span>
          <div className="flex flex-col">
            <h3 className="font-serif text-lede leading-tight">
              {friend.friendName}
            </h3>
            <span className="meta-caps text-copper">
              {friend.status === 'present' ? 'איתך כאן' : 'חופף בעתיד'}
              <span className="ms-2 text-cocoa-55">· {friend.zoneLabel}</span>
            </span>
          </div>
        </div>
        <button
          type="button"
          aria-label="סגור"
          onClick={onClose}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-cocoa-55 hover:bg-cocoa-8 active:bg-cocoa-15"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>

      <p className="text-body text-cocoa-70">{friend.detail}</p>

      <p className="text-[9pt] text-cocoa-55 leading-snug">
        מיקום ברמת עיר בלבד. תרמיל לעולם לא מציג את המיקום המדויק של חבר.
      </p>
    </div>
  );
}

function categoryLabel(c: RioPlace['category']): string {
  switch (c) {
    case 'beach':
      return 'חוף';
    case 'hostel':
      return 'הוסטל';
    case 'cafe':
      return 'קפה';
    case 'restaurant':
      return 'מסעדה';
    case 'bar':
      return 'בר';
    case 'club':
      return 'מועדון';
    case 'chabad':
      return 'חב״ד';
    case 'kosher':
      return 'כשר';
    case 'landmark':
      return 'נקודת ציון';
  }
}
