import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import clsx from 'clsx';

type Props = {
  open: boolean;
  onClose: () => void;
  /** Copper eyebrow, displayed above the title. */
  eyebrow?: string;
  /** Serif title shown at the top of the sheet. */
  title: string;
  /** Sheet body. Receives its own scroll container; just pass content. */
  children: React.ReactNode;
  /** Optional footer pinned to the bottom of the sheet (e.g., a CTA). */
  footer?: React.ReactNode;
};

/**
 * App-modal bottom sheet portaled into the device frame.
 *
 * Used for tool detail views, settings drill-downs, and the activity composer.
 * Reuses the BottomSheet motion grammar (rounded-t, slides from below,
 * ease-out-quart) so every overlay in the app feels the same.
 *
 * Closed: not portaled (returns null). Open: backdrop + sheet, with focus
 * locked away from the underlying screen via aria-modal. Escape closes.
 */
export function Modal({ open, onClose, eyebrow, title, children, footer }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const target =
    typeof document !== 'undefined'
      ? document.getElementById('device-portal')
      : null;

  if (!target) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={clsx(
        'absolute inset-0 flex flex-col justify-end',
        'transition-opacity duration-considered ease-out-quart',
        open
          ? 'pointer-events-auto opacity-100'
          : 'pointer-events-none opacity-0',
      )}
    >
      <button
        type="button"
        aria-label="Dismiss"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={clsx(
          'absolute inset-0 cursor-default bg-cocoa-30',
          'transition-opacity duration-considered ease-out-quart',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />

      <div
        className={clsx(
          'relative flex max-h-[88%] flex-col rounded-t-3xl bg-ivory shadow-sheet',
          'transition-transform duration-considered ease-out-quart',
          open ? 'translate-y-0' : 'translate-y-full',
        )}
      >
        <span
          aria-hidden
          className="mx-auto mt-2.5 block h-1 w-9 shrink-0 rounded-full bg-cocoa-15"
        />

        <header className="flex items-start justify-between gap-sm px-md pb-sm pt-sm">
          <div className="flex min-w-0 flex-1 flex-col gap-px">
            {eyebrow && (
              <span className="meta-caps text-copper">{eyebrow}</span>
            )}
            <h2 className="font-serif text-lede leading-tight text-balance text-cocoa">
              {title}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-me-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-cocoa-55 transition-[transform,background-color] duration-instant ease-out-quart hover:bg-cocoa-8 hover:text-cocoa active:scale-95 active:bg-cocoa-15"
          >
            <X className="h-4 w-4" strokeWidth={1.8} aria-hidden />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain px-md pb-md">
          {children}
        </div>

        {footer && (
          <div
            className="border-t border-cocoa-08 px-md pt-sm"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>,
    target,
  );
}
