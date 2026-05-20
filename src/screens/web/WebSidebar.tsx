import { ArrowLeft } from 'lucide-react';
import type { PlannedStop } from '../../data/plannedStops';
import type { Place } from '../../data/places';
import type { Selection } from './types';
import { WebStopList } from './WebStopList';
import { WebCityPanel } from './WebCityPanel';
import { WebTransportPanel } from './WebTransportPanel';

type Props = {
  selection: Selection;
  onSelect: (s: Selection) => void;
  onBack: () => void;
  stops: PlannedStop[];
  places: Place[];
};

export function WebSidebar({ selection, onSelect, onBack, stops, places }: Props) {
  return (
    <aside className="w-96 shrink-0 border-e border-cocoa-15 bg-ivory flex flex-col min-h-0 h-full">
      {selection.type === 'none' ? (
        <WebStopList
          stops={stops}
          selection={selection}
          onSelect={onSelect}
        />
      ) : (
        <DetailView
          selection={selection}
          stops={stops}
          places={places}
          onBack={onBack}
        />
      )}
    </aside>
  );
}

type DetailProps = {
  selection: Exclude<Selection, { type: 'none' }>;
  stops: PlannedStop[];
  places: Place[];
  onBack: () => void;
};

function DetailView({ selection, stops, places, onBack }: DetailProps) {
  return (
    <div className="flex flex-col h-full min-h-0">
      <BackButton onBack={onBack} />
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
  );
}

function requireStop(stops: PlannedStop[], id: string): PlannedStop {
  const stop = stops.find((s) => s.id === id);
  if (!stop) {
    throw new Error(`Selection referenced missing stop ${id}`);
  }
  return stop;
}

function BackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="shrink-0 flex items-center gap-xs px-md py-sm text-small text-cocoa-70 hover:text-cocoa hover:bg-cocoa-8 border-b border-cocoa-15 transition-colors duration-instant ease-out-quart motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
    >
      <ArrowLeft size={14} strokeWidth={2} />
      <span>Itinerary</span>
    </button>
  );
}
