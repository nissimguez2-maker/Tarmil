import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type Props = {
  /** Icon node. Single icon component, sized to ~20px. */
  icon: ReactNode;
  /** Accessible label. Required for icon-only and used as visible text when `extended`. */
  ariaLabel: string;
  /** When true, renders as an extended FAB with the label visible beside the icon. */
  extended?: boolean;
  /**
   * Whether the FAB lifts above a persistent <TabBar>. Default true.
   * Set false for FABs anchored to a relative container that already sits
   * above the tab bar (e.g., the trip map area).
   */
  liftAboveTabBar?: boolean;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>;

/**
 * Floating action button. Umber fill, cream mark, one shape grammar across the
 * app. Two shapes:
 *  - circle (default)   — icon only, 56px square. Used on Activity / Messages.
 *  - extended           — pill with icon + label. Used on the Trip map where
 *                         the FAB is the primary CTA and needs to name itself.
 *
 * Always renders as `absolute end-md`. `liftAboveTabBar` controls vertical
 * anchor: clear the TabBar when the FAB sits inside a full Screen, or hug the
 * container bottom when the parent already excludes the TabBar.
 */
export function Fab({
  icon,
  ariaLabel,
  extended,
  liftAboveTabBar = true,
  className,
  style,
  ...rest
}: Props) {
  // Tab capsule sits at safe-bottom + 14px + 56px tall. FAB needs to clear that
  // with breathing room. Without the tab bar (chat / detail screens), hug the
  // bottom safe area.
  const bottom = liftAboveTabBar
    ? 'calc(env(safe-area-inset-bottom, 0px) + 90px)'
    : 'calc(env(safe-area-inset-bottom, 0px) + 16px)';

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      {...rest}
      className={clsx(
        'absolute end-md z-[750] inline-flex items-center justify-center',
        'rounded-full bg-umber text-cream shadow-fab',
        'transition-[transform,background-color] duration-instant ease-out-quart motion-reduce:transition-none',
        'hover:bg-umber/90 active:scale-[0.97] active:bg-umber',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-cream',
        extended ? 'h-12 gap-2 ps-md pe-lg' : 'h-14 w-14',
        className,
      )}
      style={{ bottom, ...style }}
    >
      <span aria-hidden className="inline-flex">
        {icon}
      </span>
      {extended && (
        <span className="font-sans text-body font-medium leading-none">
          {ariaLabel}
        </span>
      )}
    </button>
  );
}
