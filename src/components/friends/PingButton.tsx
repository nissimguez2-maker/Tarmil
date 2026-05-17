import clsx from 'clsx';
import { Send, Check, EyeOff } from 'lucide-react';

type Props = {
  pinged: boolean;
  onPing: () => void;
  /** When true, the button shows "Off-grid" and is disabled. Off-grid
   * blocks all outgoing pings — the user is intentionally invisible. */
  offGrid?: boolean;
};

/**
 * Single-shot Ping affordance. Copper pill when unsent; rope pill marked
 * "Pinged" once fired. Disabled after sending — re-ping is only possible
 * when a new co-presence event surfaces. Off-grid disables pings entirely.
 */
export function PingButton({ pinged, onPing, offGrid }: Props) {
  const disabled = pinged || offGrid;
  const label = offGrid ? 'Off-grid' : pinged ? 'Pinged' : 'Ping';
  return (
    <button
      type="button"
      onClick={onPing}
      disabled={disabled}
      aria-label={label}
      className={clsx(
        'inline-flex h-9 shrink-0 items-center gap-1 rounded-full ps-3 pe-4 font-sans text-small font-medium leading-none',
        'transition-[transform,background-color,color] duration-instant ease-out-quart motion-reduce:transition-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
        'disabled:active:scale-100',
        offGrid
          ? 'bg-cocoa-08 text-cocoa-55'
          : pinged
            ? 'bg-rope/40 text-cocoa-55'
            : 'bg-copper text-ivory shadow-card hover:bg-copper-85 active:scale-[0.97]',
      )}
    >
      {offGrid ? (
        <>
          <EyeOff className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
          Off-grid
        </>
      ) : pinged ? (
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
