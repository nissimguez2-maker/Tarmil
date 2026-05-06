import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { Star, X, ChevronLeft } from 'lucide-react';
import clsx from 'clsx';
import 'leaflet/dist/leaflet.css';
import './RioMap.css';

import { rioPlaces, type RioPlace } from '../data/rioPlaces';
import {
  myTrip,
  friendOverlaps,
  type FriendOverlap,
} from '../data/myTrip';
import { mapColors } from '../utils/mapColors';

const RIO_CENTER: L.LatLngTuple = [-22.95, -43.18];
const RIO_BOUNDS = L.latLngBounds([-23.1, -43.85], [-22.65, -42.95]);

type SheetTarget =
  | { kind: 'place'; place: RioPlace }
  | { kind: 'friend'; friend: FriendOverlap }
  | null;

/**
 * Rio de Janeiro map. CartoDB Positron tiles styled with a warm Tarmil tint
 * via CSS filter, custom cocoa/copper markers, and a slide-up bottom sheet
 * for tap-to-preview before drilling into the full place detail.
 *
 * Pan and zoom work natively — finger drag + pinch on phone, mouse drag +
 * scroll wheel on desktop. View is bounded to the Rio metro area.
 */
export function RioMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [target, setTarget] = useState<SheetTarget>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: RIO_CENTER,
      zoom: 12,
      minZoom: 10,
      maxZoom: 17,
      maxBounds: RIO_BOUNDS,
      maxBoundsViscosity: 1.0,
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

    // Trip line — past (solid cocoa)
    L.polyline(myTrip.past, {
      color: mapColors.cocoa,
      weight: 4,
      opacity: 0.9,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(map);

    // Trip line — future (dashed cocoa-30)
    L.polyline(myTrip.future, {
      color: mapColors.cocoa,
      weight: 3,
      opacity: 0.55,
      dashArray: '4 6',
      lineCap: 'round',
    }).addTo(map);

    // Place markers
    rioPlaces.forEach((place) => {
      const icon = L.divIcon({
        className: 'tarmil-place-marker',
        html: `<div class="tarmil-place-dot tarmil-place-${place.category}${
          place.tarmilPick ? ' tarmil-place-pick' : ''
        }"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      const marker = L.marker([place.lat, place.lng], {
        icon,
        title: place.englishName,
      }).addTo(map);
      marker.on('click', () => setTarget({ kind: 'place', place }));
    });

    // Friend overlap bubbles
    friendOverlaps.forEach((friend) => {
      const icon = L.divIcon({
        className: 'tarmil-friend-bubble',
        html: `<div class="tarmil-friend-circle ${
          friend.status === 'present' ? 'is-present' : 'is-future'
        }">${friend.friendInitial}</div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });
      const marker = L.marker([friend.lat, friend.lng], {
        icon,
        title: friend.friendName,
        zIndexOffset: 500,
      }).addTo(map);
      marker.on('click', () => setTarget({ kind: 'friend', friend }));
    });

    // Present pin — pulsing copper
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

      {/* legend pill — top-end */}
      <div className="pointer-events-none absolute top-md end-md z-[400] flex flex-col gap-1.5">
        <LegendPill swatch="cocoa" label="עבר" />
        <LegendPill swatch="copper" label="כאן עכשיו" />
        <LegendPill swatch="dashed" label="מתוכנן" />
      </div>

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

function LegendPill({
  swatch,
  label,
}: {
  swatch: 'cocoa' | 'copper' | 'dashed';
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-cocoa-15 bg-ivory px-3 py-1 text-[9pt] text-cocoa-70 shadow-sm">
      <span
        aria-hidden
        className={clsx(
          'h-2 w-4 rounded-full',
          swatch === 'cocoa' && 'bg-cocoa',
          swatch === 'copper' && 'bg-copper',
          swatch === 'dashed' &&
            'border-t border-dashed border-cocoa bg-transparent',
        )}
      />
      <span>{label}</span>
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
