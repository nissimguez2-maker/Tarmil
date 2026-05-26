import clsx from 'clsx';
import { Send, Check } from 'lucide-react';

type Props = {
  pinged: boolean;
  onPing: () => void;
};

/**
 * Single-shot Ping affordance. Umber pill when unsent; muted pill marked
 * "Pinged" once fired. Disabled after sending — re-ping is only possible
 * when a new co-presence event surfaces (different city, or the same city
 * after a clean separation). Mirrors brief §04 Ping rules.
 */
export function PingButton({ pinged, onPing }: Props) {
  return (
    <button
      type="button"
      onClick={onPing}
      disabled={pinged}
      aria-label={pinged ? 'Pinged' : 'Ping'}
      className={clsx(
        'inline-flex h-9 shrink-0 items-center gap-1 rounded-full ps-3 pe-4 font-sans text-small font-medium leading-none',
        'transition-[transform,background-color,color] duration-instant ease-out-quart motion-reduce:transition-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
        'disabled:active:scale-100',
        pinged
          ? 'bg-charcoal-08 text-charcoal-55'
          : 'bg-umber text-cream shadow-card hover:bg-umber/90 active:scale-[0.97]',
      )}
    >
      {pinged ? (
        <>
          <Check className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
          Pinged
        </>
      ) : (
        <>
          <Send className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          Ping
        </>
      )}
    </button>
  );
}
