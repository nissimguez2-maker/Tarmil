import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { X } from 'lucide-react';
import type { PlannedStop } from '../../data/plannedStops';
import type { Place } from '../../data/places';
import type { Selection } from './types';
import { WebCityPanel } from './WebCityPanel';
import { WebTransportPanel } from './WebTransportPanel';
import type { BookingTarget } from './WebBookingModal';

type Props = {
  selection: Selection;
  stops: PlannedStop[];
  places: Place[];
  onClose: () => void;
  onBook: (target: BookingTarget) => void;
};

export function WebBubble({
  selection,
  stops,
  places,
  onClose,
  onBook,
}: Props) {
  const isOpen = selection.type !== 'none';
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setAnimateIn(false);
      return;
    }
    const id = requestAnimationFrame(() => setAnimateIn(true));
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

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
        className={clsx(
          'bg-ivory border border-rope rounded-3xl shadow-panel flex flex-col pointer-events-auto relative overflow-hidden',
          'transition-[opacity,transform] duration-considered ease-out-quart motion-reduce:transition-none',
          'origin-center',
          animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        )}
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
            onBook={onBook}
          />
        )}
        {selection.type === 'leg' && (() => {
          const fromStop = requireStop(stops, selection.fromStopId);
          const toStop = requireStop(stops, selection.toStopId);
          const idx = stops.findIndex((s) => s.id === fromStop.id);
          const travelDate = idx >= 0 ? fromStop.departureDate : new Date().toISOString().slice(0, 10);
          return (
            <WebTransportPanel
              fromStop={fromStop}
              toStop={toStop}
              travelDate={travelDate}
              onBook={onBook}
            />
          );
        })()}
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
