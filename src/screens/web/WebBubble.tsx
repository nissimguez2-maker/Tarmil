import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { PlannedStop } from '../../data/plannedStops';
import type { Place } from '../../data/places';
import type { Selection } from './types';
import { WebCityPanel } from './WebCityPanel';
import { WebTransportPanel } from './WebTransportPanel';

type Props = {
  selection: Selection;
  stops: PlannedStop[];
  places: Place[];
  onClose: () => void;
};

export function WebBubble({ selection, stops, places, onClose }: Props) {
  useEffect(() => {
    if (selection.type === 'none') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selection.type, onClose]);

  if (selection.type === 'none') return null;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center p-md pointer-events-none z-[1000]"
      aria-hidden={false}
    >
      <div
        role="dialog"
        aria-modal="false"
        style={{ width: '440px', maxHeight: '100%' }}
        className="bg-ivory border border-rope rounded-3xl shadow-panel flex flex-col pointer-events-auto relative overflow-hidden"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-sm end-sm h-8 w-8 rounded-full flex items-center justify-center text-cocoa-55 hover:text-cocoa hover:bg-cocoa-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory z-10"
        >
          <X size={16} strokeWidth={2} />
        </button>
        {selection.type === 'stop' && (
          <WebCityPanel
            stop={requireStop(stops, selection.stopId)}
            places={places.filter((p) => p.destinationId === selection.stopId)}
          />
        )}
        {selection.type === 'leg' && (
          <WebTransportPanel
            fromStop={requireStop(stops, selection.fromStopId)}
            toStop={requireStop(stops, selection.toStopId)}
          />
        )}
      </div>
    </div>
  );
}

function requireStop(stops: PlannedStop[], id: string): PlannedStop {
  const stop = stops.find((s) => s.id === id);
  if (!stop) {
    throw new Error(`Selection referenced missing stop ${id}`);
  }
  return stop;
}
