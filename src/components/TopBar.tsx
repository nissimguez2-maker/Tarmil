import { ChevronRight } from 'lucide-react';
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
 * Hairline cocoa-15 separator at the bottom.
 *
 * In RTL, the back chevron sits on the start side (right) and points right —
 * Lucide's ChevronRight is correct because in RTL the start side is on the
 * right.
 */
export function TopBar({ title, eyebrow, back, end, className }: Props) {
  const navigate = useNavigate();

  return (
    <header
      className={clsx(
        'relative flex h-lg items-center justify-center',
        'border-b border-cocoa-15 bg-ivory',
        'px-md',
        className,
      )}
    >
      {back && (
        <button
          type="button"
          aria-label="חזרה"
          onClick={() => navigate(-1)}
          className={clsx(
            'absolute start-md inline-flex h-9 w-9 items-center justify-center',
            'rounded-full text-cocoa transition-colors duration-instant ease-out-quart hover:bg-cocoa-8 active:bg-cocoa-15',
          )}
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      )}

      <div className="flex flex-col items-center gap-px">
        {eyebrow && <span className="meta-caps text-copper">{eyebrow}</span>}
        {title && (
          <h1 className="font-serif text-lede leading-none">{title}</h1>
        )}
      </div>

      {end && <div className="absolute end-md flex items-center gap-1">{end}</div>}
    </header>
  );
}
