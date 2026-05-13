import type { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

type Variant = 'primary' | 'accent' | 'ghost';
type Size = 'sm' | 'md';

type Props = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/**
 * Three variants:
 *  - primary : cocoa fill, ivory text. Default for most CTAs.
 *  - accent  : copper fill, ivory text. The "vibrant" CTA. Use sparingly.
 *  - ghost   : transparent, cocoa text, hairline cocoa-15 border. Secondary actions.
 *
 * Sizes:
 *  - md (default) : h-lg (14mm) — main CTAs, sticky bottom actions, sheet primaries.
 *  - sm           : h-10 (40px) — inline secondary actions inside dense sheets.
 *
 * Motion: instant color transition, ease-out-quart, active scale 0.97
 * for tactile feedback (matches the rest of the app's interactive grammar).
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
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
        'inline-flex items-center justify-center gap-2 rounded-full px-md',
        'font-sans text-body font-medium leading-none',
        'transition-[transform,background-color,border-color,box-shadow] duration-instant ease-out-quart',
        'motion-reduce:transition-none',
        'active:scale-[0.97]',
        'disabled:opacity-30 disabled:pointer-events-none disabled:active:scale-100',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-ivory',
        // size
        size === 'md' && 'h-lg',
        size === 'sm' && 'h-10',
        // variants
        variant === 'primary' &&
          'bg-cocoa text-ivory shadow-card hover:bg-cocoa-70 active:bg-cocoa',
        variant === 'accent' &&
          'bg-copper text-ivory shadow-fab hover:bg-copper-85 active:bg-copper',
        variant === 'ghost' &&
          'border border-cocoa-15 text-cocoa hover:border-cocoa-30 hover:bg-cocoa-8 active:bg-cocoa-15',
        fullWidth && 'w-full',
        className,
      )}
    >
      {children}
    </button>
  );
}
