import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type Props = {
  children: ReactNode;
  /** Accessible label (icon-only buttons must have one). */
  ariaLabel: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'>;

/**
 * Floating action button. Copper fill, ivory icon, anchored to the bottom
 * trailing edge above the tab bar. Used for "new post" on Activity and
 * "new chat" on Messages.
 *
 * Anchor is computed relative to the screen's bottom — caller places the FAB
 * inside the Screen's relative-positioned wrapper. The bottom offset accounts
 * for the tab bar (h-16 + safe-area).
 */
export function Fab({ children, ariaLabel, className, ...rest }: Props) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      {...rest}
      className={clsx(
        'absolute end-md inline-flex h-14 w-14 items-center justify-center',
        'rounded-full bg-copper text-ivory',
        'transition-colors hover:bg-copper-85 active:bg-copper',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
        className,
      )}
      style={{
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 90px)',
        boxShadow: '0 4px 12px rgba(199, 93, 36, 0.24)',
      }}
    >
      {children}
    </button>
  );
}
