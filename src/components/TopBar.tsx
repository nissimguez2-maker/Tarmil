import { ChevronRight, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useToolsPanel } from '../lib/ToolsPanelContext';

type Props = {
  /** Title in the center, set in Fraunces serif. */
  title?: string;
  /** Eyebrow above the title — uppercase, copper, 0.18em tracking. */
  eyebrow?: string;
  /** Show a back chevron on the start side. Tapping calls navigate(-1). */
  back?: boolean;
  /** Optional element on the end side, rendered just before the wrench (e.g., a settings gear). */
  end?: React.ReactNode;
  className?: string;
};

/**
 * Top bar for screens that need a title or back affordance.
 * Hairline cocoa-15 separator at the bottom.
 *
 * Always renders a wrench icon at the very end corner — taps open the global
 * <ToolsPanel>. Per-screen `end` content (e.g., the Profile gear) renders just
 * before it on the start side of the wrench.
 *
 * In RTL, the chevron on the start side points right (▶︎-style) — Lucide's
 * ChevronRight is correct because in RTL the start side is on the right.
 */
export function TopBar({ title, eyebrow, back, end, className }: Props) {
  const navigate = useNavigate();
  const { open: openTools } = useToolsPanel();

  return (
    <header
      className={clsx(
        'relative flex h-[14mm] items-center justify-center',
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
            'rounded-full text-cocoa hover:bg-cocoa-8 active:bg-cocoa-15',
          )}
        >
          <ChevronRight className="h-5 w-5" aria-hidden />
        </button>
      )}

      <div className="flex flex-col items-center">
        {eyebrow && (
          <span className="meta-caps text-copper">{eyebrow}</span>
        )}
        {title && (
          <h1 className="font-serif text-lede leading-none">{title}</h1>
        )}
      </div>

      <div className="absolute end-md flex items-center gap-1">
        {end}
        <button
          type="button"
          aria-label="כלים"
          onClick={openTools}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-cocoa hover:bg-cocoa-8 active:bg-cocoa-15"
        >
          <Wrench className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </header>
  );
}
