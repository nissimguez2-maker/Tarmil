import clsx from 'clsx';

type Props = {
  emoji: string;
  count: number;
  /** Has the current user reacted with this emoji? */
  active?: boolean;
  onClick?: () => void;
};

/**
 * Single reaction chip — emoji + count. Tap to toggle the user's own reaction
 * with this emoji on the target. Active state uses a thin copper ring + sand
 * fill so the affordance reads even on the ivory cards.
 */
export function ReactionPill({ emoji, count, active, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'inline-flex h-7 items-center gap-1 rounded-full px-2.5 text-small',
        'transition-[transform,background-color,box-shadow] duration-instant ease-out-quart',
        'active:scale-[0.94]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-1 focus-visible:ring-offset-ivory',
        active
          ? 'bg-sand text-cocoa shadow-[inset_0_0_0_1.5px_var(--copper)]'
          : 'bg-cocoa-08 text-cocoa-70 hover:bg-cocoa-15 hover:text-cocoa',
      )}
      aria-pressed={!!active}
    >
      <span aria-hidden>{emoji}</span>
      <span className="font-medium tabular-nums">{count}</span>
    </button>
  );
}
