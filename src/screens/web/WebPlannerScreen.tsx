import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSupabaseData } from '../../lib/SupabaseDataProvider';
import { LoadingPanel, ErrorPanel } from '../../components/DataState';
import { WebHeader } from './WebHeader';
import { WebStopList } from './WebStopList';
import { WebMapCanvas } from './WebMapCanvas';
import { WebBubble } from './WebBubble';
import type { Selection } from './types';

export function WebPlannerScreen() {
  const { data, loading, error } = useSupabaseData();
  const [selection, setSelection] = useState<Selection>({ type: 'none' });

  if (loading) return <LoadingPanel />;
  if (error || !data) return <ErrorPanel error={error} />;

  const stops = data.plannedStops;
  const places = data.places;
  const past = data.myTrip?.past as [number, number][] | undefined;

  return (
    <>
      <div className="hidden lg:flex h-dvh flex-col bg-ivory">
        <WebHeader stops={stops} />
        <div className="flex-1 flex min-h-0">
          <WebStopList
            stops={stops}
            selection={selection}
            onSelect={setSelection}
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
    </>
  );
}
