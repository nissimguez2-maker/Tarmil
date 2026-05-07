import { useEffect } from 'react';
import { Button } from './Button';

type Props = {
  open: boolean;
  title: string;
  body?: string;
  /** Confirmation button label, e.g. "סגור חוב". */
  confirmLabel: string;
  /** Cancel button label, defaults to "ביטול". */
  cancelLabel?: string;
  /** When true, the confirm button uses the accent (copper) variant — for
   * settling debts and similar "vibrant" actions. Defaults to false (primary
   * cocoa). Use for actions that should feel weighty but not destructive. */
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Centered confirmation pill, modal-style. Used for actions the user
 * shouldn't be able to fat-finger: settling a debt, deleting an expense,
 * removing a friend, etc.
 *
 * Renders only when `open` is true. Locks body scroll and listens for
 * Escape so users can dismiss without finding the cancel button. The
 * backdrop is tappable to cancel — matches iOS / Material conventions.
 */
export function ConfirmPill({
  open,
  title,
  body,
  confirmLabel,
  cancelLabel = 'ביטול',
  danger = false,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    // Lock body scroll while the pill is open so background content can't
    // shift behind the modal.
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-pill-title"
      className="fixed inset-0 z-[1500] flex items-center justify-center p-md"
    >
      {/* Dim + soft blur backdrop. Tap to cancel.
       * cocoa-tinted overlay at 45% alpha — matches the existing shadow
       * vocabulary in DESIGN.md (rgba(53, 40, 24, …)) so the dim feels of-a-piece
       * with the rest of the system rather than a generic black. */}
      <button
        type="button"
        aria-label="ביטול"
        onClick={onCancel}
        className="absolute inset-0 backdrop-blur-sm"
        style={{ background: 'rgba(53, 40, 24, 0.45)' }}
      />

      {/* The pill itself — capped at body width so it doesn't sprawl on
       * tablets, sits dead center via flex on the parent. */}
      <div
        className="relative z-10 flex w-full max-w-[110mm] flex-col gap-sm rounded-md border border-rope bg-ivory p-md"
        style={{ boxShadow: '0 30px 60px -20px rgba(53, 40, 24, 0.45)' }}
      >
        <h2
          id="confirm-pill-title"
          className="font-serif text-lede leading-tight text-cocoa"
        >
          {title}
        </h2>
        {body && (
          <p className="text-body leading-snug text-cocoa-70">{body}</p>
        )}
        <div className="mt-1 flex items-center gap-sm">
          <Button variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            variant={danger ? 'accent' : 'primary'}
            onClick={onConfirm}
            fullWidth
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
