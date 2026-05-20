import { useEffect, useMemo } from 'react';
import L from 'leaflet';
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { PlannedStop } from '../../data/plannedStops';
import type { HomeCity } from './homeCity';
import type { Selection } from './types';

type LatLng = [number, number];

type Props = {
  stops: PlannedStop[];
  home: HomeCity;
  selection: Selection;
  onSelect: (s: Selection) => void;
};

const TOMTOM_KEY = import.meta.env.VITE_TOMTOM_KEY as string | undefined;

function tomtomTileUrl(): string {
  if (TOMTOM_KEY) {
    return `https://api.tomtom.com/map/1/tile/basic/main/{z}/{x}/{y}.png?key=${TOMTOM_KEY}`;
  }
  return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
}

function pinIcon(index: number, selected: boolean): L.DivIcon {
  const ring = selected
    ? 'box-shadow: 0 0 0 2px var(--ivory), 0 0 0 5px var(--copper), 0 2px 6px rgba(0,0,0,0.18);'
    : 'box-shadow: 0 2px 6px rgba(0,0,0,0.18);';
  return L.divIcon({
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    html: `<div style="
      width:32px;height:32px;border-radius:9999px;
      background-color:var(--copper);
      display:flex;align-items:center;justify-content:center;
      color:white;font-family:Fraunces,serif;font-weight:600;font-size:14px;
      ${ring}
    ">${index + 1}</div>`,
  });
}

function homeIcon(): L.DivIcon {
  return L.divIcon({
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `<div style="
      width:28px;height:28px;border-radius:9999px;
      background-color:var(--cocoa);
      display:flex;align-items:center;justify-content:center;
      color:white;
      box-shadow:0 0 0 2px var(--ivory), 0 0 0 4px var(--cocoa), 0 2px 6px rgba(0,0,0,0.18);
    ">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-4a2 2 0 0 0-2-2h-0a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      </svg>
    </div>`,
  });
}

function FitBounds({
  stops,
  home,
}: {
  stops: PlannedStop[];
  home: HomeCity;
}) {
  const map = useMap();
  useEffect(() => {
    const points: LatLng[] = [
      [home.lat, home.lng],
      ...stops.map((s): LatLng => [s.lat, s.lng]),
    ];
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points);
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [map, stops, home]);
  return null;
}

function FlyToSelection({
  stops,
  home,
  selection,
}: {
  stops: PlannedStop[];
  home: HomeCity;
  selection: Selection;
}) {
  const map = useMap();
  useEffect(() => {
    if (selection.type === 'stop') {
      const stop = stops.find((s) => s.id === selection.stopId);
      if (stop) {
        map.flyTo([stop.lat, stop.lng], 9, { duration: 1.4 });
      }
    } else if (selection.type === 'leg') {
      const from =
        selection.fromStopId === 'home'
          ? { lat: home.lat, lng: home.lng }
          : stops.find((s) => s.id === selection.fromStopId);
      const to =
        selection.toStopId === 'home'
          ? { lat: home.lat, lng: home.lng }
          : stops.find((s) => s.id === selection.toStopId);
      if (from && to) {
        const bounds = L.latLngBounds([
          [from.lat, from.lng],
          [to.lat, to.lng],
        ]);
        map.flyToBounds(bounds, { padding: [80, 80], duration: 1.4 });
      }
    }
  }, [map, stops, home, selection]);
  return null;
}

function MapClickDismiss({ onDismiss }: { onDismiss: () => void }) {
  const map = useMap();
  useEffect(() => {
    const handler = () => onDismiss();
    map.on('click', handler);
    return () => {
      map.off('click', handler);
    };
  }, [map, onDismiss]);
  return null;
}

export function WebMapCanvas({ stops, home, selection, onSelect }: Props) {
  const initialCenter = useMemo<LatLng>(() => {
    if (!stops.length) return [home.lat, home.lng];
    return [stops[0].lat, stops[0].lng];
  }, [stops, home]);
  const selectedStopId = selection.type === 'stop' ? selection.stopId : null;
  const selectedLeg =
    selection.type === 'leg'
      ? { from: selection.fromStopId, to: selection.toStopId }
      : null;

  const departureLeg: [LatLng, LatLng] | null =
    stops.length > 0
      ? [
          [home.lat, home.lng],
          [stops[0].lat, stops[0].lng],
        ]
      : null;
  const returnLeg: [LatLng, LatLng] | null =
    stops.length > 0
      ? [
          [stops[stops.length - 1].lat, stops[stops.length - 1].lng],
          [home.lat, home.lng],
        ]
      : null;

  const isDepartureSelected =
    selectedLeg?.from === 'home' &&
    stops.length > 0 &&
    selectedLeg?.to === stops[0].id;
  const isReturnSelected =
    selectedLeg?.to === 'home' &&
    stops.length > 0 &&
    selectedLeg?.from === stops[stops.length - 1].id;

  return (
    <div className="absolute inset-0 isolate">
      <MapContainer
        center={initialCenter}
        zoom={4}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
        className="h-full w-full"
        attributionControl={false}
      >
        <TileLayer url={tomtomTileUrl()} />

        {departureLeg && (
          <Polyline
            key={`dep-${isDepartureSelected ? 'sel' : 'idle'}`}
            positions={departureLeg}
            pathOptions={{
              color: isDepartureSelected ? 'var(--copper)' : 'var(--cocoa-30)',
              weight: isDepartureSelected ? 3 : 2,
              dashArray: '6 4',
            }}
            eventHandlers={{
              click: () => {
                if (stops.length > 0) {
                  onSelect({
                    type: 'leg',
                    fromStopId: 'home',
                    toStopId: stops[0].id,
                  });
                }
              },
              mouseover: (e) => {
                if (!isDepartureSelected) {
                  e.target.setStyle({ color: 'var(--copper)', weight: 3 });
                }
              },
              mouseout: (e) => {
                if (!isDepartureSelected) {
                  e.target.setStyle({
                    color: 'var(--cocoa-30)',
                    weight: 2,
                  });
                }
              },
            }}
          />
        )}

        {stops.slice(0, -1).map((s, i) => {
          const next = stops[i + 1];
          const isSelected =
            selectedLeg?.from === s.id && selectedLeg?.to === next.id;
          return (
            <Polyline
              key={`${s.id}-${next.id}-${isSelected ? 'sel' : 'idle'}`}
              positions={[
                [s.lat, s.lng] as LatLng,
                [next.lat, next.lng] as LatLng,
              ]}
              pathOptions={{
                color: isSelected ? 'var(--copper)' : 'var(--cocoa-30)',
                weight: isSelected ? 3 : 2,
                dashArray: '6 4',
              }}
              eventHandlers={{
                click: () =>
                  onSelect({
                    type: 'leg',
                    fromStopId: s.id,
                    toStopId: next.id,
                  }),
                mouseover: (e) => {
                  if (!isSelected) {
                    e.target.setStyle({
                      color: 'var(--copper)',
                      weight: 3,
                    });
                  }
                },
                mouseout: (e) => {
                  if (!isSelected) {
                    e.target.setStyle({
                      color: 'var(--cocoa-30)',
                      weight: 2,
                    });
                  }
                },
              }}
            />
          );
        })}

        {returnLeg && (
          <Polyline
            key={`ret-${isReturnSelected ? 'sel' : 'idle'}`}
            positions={returnLeg}
            pathOptions={{
              color: isReturnSelected ? 'var(--copper)' : 'var(--cocoa-30)',
              weight: isReturnSelected ? 3 : 2,
              dashArray: '6 4',
            }}
            eventHandlers={{
              click: () => {
                if (stops.length > 0) {
                  onSelect({
                    type: 'leg',
                    fromStopId: stops[stops.length - 1].id,
                    toStopId: 'home',
                  });
                }
              },
              mouseover: (e) => {
                if (!isReturnSelected) {
                  e.target.setStyle({ color: 'var(--copper)', weight: 3 });
                }
              },
              mouseout: (e) => {
                if (!isReturnSelected) {
                  e.target.setStyle({
                    color: 'var(--cocoa-30)',
                    weight: 2,
                  });
                }
              },
            }}
          />
        )}

        <Marker
          key={`home-${home.lat}-${home.lng}`}
          position={[home.lat, home.lng]}
          icon={homeIcon()}
          title={`Home · ${home.nameEn}`}
        />

        {stops.map((s, i) => {
          const isSelected = selectedStopId === s.id;
          return (
            <Marker
              key={`${s.id}-${isSelected ? 'sel' : 'idle'}`}
              position={[s.lat, s.lng]}
              icon={pinIcon(i, isSelected)}
              title={s.nameEn}
              eventHandlers={{
                click: () => onSelect({ type: 'stop', stopId: s.id }),
              }}
            />
          );
        })}

        <FitBounds stops={stops} home={home} />
        <FlyToSelection stops={stops} home={home} selection={selection} />
        <MapClickDismiss onDismiss={() => onSelect({ type: 'none' })} />
      </MapContainer>
    </div>
  );
}
