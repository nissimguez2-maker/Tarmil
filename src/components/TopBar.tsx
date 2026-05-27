import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

type Props = {
  /** Title in the center, set in Fraunces serif. */
  title?: string;
  /** Eyebrow above the title — uppercase, copper, 0.18em tracking. */
  eyebrow?: string;
  /** Show a back chevron on the start side. Tapping calls navigate(-1). */
  back?: boolean;
  /** Optional element on the end side (e.g., the Profile gear). */
  end?: React.ReactNode;
  className?: string;
};

/**
 * Top bar for screens that need a title or back affordance.
 * Hairline cocoa-15 separator at the bottom. In LTR the back chevron
 * sits on the start (left) side and points left.
 */
export function TopBar({ title, eyebrow, back, end, className }: Props) {
  const navigate = useNavigate();

  return (
    <header
      className={clsx(
        // 3-column grid: side columns hold the controls (≥44px tap targets)
        // and the centre column truncates, so a long title can never overlap
        // the back arrow or the end control.
        'grid grid-cols-[minmax(2.75rem,auto)_minmax(0,1fr)_minmax(2.75rem,auto)] items-center h-lg',
        'border-b border-charcoal-08 bg-cream/95 backdrop-blur',
        'px-sm',
        className,
      )}
    >
      <div className="flex items-center justify-self-start">
        {back && (
          <button
            type="button"
            aria-label="Back"
            onClick={() => navigate(-1)}
            className={clsx(
              'inline-flex h-11 w-11 items-center justify-center',
              'rounded-full text-charcoal',
              'transition-[transform,background-color] duration-instant ease-out-quart motion-reduce:transition-none',
              'hover:bg-charcoal-8 active:scale-95 active:bg-charcoal-15',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
            )}
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.7} aria-hidden />
          </button>
        )}
      </div>

      <div className="flex min-w-0 flex-col items-center gap-px px-xs">
        {eyebrow && (
          <span className="max-w-full truncate text-meta text-charcoal-55">
            {eyebrow}
          </span>
        )}
        {title && (
          <h1 className="max-w-full truncate font-serif text-lede font-bold leading-none tracking-tight text-charcoal">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center justify-self-end gap-1">{end}</div>
    </header>
  );
}
