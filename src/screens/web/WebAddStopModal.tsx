import { useEffect } from 'react';
import { MapPin, Search, X } from 'lucide-react';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function WebAddStopModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] bg-cocoa/40 flex items-center justify-center p-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: '420px' }}
        className="bg-ivory border border-rope rounded-3xl shadow-panel p-md flex flex-col gap-md relative"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-sm end-sm h-8 w-8 rounded-full flex items-center justify-center text-cocoa-55 hover:text-cocoa hover:bg-cocoa-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
        >
          <X size={16} strokeWidth={2} />
        </button>
        <div className="flex flex-col gap-xs pe-12">
          <p className="meta-caps text-cocoa-55">Add stop</p>
          <h2 className="font-serif text-sub text-cocoa leading-tight">
            Extend your trip
          </h2>
        </div>
        <label className="flex items-center gap-sm rounded-full bg-sand border border-rope px-sm h-10 focus-within:border-copper transition-[border-color] duration-instant ease-out-quart motion-reduce:transition-none">
          <Search size={14} strokeWidth={2} className="text-cocoa-55 shrink-0" />
          <input
            type="text"
            placeholder="Search a city…"
            disabled
            className="flex-1 bg-transparent outline-none text-body text-cocoa placeholder:text-cocoa-55 disabled:cursor-not-allowed"
          />
        </label>
        <div className="bg-sand border border-rope rounded-2xl p-md flex flex-col gap-sm">
          <div className="inline-flex items-center gap-xs text-copper">
            <MapPin size={14} strokeWidth={2} />
            <p className="meta-caps">Coming in v2</p>
          </div>
          <p className="text-small text-cocoa-70 leading-snug">
            We're building an AI-suggested stop picker that learns from your
            existing itinerary, friends&apos; overlaps, and seasonal weather.
            For now, the route is fixed to the curated demo trip.
          </p>
        </div>
      </div>
    </div>
  );
}
