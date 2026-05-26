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
 * with this emoji on the target. Active state uses a thin amber ring + sand
 * fill so the affordance reads even on the cream cards.
 */
export function ReactionPill({ emoji, count, active, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${active ? 'Remove your' : 'React with'} ${emoji}${count > 0 ? ` (${count})` : ''}`}
      className={clsx(
        'inline-flex h-7 items-center gap-1 rounded-full ps-2.5 pe-2.5 text-small',
        'transition-[transform,background-color,box-shadow] duration-instant ease-out-quart motion-reduce:transition-none',
        'active:scale-[0.94]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-1 focus-visible:ring-offset-cream',
        active
          ? 'bg-sand text-charcoal shadow-[inset_0_0_0_1.5px_var(--amber)]'
          : 'bg-charcoal-08 text-charcoal-70 hover:bg-charcoal-15 hover:text-charcoal',
      )}
      aria-pressed={!!active}
    >
      <span aria-hidden>{emoji}</span>
      <span className="font-medium tabular-nums">{count}</span>
    </button>
  );
}
