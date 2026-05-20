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
import type { Selection } from './types';

type LatLng = [number, number];

type Props = {
  stops: PlannedStop[];
  past?: LatLng[];
  selection: Selection;
  onSelect: (s: Selection) => void;
};

function pinIcon(index: number, selected: boolean): L.DivIcon {
  const bg = selected ? 'var(--cocoa)' : 'var(--copper)';
  const ring = selected
    ? 'box-shadow:0 0 0 3px var(--copper), 0 2px 6px rgba(0,0,0,0.18);'
    : 'box-shadow:0 2px 6px rgba(0,0,0,0.18);';
  return L.divIcon({
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    html: `<div style="
      width:32px;height:32px;border-radius:9999px;
      background-color:${bg};
      display:flex;align-items:center;justify-content:center;
      color:white;font-family:Fraunces,serif;font-weight:600;font-size:14px;
      ${ring}
    ">${index + 1}</div>`,
  });
}

function FitBounds({ stops }: { stops: PlannedStop[] }) {
  const map = useMap();
  useEffect(() => {
    if (!stops.length) return;
    const bounds = L.latLngBounds(
      stops.map((s) => [s.lat, s.lng] as LatLng),
    );
    map.fitBounds(bounds, { padding: [60, 60] });
  }, [map, stops]);
  return null;
}

export function WebMapCanvas({ stops, past, selection, onSelect }: Props) {
  const initialCenter = useMemo<LatLng>(() => {
    if (!stops.length) return [0, 0];
    return [stops[0].lat, stops[0].lng];
  }, [stops]);
  const selectedStopId = selection.type === 'stop' ? selection.stopId : null;
  const selectedLeg =
    selection.type === 'leg'
      ? { from: selection.fromStopId, to: selection.toStopId }
      : null;

  return (
    <div className="flex-1 relative isolate">
      <MapContainer
        center={initialCenter}
        zoom={4}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
        className="h-full w-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {past && past.length > 1 && (
          <Polyline
            positions={past}
            pathOptions={{
              color: 'var(--cocoa-15)',
              weight: 2,
              opacity: 0.8,
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
                    e.target.setStyle({ color: 'var(--copper)', weight: 3 });
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

        {stops.map((s, i) => {
          const isSelected = selectedStopId === s.id;
          return (
            <Marker
              key={`${s.id}-${isSelected ? 'sel' : 'idle'}`}
              position={[s.lat, s.lng]}
              icon={pinIcon(i, isSelected)}
              title={`${s.nameEn}`}
              eventHandlers={{
                click: () => onSelect({ type: 'stop', stopId: s.id }),
              }}
            />
          );
        })}

        <FitBounds stops={stops} />
      </MapContainer>
    </div>
  );
}
