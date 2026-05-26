import { X } from 'lucide-react';
import { Button } from '../../Button';
import type { PlannedStop } from '../../../data/plannedStops';

type Props = {
  stop: PlannedStop;
  onConfirm: () => void;
  onDismiss: () => void;
};

/**
 * Gentle "did you arrive?" confirmation. Per the brief this is optional/TBD —
 * the demo shows the concept without being creepy: privacy-first language,
 * dismiss is the primary affordance, confirm is opt-in.
 */
export function ArrivalConfirmSheet({ stop, onConfirm, onDismiss }: Props) {
  return (
    <div className="flex flex-col gap-md px-md pb-md pt-sm">
      <div className="flex items-start justify-between gap-sm">
        <div className="flex min-w-0 flex-1 flex-col gap-px">
          <span className="meta-caps text-amber">Gentle check</span>
          <h3 className="font-serif text-lede leading-tight text-charcoal">
            Did you arrive in {stop.nameHe}?
          </h3>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onDismiss}
          className="-me-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-charcoal-55 transition-colors duration-instant ease-out-quart hover:bg-charcoal-8 active:bg-charcoal-15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        >
          <X className="h-4 w-4" strokeWidth={1.8} aria-hidden />
        </button>
      </div>

      <p className="text-body leading-snug text-charcoal-70">
        If you've arrived, we'll add {stop.nameHe} to the route you've actually
        travelled. If not — we won't touch a thing.
      </p>

      <div className="flex items-center gap-sm">
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          Not now
        </Button>
        <Button variant="accent" size="sm" onClick={onConfirm}>
          Add to my trip
        </Button>
      </div>

      <p className="text-small leading-snug text-charcoal-55">
        Always private. Tarmil never infers your movement automatically.
      </p>
    </div>
  );
}
