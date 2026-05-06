import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'accent' | 'ghost';

type Props = {
  children: ReactNode;
  variant?: Variant;
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Three variants:
 *  - primary : cocoa fill, ivory text. Default for most CTAs.
 *  - accent  : copper fill, ivory text. The "vibrant" CTA. Use sparingly.
 *  - ghost   : transparent, cocoa text, hairline cocoa-15 border. Secondary actions.
 *
 * Height is 14mm (DA spacing.lg) — comfortable for mobile thumbs and matches
 * the editorial spacing scale.
 */
export function Button({
  children,
  variant = 'primary',
  fullWidth,
  className,
  ...rest
}: Props) {
  return (
    <button
      type="button"
      {...rest}
      className={clsx(
        // base
        'inline-flex h-lg items-center justify-center gap-2 rounded-full px-md',
        'font-sans text-[11pt] font-medium leading-none',
        'transition-colors disabled:opacity-30 disabled:pointer-events-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
        // variants
        variant === 'primary' && 'bg-cocoa text-ivory hover:bg-cocoa-70 active:bg-cocoa',
        variant === 'accent' && 'bg-copper text-ivory hover:bg-copper-85 active:bg-copper',
        variant === 'ghost' && 'border border-cocoa-15 text-cocoa hover:bg-cocoa-8 active:bg-cocoa-15',
        fullWidth && 'w-full',
        className,
      )}
    >
      {children}
    </button>
  );
}
