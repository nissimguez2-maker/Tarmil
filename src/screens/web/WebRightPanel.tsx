import { MapPin } from 'lucide-react';
import type { PlannedStop } from '../../data/plannedStops';
import type { Place } from '../../data/places';
import type { Selection } from './types';
import { WebCityPanel } from './WebCityPanel';
import { WebTransportPanel } from './WebTransportPanel';

type Props = {
  selection: Selection;
  onClose: () => void;
  stops: PlannedStop[];
  places: Place[];
};

export function WebRightPanel({ selection, onClose, stops, places }: Props) {
  return (
    <aside
      style={{ width: '360px' }}
      className="shrink-0 border-s border-cocoa-15 bg-ivory flex flex-col min-h-0 h-full"
    >
      {selection.type === 'none' && <EmptyState />}
      {selection.type === 'stop' && (
        <WebCityPanel
          stop={requireStop(stops, selection.stopId)}
          places={places.filter((p) => p.destinationId === selection.stopId)}
          onClose={onClose}
        />
      )}
      {selection.type === 'leg' && (
        <WebTransportPanel
          fromStop={requireStop(stops, selection.fromStopId)}
          toStop={requireStop(stops, selection.toStopId)}
          onClose={onClose}
        />
      )}
    </aside>
  );
}

function requireStop(stops: PlannedStop[], id: string): PlannedStop {
  const stop = stops.find((s) => s.id === id);
  if (!stop) {
    throw new Error(`Selection referenced missing stop ${id}`);
  }
  return stop;
}

function EmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-xl gap-sm text-cocoa-55">
      <MapPin size={28} strokeWidth={1.5} />
      <p className="font-sans text-body max-w-caption">
        Click a stop to see bookings, or click a line to see transport options.
      </p>
    </div>
  );
}
