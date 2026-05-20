import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import { ErrorPanel } from '../../components/DataState';
import type { PlannedStop } from '../../data/plannedStops';
import { WebHeader } from './WebHeader';
import { WebStopList } from './WebStopList';
import { WebMapCanvas } from './WebMapCanvas';
import { WebBubble } from './WebBubble';
import { WebBookingModal, type BookingTarget } from './WebBookingModal';
import { WebAddStopModal } from './WebAddStopModal';
import { WebPlannerSkeleton } from './WebPlannerSkeleton';
import {
  addStop as addStopMut,
  editStopDates as editStopDatesMut,
  removeStop as removeStopMut,
  reorderStops as reorderStopsMut,
} from './tripMutations';
import type { Selection } from './types';

export function WebPlannerScreen() {
  const { data, loading, error } = useSupabaseData();
  const [localStops, setLocalStops] = useState<PlannedStop[] | null>(null);
  const [selection, setSelection] = useState<Selection>({ type: 'none' });
  const [bookingTarget, setBookingTarget] = useState<BookingTarget | null>(null);
  const [addStopOpen, setAddStopOpen] = useState(false);

  useEffect(() => {
    if (data && localStops === null) {
      setLocalStops(data.plannedStops);
    }
  }, [data, localStops]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (bookingTarget) {
        setBookingTarget(null);
      } else if (addStopOpen) {
        setAddStopOpen(false);
      } else if (selection.type !== 'none') {
        setSelection({ type: 'none' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [bookingTarget, addStopOpen, selection.type]);

  if (loading) return <WebPlannerSkeleton />;
  if (error || !data) return <ErrorPanel error={error} />;

  const stops = localStops ?? data.plannedStops;
  const places = data.places;
  const past = data.myTrip?.past as [number, number][] | undefined;

  const handleReorder = (fromIdx: number, toIdx: number) => {
    setLocalStops((prev) =>
      reorderStopsMut(prev ?? stops, fromIdx, toIdx),
    );
  };
  const handleRemove = (id: string) => {
    setLocalStops((prev) => removeStopMut(prev ?? stops, id));
    if (selection.type === 'stop' && selection.stopId === id) {
      setSelection({ type: 'none' });
    }
    if (
      selection.type === 'leg' &&
      (selection.fromStopId === id || selection.toStopId === id)
    ) {
      setSelection({ type: 'none' });
    }
  };
  const handleEditDates = (
    id: string,
    arrivalIso: string,
    departureIso: string,
  ) => {
    setLocalStops((prev) =>
      editStopDatesMut(prev ?? stops, id, arrivalIso, departureIso),
    );
  };

  return (
    <>
      <div className="hidden lg:flex h-dvh flex-col bg-ivory">
        <WebHeader stops={stops} />
        <div className="flex-1 flex min-h-0">
          <WebStopList
            stops={stops}
            selection={selection}
            onSelect={setSelection}
            onAddStop={() => setAddStopOpen(true)}
            onReorder={handleReorder}
            onRemoveStop={handleRemove}
            onEditDates={handleEditDates}
          />
          <div className="flex-1 relative">
            <WebMapCanvas
              stops={stops}
              past={past}
              selection={selection}
              onSelect={setSelection}
            />
            <WebBubble
              selection={selection}
              stops={stops}
              places={places}
              onClose={() => setSelection({ type: 'none' })}
              onBook={setBookingTarget}
            />
          </div>
        </div>
      </div>
      <div className="flex lg:hidden h-dvh flex-col items-center justify-center p-xl text-center gap-md bg-ivory">
        <p className="font-serif text-sub text-cocoa-55">
          Open on desktop (≥ 1024 px) to use the planner.
        </p>
        <Link
          to="/trip"
          className="text-small text-copper hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory rounded-sm"
        >
          Go to the mobile app →
        </Link>
      </div>
      <WebBookingModal
        target={bookingTarget}
        onClose={() => setBookingTarget(null)}
      />
      <WebAddStopModal
        open={addStopOpen}
        onClose={() => setAddStopOpen(false)}
        onAdd={(city) => setLocalStops((prev) => addStopMut(prev ?? stops, city))}
        existingStopIds={stops.map((s) => s.id)}
      />
    </>
  );
}
